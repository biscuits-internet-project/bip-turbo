import type { DbClient } from "../_shared/database/models";

/**
 * Recompute and persist a show's denormalized total duration as the sum of its
 * tracks' durations (seconds). Null tracks are ignored by the SQL sum, so a
 * partially-resolved show stores the total of what's known; a show with no
 * known track durations stores null. Called after any write that changes a
 * track's duration (live resolution or an admin edit) so the denormalized
 * `Show.duration` that backs cross-show table views stays consistent.
 */
export async function recomputeShowDuration(db: DbClient, showId: string): Promise<number | null> {
  const agg = await db.track.aggregate({ where: { showId }, _sum: { duration: true } });
  const total = agg._sum.duration ?? null;
  await db.show.update({ where: { id: showId }, data: { duration: total } });
  return total;
}
