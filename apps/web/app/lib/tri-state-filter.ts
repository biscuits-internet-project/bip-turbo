/**
 * Tri-state for the year-page media filters: each toggle cycles
 * empty → positive → negative → empty so users can express both
 * "must have media X" and "must NOT have media X" in the same URL.
 */
export type TriState = "empty" | "positive" | "negative";

/**
 * The URL param names for the five year-page media filters, in the order they
 * are emitted. Order matches the badge strip in SetlistCard so filter buttons
 * and the per-row indicators read the same way.
 *
 * Shared rather than component-local because the year loader also needs it: a
 * URL carrying only these params is one the origin can record and a show edit
 * can purge, which is what earns it a day-long edge TTL.
 */
export const MEDIA_FILTER_PARAMS = ["nugs", "youtube", "archive", "relisten", "photos"] as const;

export type MediaFilterParam = (typeof MEDIA_FILTER_PARAMS)[number];

/** True when `key` is one of the media filters. */
export function isMediaFilterParam(key: string): key is MediaFilterParam {
  return (MEDIA_FILTER_PARAMS as readonly string[]).includes(key);
}

/**
 * Read all five media filters out of a URL's params.
 *
 * Derived from {@link MEDIA_FILTER_PARAMS} rather than spelled out per key, so
 * adding a filter to that list cannot leave a reader silently ignoring it.
 */
export function readMediaFilters(params: URLSearchParams): Record<MediaFilterParam, TriState> {
  return Object.fromEntries(MEDIA_FILTER_PARAMS.map((key) => [key, parseTriState(params.get(key))])) as Record<
    MediaFilterParam,
    TriState
  >;
}

/**
 * Rewrite `params` so the media filters appear in a fixed order after any
 * other params.
 *
 * Cloudflare keys on the literal query string, so `?nugs=yes&photos=no` and
 * `?photos=no&nugs=yes` are two edge entries holding identical bytes. Toggle
 * order alone would otherwise decide which one a user creates, multiplying the
 * entries a show edit has to purge.
 */
export function canonicalizeFilterParams(params: URLSearchParams): URLSearchParams {
  const canonical = new URLSearchParams();
  for (const [key, value] of params) {
    if (!isMediaFilterParam(key)) canonical.append(key, value);
  }
  for (const key of MEDIA_FILTER_PARAMS) {
    const value = params.get(key);
    if (value !== null) canonical.set(key, value);
  }
  return canonical;
}

/**
 * The click cycle. Lives here (not inline in the component) so loader,
 * counts helper, and component all agree on the order.
 */
export const TRI_STATE_NEXT: Record<TriState, TriState> = {
  empty: "positive",
  positive: "negative",
  negative: "empty",
};

/**
 * Read a tri-state value from a `URLSearchParams.get()` result. Anything
 * other than literal `"no"` reads as positive — including bare-key `?key`
 * (which `.get()` returns as `""`) and `?key=true`. Permissive on purpose
 * so externally shared URLs that omit the value still narrow the show list.
 */
export function parseTriState(value: string | null): TriState {
  if (value === null) return "empty";
  if (value === "no") return "negative";
  return "positive";
}

/**
 * Mutate `params` so the given filter key reflects `state`. Empty deletes
 * the key entirely; positive/negative write the canonical `"yes"` / `"no"`.
 */
export function writeTriState(params: URLSearchParams, key: string, state: TriState): void {
  if (state === "empty") {
    params.delete(key);
  } else if (state === "positive") {
    params.set(key, "yes");
  } else {
    params.set(key, "no");
  }
}

/**
 * Keep-predicate for a single tri-state media/source filter: positive keeps
 * items that HAVE the thing, negative keeps items that LACK it, empty keeps
 * everything. The one place the positive/negative match lives so the DB-query
 * filters, their in-memory equivalents (media counts, external sources), and
 * the per-year counts helper can't drift apart.
 */
export function matchesTriState(state: TriState | undefined, has: boolean): boolean {
  if (state === "positive") return has;
  if (state === "negative") return !has;
  return true;
}

/** True when at least one flag is in a non-empty state. */
export function isAnyTriStateActive(flags: Record<string, TriState | undefined>): boolean {
  for (const key in flags) {
    const value = flags[key];
    if (value && value !== "empty") return true;
  }
  return false;
}
