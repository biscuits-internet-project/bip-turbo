/**
 * The Calibrated Show Rating's pure scoring math, plus its tuning constants and
 * rater-stats scope vocabulary. Inspired by the Phish.net show-ratings series
 * (Paul Jakus, 2024, https://phish.net/blog/1724255981/phishnet-show-ratings-part-4-can-rater-weights-improve-the-accuracy-of-show-ratings.html),
 * which weights raters to discount anomalous ones. We diverge: each rating is
 * weighted by the rater's Shannon entropy (how much of the 0.5 to 5 star ratings scale
 * they use) and mean-centered to remove harsh/generous bias, and only clear bad-faith
 * bombers/fluffers are dropped outright, rather than the original
 * average-deviation "MRYM" weighting.
 *
 * Deliberately free of Prisma/DB so the methodology is unit-tested in isolation;
 * `rater-weight-service.ts` feeds these functions rows and persists the results.
 */

import { average, DRUMMER_ERAS, type DrummerEra } from "@bip/domain";

// Tuning constants: the chosen hyperparameters of the rating algorithm. The pure
// functions below take them as parameters; rater-weight-service passes these in.
// Edit a value here to retune.

/**
 * Count-shrinkage strength for the displayed show score. A show with only a
 * handful of ratings can post an extreme average on an unreliable sample (one
 * 5-star vote is a perfect 5.0); shrinkage pulls a thin show toward the global
 * average until enough people have rated it, then its own ratings take over.
 * `displayed = n/(n+k) * weighted + k/(n+k) * anchor`, where `n` is the
 * contributing count; a higher k holds thin shows near the anchor longer. Kept
 * small since even top shows are low-volume: at k=2 an 11-rating show can still
 * crack the top 10, k=3 prevents that. Applied at read time, so a change takes
 * effect without a recompute.
 */
export const SHRINK_K = 3;

/**
 * The global average show rating, used as the shrinkage anchor a thin show
 * regresses toward. Anchoring on this (the overall prior) rather than the show's
 * own canonical average is the correct empirical-Bayes move and, critically,
 * stops a bomber-poisoned canonical from leaking back into the shrunk score.
 */
export const POPULATION_SHOW_MEAN = 4.07;

/**
 * Entropy (bits) at which a rater earns full confidence weight in the
 * entropy-weighted scheme, ~4 values used evenly. Below it, weight ramps down to
 * 0 for one-note raters; distance from the crowd is never penalized.
 */
export const ENTROPY_FULL_WEIGHT = 2.0;

/**
 * Cold-start (per-rater empirical-Bayes) tuning. The calibrated score weighs a
 * rater by how far they deviate from their own average and how spread-out their
 * ratings are; a brand-new rater has neither yet, so their vote would count for
 * almost nothing (deviation 0 + entropy 0), a bad welcome and a slow ramp before
 * anyone new can move a show. So a low-volume rater is blended toward the typical
 * rater by their rating count, fading out as the count grows: `RATER_K` blends
 * their centering mean toward the population mean, `ENTROPY_K` blends their
 * entropy toward `ENTROPY_FULL_WEIGHT`. Both are needed: without the entropy half
 * a new rater's weight stays 0 no matter what (spike-verified). Higher values
 * treat newcomers as typical for longer.
 */
export const COLD_START_RATER_K = 5;
export const COLD_START_ENTROPY_K = 3;

/**
 * Whether a stat aggregates show ratings or track ratings. They have very
 * different baselines (most tracks are unrated / "nothing special", so a rated
 * track is already a signal), so they must be normalized separately.
 */
export const RATEABLE_KINDS = ["SHOW", "TRACK"] as const;
export type RateableKind = (typeof RATEABLE_KINDS)[number];

/** Map the polymorphic `rateableType` ("Show"/"Track") to a RateableKind. */
export function rateableKindFromType(rateableType: string): RateableKind {
  return rateableType === "Track" ? "TRACK" : "SHOW";
}

