import { describe, expect, test } from "vitest";
import { ratingColumnWidth } from "./rating-column-width";

describe("ratingColumnWidth", () => {
  // The column widens by ~0.5rem per decimal off the 2-decimal base so the busiest
  // badge always fits without leaving slack at lower precisions.
  test("scales the width with the decimal count", () => {
    expect(ratingColumnWidth(1)).toEqual({ fixedWidth: "7.75rem", mobileFixedWidth: "6.25rem" });
    expect(ratingColumnWidth(2)).toEqual({ fixedWidth: "8.25rem", mobileFixedWidth: "6.75rem" });
    expect(ratingColumnWidth(3)).toEqual({ fixedWidth: "8.75rem", mobileFixedWidth: "7.25rem" });
    expect(ratingColumnWidth(4)).toEqual({ fixedWidth: "9.25rem", mobileFixedWidth: "7.75rem" });
  });

  // A decimals value outside 1-4 is clamped, not trusted, so a bad stored value
  // can't produce a zero-width or absurdly wide column.
  test("clamps out-of-range decimals to the 1-4 bounds", () => {
    expect(ratingColumnWidth(0)).toEqual(ratingColumnWidth(1));
    expect(ratingColumnWidth(9)).toEqual(ratingColumnWidth(4));
  });
});
