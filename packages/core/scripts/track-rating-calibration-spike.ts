import { type DrummerEra, drummerEraForDate, shrinkToward } from "@bip/domain";
import prisma from "../src/_shared/prisma/client";
import { aliasKey, mostRecentPerKey } from "../src/ratings/rater-aliases";
import { computeShowWeighted, type RaterScopeStat, type StatByUserEra } from "../src/ratings/rater-weight-service";
import {
  computeCleanedScopeStats,
  ENTROPY_FULL_WEIGHT,
  entropyWeight,
  isExcludedBucket,
  meanOf,
  ratingEntropy,
  type ScopedRating,
  SHRINK_K,
} from "../src/ratings/rater-weighting";

/**
 * Throwaway validation spike: would a calibrated (entropy-weighted, mean-centered,
 * bomber-excluded, count-shrunk) TRACK rating be a better signal than the plain
 * deduped average? Shows already have this; tracks don't. Before committing to the
 * real build (new denormalized columns + engine changes + UI), this computes
 * calibrated track scores in-memory — reusing the exact production scoring rule
 * ({@link computeShowWeighted}) and the exported pure math — and reports whether
 * calibration beats the plain average.
 *
 * Metrics:
 *  1. Split-half reliability (headline, spans the WHOLE range): randomly split raters
 *     into two disjoint halves, score each half independently, correlate across tracks.
 *     The score that reproduces itself better from independent rater samples is the
 *     more reliable signal — no ground-truth label needed. Reported for the raw
 *     weighted score, the displayed (count-shrunk) score, and the plain average, over
 *     the SAME track set each repeat so the comparison is fair.
 *  2. Distribution shape (the de-fluffing test): spread/skew/ceiling-pile + histograms of
 *     the plain vs calibrated score distributions — does calibration break the pile at 5.
 *  3. All-timer / jam-chart discrimination (top-end): Spearman of each score against the
 *     curated all-timer flag and jam-chart note. Mirrors `rating-validity-eval.ts`.
 *  4. Rater similarity: who rates like the reference rater (entropy/mean/correlation) and
 *     who the fluffers are.
 *  5. The 0.5 spot-check: where a heavy rater's "nothing interesting" 0.5 votes land.
 *  6. Variant sweep ({@link computeVariantScores}): the centering × gamma × shrink family,
 *     each config judged on distribution shape vs split-half reliability.
 *  7. All-fives show demo: real shows where a rater 5-starred every track, showing each
 *     track's community average before (plain) vs after (discriminating / mean+shrink).
 *
 * Nothing is persisted and no schema changes: this only reads. Run:
 *   `make track-rating-calibration-spike`
 *   (env knobs: REPEATS, MIN_PER_HALF, MIN_RATINGS, MIN_DIST_RATINGS, MIN_SHARED, GAMMA, USER_EMAIL)
 */

export interface SpikeRating {
  /** Canonical user id (duplicate accounts already collapsed). */
  userId: string;
  trackId: string;
  value: number;
  /** The drummer era of the track's show — the rater-stats scope axis. */
  era: DrummerEra;
}

export interface TrackScore {
  /** Raw (un-shrunk) entropy-weighted centered score. */
  weighted: number;
  /** Contributing raters after dedup + bad-faith exclusion. */
  count: number;
  /** `weighted` count-shrunk toward the track anchor — what a UI would show. */
  displayed: number;
}

// ---------------------------------------------------------------------------
// Stats helpers (tie-aware Spearman). Kept local: `rating-validity-eval.ts`
// runs `main()` on import, so its copies can't be imported without side effects.
// ---------------------------------------------------------------------------

/** Average (tie-aware, 1-based) ranks of the values, for Spearman. */
function ranks(values: number[]): number[] {
  const order = values.map((value, index) => ({ value, index })).sort((a, b) => a.value - b.value);
  const out = new Array<number>(values.length);
  let i = 0;
  while (i < order.length) {
    let j = i;
    while (j + 1 < order.length && order[j + 1].value === order[i].value) j += 1;
    const tiedRank = (i + j) / 2 + 1;
    for (let k = i; k <= j; k += 1) out[order[k].index] = tiedRank;
    i = j + 1;
  }
  return out;
}

function pearson(xs: number[], ys: number[]): number {
  const n = xs.length;
  if (n === 0) return 0;
  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = ys.reduce((a, b) => a + b, 0) / n;
  let cov = 0;
  let varX = 0;
  let varY = 0;
  for (let i = 0; i < n; i += 1) {
    const dx = xs[i] - meanX;
    const dy = ys[i] - meanY;
    cov += dx * dy;
    varX += dx * dx;
    varY += dy * dy;
  }
  return varX === 0 || varY === 0 ? 0 : cov / Math.sqrt(varX * varY);
}

const spearman = (xs: number[], ys: number[]): number => pearson(ranks(xs), ranks(ys));

/** Population standard deviation (spread). */
export function standardDeviation(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = meanOf(values);
  return Math.sqrt(values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length);
}

/**
 * Population skewness. Negative = a left tail with mass piled at the high end (the
 * fluffed-to-5 shape); ~0 = symmetric; positive = piled low. Zero when there's no spread.
 */
export function skewness(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = meanOf(values);
  const sd = standardDeviation(values);
  if (sd === 0) return 0;
  return values.reduce((sum, value) => sum + ((value - mean) / sd) ** 3, 0) / values.length;
}