/**
 * Scopes a per-user rater-stats row can be computed at: one row per drummer era
 * plus a `GLOBAL` row spanning all of a user's ratings. Era-defined, but a
 * rating concept (the scope axis of `rater_stats`), so it lives with the rating
 * code rather than the era vocabulary. The Prisma `RaterEra` enum uses these
 * exact string values, so the DB enum and this TS union agree by construction.
 */
export const RATER_ERAS = ["GLOBAL", ...DRUMMER_ERAS] as const;
export type RaterEra = (typeof RATER_ERAS)[number];

/** A rater's summary statistics within some scope (global, or one drummer era). */
export interface RaterStats {
  ratingsCount: number;
  entropy: number;
  /** The rater's own mean rating in this scope — the centering baseline. */
  mean: number;
}

/** A rating-population reference (the mean that centered scores recenter onto). */
export interface PopulationStats {
  mean: number;
}

/** One of a user's ratings, tagged with its rateable's drummer era and kind. */
export interface ScopedRating {
  value: number;
  era: DrummerEra;
  kind: RateableKind;
}

/**
 * Shannon entropy (`−Σ pᵢ·log₂ pᵢ`) over the distribution of values a rater
 * used, in bits. Zero for a rater who only ever gives one value.
 */
export function ratingEntropy(values: number[]): number {
  if (values.length === 0) return 0;
  const counts = new Map<number, number>();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  const total = values.length;
  let entropy = 0;
  for (const count of counts.values()) {
    const probability = count / total;
    entropy -= probability * Math.log2(probability);
  }
  return entropy;
}

/**
 * Arithmetic mean, treating an empty set as 0 rather than `average`'s null (a
 * rater with no ratings in a scope contributes a 0 baseline). Thin wrapper over
 * `average` so the arithmetic lives in one place.
 */
export function meanOf(values: number[]): number {
  return average(values) ?? 0;
}

const STAR_MIN = 0.5;
const STAR_MAX = 5;

function clampStar(value: number): number {
  return Math.min(STAR_MAX, Math.max(STAR_MIN, value));
}

/**
 * Mean-centering of one rating: shift by the gap between the rater's mean and
 * the population mean, preserving the rater's own spread (unlike z-score, which
 * also rescales spread). Corrects harsh/generous bias only. Not clamped.
 */
export function center(value: number, userMean: number, population: PopulationStats): number {
  return value - userMean + population.mean;
}

/**
 * A confidence weight in [0,1] from a rater's entropy: a one-note rater (0) is
 * weightless, and weight ramps to full at `fullAt` bits (a rater using ~4 values
 * evenly). Deliberately ignores distance from the crowd, so a considered
 * contrarian who uses the whole scale is fully credited rather than penalized.
 */
export function entropyWeight(entropy: number, fullAt: number): number {
  if (entropy <= 0) return 0;
  return Math.min(1, entropy / fullAt);
}

/**
 * A rateable's mean-centered score where each rater is weighted by their entropy
 * confidence: wide-range raters count fully, one-noters fall out, and nobody is
 * penalized for disagreeing. Clamped once at the end.
 */
export function entropyWeightedCenteredAverage(
  contributions: ReadonlyArray<{ value: number; userMean: number; entropy: number }>,
  population: PopulationStats,
  fullAt: number,
): WeightedAverageResult {
  let valueSum = 0;
  let weightSum = 0;
  let contributingCount = 0;
  for (const { value, userMean, entropy } of contributions) {
    const weight = entropyWeight(entropy, fullAt);
    if (weight <= 0) continue;
    valueSum += center(value, userMean, population) * weight;
    weightSum += weight;
    contributingCount += 1;
  }
  return {
    weightedAverage: weightSum === 0 ? 0 : clampStar(valueSum / weightSum),
    weightSum,
    contributingCount,
  };
}

