import { CacheKeys, type Setlist } from "@bip/domain";
import type { DehydratedState } from "@tanstack/react-query";
import type { ShowExternalSources } from "~/components/setlist/show-external-badges";
import type { PublicContext } from "~/lib/base-loaders";
import { showUserDataQueryKey } from "~/lib/query-keys";
import { createPrefetchClient, dehydrateAndClear } from "~/lib/query-prefetch";
import { services } from "~/server/services";
import { computeShowExternalSources } from "~/server/show-external-sources";
import { computeShowUserData } from "~/server/show-user-data";

export interface RockOperaPerformancesLoaderData {
  /**
   * Setlists for every full performance of the rock opera, oldest first.
   * The 1st-ever performance is the FIRST item; SetlistList renders this
   * order directly with `numbered`, so the gutter naturally shows 1..N.
   */
  performances: Setlist[];
  externalSources: Record<string, ShowExternalSources>;
  dehydratedState: DehydratedState;
}

/**
 * Shared loader payload for the rock opera resource pages
 * (`/resources/hot-air-balloon`, `/resources/chemical-warfare-brigade`,
 * `/resources/revolution-in-motion`). Cached under the
 * `rock-operas:performances:{slug}` key — invalidated by
 * `CacheInvalidationService.invalidateRockOperaAssignment` whenever an
 * admin tags or untags a show.
 */
export async function getRockOperaPerformances(
  rockOperaSlug: string,
  context: Pick<PublicContext, "currentUser">,
): Promise<RockOperaPerformancesLoaderData> {
  const cacheKey = CacheKeys.rockOperas.performances(rockOperaSlug);
  const cached = await services.cache.getOrSet(cacheKey, async () => {
    const showIds = await services.rockOperas.findPerformanceShowIds(rockOperaSlug);
    if (showIds.length === 0) {
      return { performances: [] as Setlist[], externalSources: {} };
    }
    // Sort ASC so the oldest (1st-ever full performance) lands first in
    // the array — SetlistList's `numbered` gutter then displays 1..N
    // naturally. SetlistService overlays rockOperaPerformances on every
    // returned setlist, so no further annotation lookup is needed here.
    const setlists = await services.setlists.findManyByShowIds(showIds, {
      sort: [{ field: "date", direction: "asc" }],
    });
    const externalSources = await computeShowExternalSources(setlists.map((s) => s.show));
    return { performances: setlists, externalSources };
  });

  // Prefetch per-show user data (attendance + ratings) so SetlistList's
  // badges paint with the SSR HTML — same pattern as /shows/top-rated.
  const showIds = cached.performances.map((s) => s.show.id);
  const queryClient = createPrefetchClient();
  if (showIds.length > 0) {
    await queryClient.prefetchQuery({
      queryKey: showUserDataQueryKey(showIds),
      queryFn: () => computeShowUserData(context, showIds),
    });
  }

  return {
    performances: cached.performances,
    externalSources: cached.externalSources,
    dehydratedState: dehydrateAndClear(queryClient),
  };
}
