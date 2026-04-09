import { describe, expect, test } from "vitest";

/**
 * Whether to show performance filter controls on the On This Day page.
 * Filters are only useful when there are enough all-timers to paginate.
 */
function shouldShowFilters(performanceCount: number, pageSize: number): boolean {
  return performanceCount > pageSize;
}

describe("shouldShowFilters", () => {
  // Filters add noise when all performances fit on one page — hide them.
  test("returns false when performances fit on one page", () => {
    expect(shouldShowFilters(5, 10)).toBe(false);
  });

  // At exactly the page size, there's still no second page — hide filters.
  test("returns false when performance count equals page size", () => {
    expect(shouldShowFilters(10, 10)).toBe(false);
  });

  // With more performances than the page size, pagination kicks in and
  // filters become useful for narrowing results.
  test("returns true when performances exceed page size", () => {
    expect(shouldShowFilters(11, 10)).toBe(true);
  });
});
