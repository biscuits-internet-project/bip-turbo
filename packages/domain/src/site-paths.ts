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