export interface WeightedAverageResult {
  weightedAverage: number;
  weightSum: number;
  contributingCount: number;
}

/**
 * Gamma for the Calibrated Track Rating's entropy weighting. Tracks pile at the 5-star
 * ceiling far worse than shows (people only rate tracks they liked), so — unlike the show
 * scheme — the track score is deliberately NOT mean-centered and NOT count-shrunk, and it
 * leans HARDER on wide-range raters by raising the entropy weight to this power (shows use
 * an effective power of 1). Higher favors scale-users more (more spread, less reliable); a
 * spike over the full track corpus put the useful range at 2-6. Tunable; a change needs a
 * recompute + a cache-key bump but no migration.
 */
export const TRACK_DISCRIMINATING_GAMMA = 3;

/**
 * One rater's confidence weight for the calibrated track score: their entropy weight raised
 * to `gamma` (favouring raters who use the whole scale), or 0 for a one-note fluffer/bomber
 * dropped by {@link isExcludedBucket}. The single "who counts, and how much" rule for tracks,
 * shared by the score and any track histogram so they can't disagree.
 */
export function discriminatingRaterWeight(
  stats: Pick<RaterStats, "entropy" | "mean" | "ratingsCount">,
  gamma: number,
): number {
  if (isExcludedBucket(stats)) return 0;
  return entropyWeight(stats.entropy, ENTROPY_FULL_WEIGHT) ** gamma;
}

/**
 * A track's calibrated score: the entropy^gamma-weighted average of RAW star values — no
 * mean-centering and no anchor-shrink, because tracks need their spread preserved rather
 * than regressed toward a ceiling-inflated mean. Weightless (excluded) raters fall out.
 * Clamped once at the end.
 */
export function entropyPowerWeightedAverage(
  contributions: ReadonlyArray<{ value: number; weight: number }>,
): WeightedAverageResult {
  let valueSum = 0;
  let weightSum = 0;
  let contributingCount = 0;
  for (const { value, weight } of contributions) {
    if (weight <= 0) continue;
    valueSum += value * weight;
    weightSum += weight;
    contributingCount += 1;
  }
  return {
    weightedAverage: weightSum === 0 ? 0 : clampStar(valueSum / weightSum),
    weightSum,
    contributingCount,
  };
}

/** entropy/mean/count for one bucket of a rater's ratings. */
function statsOfRatings(ratings: ReadonlyArray<ScopedRating>): RaterStats {
  const values = ratings.map((rating) => rating.value);
  return {
    ratingsCount: ratings.length,
    entropy: ratingEntropy(values),
    mean: meanOf(values),
  };
}

/**
 * Thresholds that flag a `(rater, era)` bucket as bad-faith: an account that
 * votes one extreme value across a whole era, a bomber (all ~floor, dragging
 * shows down) or a fluffer (all ~ceiling, inflating them). Their votes are noise,
 * not signal, so they're dropped from the calibrated score without hand-policing
 * accounts. The three gates together flag only deliberate bad faith, not a quiet
 * fan: ratings must be one-note (low entropy) AND stuck at an extreme (mean
 * at/below `lowMean` or at/above `highMean`) AND numerous enough (`minCount`) to
 * judge. The entropy gate is what separates a bomber/fluffer from a thoughtful
 * harsh/generous rater, who still varies their scores. A rater is excluded only
 * in the era they vote in bad faith; good-faith ratings in other eras still count.
 */
export const EXCLUSION_THRESHOLDS = {
  /** At/below this entropy (bits) the rater is essentially one-note in the era. */
  maxEntropy: 0.5,
  /** Mean at/below this is floor-bombing. */
  lowMean: 1.0,
  /** Mean at/above this is ceiling-fluffing. */
  highMean: 4.75,
  /** Below this many ratings it's too small a sample to call bad-faith. */
  minCount: 5,
};

