import { describe, expect, test } from "vitest";
import { addDaysYearAgnostic, formatMonthDay, isValidMonthDay } from "./utils";

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
