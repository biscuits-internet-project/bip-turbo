import type { Song } from "@bip/domain";
import { CacheKeys } from "@bip/domain/cache-keys";
import { publicLoader } from "~/lib/base-loaders";
import { logger } from "~/lib/logger";
import {
  parsePerformanceFilters,
  resolveAttendedUserId,
  resolveLast10ShowsDateRange,
} from "~/lib/performance-filter-params";
import { getTimeRangeParam, SONG_FILTERS } from "~/lib/song-filters";
import { addVenueInfoToSongs } from "~/lib/song-utilities";
import { services } from "~/server/services";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * For "not played" songs: returns songs matching the base filters (author/cover)
 * that have been played overall but NOT in the date-range results.
 * For "played" songs: filters to those with timesPlayed > 0 in the filtered results.
 */
async function splitByPlayStatus(
  filteredSongs: Song[],
  showNotPlayed: boolean,
  baseFilter: { authorId?: string; cover?: boolean; attendedUserId?: string },
): Promise<Song[]> {
  const playedInFilter = filteredSongs.filter((song) => song.timesPlayed > 0);

  if (!showNotPlayed) {
    return playedInFilter;
  }

  // Get all songs matching author/cover, but without date range or attended constraint.
  // This ensures "not played" = played overall but not in the filtered view.
  const { attendedUserId: _, ...baseFilterWithoutAttended } = baseFilter;
  const allSongs = await services.songs.findMany(baseFilterWithoutAttended);
  const allSongsPlayed = allSongs.filter((song) => song.timesPlayed > 0);

  // Songs NOT played in this filter = matching played songs minus filter played
  const playedIds = new Set(playedInFilter.map((song) => song.id));
  const notPlayed = allSongsPlayed.filter((song) => !playedIds.has(song.id));

  // Sort by overall timesPlayed descending (most popular first)
  return notPlayed.sort((a, b) => b.timesPlayed - a.timesPlayed);
}

export const loader = publicLoader(async ({ request, context }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("q");
  const timeRangeParam = getTimeRangeParam(url.searchParams);
  const playedParam = url.searchParams.get("played");
  const authorParam = url.searchParams.get("author");
  const coverParam = url.searchParams.get("cover");
  const attendedParam = url.searchParams.get("attended");
  const filtersParam = url.searchParams.get("filters");
  const showNotPlayed = playedParam === "notPlayed";

  const coverFilter = coverParam === "cover" ? true : coverParam === "original" ? false : undefined;

  const authorId = authorParam ? (UUID_REGEX.test(authorParam) ? authorParam : null) : null;
  if (authorParam && !authorId) {
    logger.warn("Ignoring invalid author filter", { authorParam });
  }

  const attendedUserId = await resolveAttendedUserId(attendedParam, context);

  const hasDateRange = timeRangeParam === "last10shows" || (timeRangeParam && timeRangeParam in SONG_FILTERS);

  const hasToggleFilters = !!filtersParam;

  // Handle filtering by author, cover, date range, attended, toggle filters, or any combination
  if (authorId || coverFilter !== undefined || hasDateRange || attendedUserId || hasToggleFilters) {
    try {
      const cacheKey = CacheKeys.songs.filtered({
        timeRange: timeRangeParam || null,
        played: playedParam || null,
        author: authorId || null,
        cover: coverParam || null,
        attended: attendedUserId || null,
        filters: filtersParam || null,
      });

      return await services.cache.getOrSet(
        cacheKey,
        async () => {
          const filter: {
            authorId?: string;
            cover?: boolean;
            startDate?: Date;
            endDate?: Date;
            attendedUserId?: string;
          } = {};
          if (authorId) filter.authorId = authorId;
          if (coverFilter !== undefined) filter.cover = coverFilter;
          if (attendedUserId) filter.attendedUserId = attendedUserId;

          let songs: Song[];
          if (timeRangeParam === "last10shows") {
            const dateRange = await resolveLast10ShowsDateRange();
            if (dateRange) {
              songs = await services.songs.findManyInDateRange({ startDate: dateRange.startDate, ...filter });
            } else {
              songs = await services.songs.findMany(filter);
            }
          } else if (timeRangeParam && timeRangeParam in SONG_FILTERS) {
            const { startDate, endDate } = SONG_FILTERS[timeRangeParam];
            songs = await services.songs.findManyInDateRange({ startDate, endDate, ...filter });
          } else {
            songs = await services.songs.findMany(filter);
          }

          // When toggle filters are active, cross-reference with performance counts
          if (hasToggleFilters) {
            const performanceFilters = await parsePerformanceFilters(url, context);
            const counts = await services.songPageComposer.buildSongPerformanceCounts(performanceFilters);

            songs = songs
              .filter((song) => (counts[song.id] ?? 0) > 0)
              .map((song) => ({ ...song, timesPlayed: counts[song.id] }));
          }

          const filtered = await splitByPlayStatus(
            songs,
            showNotPlayed && (!!hasDateRange || !!attendedUserId),
            filter,
          );
          return await addVenueInfoToSongs(filtered);
        },
        { ttl: 3600 },
      );
    } catch (error) {
      logger.error("Error fetching filtered songs", { error });
      return [];
    }
  }

  // Handle search query
  if (!query || query.length < 2) {
    return [];
  }

  logger.info(`Song search for '${query}'`);

  try {
    const songs = await services.songs.search(query, 20);
    logger.info(`Song search for '${query}' returned ${songs.length} results`);
    return songs;
  } catch (error) {
    logger.error("Song search error", { error });
    return [];
  }
});
