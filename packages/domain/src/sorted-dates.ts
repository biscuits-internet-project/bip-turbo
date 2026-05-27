/**
 * Pure binary-search counters over a sorted-ascending string array.
 * Lives in `@bip/domain` so both the server (rarity stats, gap denominators)
 * and the client (gap-chart Played Before column) can share one
 * implementation — `@bip/core` imports leak Prisma into the web bundle, so
 * the primitives needed to be hoisted somewhere universally importable.
 *
 * Designed for ISO `YYYY-MM-DD` strings — lexicographic compare matches
 * chronological order so callers don't have to parse to `Date`. Works on
 * any sorted-ascending string array even so; the "dates" naming reflects
 * the dominant use case, not a hard requirement on the input.
 *
 * All four public counters are thin wrappers around the standard
 * `lower_bound` / `upper_bound` pair (Python's `bisect_left` / `bisect_right`).
 * Keeping the two binary searches in one place means there's exactly one
 * `while (lo < hi) ...` loop to read, audit, and keep correct.
 */

/**
 * Smallest index `i` such that `arr[i] >= target`. Equivalent to C++
 * `std::lower_bound` / Python `bisect_left`. Returns `arr.length` when
 * every element is strictly less than target.
 */
function lowerBound(arr: readonly string[], target: string): number {
  let lo = 0;
  let hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

/**
 * Smallest index `i` such that `arr[i] > target`. Equivalent to C++
 * `std::upper_bound` / Python `bisect_right`. Returns `arr.length` when
 * every element is less than or equal to target.
 */
function upperBound(arr: readonly string[], target: string): number {
  let lo = 0;
  let hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (arr[mid] <= target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

/**
 * Count of entries strictly greater than `target`. Strictly-greater
 * (not `>=`) so a record at the most recent date reads "0 after itself",
 * not "1".
 */
export function countSortedAfter(sortedDates: readonly string[], target: string): number {
  return sortedDates.length - upperBound(sortedDates, target);
}

/**
 * Count of entries greater than or equal to `target`. Inclusive variant —
 * used as the denominator for "matching-universe shows from a debut date
 * onward" calculations where the debut itself must count.
 */
export function countSortedOnOrAfter(sortedDates: readonly string[], target: string): number {
  return sortedDates.length - lowerBound(sortedDates, target);
}

/**
 * Count of entries strictly less than `target`. Mirrors the "Seen Before"
 * semantic for catalog data: viewing a 2020 show shouldn't pull a 2024
 * performance into the count.
 */
export function countSortedBefore(sortedDates: readonly string[], target: string): number {
  return lowerBound(sortedDates, target);
}

/**
 * Count of entries strictly between `low` and `high` (both exclusive).
 * Drives the closed-gap denominator for average-gap calculations: the
 * endpoints themselves are performances, not gaps. Inverted or degenerate
 * intervals collapse to 0 rather than negative.
 */
export function countSortedBetween(sortedDates: readonly string[], low: string, high: string): number {
  if (low >= high) return 0;
  return lowerBound(sortedDates, high) - upperBound(sortedDates, low);
}
