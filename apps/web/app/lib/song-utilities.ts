import type { Show, Song } from "@bip/domain";
import { dateToISOStringSansTime } from "~/lib/date";
import { services } from "~/server/services";

interface SongsLoaderData {
  songs: Song[];
}

interface DateRange {
  startDate?: Date;
  endDate?: Date;
}

/**
 * Shared loader logic for songs pages: cache lookup, fetch songs (optionally
 * filtered by date range), exclude unplayed songs, and add venue info.
 */
export async function loadSongsWithVenueInfo(
  cacheKey: string,
  dateRange?: DateRange,
): Promise<SongsLoaderData> {
  return await services.cache.getOrSet(
    cacheKey,
    async () => {
      const allSongs = dateRange
        ? await services.songs.findManyInDateRange(dateRange)
        : await services.songs.findMany({});

      const songs = allSongs.filter((song) => song.timesPlayed > 0);
      const songsWithVenueInfo = await addVenueInfoToSongs(songs);
      return { songs: songsWithVenueInfo };
    },
    { ttl: 3600 },
  );
}

/**
 * Adds the venue info to a songs firstPlayedShow and lastPlayedShow.
 */
export async function addVenueInfoToSongs(
  songs: Song[],
): Promise<Array<Song & { firstPlayedShow: Show | null; lastPlayedShow: Show | null }>> {
  // Get unique show dates for first/last played venue lookup
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
