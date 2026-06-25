import { describe, expect, test } from "vitest";
import {
  bucketRatingValues,
  center,
  computeCleanedScopeStats,
  entropyWeight,
  entropyWeightedCenteredAverage,
  isExcludedBucket,
  meanOf,
  RATER_ERAS,
  ratingEntropy,
  type ScopedRating,
  selectContributingRatings,
} from "./rater-weighting";

// ratingEntropy — Shannon information entropy over a rater's value distribution.
// 0 means perfectly predictable (a pure fluffer/bomber); higher means the rater
// uses more of the scale, carrying more information about show quality.
describe("ratingEntropy", () => {
  test("a single-value rater (fluffer/bomber) has zero entropy", () => {
    expect(ratingEntropy([5, 5, 5, 5])).toBe(0);
    expect(ratingEntropy([0.5, 0.5, 0.5])).toBe(0);
  });

  test("an empty rater has zero entropy", () => {
    expect(ratingEntropy([])).toBe(0);
  });

  test("an even two-value split is exactly one bit", () => {
    expect(ratingEntropy([1, 5, 1, 5])).toBeCloseTo(1, 10);
  });

  test("a uniform five-value rater approaches log2(5)", () => {
    expect(ratingEntropy([1, 2, 3, 4, 5])).toBeCloseTo(Math.log2(5), 10);
  });

  test("a full-scale rater carries more entropy than a near-fluffer", () => {
    const fullScale = ratingEntropy([1, 2, 3, 4, 5, 4, 3, 2]);
    const nearFluffer = ratingEntropy([5, 5, 5, 5, 5, 5, 5, 4]);
    expect(fullScale).toBeGreaterThan(nearFluffer);
  });
});

// The rater-stats scope axis: GLOBAL plus one bucket per drummer era.
describe("RATER_ERAS", () => {
  test("prepends GLOBAL to the drummer eras", () => {
    expect(RATER_ERAS).toEqual(["GLOBAL", "ALTMAN", "AUCOIN", "MARLON"]);
  });
});

// meanOf treats an empty set as 0 (not average's null), since a rater with no
// ratings in a scope contributes a 0 baseline.
describe("meanOf", () => {
  test("averages values and returns 0 for an empty set", () => {
    expect(meanOf([2, 4])).toBe(3);
    expect(meanOf([])).toBe(0);
  });
});

// center shifts a rating by the gap between the rater's own mean and the
// population mean, so a harsh grader's "high for them" rating counts as high.
describe("center", () => {
  test("recenters a harsh rater's rating up toward what it means for them", () => {
    // Harsh rater (own mean 2) gives a 3; population mean 4 → counts as a 5.
    expect(center(3, 2, { mean: 4 })).toBe(5);
  });

  test("recenters a generous rater's rating down", () => {
    // Generous rater (own mean 4.5) gives a 4; population mean 4 → counts as 3.5.
    expect(center(4, 4.5, { mean: 4 })).toBe(3.5);
  });

  test("a rating equal to the rater's own mean lands on the population mean", () => {
    expect(center(3, 3, { mean: 4 })).toBe(4);
  });
});

// entropyWeight maps a rater's entropy to a [0,1] confidence: one-noters are
// weightless, ramping to full at `fullAt` bits.
describe("entropyWeight", () => {
  test("a one-note (zero or negative entropy) rater is weightless", () => {
    expect(entropyWeight(0, 2)).toBe(0);
    expect(entropyWeight(-1, 2)).toBe(0);
  });

  test("ramps linearly to full weight at fullAt", () => {
    expect(entropyWeight(1, 2)).toBe(0.5);
    expect(entropyWeight(2, 2)).toBe(1);
  });

  test("clamps above fullAt to 1", () => {
    expect(entropyWeight(3, 2)).toBe(1);
  });
});

// The core score: center each rating, weight by entropy, average, clamp once.
describe("entropyWeightedCenteredAverage", () => {
  test("drops zero-entropy raters and keeps the entropy-weighted ones", () => {
    const result = entropyWeightedCenteredAverage(
      [
        { value: 5, userMean: 4, entropy: 2 }, // full weight, center → 5
        { value: 0.5, userMean: 4, entropy: 0 }, // weightless, dropped
      ],
      { mean: 4 },
      2,
    );
    expect(result.contributingCount).toBe(1);
    expect(result.weightedAverage).toBe(5);
  });

  test("clamps the result into the 0.5 to 5 star range", () => {
    // center(5, 2, 4) = 7, clamped down to 5.
    const result = entropyWeightedCenteredAverage([{ value: 5, userMean: 2, entropy: 2 }], { mean: 4 }, 2);
    expect(result.weightedAverage).toBe(5);
  });

  test("returns an empty result when every rater is weightless", () => {
    const result = entropyWeightedCenteredAverage([{ value: 5, userMean: 4, entropy: 0 }], { mean: 4 }, 2);
    expect(result.contributingCount).toBe(0);
    expect(result.weightedAverage).toBe(0);
  });
});

