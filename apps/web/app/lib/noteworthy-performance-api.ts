import type { PerformanceFilterOptions } from "@bip/core/page-composers/song-page-composer";
import type { AllTimersPageView } from "@bip/domain";
import { publicLoader } from "~/lib/base-loaders";
import { buildFilteredCacheKey, parsePerformanceFilters } from "~/lib/performance-filter-params";
import { services } from "~/server/services";

/**
 * Shared API loader for the cross-song noteworthy-performance endpoints
 * (`/api/all-timers`, `/api/jam-charts`). Parses URL filters, derives a
 * filter-aware cache key, and delegates to the route-specific `build`
 * function (which carries the base WHERE condition). Returns just the
 * performances array — the routes are consumed by client-side refetch,
 * not by SSR loaders that also need a dehydrated query client.
 */
export function createNoteworthyApiLoader({
  cacheSuffix,
  build,
}: {
  /** Cache-key suffix passed through `buildFilteredCacheKey` — e.g. `"all-timers"` or `"jam-charts"`. */
  cacheSuffix: string;
  build: (filters: PerformanceFilterOptions) => Promise<AllTimersPageView>;
}) {
  return publicLoader(async ({ request, context }) => {
    const url = new URL(request.url);
    const filters = await parsePerformanceFilters(url, context);
    const cacheKey = buildFilteredCacheKey(url, cacheSuffix, filters.attendedUserId);

    const result = await services.cache.getOrSet(cacheKey, async () => build(filters), { ttl: 3600 });

    return result.performances;
  });
}
