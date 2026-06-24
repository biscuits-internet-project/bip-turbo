import { shrinkToward } from "@bip/domain";
import prisma from "../src/_shared/prisma/client";
import { POPULATION_SHOW_MEAN, SHRINK_K } from "../src/ratings/rater-weighting";

/**
 * Validity eval for the calibrated show rating. Correlates each show's score against
 * objective, rating-independent quality signals and reports whether the calibrated
 * score tracks them at least as well as the raw community average. The guard for any
 * change to the rating algorithm (rater weighting, dedup, exclusion, cold-start): a
 * change that drops these correlations is regressing validity.
 *
 * Signals (community-curated jam-chart / all-timer data, not derived from the star votes):
 *  - all-timer count — how many of a show's tracks are on the curated "best jams" list.
 *  - all-timer length — total duration of those all-timer tracks (a show of long, notable jams).
 *
 * Method: Spearman rank correlation (tie-aware) over shows with >= MIN_RATINGS votes,
 * for both the calibrated (count-shrunk weighted) score and the simple deduped average.
 *
 * Run: `make rating-validity-eval` (optionally `MIN_RATINGS=5 make rating-validity-eval`).
 */

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

async function main(): Promise<void> {
  const minRatings = Number(process.env.MIN_RATINGS ?? 10);
  const settings = await prisma.ratingSettings.findFirst({ select: { showShrinkAnchor: true } });
  const anchor = settings?.showShrinkAnchor ?? POPULATION_SHOW_MEAN;

  const rows = await prisma.$queryRaw<
    Array<{ weighted: number; average: number; count: number; alltimer: bigint; alltimer_duration: number }>
  >`
    SELECT s.weighted_rating AS weighted,
           s.average_rating AS average,
           s.ratings_count AS count,
           COUNT(*) FILTER (WHERE t.all_timer) AS alltimer,
           COALESCE(SUM(t.duration) FILTER (WHERE t.all_timer), 0) AS alltimer_duration
    FROM shows s
    LEFT JOIN tracks t ON t.show_id = s.id
    WHERE s.weighted_rating IS NOT NULL AND s.average_rating IS NOT NULL AND s.ratings_count >= ${minRatings}
    GROUP BY s.id
  `;

  const calibrated = rows.map((r) => shrinkToward(Number(r.weighted), anchor, Number(r.count), SHRINK_K));
  const simple = rows.map((r) => Number(r.average));
  const allTimerCount = rows.map((r) => Number(r.alltimer));
  const allTimerLength = rows.map((r) => Number(r.alltimer_duration));

  console.log(`Shows: ${rows.length} (ratings_count >= ${minRatings}) · anchor ${anchor.toFixed(4)} · k=${SHRINK_K}`);
  console.log("Spearman rank correlation (higher = better tracks objective quality):\n");
  const report = (label: string, truth: number[]) => {
    const c = spearman(calibrated, truth);
    const s = spearman(simple, truth);
    const delta = c - s;
    // ±0.01 is within rank-correlation noise on this sample, so call it a tie.
    const verdict = delta > 0.01 ? "✓ better" : delta < -0.01 ? "✗ worse" : "≈ tied";
    console.log(
      `  ${label.padEnd(22)} calibrated ${c.toFixed(4)} | simple ${s.toFixed(4)} | Δ ${delta >= 0 ? "+" : ""}${delta.toFixed(4)}  ${verdict}`,
    );
  };
  report("vs all-timer count", allTimerCount);
  report("vs all-timer length", allTimerLength);

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error("rating-validity-eval failed:", error);
  process.exit(1);
});
