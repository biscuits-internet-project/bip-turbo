import type { Logger } from "@bip/domain";
import type { CacheInvalidationService } from "../_shared/cache";
import type { DbClient } from "../_shared/database/models";
import type { StatsService } from "./stats-service";

export interface RecomputePendingDeps {
  db: DbClient;
  stats: StatsService;
  cacheInvalidation?: CacheInvalidationService;
  logger?: Pick<Logger, "info">;
}

/**
 * Drains the stats_recompute_requests queue at deploy time. A data migration
 * that changes stats-relevant data (count_for_stats, show date, day_order, show
 * insert/delete, or a track's song/show/position/set) queues the earliest
 * affected date here; this rebuilds gaps + song stats from the minimum of those
 * dates, busts the stats/listing/song caches for the affected years, then clears
 * the queue. An empty queue is a no-op, so a deploy with no queued change costs
 * one MIN() query.
 */
export async function runPendingRecompute({
  db,
  stats,
  cacheInvalidation,
  logger,
}: RecomputePendingDeps): Promise<void> {
  const { _min } = await db.statsRecomputeRequest.aggregate({ _min: { sinceDate: true } });
  const earliest = _min.sinceDate;
  if (!earliest) {
    logger?.info("No pending stats recompute requests");
    return;
  }

  const sinceDate = earliest.toISOString().slice(0, 10);
  logger?.info(`Recomputing gaps + song stats since ${sinceDate}`);
  await stats.rebuildGapsAndSongStatsSince(sinceDate);

  if (cacheInvalidation) {
    await cacheInvalidation.invalidateShowListings(yearsSince(sinceDate));
    await cacheInvalidation.invalidateSongCaches();
  }

  await db.statsRecomputeRequest.deleteMany({});
  logger?.info(`Cleared stats recompute queue (rebuilt since ${sinceDate})`);
}

/**
 * Inclusive list of calendar years from the recompute start to the current year,
 * matching the year-tag granularity CacheInvalidationService.invalidateShowListings
 * expects for Cloudflare listing purges.
 */
function yearsSince(sinceDate: string): number[] {
  const start = Number.parseInt(sinceDate.slice(0, 4), 10);
  const end = new Date().getUTCFullYear();
  const years: number[] = [];
  for (let year = start; year <= end; year++) years.push(year);
  return years;
}
