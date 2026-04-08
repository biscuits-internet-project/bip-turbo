import { publicLoader } from "~/lib/base-loaders";
import { buildFilteredCacheKey, parsePerformanceFilters } from "~/lib/performance-filter-params";
import { services } from "~/server/services";

export const loader = publicLoader(async ({ request, context }) => {
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug");
  if (!slug) {
    return new Response(JSON.stringify({ error: "slug is required" }), { status: 400 });
  }

  const filters = await parsePerformanceFilters(url, context);
  const cacheKey = buildFilteredCacheKey(url, `song:${slug}`, filters.attendedUserId);

  return await services.cache.getOrSet(
    cacheKey,
    async () => services.songPageComposer.buildSongPerformances(slug, filters),
    { ttl: 3600 },
  );
});
