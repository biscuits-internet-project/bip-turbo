import { DRUMMER_ERAS } from "@bip/domain";
import { describe, expect, test } from "vitest";
import {
  ceilingShare,
  computeCalibratedTrackScores,
  computeDiscriminatingScores,
  computeVariantScores,
  plainTrackAverages,
  type SpikeRating,
  skewness,
  standardDeviation,
} from "./track-rating-calibration-spike";

/**
 * Wiring tests for the spike's calibrated-track scoring: that it reuses production's
 * dedup-free pure rule correctly (bad-faith exclusion drops a bucket, thin tracks
 * shrink toward the anchor). The scoring math itself is covered in
 * rater-weighting.test.ts; these prove the track wrapper threads it right.
 */

const ERA = DRUMMER_ERAS[0];

/** One rater's votes over a spread of tracks, all in the same era. */
function votes(userId: string, entries: Array<[track: string, value: number]>): SpikeRating[] {
  return entries.map(([trackId, value]) => ({ userId, trackId, value, era: ERA }));
}

describe("computeCalibratedTrackScores", () => {
  test("drops a one-note ceiling-fluffer bucket from a track's contributing count", () => {
    // A fluffer: 6 straight 5.0s → entropy 0, mean 5 (>= 4.75), count >= 5 → excluded.
    const fluffer = votes("fluffer", [
      ["helicopters", 5],
      ["basisforaday", 5],
      ["confrontation", 5],
      ["spaga", 5],
      ["mrdon", 5],
      ["shemrahboo", 5],
    ]);
    // A genuine wide-range rater who also rated "helicopters".
    const honest = votes("honest", [
      ["helicopters", 4],
      ["basisforaday", 2],
      ["confrontation", 5],
      ["spaga", 1],
      ["mrdon", 3],
    ]);

    const { scores } = computeCalibratedTrackScores([...fluffer, ...honest]);
    // Both rated "helicopters", but the fluffer is excluded, so only 1 vote counts.
    expect(scores.get("helicopters")?.count).toBe(1);
  });

  test("keeps both raters when neither trips the bad-faith gate", () => {
    const wide = votes("wide", [
      ["helicopters", 4],
      ["basisforaday", 2],
      ["confrontation", 5],
      ["spaga", 1],
      ["mrdon", 3],
    ]);
    const alsoWide = votes("alsowide", [
      ["helicopters", 3],
      ["basisforaday", 5],
      ["confrontation", 2],
      ["spaga", 4],
      ["mrdon", 1],
    ]);

    const { scores } = computeCalibratedTrackScores([...wide, ...alsoWide]);
    expect(scores.get("helicopters")?.count).toBe(2);
  });

  test("shrinks a thin track's extreme vote toward the anchor", () => {
    // A broad field of mid-range tracks establishes an anchor well below 5, then one
    // thin track gets a single 5.0. Its displayed score must land strictly between the
    // anchor and 5 — the raw vote is pulled in because n=1 is unreliable.
    const rater = votes("solo", [
      ["helicopters", 3],
      ["basisforaday", 3],
      ["confrontation", 2.5],
      ["spaga", 3.5],
      ["mrdon", 3],
      ["shemrahboo", 5],
    ]);

    const { scores, anchor } = computeCalibratedTrackScores(rater);
    const thin = scores.get("shemrahboo");
    expect(thin).toBeDefined();
    expect(thin?.count).toBe(1);
    expect(thin?.displayed).toBeGreaterThan(anchor);
    expect(thin?.displayed).toBeLessThan(thin?.weighted ?? 5);
  });
});

