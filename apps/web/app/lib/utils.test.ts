import { describe, expect, test, vi } from "vitest";
import {
  addDaysYearAgnostic,
  formatDateLong,
  formatDateMedium,
  formatDateShort,
  formatDateShortMobile,
  formatMonthDay,
  getAnniversaryYears,
  getOrdinalSuffix,
  isValidMonthDay,
  slugifyAnchor,
} from "./utils";

// Show dates are stored as bare "YYYY-MM-DD" strings with no time/zone, but
// these helpers also accept Date objects. JS parses a bare date string as UTC
// midnight, so the danger is reading it back in LOCAL time (a day east of UTC
// rolls forward). Every assertion below holds on any CI machine BECAUSE the
// helpers read UTC fields / pin timeZone:"UTC" — the boundary cases lock that
// in: an instant late on the 15th UTC must never render as the 16th.
const LATE_UTC_15TH = new Date("2024-06-15T23:30:00Z");

describe("formatDateShort", () => {
  test("formats a YYYY-MM-DD string as M/D/YYYY", () => {
    expect(formatDateShort("2024-06-05")).toBe("6/5/2024");
  });

  // Reads UTC fields, so a Date late on the 15th UTC stays the 15th regardless
  // of the test runner's timezone.
  test("uses UTC fields for a Date near the day boundary", () => {
    expect(formatDateShort(LATE_UTC_15TH)).toBe("6/15/2024");
  });

  // Fallback only fires when the input doesn't split into 3 dash-segments;
  // "a-b-c" would parse to NaN instead, but real inputs are always YYYY-MM-DD.
  test("returns the original string when it isn't a parseable date", () => {
    expect(formatDateShort("nope")).toBe("nope");
  });
});

describe("formatDateShortMobile", () => {
  test("formats a YYYY-MM-DD string as M/D/YY", () => {
    expect(formatDateShortMobile("2024-06-05")).toBe("6/5/24");
  });

  test("uses UTC fields for a Date near the day boundary", () => {
    expect(formatDateShortMobile(LATE_UTC_15TH)).toBe("6/15/24");
  });
});

describe("formatDateMedium", () => {
  test("formats as abbreviated month, day, year", () => {
    expect(formatDateMedium("2024-06-05")).toBe("Jun 5, 2024");
  });

  // Pins timeZone:"UTC", so the late-UTC instant must not roll to the 16th.
  test("pins UTC for a Date near the day boundary", () => {
    expect(formatDateMedium(LATE_UTC_15TH)).toBe("Jun 15, 2024");
  });
});

describe("formatDateLong", () => {
  // Day is rendered without a leading zero ("June 5", not "June 05").
  test("formats a YYYY-MM-DD string as Month D, YYYY", () => {
    expect(formatDateLong("2024-06-05")).toBe("June 5, 2024");
  });

  test("formats first and last day of the month without a leading zero", () => {
    expect(formatDateLong("2024-01-01")).toBe("January 1, 2024");
    expect(formatDateLong("2024-12-31")).toBe("December 31, 2024");
  });

  // Accepts a Date too (content dates arrive as Date or ISO string); reads UTC
  // fields so a Date late on the 15th UTC stays the 15th on any test runner.
  test("formats a Date near the day boundary using UTC fields", () => {
    expect(formatDateLong(LATE_UTC_15TH)).toBe("June 15, 2024");
  });

  test("returns the original string when it isn't a parseable date", () => {
    expect(formatDateLong("nope")).toBe("nope");
  });
});

describe("formatMonthDay", () => {
  // Converts zero-padded MM-DD to human-readable "Month Day" format
  test("formats mid-year date", () => {
    expect(formatMonthDay("04-04")).toBe("April 4");
  });

  // Handles first day of the year
  test("formats January 1", () => {
    expect(formatMonthDay("01-01")).toBe("January 1");
  });

  // Handles last month of the year
  test("formats December 25", () => {
    expect(formatMonthDay("12-25")).toBe("December 25");
  });

  // Leap day is valid across years
  test("formats February 29", () => {
    expect(formatMonthDay("02-29")).toBe("February 29");
  });

  // Day should not have leading zero in output
  test("strips leading zero from single-digit day", () => {
    expect(formatMonthDay("03-07")).toBe("March 7");
  });

  // Double-digit day stays as-is
  test("preserves double-digit day", () => {
    expect(formatMonthDay("11-15")).toBe("November 15");
  });
});

