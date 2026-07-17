/**
 * Tri-state for the year-page media filters: each toggle cycles
 * empty → positive → negative → empty so users can express both
 * "must have media X" and "must NOT have media X" in the same URL.
 */
export type TriState = "empty" | "positive" | "negative";

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
 * Convert a tri-state to the `boolean | undefined` shape used by the core
 * `SetlistFilter` for `hasPhotos` / `hasYoutube`.
 *   empty → undefined (no filter)
 *   positive → true (must have)
 *   negative → false (must NOT have)
 */
export function triStateToBoolean(state: TriState): boolean | undefined {
  if (state === "empty") return undefined;
  return state === "positive";
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
