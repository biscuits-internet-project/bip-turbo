import { useQuery } from "@tanstack/react-query";

export type SongPlayDates = Record<string, string[]>;

const EMPTY: SongPlayDates = {};

/**
 * Lazy fetcher for the catalog play-history blob (`{songId: [date, ...]}`).
 * Backs the SetlistCard gap-chart "Played Before" column — the lazy gate
 * is structural: this hook only mounts when SetlistTable mounts, which
 * only happens when the user opens gap-chart. After that one fetch, every
 * gap-chart toggle across the session reads from React Query in memory.
 *
 * Public payload (no auth needed). 5-minute staleTime mirrors the personal
 * history hook; the server-side cache is Redis-backed with a 24h TTL and
 * invalidates on show mutations.
 */
export function useSongPlayDates(): { data: SongPlayDates; isLoading: boolean } {
  const { data, isLoading } = useQuery({
    queryKey: ["stats", "song-play-dates"],
    queryFn: async (): Promise<SongPlayDates> => {
      const response = await fetch("/api/stats/song-play-dates");
      if (!response.ok) throw new Error("Failed to load song play dates");
      return response.json();
    },
    staleTime: 5 * 60_000,
  });

  return { data: data ?? EMPTY, isLoading };
}
