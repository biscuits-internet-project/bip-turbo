import { describe, expect, test } from "vitest";
import { matchesDateRange } from "./song-filters";

describe("matchesDateRange", () => {
  // A date that falls between startDate and endDate matches. This is the
  // common case for year and era filters.
  test("returns true when date is within the range", () => {
    expect(
      matchesDateRange("2024-06-15", {
        label: "2024",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-12-31"),
      }),
    ).toBe(true);
  });

  // A date before the range's startDate does not match.
  test("returns false when date is before startDate", () => {
    expect(
      matchesDateRange("2023-12-31", {
        label: "2024",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-12-31"),
      }),
    ).toBe(false);
  });

  // A date after the range's endDate does not match.
  test("returns false when date is after endDate", () => {
    expect(
      matchesDateRange("2025-01-01", {
        label: "2024",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-12-31"),
      }),
    ).toBe(false);
  });

  // Some eras have no startDate (e.g., the Sammy era starts from the
  // beginning of the band). Any date before the endDate matches.
  test("matches any date before endDate when startDate is undefined", () => {
    expect(
      matchesDateRange("1995-01-01", {
        label: "Sammy Era",
        endDate: new Date("2005-08-27"),
      }),
    ).toBe(true);

    expect(
      matchesDateRange("2006-01-01", {
        label: "Sammy Era",
        endDate: new Date("2005-08-27"),
      }),
    ).toBe(false);
  });

  // Some eras have no endDate (e.g., the current era extends to the present
  // and future). Any date after the startDate matches.
  test("matches any date after startDate when endDate is undefined", () => {
    expect(
      matchesDateRange("2026-01-01", {
        label: "Marlon Era",
        startDate: new Date("2025-10-31"),
      }),
    ).toBe(true);

    expect(
      matchesDateRange("2025-01-01", {
        label: "Marlon Era",
        startDate: new Date("2025-10-31"),
      }),
    ).toBe(false);
  });
});
