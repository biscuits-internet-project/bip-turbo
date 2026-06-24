import { describe, expect, test } from "vitest";
import { average, median, shrinkToward } from "./math";

describe("average", () => {
  // Empty input returns null so callers can branch on "render the value
  // vs. hide the summary line" without a length check at every site.
  test("returns null for an empty list", () => {
    expect(average([])).toBeNull();
  });

  // Arithmetic mean — standard case.
  test("computes the arithmetic mean of numeric values", () => {
    expect(average([2, 4, 6])).toBe(4);
    expect(average([7, 3])).toBe(5);
  });

  // Single value averages to itself; floating point exact.
  test("returns the single value when the list has one entry", () => {
    expect(average([42])).toBe(42);
  });
});

describe("median", () => {
  // Empty input returns null, same convention as average.
  test("returns null for an empty list", () => {
    expect(median([])).toBeNull();
  });

  // Odd count picks the middle element; sorting handled internally so the
  // input order doesn't matter.
  test("returns the middle element for an odd-count list", () => {
    expect(median([1, 5, 3])).toBe(3);
    expect(median([10, 30, 20, 40, 50])).toBe(30);
  });

  // Even count averages the two middle elements.
  test("averages the two middle elements for an even-count list", () => {
    expect(median([2, 4, 6, 10])).toBe(5);
    expect(median([1, 2])).toBe(1.5);
  });

  // Resists outliers — one very-large value barely moves the median while
  // it would drag the average up significantly. (This is *why* both stats
  // pair up in the gap-chart UI.)
  test("is unmoved by a single outlier value", () => {
    expect(median([1, 2, 3, 4, 1000])).toBe(3);
  });
});

describe("shrinkToward", () => {
  // No sample falls all the way back to the anchor (avoids 0/0 and lets a
  // ratingless show read as the population baseline rather than NaN).
  test("returns the anchor when count is zero or negative", () => {
    expect(shrinkToward(5, 3, 0, 3)).toBe(3);
    expect(shrinkToward(5, 3, -2, 3)).toBe(3);
  });

  // weight = count/(count+k): at count === k the value and anchor are weighted
  // equally, so the result is their midpoint.
  test("weights value and anchor equally when count equals k", () => {
    expect(shrinkToward(5, 3, 3, 3)).toBe(4);
  });

  // Few ratings leave the anchor dominant; many let the value dominate.
  test("shifts from anchor-dominated to value-dominated as count grows", () => {
    expect(shrinkToward(5, 3, 1, 3)).toBe(3.5); // w = 0.25
    expect(shrinkToward(5, 3, 9, 3)).toBe(4.5); // w = 0.75
  });

  // A larger k holds the value near the anchor for longer (more shrinkage at
  // the same count).
  test("larger k means more shrinkage toward the anchor", () => {
    expect(shrinkToward(5, 3, 3, 3)).toBe(4); // w = 0.5
    expect(shrinkToward(5, 3, 3, 9)).toBe(3.5); // w = 0.25
  });
});
