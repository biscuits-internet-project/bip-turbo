import { describe, expect, test } from "vitest";
import { displayedRatingComparator, formatRatingScore, roundRatingForDisplay } from "./rating-display";

describe("formatRatingScore / roundRatingForDisplay", () => {
  // The formatter and the sort key MUST agree: the number the sort rounds to is
  // exactly the number the badge renders, so ranking can't flip on hidden precision.
  test("formats and rounds at the given precision", () => {
    expect(formatRatingScore(4.81104404832045, 2)).toBe("4.81");
    expect(formatRatingScore(4.81104404832045, 3)).toBe("4.811");
    expect(formatRatingScore(4.81104404832045, 4)).toBe("4.8110");
    expect(roundRatingForDisplay(4.81104404832045, 3)).toBe(4.811);
  });

  // Defaults to 2 when no precision is passed (the app default + global-sort precision).
  test("defaults to 2 decimals", () => {
    expect(formatRatingScore(4.81104404832045)).toBe("4.81");
    expect(roundRatingForDisplay(4.81104404832045)).toBe(4.81);
  });

  // A stored/query value outside 1-4 is clamped rather than trusted.
  test("clamps precision to the 1-4 range", () => {
    expect(formatRatingScore(4.8151, 0)).toBe("4.8"); // clamps up to 1
    expect(formatRatingScore(4.8151, 9)).toBe("4.8151"); // clamps down to 4
  });
});

describe("displayedRatingComparator", () => {
  const show = (id: string, date: string, dayOrder: number | null = null) => ({ id, date, dayOrder });

  // The 10/5/02 Haymaker vs 9/1/01 Wetlands case: both display 4.81 at 2 decimals,
  // so the rounded score ties them and the count tiebreak decides — Wetlands (33)
  // over Haymaker (30) — flipping the full-precision order no user could see.
  test("equal rounded score falls to the count tiebreak (more ratings ranks higher)", () => {
    const haymaker = { rating: 4.81104404832045, count: 30, show: show("hay", "2002-10-05") };
    const wetlands = { rating: 4.81102720879324, count: 33, show: show("wet", "2001-09-01") };
    expect([haymaker, wetlands].sort(displayedRatingComparator(2)).map((s) => s.show.id)).toEqual(["wet", "hay"]);
    // Full precision alone would rank Haymaker first, so the flip proves the rounding.
    expect(wetlands.rating).toBeLessThan(haymaker.rating);
  });

  // At a finer precision the same two scores separate, so the count tiebreak is
  // never reached and the higher raw score wins.
  test("a finer precision can separate scores that tie at 2 decimals", () => {
    const higher = { rating: 4.814, count: 1, show: show("hi", "2000-01-01") };
    const lower = { rating: 4.811, count: 999, show: show("lo", "2000-01-01") };
    // Both round to 4.81 at 2 decimals → count wins (lower, 999). At 3 they differ
    // (4.814 vs 4.811) → the higher score wins.
    expect([higher, lower].sort(displayedRatingComparator(2)).map((s) => s.show.id)).toEqual(["lo", "hi"]);
    expect([higher, lower].sort(displayedRatingComparator(3)).map((s) => s.show.id)).toEqual(["hi", "lo"]);
  });

  // Equal rounded score AND equal count fall to the show-date tiebreak, DESC
  // (newest-first) to mirror showOrderBySql(..., "DESC").
  test("equal rounded score and count fall to newest-date-first", () => {
    const older = { rating: 4.5, count: 10, show: show("older", "2005-01-01") };
    const newer = { rating: 4.5, count: 10, show: show("newer", "2010-01-01") };
    expect([older, newer].sort(displayedRatingComparator(2)).map((s) => s.show.id)).toEqual(["newer", "older"]);
  });
});
