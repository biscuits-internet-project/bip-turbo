import { publicLoader } from "~/lib/base-loaders";
import { buildFilteredCacheKey, parsePerformanceFilters } from "~/lib/performance-filter-params";
import { services } from "~/server/services";

export const loader = publicLoader(async ({ request, context }) => {
  const url = new URL(request.url);
  const filters = await parsePerformanceFilters(url, context);
  const cacheKey = buildFilteredCacheKey(url, "all-timers", filters.attendedUserId);

  const result = await services.cache.getOrSet(
    cacheKey,
    async () => services.songPageComposer.buildAllTimers(filters),
    { ttl: 3600 },
  );

  return result.performances;
});
