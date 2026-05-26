/**
 * Pure numeric reductions. Kept in the domain package so both the server
 * (catalog gap aggregates in setlist-service) and the client (per-user
 * gap aggregates in personal-setlist-columns) share the same arithmetic.
 * Each function returns `null` on an empty input so callers can branch on
 * "show the value vs. hide the cell" without a separate length check.
 */

export function average(values: readonly number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function median(values: readonly number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = sorted.length >>> 1;
  return sorted.length % 2 === 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}