/** Share of values at/above `threshold` — the ceiling pile-up (fraction crushed near 5). */
export function ceilingShare(values: number[], threshold: number): number {
  if (values.length === 0) return 0;
  return values.filter((value) => value >= threshold).length / values.length;
}

/**
 * A fixed-bin text histogram of star scores (0.5-wide bins over [0.5, 5]), scaled so the
 * tallest bin is `width` characters. Lets the plain and calibrated shapes be eyeballed
 * side by side — is the mass a spike at the ceiling or a spread-out curve.
 */
export function textHistogram(values: number[], width = 40): string[] {
  const bins = new Array(10).fill(0); // [0.5,1.0) … [5.0,5.0]
  for (const value of values) {
    const index = Math.min(9, Math.max(0, Math.floor((value - 0.5) / 0.5)));
    bins[index] += 1;
  }
  const max = Math.max(1, ...bins);
  return bins.map((count, index) => {
    const low = (0.5 + index * 0.5).toFixed(1);
    const bar = "█".repeat(Math.round((count / max) * width));
    return `    ${low.padStart(4)}  ${bar} ${count}`;
  });
}

/** Deterministic PRNG so split-half assignments are reproducible across runs. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------------------
// Pure scoring (exported for the unit test — no DB access).
// ---------------------------------------------------------------------------

/**
 * The calibrated score for every track in a set of ratings, reusing the exact
 * production rule. Rater scope-stats are computed fresh from the given ratings (so a
 * split-half subset gets stats from ONLY its half — no cross-half leakage), the
 * population/anchor are derived empirically for tracks (the show constants are
 * show-tuned and deliberately not reused for the baseline), and each track is scored
 * by {@link computeShowWeighted}.
 */
export function computeCalibratedTrackScores(ratings: ReadonlyArray<SpikeRating>): {
  scores: Map<string, TrackScore>;
  populationMean: number;
  anchor: number;
} {
  const populationMean = meanOf(ratings.map((rating) => rating.value));
  const population = { mean: populationMean };

  // Per-user cleaned scope stats (mean/entropy/count/isExcluded per era + GLOBAL).
  const byUser = new Map<string, SpikeRating[]>();
  for (const rating of ratings) {
    const bucket = byUser.get(rating.userId) ?? [];
    bucket.push(rating);
    byUser.set(rating.userId, bucket);
  }
  const statLookup = new Map<string, RaterScopeStat>();
  for (const [userId, userRatings] of byUser) {
    const scoped = userRatings.map((rating): ScopedRating => ({ value: rating.value, era: rating.era, kind: "TRACK" }));
    for (const [era, stats] of computeCleanedScopeStats(scoped)) {
      statLookup.set(`${userId}:${era}`, {
        mean: stats.mean,
        entropy: stats.entropy,
        count: stats.ratingsCount,
        isExcluded: stats.isExcluded,
      });
    }
  }
  const statByUserEra: StatByUserEra = (userId, era) => statLookup.get(`${userId}:${era}`);

  // Group ratings by track — the era is the track's show era, shared by all its votes.
  const byTrack = new Map<string, { era: DrummerEra; votes: Array<{ userId: string; value: number }> }>();
  for (const rating of ratings) {
    const entry = byTrack.get(rating.trackId) ?? { era: rating.era, votes: [] };
    entry.votes.push({ userId: rating.userId, value: rating.value });
    byTrack.set(rating.trackId, entry);
  }

  const raw = new Map<string, { weighted: number; count: number }>();
  for (const [trackId, { era, votes }] of byTrack) {
    const { weightedRating, weightedRatingsCount } = computeShowWeighted(votes, era, statByUserEra, population);
    if (weightedRating != null) raw.set(trackId, { weighted: weightedRating, count: weightedRatingsCount });
  }

  const anchor = meanOf([...raw.values()].map((score) => score.weighted)) || populationMean;
  const scores = new Map<string, TrackScore>();
  for (const [trackId, { weighted, count }] of raw) {
    scores.set(trackId, { weighted, count, displayed: shrinkToward(weighted, anchor, count, SHRINK_K) });
  }
  return { scores, populationMean, anchor };
}

/** The plain deduped per-track average + count (today's track number). */
export function plainTrackAverages(
  ratings: ReadonlyArray<SpikeRating>,
): Map<string, { average: number; count: number }> {
  const byTrack = new Map<string, number[]>();
  for (const rating of ratings) {
    const bucket = byTrack.get(rating.trackId) ?? [];
    bucket.push(rating.value);
    byTrack.set(rating.trackId, bucket);
  }
  const out = new Map<string, { average: number; count: number }>();
  for (const [trackId, values] of byTrack) out.set(trackId, { average: meanOf(values), count: values.length });
  return out;
}

/**
 * The "raters like me" variant: an entropy-POWER-weighted average of the RAW (un-centered)
 * scores, no count-shrinkage, with pure fluffers dropped. Unlike the show scheme, it does
 * not mean-center (so a discriminating rater's actual low scores survive instead of being
 * shifted up toward the population) and it raises the entropy weight to `gamma` so
 * high-entropy raters dominate rather than being merely un-penalized. `gamma = 1` is the
 * soft show-style weight; higher `gamma` sharpens the preference for wide-range raters.
 */

/** How a rater's votes are re-based before averaging. */
export type Centering =
  | "none" // raw star value — a discriminating rater's real low scores survive.
  | "mean" // value − raterMean + popMean — removes harsh/generous bias, keeps spread (the show move).
  | "zscore"; // (value − raterMean)/raterSD → popMean/popSD — also rescales spread (tried + rejected for shows).

