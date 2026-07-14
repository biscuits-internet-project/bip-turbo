import type { AllTimersPageView } from "@bip/domain";
import type { DehydratedState } from "@tanstack/react-query";
import { type PublicContext, publicLoader } from "~/lib/base-loaders";
import { showUserDataQueryKey, trackUserRatingsQueryKey } from "~/lib/query-keys";
import { createPrefetchClient, dehydrateAndClear } from "~/lib/query-prefetch";
import { services } from "~/server/services";
import { computeShowUserData } from "~/server/show-user-data";
import { computeTrackUserRatings } from "~/server/track-user-ratings";

export type NoteworthyLoaderData = AllTimersPageView & { dehydratedState: DehydratedState };

/**
 * Server-only loader factory for the cross-song noteworthy-performance
 * pages (`/songs/all-timers`, `/songs/jam-charts`). Caches the composer
 * result and prefetches per-track rating + per-show attendance data so
 * the first frame paints with hydrated chrome.
 *
 * Kept in its own file (no JSX, no client imports) because route
 * components reference `FilteredSongPerformanceTable` as a runtime value;
 * if the loader factory and the component lived in the same module,
 * Vite would pull `~/server/*` into the client bundle through the
 * component import and break `<Link>` navigation (see PR #58 +
 * apps/web/CLAUDE.md).
 */
export function createNoteworthyLoader({
  cacheKey,
  build,
}: {
  cacheKey: string;
  build: () => Promise<AllTimersPageView>;
}) {
  return publicLoader(async ({ context }: { context: PublicContext }): Promise<NoteworthyLoaderData> => {
    const view = await services.cache.getOrSet(cacheKey, build, { ttl: 3600 });

    const trackIds = view.performances.map((p) => p.trackId);
    const showIds = [...new Set(view.performances.map((p) => p.show.id))];
    const queryClient = createPrefetchClient();
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: trackUserRatingsQueryKey(trackIds),
        queryFn: () => computeTrackUserRatings(context, trackIds),
      }),
      queryClient.prefetchQuery({
        queryKey: showUserDataQueryKey(showIds),
        queryFn: () => computeShowUserData(context, showIds),
      }),
    ]);

    return { ...view, dehydratedState: dehydrateAndClear(queryClient) };
  });
}
