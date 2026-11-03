import { isNarrowingFilter } from "@bip/core/page-composers/song-page-composer";
import { publicLoader } from "~/lib/base-loaders";
import {
  buildFilteredCacheKey,
  normalizeFilterKeyParts,
  parsePerformanceFilters,
} from "~/lib/performance-filter-params";
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
  const rawSlug = url.searchParams.get("slug");
  const slug = normalizeFilterKeyParts(url.searchParams).slug;

  // `slug` becomes both the cache scope and a real predicate, so a junk value mints a
  // Redis entry and runs the aggregate. Bound the shape here — cheap, and it rules out
  // the arbitrary strings that make walking the space trivial.
  //
  // Deliberately NOT resolving the song: that would add a DB round trip to every request
  // including cache hits, to defend a cache-fill. Shape validation is the cheap bound;
  // request volume is handled at the edge, not here.
  //
  // Checked before parsePerformanceFilters, which does its own DB lookups (musician,
  // attended user, last-10-shows) that a rejected request should not pay for.
  if (rawSlug && !slug) {
    return new Response(JSON.stringify({ error: "invalid song slug" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

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
