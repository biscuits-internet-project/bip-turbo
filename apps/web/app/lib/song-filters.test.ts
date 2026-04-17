import { describe, expect, test } from "vitest";
import { SONG_FILTERS, getTimeRangeParam, TIME_RANGE_GROUPS } from "./song-filters";

describe("TIME_RANGE_GROUPS", () => {
  // The groups should be ordered: Recent, Eras, Years — matching the
  // visual layout in the Time Range dropdown.
  test("has three groups: Recent, Eras, Years", () => {
    expect(TIME_RANGE_GROUPS).toHaveLength(3);
    expect(TIME_RANGE_GROUPS[0].label).toBe("Recent");
    expect(TIME_RANGE_GROUPS[1].label).toBe("Eras");
    expect(TIME_RANGE_GROUPS[2].label).toBe("Years");
  });

  // Recent group provides quick-access presets for commonly browsed time ranges.
  test("Recent group contains Last 10 Shows and This Year", () => {
    const recent = TIME_RANGE_GROUPS[0];
    expect(recent.options).toHaveLength(2);
    expect(recent.options[0]).toEqual({ value: "last10shows", label: "Last 10 Shows" });
    expect(recent.options[1]).toEqual({ value: "thisYear", label: "This Year" });
  });

  // Eras group contains all band personnel eras.
  test("Eras group contains all 4 eras", () => {
    const eras = TIME_RANGE_GROUPS[1];
    expect(eras.options).toHaveLength(4);
    const eraValues = eras.options.map((o) => o.value);
    expect(eraValues).toContain("marlon");
    expect(eraValues).toContain("allen");
    expect(eraValues).toContain("sammy");
    expect(eraValues).toContain("triscuits");
  });

  // Years group should span from 1995 to the current year, newest first.
  test("Years group contains years from current year down to 1995", () => {
    const years = TIME_RANGE_GROUPS[2];
    const currentYear = new Date().getFullYear();
    expect(years.options[0].value).toBe(String(currentYear));
    expect(years.options[years.options.length - 1].value).toBe("1995");
    expect(years.options).toHaveLength(currentYear - 1995 + 1);
  });
});

describe("SONG_FILTERS", () => {
  // thisYear should resolve to the current year's date range.
  test("thisYear resolves to current year date range", () => {
    const currentYear = new Date().getFullYear();
    const thisYear = SONG_FILTERS.thisYear;
    expect(thisYear).toBeDefined();
    expect(thisYear.startDate).toEqual(new Date(`${currentYear}-01-01`));
    expect(thisYear.endDate).toEqual(new Date(`${currentYear}-12-31`));
  });

  // Existing year and era keys should still resolve correctly.
  test("existing year keys still resolve to date ranges", () => {
    expect(SONG_FILTERS["2024"]).toBeDefined();
    expect(SONG_FILTERS["2024"].startDate).toEqual(new Date("2024-01-01"));
    expect(SONG_FILTERS["2024"].endDate).toEqual(new Date("2024-12-31"));
  });

  test("existing era keys still resolve to date ranges", () => {
    expect(SONG_FILTERS.sammy).toBeDefined();
    expect(SONG_FILTERS.sammy.endDate).toEqual(new Date("2005-08-27"));
  });
});

describe("getTimeRangeParam", () => {
  // The primary param name for time-based filtering.
  test("returns timeRange param when present", () => {
    const params = new URLSearchParams("timeRange=2024");
    expect(getTimeRangeParam(params)).toBe("2024");
  });

  // Legacy year param is accepted for bookmarked URLs.
  test("falls back to year param when timeRange is absent", () => {
    const params = new URLSearchParams("year=2024");
    expect(getTimeRangeParam(params)).toBe("2024");
  });

  // Legacy era param is accepted for bookmarked URLs.
  test("falls back to era param when timeRange and year are absent", () => {
    const params = new URLSearchParams("era=sammy");
    expect(getTimeRangeParam(params)).toBe("sammy");
  });

  // timeRange takes priority over year/era if multiple are somehow present.
  test("prefers timeRange over year and era", () => {
    const params = new URLSearchParams("timeRange=last10shows&year=2024&era=sammy");
    expect(getTimeRangeParam(params)).toBe("last10shows");
  });

  // Returns null when no time-related params are set.
  test("returns null when no time params are present", () => {
    const params = new URLSearchParams("cover=original");
    expect(getTimeRangeParam(params)).toBeNull();
  });
});
