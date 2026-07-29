/**
 * Per-interval request counts, bucketed by route pattern.
 *
 * Exists because diagnosing the 2026-07 OOM incidents meant *inferring* which
 * routes took traffic from cache TTLs and URL shapes, since nothing recorded
 * it. Pairing these counts with the RSS line in `memory-log` turns "RSS climbed
 * 800MB this minute" into "RSS climbed 800MB this minute, and 412 of the
 * requests were year listings carrying a query string".
 */

/**
 * Ordered longest-prefix-first: `/shows/stats` must match before the
 * `/shows/:slug` catch-all, or every stats hit would be counted as a show
 * detail page.
 */
const ROUTE_BUCKETS: Array<{ match: RegExp; name: string }> = [
  { match: /^\/$/, name: "home" },
  { match: /^\/shows\/year(\/|$)/, name: "shows/year" },
  { match: /^\/shows\/stats(\/|$)/, name: "shows/stats" },
  { match: /^\/shows\/top-rated(\/|$)/, name: "shows/top-rated" },
  { match: /^\/shows\/tour-dates(\/|$)/, name: "shows/tour-dates" },
  { match: /^\/shows\/[^/]+$/, name: "shows/detail" },
  { match: /^\/shows(\/|$)/, name: "shows" },
  { match: /^\/songs\/[^/]+$/, name: "songs/detail" },
  { match: /^\/songs(\/|$)/, name: "songs" },
  { match: /^\/musicians\/[^/]+$/, name: "musicians/detail" },
  { match: /^\/musicians(\/|$)/, name: "musicians" },
  { match: /^\/venues\/[^/]+$/, name: "venues/detail" },
  { match: /^\/venues(\/|$)/, name: "venues" },
  { match: /^\/authors(\/|$)/, name: "authors" },
  { match: /^\/users(\/|$)/, name: "users" },
  { match: /^\/blog(\/|$)/, name: "blog" },
  { match: /^\/resources(\/|$)/, name: "resources" },
  { match: /^\/admin(\/|$)/, name: "admin" },
  { match: /^\/api(\/|$)/, name: "api" },
  { match: /^\/on-this-day(\/|$)/, name: "on-this-day" },
];

/**
 * Everything unmatched collapses here. The bucket list is fixed and slugs are
 * never recorded, so a crawler walking unbounded distinct paths cannot grow
 * this map — the counter measuring a memory problem must not become one. It
 * also keeps user-visible identifiers out of a world-readable run log, since
 * `ops.yml` prints these lines from a public repo.
 */
const OTHER_BUCKET = "other";

let counts = new Map<string, number>();

/**
 * Held separately from `counts` so the cap in `recordUnrecognizedParams` bounds
 * only the attacker-influenced keys. Mixing them would let a crawler's invented
 * param names crowd out the fixed route buckets.
 */
let paramNames = new Map<string, number>();

/**
 * Total requests in the interval whose user-agent identified a bot. Kept as one
 * flat number rather than a per-bucket split so the key set stays small: the
 * question it answers is "what share of this interval was crawlers", which the
 * 2026-07 investigation could only guess at.
 */
const BOT_BUCKET = "bot";

/** Bucket a request. `search` only affects the key by its presence. */
export function recordRequest(pathname: string, search: string, isBot = false): void {
  const bucket = ROUTE_BUCKETS.find((route) => route.match.test(pathname))?.name ?? OTHER_BUCKET;
  // A trailing `?` marks "carried a query string": filter permutations are the
  // crawler-shaped traffic that multiplies origin hits, and they cost more per
  // request than the bare URL, so they have to be countable separately.
  const key = search && search !== "?" ? `${bucket}?` : bucket;
  counts.set(key, (counts.get(key) ?? 0) + 1);
  if (isBot) counts.set(BOT_BUCKET, (counts.get(BOT_BUCKET) ?? 0) + 1);
}

/**
 * Record which edge-cache policy a listing response received.
 *
 * A listing only earns its day-long TTL when a purge can name the URL, and
 * everything else falls back to a short self-healing one. Which of those real
 * crawler traffic actually gets was inferred from URL shapes, never measured;
 * this is the field that answers it. Callers pass a fixed route name, so the
 * key set stays bounded at two per route.
 */
/**
 * Distinct unrecognized param names tracked per interval.
 *
 * A crawler can invent unbounded param names, and the map that exists to
 * diagnose a memory problem must not become one. Past the cap the rest collapse
 * into a single overflow bucket, which is enough to say "there is a long tail"
 * without holding it.
 */
export const MAX_TRACKED_PARAM_NAMES = 20;

/**
 * Record which param names cost a request its long edge TTL.
 *
 * Production shows a large share of `/shows/stats` hits falling to the short
 * self-healing TTL, which means the crawler sends params the route's own
 * controls never emit. Widening the recognized list needs their names, and
 * inferring them from URL shapes is what this instrumentation exists to stop.
 *
 * Names only, never values: a value can carry anything a visitor typed, and
 * `ops.yml` prints these lines into world-readable run logs.
 */
export function recordUnrecognizedParams(route: string, names: Iterable<string>): void {
  for (const name of names) {
    const key = `${route}:param:${name}`;
    if (paramNames.has(key)) {
      paramNames.set(key, (paramNames.get(key) ?? 0) + 1);
      continue;
    }
    if (paramNames.size >= MAX_TRACKED_PARAM_NAMES) {
      const overflow = `${route}:param:overflow`;
      paramNames.set(overflow, (paramNames.get(overflow) ?? 0) + 1);
      continue;
    }
    paramNames.set(key, 1);
  }
}

export function recordCachePolicy(route: string, purgeable: boolean): void {
  const key = `${route}:${purgeable ? "long" : "short"}`;
  counts.set(key, (counts.get(key) ?? 0) + 1);
}

/**
 * Return the counts since the last drain and reset. Each memory line therefore
 * describes the traffic in its own interval rather than since boot, which is
 * what makes it comparable against that interval's RSS delta.
 */
export function drainRequestCounts(): Record<string, number> {
  const drained = { ...Object.fromEntries(counts), ...Object.fromEntries(paramNames) };
  counts = new Map();
  paramNames = new Map();
  return drained;
}