export interface VariantOptions {
  centering: Centering;
  /** Entropy-weight exponent: higher favors wide-range raters harder (0 = uniform weight). */
  gamma: number;
  /** Count-shrinkage strength toward the anchor (0 = none, 3 = show default). */
  shrinkK: number;
}

/** The score for one track under a variant: raw and (count-shrunk) displayed, plus contributing raters. */
export interface VariantScore {
  score: number;
  displayed: number;
  count: number;
}

/**
 * The parametric "raters like me" family, spanning the axes we're comparing: how each
 * rater is re-based (centering), how hard scale-users are favored (gamma), and how much
 * thin tracks are pulled to the anchor (shrinkK). Fluffers (excluded buckets) get weight 0.
 * The show scheme ≈ {mean, ~1, 3}; the pure discriminating variant = {none, 3, 0}.
 */
export function computeVariantScores(
  ratings: ReadonlyArray<SpikeRating>,
  options: VariantOptions,
): Map<string, VariantScore> {
  const { centering, gamma, shrinkK } = options;
  const valuesByUser = new Map<string, number[]>();
  for (const rating of ratings) {
    const bucket = valuesByUser.get(rating.userId) ?? [];
    bucket.push(rating.value);
    valuesByUser.set(rating.userId, bucket);
  }
  const allValues = ratings.map((rating) => rating.value);
  const popMean = meanOf(allValues);
  const popSd = standardDeviation(allValues) || 1;

  const profile = new Map<string, { weight: number; mean: number; sd: number }>();
  for (const [userId, values] of valuesByUser) {
    const entropy = ratingEntropy(values);
    const excluded = isExcludedBucket({ mean: meanOf(values), entropy, ratingsCount: values.length });
    profile.set(userId, {
      weight: excluded ? 0 : entropyWeight(entropy, ENTROPY_FULL_WEIGHT) ** gamma,
      mean: meanOf(values),
      // Stabilize a thin rater's SD toward the population so a 2-vote rater can't post a huge z-score.
      sd: shrinkToward(standardDeviation(values), popSd, values.length, 5),
    });
  }

  const rebase = (value: number, p: { mean: number; sd: number }): number | null => {
    if (centering === "mean") return value - p.mean + popMean;
    if (centering === "zscore") return p.sd <= 0 ? null : ((value - p.mean) / p.sd) * popSd + popMean;
    return value;
  };

  const byTrack = new Map<string, { sum: number; weight: number; count: number }>();
  for (const rating of ratings) {
    const p = profile.get(rating.userId);
    if (!p || p.weight <= 0) continue;
    const rebased = rebase(rating.value, p);
    if (rebased == null) continue;
    const entry = byTrack.get(rating.trackId) ?? { sum: 0, weight: 0, count: 0 };
    entry.sum += rebased * p.weight;
    entry.weight += p.weight;
    entry.count += 1;
    byTrack.set(rating.trackId, entry);
  }

  const raw = new Map<string, { score: number; count: number }>();
  for (const [trackId, entry] of byTrack) {
    if (entry.weight > 0) raw.set(trackId, { score: entry.sum / entry.weight, count: entry.count });
  }
  const anchor = meanOf([...raw.values()].map((entry) => entry.score)) || popMean;
  const out = new Map<string, VariantScore>();
  for (const [trackId, { score, count }] of raw) {
    out.set(trackId, { score, displayed: shrinkToward(score, anchor, count, shrinkK), count });
  }
  return out;
}

/** The un-centered, un-shrunk discriminating score — {@link computeVariantScores} with `none`/k0. */
export function computeDiscriminatingScores(
  ratings: ReadonlyArray<SpikeRating>,
  gamma: number,
): Map<string, { score: number; count: number }> {
  const scores = computeVariantScores(ratings, { centering: "none", gamma, shrinkK: 0 });
  return new Map([...scores].map(([id, value]) => [id, { score: value.score, count: value.count }]));
}

/** Per-track rating count in a rating set (for split-half membership gating). */
function countByTrack(ratings: ReadonlyArray<SpikeRating>): Map<string, number> {
  const counts = new Map<string, number>();
  for (const rating of ratings) counts.set(rating.trackId, (counts.get(rating.trackId) ?? 0) + 1);
  return counts;
}

/**
 * Generic split-half reliability for any per-track scoring function: over `repeats`
 * random rater partitions, correlate the two halves' scores across tracks rated
 * >= `minPerHalf` times in both halves AND scored in both. Used to compare arbitrary
 * variants (plain, discriminating) on the same footing as the headline metric.
 */
export function splitHalfCorrelation(
  ratings: ReadonlyArray<SpikeRating>,
  repeats: number,
  minPerHalf: number,
  scoreFn: (subset: ReadonlyArray<SpikeRating>) => Map<string, number>,
): { validRepeats: number; correlation: number } {
  const users = [...new Set(ratings.map((rating) => rating.userId))];
  let sum = 0;
  let valid = 0;
  for (let repeat = 0; repeat < repeats; repeat += 1) {
    const random = mulberry32(repeat + 1);
    const half = new Map<string, 0 | 1>();
    for (const user of users) half.set(user, random() < 0.5 ? 0 : 1);
    const a = ratings.filter((rating) => half.get(rating.userId) === 0);
    const b = ratings.filter((rating) => half.get(rating.userId) === 1);
    const countA = countByTrack(a);
    const countB = countByTrack(b);
    const scoreA = scoreFn(a);
    const scoreB = scoreFn(b);
    const tracks = [...countA.keys()].filter(
      (id) =>
        (countA.get(id) ?? 0) >= minPerHalf && (countB.get(id) ?? 0) >= minPerHalf && scoreA.has(id) && scoreB.has(id),
    );
    if (tracks.length < 3) continue;
    sum += spearman(
      tracks.map((id) => scoreA.get(id) ?? 0),
      tracks.map((id) => scoreB.get(id) ?? 0),
    );
    valid += 1;
  }
  return { validRepeats: valid, correlation: valid ? sum / valid : 0 };
}