/** Whether a bucket's stats trip the bad-faith (era-bomber/fluffer) test. */
export function isExcludedBucket(stats: Pick<RaterStats, "entropy" | "mean" | "ratingsCount">): boolean {
  return (
    stats.entropy <= EXCLUSION_THRESHOLDS.maxEntropy &&
    (stats.mean <= EXCLUSION_THRESHOLDS.lowMean || stats.mean >= EXCLUSION_THRESHOLDS.highMean) &&
    stats.ratingsCount >= EXCLUSION_THRESHOLDS.minCount
  );
}

/** A scope's stats plus whether that era bucket was flagged bad-faith and dropped. */
export interface ScopeStat extends RaterStats {
  isExcluded: boolean;
}

/**
 * Computes a rater's stats for every scope (each drummer era plus `GLOBAL`) in
 * two passes: first score each era, then flag the bad-faith era buckets and
 * rebuild the `GLOBAL` scope from the surviving eras only. This de-poisons a
 * bimodal rater's global mean (e.g. someone normal in one era but floor-bombing
 * another), so a single global-scoped scheme can trust them where they're genuine
 * without their bombing leaking in. Falls back to all ratings for GLOBAL if every
 * era was excluded (so it never goes empty).
 */
export function computeCleanedScopeStats(ratings: ReadonlyArray<ScopedRating>): Map<RaterEra, ScopeStat> {
  const byEra = new Map<DrummerEra, ScopedRating[]>();
  for (const rating of ratings) {
    const bucket = byEra.get(rating.era);
    if (bucket) bucket.push(rating);
    else byEra.set(rating.era, [rating]);
  }

  const result = new Map<RaterEra, ScopeStat>();
  const excludedEras = new Set<DrummerEra>();
  for (const [era, bucket] of byEra) {
    const stats = statsOfRatings(bucket);
    const isExcluded = isExcludedBucket(stats);
    if (isExcluded) excludedEras.add(era);
    result.set(era, { ...stats, isExcluded });
  }

  const survivors = ratings.filter((rating) => !excludedEras.has(rating.era));
  const globalBase = survivors.length > 0 ? survivors : ratings;
  result.set("GLOBAL", { ...statsOfRatings(globalBase), isExcluded: false });
  return result;
}

/**
 * The contributing set of a show's deduped ratings: the votes that actually feed
 * the calibrated score. Drops raters flagged bad-faith in this show's era; falls
 * back to all ratings if that empties the show (so a score/distribution always
 * exists). The single source of the "who counts" rule, shared by
 * {@link computeShowWeighted} (which sums them) and the calibrated histogram
 * (which counts them by raw value) so the two can never disagree on membership.
 */
export function selectContributingRatings<T extends { userId: string }>(
  ratings: ReadonlyArray<T>,
  showEra: RaterEra | null,
  isExcludedInEra: (userId: string, era: RaterEra) => boolean,
): T[] {
  const excludedHere = new Set<string>();
  if (showEra) {
    for (const rating of ratings) {
      if (isExcludedInEra(rating.userId, showEra)) excludedHere.add(rating.userId);
    }
  }
  const active = ratings.filter((rating) => !excludedHere.has(rating.userId));
  return active.length > 0 ? active : [...ratings];
}

/**
 * Group raw star values into per-value `{ value, count }` buckets, skipping the
 * sub-0.5 "unrated" sentinel. The single bucketing rule behind every per-rateable
 * histogram (the deduped community distribution and the calibrated contributing
 * distribution) so both bucket and floor-filter identically.
 */
export function bucketRatingValues(values: ReadonlyArray<number>): Array<{ value: number; count: number }> {
  const countByValue = new Map<number, number>();
  for (const value of values) {
    if (value < 0.5) continue;
    countByValue.set(value, (countByValue.get(value) ?? 0) + 1);
  }
  return Array.from(countByValue, ([value, count]) => ({ value, count }));
}