describe("computeDiscriminatingScores", () => {
  test("follows the wide-range rater and drops the excluded fluffer, keeping the raw low score", () => {
    // Fluffer: 6 straight 5.0s → entropy 0, mean 5 → excluded (weight 0).
    const fluffer = votes("fluffer", [
      ["helicopters", 5],
      ["basisforaday", 5],
      ["confrontation", 5],
      ["spaga", 5],
      ["mrdon", 5],
      ["shemrahboo", 5],
    ]);
    // A wide-range rater who rated "helicopters" a genuine 0.5.
    const wide = votes("wide", [
      ["helicopters", 0.5],
      ["basisforaday", 2],
      ["confrontation", 5],
      ["spaga", 1],
      ["mrdon", 3.5],
    ]);

    const scores = computeDiscriminatingScores([...fluffer, ...wide], 3);
    // Only the wide rater counts, and un-centered — so the low 0.5 survives intact.
    expect(scores.get("helicopters")?.score).toBeCloseTo(0.5, 5);
    expect(scores.get("helicopters")?.count).toBe(1);
  });

  test("a higher gamma pulls the score further toward the wider-range rater", () => {
    // Two raters on one track: a narrow-range rater (low entropy) votes high, a
    // wide-range rater votes low. Raising gamma should weight the wide rater more,
    // pulling the blended score down.
    const narrow = votes("narrow", [
      ["helicopters", 5],
      ["basisforaday", 4.5],
      ["confrontation", 5],
      ["spaga", 4.5],
      ["mrdon", 5],
    ]);
    const wide = votes("wide", [
      ["helicopters", 2],
      ["basisforaday", 0.5],
      ["confrontation", 5],
      ["spaga", 1],
      ["mrdon", 3.5],
    ]);
    const all = [...narrow, ...wide];
    const low = computeDiscriminatingScores(all, 1).get("helicopters")?.score ?? 0;
    const high = computeDiscriminatingScores(all, 4).get("helicopters")?.score ?? 0;
    expect(high).toBeLessThan(low);
  });
});

describe("computeVariantScores centering modes", () => {
  // A harsh wide-range rater (personal mean well below the population) — only they rate "helicopters".
  const harsh = votes("harsh", [
    ["helicopters", 1],
    ["basisforaday", 0.5],
    ["confrontation", 2],
    ["spaga", 1.5],
    ["mrdon", 1],
  ]);
  // A generous wide-ish rater on other tracks, to pull the population mean above harsh's mean.
  const generous = votes("generous", [
    ["tela", 5],
    ["crickets", 4.5],
    ["kitchen", 5],
    ["hotdog", 4],
    ["shimmy", 5],
  ]);

  test("mean-centering lifts a harsh rater's low vote toward the population mean", () => {
    const both = [...harsh, ...generous];
    const none = computeVariantScores(both, { centering: "none", gamma: 1, shrinkK: 0 }).get("helicopters")?.score ?? 0;
    const mean = computeVariantScores(both, { centering: "mean", gamma: 1, shrinkK: 0 }).get("helicopters")?.score ?? 0;
    // Un-centered keeps the raw 1.0; mean-centering shifts it up (harsh's mean < population mean).
    expect(none).toBeCloseTo(1, 5);
    expect(mean).toBeGreaterThan(none);
  });

  test("shrinkK pulls a thin track toward the anchor; k0 leaves the raw score", () => {
    const k0 = computeVariantScores(harsh, { centering: "none", gamma: 1, shrinkK: 0 }).get("helicopters");
    const k3 = computeVariantScores(harsh, { centering: "none", gamma: 1, shrinkK: 3 }).get("helicopters");
    expect(k0?.displayed).toBeCloseTo(k0?.score ?? 0, 5);
    // With one vote, k=3 shrinks hard toward the anchor, away from the raw 1.0.
    expect(k3?.displayed ?? 0).toBeGreaterThan(k0?.displayed ?? 0);
  });
});

describe("distribution-shape stats", () => {
  test("skewness is negative for a high-piled (fluffed) distribution", () => {
    // Mass crushed near the 5.0 ceiling with a thin low tail → left-skewed → negative.
    const fluffed = [5, 5, 5, 5, 5, 4.5, 4.5, 4, 1];
    expect(skewness(fluffed)).toBeLessThan(0);
  });

  test("skewness is ~0 for a symmetric distribution", () => {
    const symmetric = [1, 2, 3, 3, 3, 4, 5];
    expect(Math.abs(skewness(symmetric))).toBeLessThan(0.1);
  });

  test("standardDeviation grows as a distribution spreads off a single point", () => {
    expect(standardDeviation([3, 3, 3, 3])).toBe(0);
    expect(standardDeviation([1, 2, 4, 5])).toBeGreaterThan(1);
  });

  test("ceilingShare counts the fraction at/above the threshold", () => {
    expect(ceilingShare([5, 5, 4.5, 3, 1], 4.5)).toBeCloseTo(0.6, 5);
  });
});

describe("plainTrackAverages", () => {
  test("averages a track's votes and counts them", () => {
    const ratings: SpikeRating[] = [
      { userId: "a", trackId: "helicopters", value: 4, era: ERA },
      { userId: "b", trackId: "helicopters", value: 2, era: ERA },
    ];
    expect(plainTrackAverages(ratings).get("helicopters")).toEqual({ average: 3, count: 2 });
  });
});
