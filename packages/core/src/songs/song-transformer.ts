import type { Song } from "@bip/domain";
import type { SongRow } from "../_shared/drizzle/types";

export function transformSong(song: SongRow): Song {
  return {
    ...song,
    createdAt: new Date(song.createdAt),
    updatedAt: new Date(song.updatedAt),
    dateLastPlayed: song.dateLastPlayed ? new Date(song.dateLastPlayed) : null,
    yearlyPlayData: song.yearlyPlayData as Record<string, unknown>,
    longestGapsData: song.longestGapsData as Record<string, unknown>,
  };
}