/**
 * Split-half reliability: over `repeats` random rater partitions, correlate the two
 * halves' scores across tracks rated >= `minPerHalf` times in BOTH halves. Higher =
 * the score reproduces itself better from independent samples. Plain and calibrated
 * are correlated over the identical track set each repeat so neither is advantaged.
 */
export function splitHalfReliability(ratings: ReadonlyArray<SpikeRating>, repeats: number, minPerHalf: number) {
  const users = [...new Set(ratings.map((rating) => rating.userId))];
  let displayedSum = 0;
  let weightedSum = 0;
  let plainSum = 0;
  let trackSum = 0;
  let validRepeats = 0;

  for (let repeat = 0; repeat < repeats; repeat += 1) {
    const random = mulberry32(repeat + 1);
    const half = new Map<string, 0 | 1>();
    for (const user of users) half.set(user, random() < 0.5 ? 0 : 1);
    const a = ratings.filter((rating) => half.get(rating.userId) === 0);
    const b = ratings.filter((rating) => half.get(rating.userId) === 1);

    const aPlain = plainTrackAverages(a);
    const bPlain = plainTrackAverages(b);
    const aCalibrated = computeCalibratedTrackScores(a);
    const bCalibrated = computeCalibratedTrackScores(b);

    // Same membership for every metric: rated >= minPerHalf in both halves AND scored
    // by calibration in both (a track can lose its calibrated score if all its raters
    // in a half are excluded).
    const tracks: string[] = [];
    for (const [trackId, plainA] of aPlain) {
      const plainB = bPlain.get(trackId);
      if (!plainB || plainA.count < minPerHalf || plainB.count < minPerHalf) continue;
      if (aCalibrated.scores.has(trackId) && bCalibrated.scores.has(trackId)) tracks.push(trackId);
    }
    if (tracks.length < 3) continue;

    displayedSum += spearman(
      tracks.map((id) => aCalibrated.scores.get(id)?.displayed ?? 0),
      tracks.map((id) => bCalibrated.scores.get(id)?.displayed ?? 0),
    );
    weightedSum += spearman(
      tracks.map((id) => aCalibrated.scores.get(id)?.weighted ?? 0),
      tracks.map((id) => bCalibrated.scores.get(id)?.weighted ?? 0),
    );
    plainSum += spearman(
      tracks.map((id) => aPlain.get(id)?.average ?? 0),
      tracks.map((id) => bPlain.get(id)?.average ?? 0),
    );
    trackSum += tracks.length;
    validRepeats += 1;
  }

  return {
    validRepeats,
    averageTracks: validRepeats ? trackSum / validRepeats : 0,
    calibratedDisplayed: validRepeats ? displayedSum / validRepeats : 0,
    calibratedWeighted: validRepeats ? weightedSum / validRepeats : 0,
    plain: validRepeats ? plainSum / validRepeats : 0,
  };
}

// ---------------------------------------------------------------------------
// Data loading (mirrors RaterWeightService's private dedup + era tagging).
// ---------------------------------------------------------------------------

/**
 * userId → canonical userId, collapsing duplicate accounts. A local mirror of
 * `RaterWeightService.buildCanonicalUserMap` (private) reusing the shared
 * {@link aliasKey} rule, so the spike dedupes exactly as production does.
 */
async function buildCanonicalUserMap(): Promise<Map<string, string>> {
  const users = await prisma.user.findMany({
    where: { username: { not: null } },
    select: { id: true, username: true },
  });
  const counts = await prisma.rating.groupBy({ by: ["userId"], _count: { id: true } });
  const ratingCount = new Map(counts.map((count) => [count.userId, count._count.id]));
  const groups = new Map<string, Array<{ id: string; n: number }>>();
  for (const user of users) {
    if (!user.username) continue;
    const key = aliasKey(user.username, user.id);
    const group = groups.get(key) ?? [];
    group.push({ id: user.id, n: ratingCount.get(user.id) ?? 0 });
    groups.set(key, group);
  }
  const canonical = new Map<string, string>();
  for (const group of groups.values()) {
    const primary = group.reduce((best, member) => (member.n > best.n ? member : best)).id;
    for (const member of group) canonical.set(member.id, primary);
  }
  return canonical;
}

