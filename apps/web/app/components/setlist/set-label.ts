/**
 * Compact display of a track's `set` value across any table that shows a
 * Set column. Drops the "S" prefix on regular sets ("S1" → "1") because the
 * column header already says "Set". Encores keep their letter; if the
 * caller knows the surrounding setlist has only one encore (single-show
 * tables), pass `encoresInSet: 1` to collapse "E1" → "E". Anything else
 * (e.g. "Soundcheck") renders verbatim.
 *
 * @param raw The raw set label as stored on the Track row.
 * @param opts.encoresInSet Optional count of distinct encores that share
 *   the same setlist as this track. Only meaningful when the caller knows
 *   the full setlist (e.g. SetlistTable); cross-show tables omit it.
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
