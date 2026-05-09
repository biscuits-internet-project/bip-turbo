import type { ShowMinimal } from "./models/show";

/**
 * Comparator for ASC ordering of rows that carry a `show` field by
 * chronological position with the canonical same-date tiebreakers (date →
 * dayOrder NULLs LAST → id). Mirrors the server-side rule in
 * `packages/core/src/_shared/show-ordering.ts` so a "sort by date" toggle
 * on the client produces the same order the loader would have returned.
 *
 * Use as a TanStack Table `sortingFn`. TanStack inverts this result for
 * descending sort, which means our DESC behavior is "strict reversal of
 * ASC" (NULLs end up first in DESC output) — matching the server.
 *
 * Domain-only (no Prisma). Safe to import in client bundles.
 */
export function compareByShowDate(
  a: { show: Pick<ShowMinimal, "id" | "date"> & { dayOrder?: number | null } },
  b: { show: Pick<ShowMinimal, "id" | "date"> & { dayOrder?: number | null } },
): number {
  if (a.show.date !== b.show.date) return a.show.date < b.show.date ? -1 : 1;
  // Same date: tiebreak by dayOrder. NULLs sort LAST in ASC (treated as +∞).
  const aOrder = a.show.dayOrder ?? Number.MAX_SAFE_INTEGER;
  const bOrder = b.show.dayOrder ?? Number.MAX_SAFE_INTEGER;
  if (aOrder !== bOrder) return aOrder - bOrder;
  // Final stable tiebreaker on show id (string compare).
  return a.show.id < b.show.id ? -1 : a.show.id > b.show.id ? 1 : 0;
}
