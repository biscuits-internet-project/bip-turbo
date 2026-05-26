import type { PersonalSongHistory } from "@bip/core";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "~/hooks/use-session";

const EMPTY: PersonalSongHistory = { attendedShows: [], songAttendances: {} };

/**
 * Lazy fetcher for the current user's full attendance + per-song history.
 * Backs the SetlistCard "personal" view. Disabled when logged out so the
 * endpoint is never hit anonymously. 5-minute staleTime — the server is
 * Redis-cached for 24h and invalidates on attendance toggles, so this is
 * just to avoid refetch storms during a single browsing session.
 */
export function usePersonalSongHistory(): {
  data: PersonalSongHistory;
  isLoading: boolean;
} {
  const { user } = useSession();
  const userId = user?.id ?? null;

  const { data, isLoading } = useQuery({
    queryKey: ["users", "song-history", userId],
    queryFn: async (): Promise<PersonalSongHistory> => {
      const response = await fetch("/api/users/song-history", { credentials: "include" });
      if (!response.ok) throw new Error("Failed to load personal song history");
      return response.json();
    },
    enabled: Boolean(userId),
    staleTime: 5 * 60_000,
  });

  return { data: data ?? EMPTY, isLoading };
}
