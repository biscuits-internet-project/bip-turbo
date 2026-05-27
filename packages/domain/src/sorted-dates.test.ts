import { describe, expect, test } from "vitest";
import { countSortedAfter, countSortedBefore, countSortedBetween, countSortedOnOrAfter } from "./sorted-dates";

// ---------------------------------------------------------------------------
// countSortedAfter — strictly-greater binary-search count
// ---------------------------------------------------------------------------

describe("countSortedAfter", () => {
  // Drives the /songs Gap to Now column and song-detail "X shows ago"
  // sublabel — number of stats-eligible shows since dateLastPlayed.

  test("returns 0 for empty input regardless of target", () => {
    expect(countSortedAfter([], "2024-01-01")).toBe(0);
  });

  test("returns full length when target precedes all dates", () => {
    expect(countSortedAfter(["2010-01-01", "2015-06-15", "2020-12-31"], "2000-01-01")).toBe(3);
  });

  // Strictly-greater semantics excludes the match itself. Matches the
  // song-detail composer's existing SQL (`> date`, not `>=`).
  test("strictly-greater: target equal to a date does not count that date", () => {
    expect(countSortedAfter(["2020-01-01", "2021-01-01", "2022-01-01"], "2021-01-01")).toBe(1);
  });

  test("strictly-greater with duplicates: all matching entries are excluded", () => {
    expect(countSortedAfter(["2020-01-01", "2020-01-01", "2021-01-01"], "2020-01-01")).toBe(1);
  });

  test("returns 0 when target follows every date", () => {
    expect(countSortedAfter(["2010-01-01", "2015-06-15", "2020-12-31"], "2025-01-01")).toBe(0);
  });

  test("counts dates strictly greater than a target falling between two entries", () => {
    expect(countSortedAfter(["2010-01-01", "2015-06-15", "2020-12-31", "2024-07-04"], "2018-01-01")).toBe(2);
  });

  // Binary search must agree with a linear scan even on larger arrays.
  test("matches a linear scan on a 480-element array", () => {
    const dates: string[] = [];
    for (let year = 1990; year < 2030; year++) {
      for (let month = 1; month <= 12; month++) {
        dates.push(`${year}-${String(month).padStart(2, "0")}-15`);
      }
    }
    dates.sort();
    const target = "2010-06-15";
    expect(countSortedAfter(dates, target)).toBe(dates.filter((d) => d > target).length);
  });
});

// ---------------------------------------------------------------------------
// countSortedOnOrAfter — inclusive variant for the filtered-debut denominator
// ---------------------------------------------------------------------------

describe("countSortedOnOrAfter", () => {
  // Drives Filtered Since Debut / Filtered Avg Gap on /songs — the
  // denominator must include the debut show itself.

  test("returns 0 for empty input regardless of target", () => {
    expect(countSortedOnOrAfter([], "2024-01-01")).toBe(0);
  });

  test("returns full length when target precedes all dates", () => {
    expect(countSortedOnOrAfter(["2010-01-01", "2015-06-15", "2020-12-31"], "2000-01-01")).toBe(3);
  });

  // Distinguishes this helper from `countSortedAfter`.
  test("inclusive: target equal to a date includes that date", () => {
    expect(countSortedOnOrAfter(["2020-01-01", "2021-01-01", "2022-01-01"], "2021-01-01")).toBe(2);
  });

  test("returns 0 when target follows every date", () => {
    expect(countSortedOnOrAfter(["2010-01-01", "2015-06-15"], "2030-01-01")).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// countSortedBefore — strictly-less binary-search count
// ---------------------------------------------------------------------------

describe("countSortedBefore", () => {
  // Drives the gap-chart Played Before column: number of stats-eligible
  // performances of a song strictly before the current show's date.
  // Mirrors the personal view's "Seen Before" semantic.

  test("returns 0 for empty input", () => {
    expect(countSortedBefore([], "2026-05-24")).toBe(0);
  });

  test("returns 0 when every date is on or after the target", () => {
    expect(countSortedBefore(["2026-05-24", "2026-06-01"], "2026-05-24")).toBe(0);
  });

  // Strictly-less semantics excludes dates equal to the target — a play
  // on the show date itself isn't a "prior" play.
  test("strictly-less: target equal to a date does not count that date", () => {
    expect(countSortedBefore(["2020-01-01", "2026-05-24", "2026-05-24"], "2026-05-24")).toBe(1);
  });

  test("counts plays strictly before a target falling between entries", () => {
    const dates = ["2010-04-12", "2015-06-15", "2020-12-31", "2024-08-08"];
    expect(countSortedBefore(dates, "2020-12-31")).toBe(2);
    expect(countSortedBefore(dates, "2025-01-01")).toBe(4);
  });
});

// ---------------------------------------------------------------------------
// countSortedBetween — both endpoints exclusive
// ---------------------------------------------------------------------------

describe("countSortedBetween", () => {
  // Drives the closed-gap numerator for filteredAverageGapShows: matching-
  // universe shows strictly between the first and last filtered plays.
  // Endpoints are performances, not gaps.

  test("returns 0 for empty input", () => {
    expect(countSortedBetween([], "2024-01-01", "2024-12-31")).toBe(0);
  });

  test("excludes both endpoints", () => {
    const dates = ["2024-01-01", "2024-02-01", "2024-03-01", "2024-04-01", "2024-05-01"];
    expect(countSortedBetween(dates, "2024-01-01", "2024-05-01")).toBe(3);
  });

  // Inverted or degenerate intervals return 0, never negative.
  test("returns 0 when low >= high", () => {
    const dates = ["2024-01-01", "2024-02-01", "2024-03-01"];
    expect(countSortedBetween(dates, "2024-03-01", "2024-01-01")).toBe(0);
    expect(countSortedBetween(dates, "2024-02-01", "2024-02-01")).toBe(0);
  });

  test("returns 0 when no dates fall in range", () => {
    const dates = ["2024-01-01", "2024-02-01"];
    expect(countSortedBetween(dates, "2025-01-01", "2025-12-31")).toBe(0);
  });
});
