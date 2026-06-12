import { isNarrowingFilter } from "@bip/core/page-composers/song-page-composer";
import { publicLoader } from "~/lib/base-loaders";
import { buildFilteredCacheKey, parsePerformanceFilters } from "~/lib/performance-filter-params";
import { services } from "~/server/services";

/**
 * Filtered song-performances endpoint. `parsePerformanceFilters` folds `?slug=`
 * into `filters.songSlug`, so the composer handles both modes uniformly: a slug
 * scopes to one song (the song-detail tab, with filtered Gaps); without one it's
 * a cross-song list (all-timers, jam-charts, musician, …). The cache scope keys
 * single-song results per slug.
 */
export const loader = publicLoader(async ({ request, context }) => {
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug");
  const filters = await parsePerformanceFilters(url, context);

  // A song scope is its own narrowing; a cross-song list with no narrowing
  // filter would scan every track ever played, so refuse it. (The composer
  // throws the same guard as a backstop for any other caller.)
  if (!slug && !isNarrowingFilter(filters)) {
    return new Response(JSON.stringify({ error: "a narrowing filter is required" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const cacheKey = buildFilteredCacheKey(url, slug ? `song:${slug}` : "performances", filters.attendedUserId);
  const view = await services.cache.getOrSet(cacheKey, () => services.songPageComposer.buildSongPerformances(filters), {
    ttl: 3600,
  });
  return view.performances;
});
