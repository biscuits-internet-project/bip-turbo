import { describe, expect, test } from "vitest";
import { hasNarrowingFilter, shouldShowNotPlayed } from "~/lib/played-filter";

const defaults = {
  playedParam: null as string | null,
  hasDateRange: false,
  hasAttendedUser: false,
  hasToggleFilters: false,
};

describe("hasNarrowingFilter", () => {
  // None of date range / attended / toggles → no narrowing happening.
  // (Cover and author are deliberately not "narrowing" — they pick which
  // songs appear but don't restrict which performances contribute to a
  // count, so they stay out of this predicate.)
  test("returns false when no narrowing input is set", () => {
    expect(hasNarrowingFilter({ hasDateRange: false, hasAttendedUser: false, hasToggleFilters: false })).toBe(false);
  });

  // Each of the three narrowing inputs is sufficient on its own. Parameterized
  // to keep the rule visible in one place if a fourth narrowing kind is added.
  test.each([
    ["hasDateRange", { hasDateRange: true, hasAttendedUser: false, hasToggleFilters: false }],
    ["hasAttendedUser", { hasDateRange: false, hasAttendedUser: true, hasToggleFilters: false }],
    ["hasToggleFilters", { hasDateRange: false, hasAttendedUser: false, hasToggleFilters: true }],
  ])("returns true when %s is set", (_label, input) => {
    expect(hasNarrowingFilter(input)).toBe(true);
  });
});

describe("shouldShowNotPlayed", () => {
  // When no played param is set, not-played filtering never activates
  // regardless of which other filters are active.
  test("returns false when playedParam is not notPlayed", () => {
    expect(shouldShowNotPlayed({ ...defaults, hasDateRange: true })).toBe(false);
  });

  // notPlayed alone isn't enough — there must be a narrowing filter that
  // defines what "played in this view" means.
  test("returns false when notPlayed but no narrowing filter is active", () => {
    expect(shouldShowNotPlayed({ ...defaults, playedParam: "notPlayed" })).toBe(false);
  });

  // Date range narrows the view to a time period, so "not played" = songs
  // not played in that period.
  test("returns true when notPlayed with date range", () => {
    expect(shouldShowNotPlayed({ ...defaults, playedParam: "notPlayed", hasDateRange: true })).toBe(true);
  });

  // Attended narrows the view to shows the user went to, so "not played" =
  // songs never played at attended shows.
  test("returns true when notPlayed with attended user", () => {
    expect(shouldShowNotPlayed({ ...defaults, playedParam: "notPlayed", hasAttendedUser: true })).toBe(true);
  });

  // Toggle filters (set opener, jam, guest, etc.) narrow the view to
  // performances matching those traits, so "not played" = songs that have
  // never had a matching performance.
  test("returns true when notPlayed with toggle filters", () => {
    expect(shouldShowNotPlayed({ ...defaults, playedParam: "notPlayed", hasToggleFilters: true })).toBe(true);
  });
});