// isExcludedBucket flags bad-faith buckets: one-note AND stuck at an extreme AND
// numerous enough to be deliberate.
describe("isExcludedBucket", () => {
  test("flags a numerous one-note floor-bomber", () => {
    expect(isExcludedBucket({ entropy: 0.2, mean: 0.6, ratingsCount: 10 })).toBe(true);
  });

  test("flags a numerous one-note ceiling-fluffer", () => {
    expect(isExcludedBucket({ entropy: 0.3, mean: 4.9, ratingsCount: 8 })).toBe(true);
  });

  test("spares a wide-range rater even at an extreme mean (the entropy gate)", () => {
    expect(isExcludedBucket({ entropy: 1.5, mean: 0.8, ratingsCount: 10 })).toBe(false);
  });

  test("spares a one-noter whose mean isn't extreme", () => {
    expect(isExcludedBucket({ entropy: 0, mean: 3, ratingsCount: 10 })).toBe(false);
  });

  test("spares too small a sample to judge", () => {
    expect(isExcludedBucket({ entropy: 0, mean: 0.5, ratingsCount: 3 })).toBe(false);
  });
});

// computeCleanedScopeStats scores each era, drops the bad-faith ones, and rebuilds
// GLOBAL from the survivors so a bimodal rater's bombing doesn't poison their mean.
describe("computeCleanedScopeStats", () => {
  const kind = "SHOW" as const;

  test("excludes a bad-faith era and rebuilds GLOBAL from the surviving eras", () => {
    const ratings: ScopedRating[] = [
      // AUCOIN: a one-note floor-bombing bucket (excluded).
      ...Array.from({ length: 5 }, () => ({ value: 0.5, era: "AUCOIN" as const, kind })),
      // MARLON: genuine, varied ratings (kept).
      { value: 3, era: "MARLON", kind },
      { value: 4, era: "MARLON", kind },
      { value: 5, era: "MARLON", kind },
      { value: 2, era: "MARLON", kind },
      { value: 4, era: "MARLON", kind },
    ];
    const scopes = computeCleanedScopeStats(ratings);
    expect(scopes.get("AUCOIN")?.isExcluded).toBe(true);
    expect(scopes.get("MARLON")?.isExcluded).toBe(false);
    // GLOBAL is rebuilt from MARLON only, so the 0.5 bombs don't drag it down.
    expect(scopes.get("GLOBAL")?.mean).toBeCloseTo(3.6, 10);
  });

  test("falls back to all ratings for GLOBAL when every era is excluded", () => {
    const ratings: ScopedRating[] = [
      ...Array.from({ length: 5 }, () => ({ value: 0.5, era: "AUCOIN" as const, kind })),
      ...Array.from({ length: 5 }, () => ({ value: 0.5, era: "MARLON" as const, kind })),
    ];
    const scopes = computeCleanedScopeStats(ratings);
    expect(scopes.get("GLOBAL")?.mean).toBe(0.5);
    expect(scopes.get("GLOBAL")?.isExcluded).toBe(false);
  });
});

// selectContributingRatings — the "who counts" rule shared by the calibrated score
// and histogram: drop the era's bad-faith raters, but never empty the show.
describe("selectContributingRatings", () => {
  const ratings = [
    { userId: "credible", value: 5 },
    { userId: "bomber", value: 0.5 },
  ];

  test("drops raters flagged bad-faith in the show's era", () => {
    const used = selectContributingRatings(ratings, "MARLON", (userId) => userId === "bomber");
    expect(used).toEqual([{ userId: "credible", value: 5 }]);
  });

  test("keeps everyone when the show has no era (date unknown)", () => {
    const used = selectContributingRatings(ratings, null, () => true);
    expect(used).toEqual(ratings);
  });

  test("falls back to all ratings when exclusion would empty the show", () => {
    const used = selectContributingRatings(ratings, "MARLON", () => true);
    expect(used).toEqual(ratings);
  });
});

// bucketRatingValues — the single per-rateable histogram bucketing rule: group by
// star value, skipping the sub-0.5 "unrated" sentinel.
describe("bucketRatingValues", () => {
  test("counts each star value and skips sub-0.5 sentinels", () => {
    const buckets = bucketRatingValues([5, 5, 4, 0.5, 0.25, 0]);
    expect(Object.fromEntries(buckets.map((b) => [b.value, b.count]))).toEqual({ 5: 2, 4: 1, 0.5: 1 });
  });

  test("returns no buckets for an empty set", () => {
    expect(bucketRatingValues([])).toEqual([]);
  });
});
