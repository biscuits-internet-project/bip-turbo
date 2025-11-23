import type { Show, Song } from "@bip/domain";
import { dateToISOStringSansTime } from "~/lib/date";
import { services } from "~/server/services";

/**
 * Enhances songs with firstPlayedShow and lastPlayedShow venue info.
 * Filters out songs with no plays, collects show dates, fetches shows, and returns enhanced songs.
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
