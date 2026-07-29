/**
 * Request paths that more than one package has to spell identically.
 *
 * A path built in two places is a silent-failure risk wherever the two are
 * compared rather than rendered: Cloudflare's purge-by-URL matches a cache key
 * exactly and reports success either way, so a purge naming a path the origin
 * never served evicts nothing and says nothing. The year listing is built by
 * the web loader (recording what it served) and by the core purge service
 * (naming what to evict), so it lives here rather than in either one.
 */

/** The `/shows/year/:year` listing, without query string. */
export function yearListingPath(year: number): string {
  return `/shows/year/${year}`;
}

/** The `/shows/stats` table, without query string. */
export function showsStatsPath(): string {
  return "/shows/stats";
}

/**
 * Scope identifiers for the served-URL purge registry.
 *
 * They live beside the paths, and in the domain package, because both the web
 * loaders (recording what they served) and the core purge service (naming what
 * to evict) must agree on them. A route module can import from here without
 * pulling the server-only core package into the client bundle.
 */

/** `/shows/stats` is one global listing rather than one per year. */
export const SHOWS_STATS_SCOPE = "shows-stats";

/** The scope covering one year's `/shows/year/:year` listing. */
export function yearScope(year: number): string {
  return `year:${year}`;
}
