import type { Song } from "@bip/domain";
import { publicLoader } from "~/lib/base-loaders";
import { logger } from "~/lib/logger";
import { addVenueInfoToSongs } from "~/lib/song-utilities";
import { services } from "~/server/services";

export const SONG_FILTERS = {
  sammy: { endDate: new Date("2005-08-27") },
  allen: { startDate: new Date("2005-12-28"), endDate: new Date("2025-09-07") },
  marlon: { startDate: new Date("2025-10-31") },
  triscuits: { startDate: new Date("2000-03-11"), endDate: new Date("2000-07-12") },
};

export const loader = publicLoader(async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("q");
  const era = url.searchParams.get("era");
  const playedParam = url.searchParams.get("played");
  const authorId = url.searchParams.get("author");
  const coverParam = url.searchParams.get("cover");
  // Default to "played" if not specified, or if "notPlayed" show only not played songs
  const showNotPlayed = playedParam === "notPlayed";

  // Convert cover filter to boolean or undefined
  const coverFilter = coverParam === "cover" ? true : coverParam === "original" ? false : undefined;

  // Handle filtering (author, cover, or both with optional era)
  if (authorId || coverFilter !== undefined) {
    try {
      let filteredSongs: Song[];

      const filter: { authorId?: string; cover?: boolean; startDate?: Date; endDate?: Date } = {};
      if (authorId) filter.authorId = authorId;
      if (coverFilter !== undefined) filter.cover = coverFilter;

      // If era is specified, combine with other filters
      if (era && era in SONG_FILTERS) {
        const eraFilter = SONG_FILTERS[era as keyof typeof SONG_FILTERS];
        filteredSongs = await services.songs.findManyInDateRange({ ...eraFilter, ...filter });
      } else {
        // Filter by author/cover only
        filteredSongs = await services.songs.findMany(filter);
      }

      // Handle played/not played filtering
      let filteredSongsByPlayStatus: Song[];
      if (showNotPlayed) {
        const notPlayedInEra = filteredSongs.filter((song) => song.timesPlayed === 0);
        const songIds = notPlayedInEra.map((song) => song.id);
        const allSongs = await services.songs.findMany({});
        const songsWithOverallStats = allSongs.filter((song) => songIds.includes(song.id));

        const overallTimesPlayedMap = new Map<string, number>(
          songsWithOverallStats.map((song) => [song.id, song.timesPlayed]),
        );

        filteredSongsByPlayStatus = notPlayedInEra.sort((a, b) => {
          const aOverall = overallTimesPlayedMap.get(a.id) || 0;
          const bOverall = overallTimesPlayedMap.get(b.id) || 0;
          return bOverall - aOverall;
        });
      } else {
        filteredSongsByPlayStatus = filteredSongs.filter((song) => song.timesPlayed > 0);
      }

      const songsWithVenueInfo = await addVenueInfoToSongs(filteredSongsByPlayStatus);
      return songsWithVenueInfo;
    } catch (error) {
      logger.error("Error fetching author filtered songs", { error });
      return [];
    }
  }

  // Handle era filtering (without author)
  if (era && era in SONG_FILTERS) {
    const eraFilter = SONG_FILTERS[era as keyof typeof SONG_FILTERS];
    try {
      const filteredSongs = await services.songs.findManyInDateRange(eraFilter);

      // For "not played" songs, we need to get their overall timesPlayed for sorting
      // The findMany with date range recalculates timesPlayed for that era only
      // So we need to fetch the original overall timesPlayed from the database
      let filteredSongsByPlayStatus: Song[];
      if (showNotPlayed) {
        // Filter to only songs not played in this era
        const notPlayedInEra = filteredSongs.filter((song) => song.timesPlayed === 0);

        // Fetch overall timesPlayed for these songs to sort by popularity
        const songIds = notPlayedInEra.map((song) => song.id);
        const allSongs = await services.songs.findMany({});
        const songsWithOverallStats = allSongs.filter((song) => songIds.includes(song.id));

        // Create a map of overall timesPlayed
        const overallTimesPlayedMap = new Map<string, number>(
          songsWithOverallStats.map((song) => [song.id, song.timesPlayed]),
        );

        // Sort by overall timesPlayed descending (most popular first)
        filteredSongsByPlayStatus = notPlayedInEra.sort((a, b) => {
          const aOverall = overallTimesPlayedMap.get(a.id) || 0;
          const bOverall = overallTimesPlayedMap.get(b.id) || 0;
          return bOverall - aOverall;
        });
      } else {
        // Only played songs (default) - already sorted by timesPlayed in era
        filteredSongsByPlayStatus = filteredSongs.filter((song) => song.timesPlayed > 0);
      }

      const songsWithVenueInfo = await addVenueInfoToSongs(filteredSongsByPlayStatus);
      return songsWithVenueInfo;
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
    // Search songs by title
    const songs = await services.songs.search(query, 20);

    logger.info(`Song search for '${query}' returned ${songs.length} results`);
    return songs;
  } catch (error) {
    logger.error("Song search error", { error });
    return [];
  }
});
