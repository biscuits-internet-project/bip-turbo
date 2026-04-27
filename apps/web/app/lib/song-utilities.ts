import type { Show, Song } from "@bip/domain";
import { CacheKeys } from "@bip/domain/cache-keys";
import type { PublicContext } from "~/lib/base-loaders";
import { dateToISOStringSansTime } from "~/lib/date";
import {
  parsePerformanceFilters,
  resolveAttendedUserId,
  resolveLast10ShowsDateRange,
} from "~/lib/performance-filter-params";
import { shouldShowNotPlayed } from "~/lib/played-filter";
import { getTimeRangeParam, SONG_FILTERS } from "~/lib/song-filters";
import { services } from "~/server/services";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface BaseFilter {
  authorId?: string;
  cover?: boolean;
}

/**
 * Single source of truth for the /songs filter pipeline. Called by the
 * `/api/songs` endpoint and by the page loaders for `/songs`,
 * `/songs/this-year`, and `/songs/recent`, so loader revalidation can
 * drive filter updates without a separate client fetch.
 *
 * The canonical all-time list comes from `services.songs.findMany` keyed
 * only on cover/author — those filters pick which songs appear, not which
 * performances contribute to a count. Narrowing filters (date range,
 * attended, toggle flags) compute scope counts as a separate
 * `Map<songId, count>` and attach as `filteredTimesPlayed`. `timesPlayed`
 * always means the all-time count from the denormalized song column.
 */
export async function fetchFilteredSongs(url: URL, context: PublicContext): Promise<Song[]> {
  const params = url.searchParams;
  const timeRangeParam = getTimeRangeParam(params);
  const playedParam = params.get("played");
  const authorParam = params.get("author");
  const coverParam = params.get("cover");
  const attendedParam = params.get("attended");
  const filtersParam = params.get("filters");

  const coverFilter = coverParam === "cover" ? true : coverParam === "original" ? false : undefined;
  const authorId = authorParam && UUID_REGEX.test(authorParam) ? authorParam : undefined;
  const attendedUserId = await resolveAttendedUserId(attendedParam, context);

  const hasDateRange = timeRangeParam === "last10shows" || (timeRangeParam !== null && timeRangeParam in SONG_FILTERS);
  const hasToggleFilters = !!filtersParam;
  const hasAttendedUser = !!attendedUserId;
  const showNotPlayed = shouldShowNotPlayed({
    playedParam,
    hasDateRange,
    hasAttendedUser,
    hasToggleFilters,
  });

  const baseFilter: BaseFilter = {};
  if (authorId) baseFilter.authorId = authorId;
  if (coverFilter !== undefined) baseFilter.cover = coverFilter;

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
      const allSongs = await services.songs.findMany(baseFilter);

      const scopeCountsById = await computeScopeCounts({
        url,
        context,
        baseFilter,
        attendedUserId,
        timeRangeParam,
        hasDateRange,
        hasAttendedUser,
        hasToggleFilters,
      });

      let result: Song[];
      if (!scopeCountsById) {
        result = allSongs.filter((song) => song.timesPlayed > 0);
      } else if (showNotPlayed) {
        result = allSongs
          .filter((song) => song.timesPlayed > 0 && !scopeCountsById.has(song.id))
          .sort((a, b) => b.timesPlayed - a.timesPlayed);
      } else {
        result = allSongs
          .filter((song) => scopeCountsById.has(song.id))
          .map((song) => ({ ...song, filteredTimesPlayed: scopeCountsById.get(song.id) }));
      }

      return await addVenueInfoToSongs(result);
    },
    { ttl: 3600 },
  );
}

interface ScopeContext {
  url: URL;
  context: PublicContext;
  baseFilter: BaseFilter;
  attendedUserId: string | undefined;
  timeRangeParam: string | null;
  hasDateRange: boolean;
  hasAttendedUser: boolean;
  hasToggleFilters: boolean;
}

/**
 * Returns scope counts as a `Map<songId, count>` for whichever narrowing
 * filter is active, or `null` when no narrowing is happening. Dispatch:
 * `buildSongPerformanceCounts` is the only counter that understands toggle
 * flags, so any toggle wins; otherwise date range or attended routes
 * through the song service. The two paths count differently on same-show
 * repeats (distinct-tracks vs distinct-shows-with-track) — call sites
 * surface whichever the active filter selects.
 */
async function computeScopeCounts(scope: ScopeContext): Promise<Map<string, number> | null> {
  const { url, context, baseFilter, attendedUserId, timeRangeParam, hasDateRange, hasAttendedUser, hasToggleFilters } =
    scope;

  if (hasToggleFilters) {
    const performanceFilters = await parsePerformanceFilters(url, context);
    const counts = await services.songPageComposer.buildSongPerformanceCounts(performanceFilters);
    return new Map(Object.entries(counts).filter(([, c]) => c > 0));
  }

  if (hasDateRange) {
    const dateRange = await resolveDateRangeForTimeRange(timeRangeParam);
    if (!dateRange) return new Map();
    const scoped = await services.songs.findManyInDateRange({
      ...baseFilter,
      ...(attendedUserId ? { attendedUserId } : {}),
      ...dateRange,
    });
    return new Map(scoped.filter((song) => song.timesPlayed > 0).map((song) => [song.id, song.timesPlayed]));
  }

  if (hasAttendedUser) {
    const scoped = await services.songs.findMany({ ...baseFilter, attendedUserId });
    return new Map(scoped.filter((song) => song.timesPlayed > 0).map((song) => [song.id, song.timesPlayed]));
  }

  return null;
}

async function resolveDateRangeForTimeRange(
  timeRangeParam: string | null,
): Promise<{ startDate?: Date; endDate?: Date } | null> {
  if (timeRangeParam === "last10shows") {
    return await resolveLast10ShowsDateRange();
  }
  if (timeRangeParam && timeRangeParam in SONG_FILTERS) {
    const { startDate, endDate } = SONG_FILTERS[timeRangeParam];
    return { startDate, endDate };
  }
  return null;
}

/**
 * Adds the venue info to a songs firstPlayedShow and lastPlayedShow.
 */
export async function addVenueInfoToSongs(
  songs: Song[],
): Promise<Array<Song & { firstPlayedShow: Show | null; lastPlayedShow: Show | null }>> {
  const showDates = new Set<string>();
  songs.forEach((song) => {
    if (song.dateFirstPlayed) {
      showDates.add(dateToISOStringSansTime(song.dateFirstPlayed));
    }
    if (song.dateLastPlayed) {
      showDates.add(dateToISOStringSansTime(song.dateLastPlayed));
    }
  });

  const showsWithVenues = showDates.size > 0 ? await services.shows.findManyByDates(Array.from(showDates)) : [];
  const showsByDate = new Map(showsWithVenues.map((show) => [show.date, show]));

  return songs.map((song) => ({
    ...song,
    firstPlayedShow: song.dateFirstPlayed
      ? (showsByDate.get(dateToISOStringSansTime(song.dateFirstPlayed)) ?? null)
      : null,
    lastPlayedShow: song.dateLastPlayed
      ? (showsByDate.get(dateToISOStringSansTime(song.dateLastPlayed)) ?? null)
      : null,
  }));
}