describe("isValidMonthDay", () => {
  // --- valid inputs ---

  // Standard valid dates
  test("accepts 04-04", () => {
    expect(isValidMonthDay("04-04")).toBe(true);
  });

  test("accepts 01-01", () => {
    expect(isValidMonthDay("01-01")).toBe(true);
  });

  test("accepts 12-31", () => {
    expect(isValidMonthDay("12-31")).toBe(true);
  });

  // Leap day allowed — shows exist on Feb 29 in leap years
  test("accepts 02-29 (leap day)", () => {
    expect(isValidMonthDay("02-29")).toBe(true);
  });

  // --- invalid inputs: not zero-padded ---

  // Single-digit month/day must be zero-padded
  test("rejects 4-4 (not zero-padded)", () => {
    expect(isValidMonthDay("4-4")).toBe(false);
  });

  // --- invalid inputs: out of range ---

  // Month 13 doesn't exist
  test("rejects 13-01 (invalid month)", () => {
    expect(isValidMonthDay("13-01")).toBe(false);
  });

  // Month 0 doesn't exist
  test("rejects 00-01 (month zero)", () => {
    expect(isValidMonthDay("00-01")).toBe(false);
  });

  // Day 32 never exists
  test("rejects 01-32 (day overflow)", () => {
    expect(isValidMonthDay("01-32")).toBe(false);
  });

  // February only has 29 days max
  test("rejects 02-30 (Feb 30 doesn't exist)", () => {
    expect(isValidMonthDay("02-30")).toBe(false);
  });

  // April has 30 days
  test("rejects 04-31 (April has 30 days)", () => {
    expect(isValidMonthDay("04-31")).toBe(false);
  });

  // --- invalid inputs: wrong format ---

  // Empty string
  test("rejects empty string", () => {
    expect(isValidMonthDay("")).toBe(false);
  });

  // Non-numeric
  test("rejects non-numeric input", () => {
    expect(isValidMonthDay("hello")).toBe(false);
  });

  // Full date (includes year)
  test("rejects full date with year", () => {
    expect(isValidMonthDay("04-04-2024")).toBe(false);
  });
});

describe("addDaysYearAgnostic", () => {
  // Normal case: incrementing a mid-month day stays in the same month
  test("increments a normal day", () => {
    expect(addDaysYearAgnostic("04-08", 1)).toBe("04-09");
  });

  // Normal case: decrementing a mid-month day stays in the same month
  test("decrements a normal day", () => {
    expect(addDaysYearAgnostic("04-08", -1)).toBe("04-07");
  });

  // Dec 31 + 1 wraps to Jan 1 (year-end boundary)
  test("wraps forward from December 31 to January 1", () => {
    expect(addDaysYearAgnostic("12-31", 1)).toBe("01-01");
  });

  // Jan 1 - 1 wraps to Dec 31 (year-start boundary)
  test("wraps backward from January 1 to December 31", () => {
    expect(addDaysYearAgnostic("01-01", -1)).toBe("12-31");
  });

  // Uses leap year (2000) internally so Feb 29 is always reachable
  test("Feb 28 + 1 = Feb 29", () => {
    expect(addDaysYearAgnostic("02-28", 1)).toBe("02-29");
  });

  // Stepping past Feb 29 lands on Mar 1
  test("Feb 29 + 1 = Mar 1", () => {
    expect(addDaysYearAgnostic("02-29", 1)).toBe("03-01");
  });

  // Stepping back from Feb 29 lands on Feb 28
  test("Feb 29 - 1 = Feb 28", () => {
    expect(addDaysYearAgnostic("02-29", -1)).toBe("02-28");
  });

  // Stepping back from Mar 1 lands on Feb 29 (not Feb 28)
  test("Mar 1 - 1 = Feb 29", () => {
    expect(addDaysYearAgnostic("03-01", -1)).toBe("02-29");
  });

  // Output must always be zero-padded MM-DD
  test("zero-pads single-digit months and days", () => {
    expect(addDaysYearAgnostic("01-01", 1)).toBe("01-02");
  });
});

describe("getOrdinalSuffix", () => {
  // Standard "th" suffix for most numbers
  test("returns 'th' for 0", () => {
    expect(getOrdinalSuffix(0)).toBe("th");
  });

  // 1st, 2nd, 3rd are the special cases
  test("returns 'st' for 1", () => {
    expect(getOrdinalSuffix(1)).toBe("st");
  });

  test("returns 'nd' for 2", () => {
    expect(getOrdinalSuffix(2)).toBe("nd");
  });

  test("returns 'rd' for 3", () => {
    expect(getOrdinalSuffix(3)).toBe("rd");
  });

  // 4-9 all get "th"
  test("returns 'th' for 5", () => {
    expect(getOrdinalSuffix(5)).toBe("th");
  });

  // 11th, 12th, 13th are exceptions to the 1st/2nd/3rd rule
  test("returns 'th' for 11 (not 'st')", () => {
    expect(getOrdinalSuffix(11)).toBe("th");
  });

  test("returns 'th' for 12 (not 'nd')", () => {
    expect(getOrdinalSuffix(12)).toBe("th");
  });

  test("returns 'th' for 13 (not 'rd')", () => {
    expect(getOrdinalSuffix(13)).toBe("th");
  });

  // 21st, 22nd, 23rd resume the normal pattern
  test("returns 'st' for 21", () => {
    expect(getOrdinalSuffix(21)).toBe("st");
  });

  test("returns 'nd' for 22", () => {
    expect(getOrdinalSuffix(22)).toBe("nd");
  });

  test("returns 'rd' for 23", () => {
    expect(getOrdinalSuffix(23)).toBe("rd");
  });

  // Typical anniversary values used in this feature
  test("returns 'th' for 10", () => {
    expect(getOrdinalSuffix(10)).toBe("th");
  });

  test("returns 'th' for 20", () => {
    expect(getOrdinalSuffix(20)).toBe("th");
  });

  test("returns 'th' for 25", () => {
    expect(getOrdinalSuffix(25)).toBe("th");
  });
});

