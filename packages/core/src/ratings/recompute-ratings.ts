import type { Logger } from "@bip/domain";
import type { RaterWeightService } from "./rater-weight-service";
import type { RatingService } from "./rating-service";

export interface RecomputeRatingsDeps {
  raterWeights: RaterWeightService;
  ratings: RatingService;
  logger?: Pick<Logger, "info">;
}

export interface RecomputeRatingsResult {
  ran: boolean;
  reason?: string;
  users?: number;
  shows?: number;
  rateables?: number;
  anchor?: number;
}

/**
 * The dirty-gated full rating recompute, shared by the hourly cron and the deploy
 * entrypoint. No-ops when nothing has changed since the last run (the cheap common
 * case), so it's safe to invoke on every deploy. When dirty: rebuild every person's
 * calibrated-rating stats + each show's `weighted_rating`, rebuild every rateable's
 * deduped canonical average, then recompute the shrink anchor and stamp
 * `last_recompute_at` (the rating-cache version key) while clearing the dirty flag.
 * The `ratings_dirty` flag is seeded true, so the first deploy backfills everything.
 */
export async function runRatingsRecompute({
  raterWeights,
  ratings,
  logger,
}: RecomputeRatingsDeps): Promise<RecomputeRatingsResult> {
  if (!(await raterWeights.isDirty())) {
    logger?.info("Ratings unchanged since last recompute; skipping");
    return { ran: false, reason: "clean" };
  }

  const counts = await raterWeights.recomputeAll();
  const pairs = await raterWeights.allRatedPairs();
  await ratings.rebuildAggregatesFor(pairs);
  const anchor = await raterWeights.computeShrinkAnchor();
  await raterWeights.markRecomputed(anchor);

  // No cache invalidation here: the canonical averages embedded in cached setlist
  // payloads change only when a rateable's own ratings change (handled by the
  // rating write paths), and the calibrated weighted ratings + shrink anchor this
  // recompute rewrites are read live (never cached). The cross-show ripple touches
  // only calibrated scores, so it staleness-busts nothing cached.

  logger?.info(
    `Recomputed ratings: ${counts.users} raters, ${counts.rateables} shows, ${pairs.length} canonical averages, anchor ${anchor.toFixed(3)}`,
  );
  return { ran: true, users: counts.users, shows: counts.rateables, rateables: pairs.length, anchor };
}
