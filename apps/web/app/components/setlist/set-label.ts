/**
 * Compact display of a track's `set` value across any table that shows a
 * Set column. Drops the "S" prefix on regular sets ("S1" → "1") because the
 * column header already says "Set". Encores keep their numeral unless the
 * caller passes `encoresInSet: 1`, which collapses "E1" → "E". Anything else
 * (e.g. "Soundcheck") renders verbatim.
 *
 * @param raw The raw set label as stored on the Track row.
 * @param opts.encoresInSet Count of distinct encores in this track's show.
 *   Single-show tables derive it from the setlist in scope; cross-show
 *   tables carry it per-row on the performance DTO. Omit it only when the
 *   show's encore count is genuinely unknown.
 */
export function formatSetLabel(raw: string, opts?: { encoresInSet?: number }): string {
  const upper = raw.toUpperCase();
  if (/^S\d+$/.test(upper)) return upper.slice(1);
  if (/^E\d+$/.test(upper)) {
    return opts?.encoresInSet === 1 ? "E" : upper;
  }
  return raw;
}

/**
 * Counts distinct encore labels in a flat track list. Use the result as
 * `encoresInSet` for {@link formatSetLabel} when you have the whole setlist
 * in scope (e.g. inside SetlistTable's Set column cell renderer).
 */
export function countDistinctEncores(rows: ReadonlyArray<{ set: string }>): number {
  const encores = new Set<string>();
  for (const r of rows) {
    if (/^E\d+$/i.test(r.set)) encores.add(r.set.toUpperCase());
  }
  return encores.size;
}

/**
 * Distinct-encore count from a setlist's set groupings, where the set value
 * lives on each group's `label` rather than on individual tracks. Adapts to
 * {@link countDistinctEncores} so callers holding a `Setlist`-shaped object
 * (sets with labels) get the `encoresInSet` value without re-deriving the
 * set→`{ set }` mapping at the call site.
 */
export function countSetlistEncores(sets: ReadonlyArray<{ label: string }>): number {
  return countDistinctEncores(sets.map((s) => ({ set: s.label })));
}

/**
 * Numeric sort key for a set label so callers can sort tracks by canonical
 * narrative order: soundcheck first, then S1..S4, then E1..E3, unknowns
 * last. Pairs with {@link compareBySetThenPosition} for full row ordering.
 */
export function setSortKey(label: string): number {
  const upper = label.toUpperCase();
  if (label.toLowerCase() === "soundcheck") return 0;
  if (upper === "S1") return 10;
  if (upper === "S2") return 20;
  if (upper === "S3") return 30;
  if (upper === "S4") return 40;
  if (upper === "E1") return 50;
  if (upper === "E2") return 60;
  if (upper === "E3") return 70;
  return 999;
}

/**
 * Sort comparator for any track-like row: order by set bucket first, then
 * by track position within the set. Generic over the row shape so it works
 * for both `SetlistTableRow` (gap chart) and `PersonalSetlistTableRow`
 * (personal gap chart) — anything with `{set, position}`.
 */
export function compareBySetThenPosition<T extends { set: string; position: number }>(a: T, b: T): number {
  const setDiff = setSortKey(a.set) - setSortKey(b.set);
  if (setDiff !== 0) return setDiff;
  return a.position - b.position;
}