describe("getAnniversaryYears", () => {
  // Returns 5 for a show 5 years ago
  test("returns 5 for 5-year anniversary", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-14"));
    expect(getAnniversaryYears("2021-04-14")).toBe(5);
    vi.useRealTimers();
  });

  // Returns 10 for a show 10 years ago
  test("returns 10 for 10-year anniversary", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-14"));
    expect(getAnniversaryYears("2016-04-14")).toBe(10);
    vi.useRealTimers();
  });

  // Returns 15 for a show 15 years ago
  test("returns 15 for 15-year anniversary", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-14"));
    expect(getAnniversaryYears("2011-04-14")).toBe(15);
    vi.useRealTimers();
  });

  // Returns 20 for a show 20 years ago
  test("returns 20 for 20-year anniversary", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-14"));
    expect(getAnniversaryYears("2006-04-14")).toBe(20);
    vi.useRealTimers();
  });

  // Returns 25 for a show 25 years ago
  test("returns 25 for 25-year anniversary", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-14"));
    expect(getAnniversaryYears("2001-04-14")).toBe(25);
    vi.useRealTimers();
  });

  // Returns 30 for a show 30 years ago
  test("returns 30 for 30-year anniversary", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-14"));
    expect(getAnniversaryYears("1996-04-14")).toBe(30);
    vi.useRealTimers();
  });

  // Returns null for non-multiples of 5
  test("returns null for 3-year-old show", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-14"));
    expect(getAnniversaryYears("2023-04-14")).toBeNull();
    vi.useRealTimers();
  });

  // Returns null for 7-year-old show
  test("returns null for 7-year-old show", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-14"));
    expect(getAnniversaryYears("2019-04-14")).toBeNull();
    vi.useRealTimers();
  });

  // Returns null for a show from the current year (0 years)
  test("returns null for show from current year", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-14"));
    expect(getAnniversaryYears("2026-04-14")).toBeNull();
    vi.useRealTimers();
  });

  // Returns null for a future show date
  test("returns null for future show date", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-14"));
    expect(getAnniversaryYears("2027-01-01")).toBeNull();
    vi.useRealTimers();
  });
});

describe("slugifyAnchor", () => {
  // Canonical case: a song / act / section title becomes a kebab-case
  // anchor fragment that pairs with `<element id="...">` on the same page.
  test("lowercases and joins words with single hyphens", () => {
    expect(slugifyAnchor("Hot Air Balloon")).toBe("hot-air-balloon");
  });

  // Punctuation in titles (apostrophes, periods, slashes, parens) collapses
  // to hyphens. Rock opera titles include "Spaga's Last Stand",
  // "To Be Continued...", "Tourists (Rocket Ship)" — keep them anchor-safe.
  test("collapses punctuation runs into single hyphens", () => {
    expect(slugifyAnchor("Spaga's Last Stand")).toBe("spaga-s-last-stand");
    expect(slugifyAnchor("To Be Continued...")).toBe("to-be-continued");
    expect(slugifyAnchor("Tourists (Rocket Ship)")).toBe("tourists-rocket-ship");
  });

  // Leading and trailing hyphens get trimmed so the anchor doesn't have
  // dead "-" characters (which break some smooth-scroll polyfills and look
  // ugly in URL fragments).
  test("trims leading and trailing hyphens", () => {
    expect(slugifyAnchor("!Shocked!")).toBe("shocked");
    expect(slugifyAnchor("...Quiet Storm...")).toBe("quiet-storm");
  });

  // Numbers are preserved — "Act 1", "Plan B", "JP8000" should all yield
  // anchors that read like their source titles.
  test("preserves digits", () => {
    expect(slugifyAnchor("Act 1")).toBe("act-1");
    expect(slugifyAnchor("Plan B")).toBe("plan-b");
    expect(slugifyAnchor("JP8000")).toBe("jp8000");
  });

  // All-non-alphanumeric input would collapse to a single hyphen, then
  // get trimmed to empty. Documented behavior so callers can decide
  // whether to fall back; today nothing in the codebase relies on this.
  test("returns empty string when input has no alphanumeric characters", () => {
    expect(slugifyAnchor("!!!")).toBe("");
    expect(slugifyAnchor("   ")).toBe("");
  });
});
