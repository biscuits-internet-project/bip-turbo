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

/**
 * Pull a value toward a stable anchor by a weight that grows with the sample
 * size: `w = count/(count+k)`. With few ratings the anchor dominates; with many,
 * the value does. Used by the Calibrated Show Rating for count-shrinkage (toward
 * the global average) and cold-start (a rater's mean toward the population mean,
 * their entropy toward full weight), on both the server compute and client
 * display paths so the formula stays identical.
 */
export function shrinkToward(value: number, anchor: number, count: number, k: number): number {
  if (count <= 0) return anchor;
  const weight = count / (count + k);
  return weight * value + (1 - weight) * anchor;
}