/** All deduped TRACK ratings, era-tagged (tracks with an unknown show date are dropped). */
async function loadTrackRatings(canonical: Map<string, string>): Promise<SpikeRating[]> {
  const raw = await prisma.rating.findMany({
    where: { rateableType: "Track" },
    select: { userId: true, rateableId: true, value: true, createdAt: true },
  });
  if (raw.length === 0) return [];

  // Remap to canonical user, then one most-recent vote per (person, track).
  const deduped = mostRecentPerKey(
    raw.map((rating) => ({ ...rating, userId: canonical.get(rating.userId) ?? rating.userId })),
    (rating) => `${rating.userId}:${rating.rateableId}`,
  );

  const trackIds = [...new Set(deduped.map((rating) => rating.rateableId))];
  const tracks = await prisma.track.findMany({
    where: { id: { in: trackIds } },
    select: { id: true, show: { select: { date: true } } },
  });
  const dateByTrack = new Map(tracks.map((track) => [track.id, track.show?.date ?? ""]));

  const out: SpikeRating[] = [];
  for (const rating of deduped) {
    const date = dateByTrack.get(rating.rateableId);
    if (!date) continue;
    out.push({ userId: rating.userId, trackId: rating.rateableId, value: rating.value, era: drummerEraForDate(date) });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

async function discriminationReport(
  ratings: SpikeRating[],
  full: ReturnType<typeof computeCalibratedTrackScores>,
  minRatings: number,
): Promise<void> {
  const plain = plainTrackAverages(ratings);
  const qualified = [...plain.keys()].filter((id) => (plain.get(id)?.count ?? 0) >= minRatings);
  const flagRows = await prisma.track.findMany({
    where: { id: { in: qualified } },
    select: { id: true, allTimer: true, note: true },
  });
  const flags = new Map(
    flagRows.map((track) => [
      track.id,
      { allTimer: track.allTimer ? 1 : 0, jamChart: track.note && track.note.trim().length > 0 ? 1 : 0 },
    ]),
  );

  const eligible = qualified.filter((id) => full.scores.has(id) && flags.has(id));
  const calibrated = eligible.map((id) => full.scores.get(id)?.displayed ?? 0);
  const simple = eligible.map((id) => plain.get(id)?.average ?? 0);
  const allTimer = eligible.map((id) => flags.get(id)?.allTimer ?? 0);
  const jamChart = eligible.map((id) => flags.get(id)?.jamChart ?? 0);
  const allTimerCount = allTimer.reduce((a, b) => a + b, 0);
  const jamChartCount = jamChart.reduce((a, b) => a + b, 0);

  console.log(
    `\nAll-timer / jam-chart discrimination — top-end sanity check (tracks with ratings_count >= ${minRatings})`,
  );
  console.log(
    `  ${eligible.length} tracks · ${allTimerCount} all-timers · ${jamChartCount} jam-charted · Spearman, higher = separates the flagged jams better\n`,
  );
  const report = (label: string, truth: number[]): void => {
    const calibratedCorrelation = spearman(calibrated, truth);
    const simpleCorrelation = spearman(simple, truth);
    const delta = calibratedCorrelation - simpleCorrelation;
    const verdict = delta > 0.01 ? "✓ better" : delta < -0.01 ? "✗ worse" : "≈ tied";
    console.log(
      `  ${label.padEnd(20)} calibrated ${calibratedCorrelation.toFixed(4)} | plain ${simpleCorrelation.toFixed(4)} | Δ ${delta >= 0 ? "+" : ""}${delta.toFixed(4)}  ${verdict}`,
    );
  };
  report("vs all-timer", allTimer);
  report("vs jam-chart note", jamChart);
}

async function zeroPointFiveReport(
  ratings: SpikeRating[],
  full: ReturnType<typeof computeCalibratedTrackScores>,
  canonical: Map<string, string>,
  email: string,
): Promise<void> {
  const user = await prisma.user.findFirst({ where: { email }, select: { id: true } });
  if (!user) {
    console.log(`\n0.5 spot-check — skipped (no user for ${email})`);
    return;
  }
  const canonicalId = canonical.get(user.id) ?? user.id;
  const plain = plainTrackAverages(ratings);
  const halfStar = ratings.filter((rating) => rating.userId === canonicalId && rating.value === 0.5);
  const scored = halfStar
    .map((rating) => ({
      trackId: rating.trackId,
      plain: plain.get(rating.trackId)?.average ?? 0,
      count: plain.get(rating.trackId)?.count ?? 0,
      displayed: full.scores.get(rating.trackId)?.displayed ?? null,
    }))
    .filter((row) => row.displayed != null) as Array<{
    trackId: string;
    plain: number;
    count: number;
    displayed: number;
  }>;

  console.log(`\n0.5 spot-check — where ${email}'s "nothing interesting" 0.5 votes land`);
  if (scored.length === 0) {
    console.log("  (no 0.5 track votes found)");
    return;
  }
  const meanPlain = meanOf(scored.map((row) => row.plain));
  const meanDisplayed = meanOf(scored.map((row) => row.displayed));
  const washedUp = scored.filter((row) => row.displayed >= 3).length;
  console.log(
    `  ${scored.length} tracks · mean plain ${meanPlain.toFixed(2)} · mean calibrated ${meanDisplayed.toFixed(2)} · ${washedUp} (${((100 * washedUp) / scored.length).toFixed(0)}%) shown >= 3.0 by calibration`,
  );

  const titleRows = await prisma.track.findMany({
    where: { id: { in: scored.map((row) => row.trackId) } },
    select: { id: true, song: { select: { title: true } }, show: { select: { date: true } } },
  });
  const label = new Map(
    titleRows.map((track) => [track.id, `${track.song?.title ?? "?"} — ${track.show?.date ?? "?"}`]),
  );
  const worst = [...scored].sort((a, b) => b.displayed - a.displayed).slice(0, 15);
  console.log("\n  Most washed-up (highest calibrated despite your 0.5):");
  for (const row of worst) {
    console.log(
      `    ${(label.get(row.trackId) ?? row.trackId).padEnd(40)} plain ${row.plain.toFixed(2)} (n=${row.count}) → calibrated ${row.displayed.toFixed(2)}`,
    );
  }
}

/**
 * The distribution-shape comparison — the metric closest to the actual goal (stop
 * fluffers pinning everything at 5). Over tracks rated >= `minRatings` times, contrasts
 * the plain-average and calibrated-displayed score distributions: spread, skew, ceiling
 * pile-up, and side-by-side histograms. A "better" (more discriminating) shape is more
 * spread out, less left-skewed, and has less mass crushed at the top.
 */
function distributionReport(
  ratings: SpikeRating[],
  full: ReturnType<typeof computeCalibratedTrackScores>,
  minRatings: number,
): void {
  const plain = plainTrackAverages(ratings);
  const tracks = [...plain.keys()].filter((id) => (plain.get(id)?.count ?? 0) >= minRatings && full.scores.has(id));
  const plainValues = tracks.map((id) => plain.get(id)?.average ?? 0);
  const calibratedValues = tracks.map((id) => full.scores.get(id)?.displayed ?? 0);
  const rawValues = tracks.map((id) => full.scores.get(id)?.weighted ?? 0);

  console.log(
    `\nDistribution shape — the de-fluffing test (${tracks.length} tracks with ratings_count >= ${minRatings})`,
  );
  const shape = (label: string, values: number[]): void => {
    console.log(
      `  ${label.padEnd(24)} mean ${meanOf(values).toFixed(2)} · sd ${standardDeviation(values).toFixed(3)} · skew ${skewness(values).toFixed(2)} · ${(100 * ceilingShare(values, 4.5)).toFixed(0)}% >= 4.5`,
    );
  };
  shape("plain average", plainValues);
  shape("calibrated (raw weighted)", rawValues);
  shape("calibrated (displayed)", calibratedValues);
  console.log("  Wider sd + skew nearer 0 + smaller >= 4.5 share = more discriminating, less ceiling-piled.");
  console.log("  'raw weighted' isolates centering/exclusion; 'displayed' adds count-shrinkage toward the anchor.\n");
  console.log("  plain average:");
  for (const line of textHistogram(plainValues)) console.log(line);
  console.log("  calibrated (raw weighted):");
  for (const line of textHistogram(rawValues)) console.log(line);
  console.log("  calibrated (displayed):");
  for (const line of textHistogram(calibratedValues)) console.log(line);
}

/** One rater's style + how their ordering agrees with the reference rater's. */
interface RaterProfile {
  userId: string;
  count: number;
  mean: number;
  entropy: number;
  shared: number;
  correlation: number;
}

/**
 * Who rates like you, and who the fluffers are. Profiles every track rater by their range
 * usage (entropy) and generosity (mean), and — over tracks you both rated — how well their
 * ordering correlates with yours. High entropy + your correlation = kindred discriminators;
 * high mean + low entropy = the fluffers calibration is meant to discount.
 */
async function raterSimilarityReport(
  ratings: SpikeRating[],
  canonical: Map<string, string>,
  email: string,
  minShared: number,
): Promise<void> {
  const user = await prisma.user.findFirst({ where: { email }, select: { id: true } });
  if (!user) {
    console.log(`\nRater similarity — skipped (no user for ${email})`);
    return;
  }
  const meId = canonical.get(user.id) ?? user.id;

  const valuesByUser = new Map<string, Map<string, number>>();
  for (const rating of ratings) {
    const byTrack = valuesByUser.get(rating.userId) ?? new Map<string, number>();
    byTrack.set(rating.trackId, rating.value);
    valuesByUser.set(rating.userId, byTrack);
  }
  const mine = valuesByUser.get(meId);
  if (!mine) {
    console.log(`\nRater similarity — skipped (${email} has no track ratings)`);
    return;
  }

  const usernameRows = await prisma.user.findMany({
    where: { id: { in: [...valuesByUser.keys()] } },
    select: { id: true, username: true },
  });
  const nameById = new Map(usernameRows.map((row) => [row.id, row.username ?? row.id]));

  const profiles: RaterProfile[] = [];
  for (const [userId, byTrack] of valuesByUser) {
    if (userId === meId) continue;
    const values = [...byTrack.values()];
    const sharedIds = [...byTrack.keys()].filter((id) => mine.has(id));
    const correlation =
      sharedIds.length >= minShared
        ? pearson(
            sharedIds.map((id) => mine.get(id) ?? 0),
            sharedIds.map((id) => byTrack.get(id) ?? 0),
          )
        : Number.NaN;
    profiles.push({
      userId,
      count: values.length,
      mean: meanOf(values),
      entropy: ratingEntropy(values),
      shared: sharedIds.length,
      correlation,
    });
  }

  const myValues = [...mine.values()];
  console.log(
    `\nRater similarity — you (${email}): ${myValues.length} tracks · mean ${meanOf(myValues).toFixed(2)} · entropy ${ratingEntropy(myValues).toFixed(2)} bits`,
  );
  const row = (profile: RaterProfile): string =>
    `    ${(nameById.get(profile.userId) ?? profile.userId).padEnd(22)} r ${Number.isNaN(profile.correlation) ? " n/a " : profile.correlation.toFixed(2).padStart(5)} · shared ${String(profile.shared).padStart(4)} · mean ${profile.mean.toFixed(2)} · entropy ${profile.entropy.toFixed(2)} · n ${profile.count}`;

  const comparable = profiles.filter((profile) => !Number.isNaN(profile.correlation));
  const closest = [...comparable].sort((a, b) => b.correlation - a.correlation).slice(0, 15);
  console.log(`\n  Closest to you (Pearson over >= ${minShared} shared tracks, highest first):`);
  for (const profile of closest) console.log(row(profile));

  // Fluffers: generous AND one-note, among raters with enough volume to matter.
  const fluffers = profiles
    .filter((profile) => profile.count >= 50)
    .sort((a, b) => b.mean - a.mean || a.entropy - b.entropy)
    .slice(0, 12);
  console.log("\n  Biggest fluffers (highest mean + lowest entropy, n >= 50) — what calibration discounts:");
  for (const profile of fluffers) console.log(row(profile));
}

/**
 * The variant sweep: the "combine the two" comparison. For each named config it reports
 * the two axes that actually matter for the goal — distribution shape (does it spread off
 * the 5-star ceiling) and split-half reliability (is that spread real signal or noise) —
 * so the centering × gamma × shrink tradeoff is visible in one table. Self-alignment is
 * deliberately gone: the goal is a discriminating score, not one tuned to agree with anyone.
 */
function variantSweepReport(
  ratings: SpikeRating[],
  options: { gamma: number; repeats: number; minPerHalf: number; minDistRatings: number },
): void {
  const { gamma, repeats, minPerHalf, minDistRatings } = options;
  const plain = plainTrackAverages(ratings);
  const distTracks = [...plain.keys()].filter((id) => (plain.get(id)?.count ?? 0) >= minDistRatings);

  const configs: Array<{ label: string; options: VariantOptions }> = [
    { label: `discriminating (none, γ${gamma}, k0)`, options: { centering: "none", gamma, shrinkK: 0 } },
    { label: `mean-center (mean, γ${gamma}, k0)`, options: { centering: "mean", gamma, shrinkK: 0 } },
    { label: `z-score (zscore, γ${gamma}, k0)`, options: { centering: "zscore", gamma, shrinkK: 0 } },
    { label: `mean + light shrink (mean, γ${gamma}, k1)`, options: { centering: "mean", gamma, shrinkK: 1 } },
    { label: `mean, low γ1, k1`, options: { centering: "mean", gamma: 1, shrinkK: 1 } },
  ];

  console.log(
    `\n=== Variant sweep — combining centering × gamma × shrink (${distTracks.length} tracks, ratings_count >= ${minDistRatings}) ===`,
  );
  console.log("  Goal: skew toward 0 + wider sd (discrimination) WHILE reliability stays high (the spread is real).\n");

  const plainValues = distTracks.map((id) => plain.get(id)?.average ?? 0);
  const plainReliability = splitHalfCorrelation(
    ratings,
    repeats,
    minPerHalf,
    (subset) => new Map([...plainTrackAverages(subset)].map(([id, value]) => [id, value.average])),
  );
  const shapeLine = (label: string, values: number[], reliability: number): void => {
    console.log(
      `  ${label.padEnd(34)} skew ${skewness(values).toFixed(2).padStart(5)} · sd ${standardDeviation(values).toFixed(3)} · ${String(Math.round(100 * ceilingShare(values, 4.5))).padStart(2)}% >= 4.5 · reliability ${reliability.toFixed(3)}`,
    );
  };
  shapeLine("plain average", plainValues, plainReliability.correlation);
  for (const { label, options: variant } of configs) {
    const full = computeVariantScores(ratings, variant);
    const values = distTracks.filter((id) => full.has(id)).map((id) => full.get(id)?.displayed ?? 0);
    const reliability = splitHalfCorrelation(
      ratings,
      repeats,
      minPerHalf,
      (subset) => new Map([...computeVariantScores(subset, variant)].map(([id, value]) => [id, value.displayed])),
    );
    shapeLine(label, values, reliability.correlation);
  }
  console.log(
    "  (Reference: plain reliability is the bar to beat; every point of discrimination tends to cost reliability.)",
  );
}

/**
 * The concrete demo: find shows where one or more raters gave EVERY track 5 stars, and show
 * each track's community average before (plain) vs after (discriminating and mean+shrink
 * variants). Makes the abstract distribution numbers tangible — you see the all-5 votes
 * getting down-weighted track by track on a real setlist.
 */
async function allFivesShowDemo(
  ratings: SpikeRating[],
  gamma: number,
  minTracks: number,
  showLimit: number,
): Promise<void> {
  const trackIds = [...new Set(ratings.map((rating) => rating.trackId))];
  const trackRows = await prisma.track.findMany({
    where: { id: { in: trackIds } },
    select: {
      id: true,
      showId: true,
      set: true,
      position: true,
      song: { select: { title: true } },
      show: { select: { date: true } },
    },
  });
  const trackInfo = new Map(
    trackRows.map((track) => [
      track.id,
      {
        showId: track.showId,
        date: track.show?.date ?? "?",
        title: track.song?.title ?? "?",
        set: track.set,
        position: track.position,
      },
    ]),
  );
  const tracksByShow = new Map<string, string[]>();
  for (const [id, info] of trackInfo) {
    const bucket = tracksByShow.get(info.showId) ?? [];
    bucket.push(id);
    tracksByShow.set(info.showId, bucket);
  }

  // Count all-5 raters per show: a (user, show) where every one of their >= minTracks votes is 5.
  const userShowValues = new Map<string, number[]>();
  for (const rating of ratings) {
    const info = trackInfo.get(rating.trackId);
    if (!info) continue;
    const key = `${rating.userId}|${info.showId}`;
    const bucket = userShowValues.get(key) ?? [];
    bucket.push(rating.value);
    userShowValues.set(key, bucket);
  }
  const allFivesByShow = new Map<string, number>();
  for (const [key, values] of userShowValues) {
    if (values.length >= minTracks && values.every((value) => value === 5)) {
      const showId = key.slice(key.indexOf("|") + 1);
      allFivesByShow.set(showId, (allFivesByShow.get(showId) ?? 0) + 1);
    }
  }
  const chosen = [...allFivesByShow.entries()].sort((a, b) => b[1] - a[1]).slice(0, showLimit);

  const plain = plainTrackAverages(ratings);
  const discriminating = computeVariantScores(ratings, { centering: "none", gamma, shrinkK: 0 });
  const meanShrink = computeVariantScores(ratings, { centering: "mean", gamma, shrinkK: 1 });
  const clamp = (value: number): number => Math.min(5, Math.max(0.5, value));

  console.log(`\n=== Shows with all-5 raters — community average before vs after (γ${gamma}) ===`);
  if (chosen.length === 0) {
    console.log(`  (no shows had a rater giving 5★ to >= ${minTracks} tracks)`);
    return;
  }
  for (const [showId, fluffers] of chosen) {
    const showTracks = (tracksByShow.get(showId) ?? [])
      .map((id) => ({ id, ...(trackInfo.get(id) as { date: string; title: string; set: string; position: number }) }))
      .sort((a, b) => a.set.localeCompare(b.set) || a.position - b.position);
    console.log(
      `\n  ${showTracks[0]?.date ?? "?"} — ${fluffers} rater(s) gave every track 5★ · ${showTracks.length} tracks`,
    );
    console.log(`    ${"track".padEnd(32)} plain      discrim   mean+shrink`);
    for (const track of showTracks) {
      const p = plain.get(track.id);
      if (!p) continue;
      const d = discriminating.get(track.id)?.displayed;
      const m = meanShrink.get(track.id)?.displayed;
      console.log(
        `    ${track.title.slice(0, 32).padEnd(32)} ${p.average.toFixed(2)} (n=${String(p.count).padStart(2)})  ${d == null ? "  --  " : clamp(d).toFixed(2).padStart(5)}     ${m == null ? "  --  " : clamp(m).toFixed(2).padStart(5)}`,
      );
    }
  }
}

async function main(): Promise<void> {
  const repeats = Number(process.env.REPEATS ?? 50);
  const minPerHalf = Number(process.env.MIN_PER_HALF ?? 2);
  const minRatings = Number(process.env.MIN_RATINGS ?? 10);
  const minDistRatings = Number(process.env.MIN_DIST_RATINGS ?? 5);
  const minShared = Number(process.env.MIN_SHARED ?? 20);
  const gamma = Number(process.env.GAMMA ?? 3);
  const email = process.env.USER_EMAIL ?? "evan@foo.net";

  const canonical = await buildCanonicalUserMap();
  const ratings = await loadTrackRatings(canonical);
  const raters = new Set(ratings.map((rating) => rating.userId)).size;
  const tracks = new Set(ratings.map((rating) => rating.trackId)).size;

  const full = computeCalibratedTrackScores(ratings);

  console.log("Track Rating Calibration — validation spike");
  console.log(
    `  ${ratings.length} deduped track ratings · ${tracks} tracks · ${raters} raters · ${full.scores.size} scored · population mean ${full.populationMean.toFixed(3)} · anchor ${full.anchor.toFixed(3)}`,
  );

  const reliability = splitHalfReliability(ratings, repeats, minPerHalf);
  console.log(
    `\nSplit-half reliability — headline, whole-range (${reliability.validRepeats}/${repeats} valid repeats · ~${reliability.averageTracks.toFixed(0)} tracks/repeat · >= ${minPerHalf} ratings per half)`,
  );
  console.log(
    "  How well each score reproduces itself from an independent half of the raters (higher = more reliable):",
  );
  const line = (label: string, value: number, baseline: number): string => {
    const delta = value - baseline;
    const verdict = delta > 0.01 ? "✓ better" : delta < -0.01 ? "✗ worse" : "≈ tied";
    return `  ${label.padEnd(28)} ${value.toFixed(4)}  (Δ vs plain ${delta >= 0 ? "+" : ""}${delta.toFixed(4)}  ${verdict})`;
  };
  console.log(`  ${"plain average".padEnd(28)} ${reliability.plain.toFixed(4)}`);
  console.log(line("calibrated (displayed)", reliability.calibratedDisplayed, reliability.plain));
  console.log(line("calibrated (raw weighted)", reliability.calibratedWeighted, reliability.plain));
  console.log(
    "  Note: 'displayed' is count-shrunk toward the anchor, which compresses thin tracks and can lift reliability on its own;\n  'raw weighted' isolates whether the entropy-centering itself (not just shrinkage) improves the signal.",
  );

  distributionReport(ratings, full, minDistRatings);
  await discriminationReport(ratings, full, minRatings);
  await raterSimilarityReport(ratings, canonical, email, minShared);
  await zeroPointFiveReport(ratings, full, canonical, email);
  variantSweepReport(ratings, { gamma, repeats, minPerHalf, minDistRatings });
  await allFivesShowDemo(ratings, gamma, 5, 5);

  await prisma.$disconnect();
}

if (import.meta.main) {
  main().catch((error) => {
    console.error("track-rating-calibration-spike failed:", error);
    process.exit(1);
  });
}
