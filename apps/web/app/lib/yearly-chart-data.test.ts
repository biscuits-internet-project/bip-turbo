import { describe, expect, test } from "vitest";
import { buildYearlyChartData, expandPlayedYears, expandYearlyDataToRange } from "./yearly-chart-data";

describe("buildYearlyChartData", () => {
  // Each point carries `count` and `percent` alongside `value` so the chart's
  // tooltip can show BOTH metrics regardless of which toggle is active. The
  // `value` field still drives the visible line series. Count mode points
  // `value` at the raw count; percent mode points it at the 0-1 decimal.
  test("count mode returns sorted points with value=count and full count+percent fields", () => {
    const yearlyPlayData = { 2010: 12, 2008: 5, 2012: 8 };
    const showsByYear = { 2008: 50, 2010: 60, 2012: 80 };

    const result = buildYearlyChartData(yearlyPlayData, showsByYear, "count");

    expect(result).toEqual([
      { year: 2008, value: 5, count: 5, percent: 0.1 },
      { year: 2010, value: 12, count: 12, percent: 0.2 },
      { year: 2012, value: 8, count: 8, percent: 0.1 },
    ]);
  });

  // Percent mode: value tracks the normalized decimal. count and percent are
  // populated identically to count mode so the tooltip can pull both. "Above
  // the Waves" is the kind of song where normalization tells a different
  // story than raw counts.
  test("percent mode returns value=percent with count+percent both populated", () => {
    const yearlyPlayData = { 2008: 5, 2010: 14 };
    const showsByYear = { 2008: 50, 2010: 70 };

    const result = buildYearlyChartData(yearlyPlayData, showsByYear, "percent");

    expect(result).toEqual([
      { year: 2008, value: 0.1, count: 5, percent: 0.1 },
      { year: 2010, value: 0.2, count: 14, percent: 0.2 },
    ]);
  });

  // Defensive: missing or zero `showsByYear[year]` keeps `percent` at 0
  // rather than NaN or Infinity. count is unaffected by the denominator. The
  // tooltip uses this to suppress the percent line when the denominator is
  // missing — confirmed by the chart's tooltip render behavior.
  test("missing or zero showsByYear[year] keeps percent at 0; count still reflects raw plays", () => {
    const yearlyPlayData = { 2010: 5, 2011: 3, 2012: 7 };
    const showsByYear = { 2010: 50, 2011: 0 }; // 2011 zero, 2012 absent

    const countResult = buildYearlyChartData(yearlyPlayData, showsByYear, "count");
    const percentResult = buildYearlyChartData(yearlyPlayData, showsByYear, "percent");

    expect(countResult).toEqual([
      { year: 2010, value: 5, count: 5, percent: 0.1 },
      { year: 2011, value: 3, count: 3, percent: 0 },
      { year: 2012, value: 7, count: 7, percent: 0 },
    ]);
    expect(percentResult).toEqual([
      { year: 2010, value: 0.1, count: 5, percent: 0.1 },
      { year: 2011, value: 0, count: 3, percent: 0 },
      { year: 2012, value: 0, count: 7, percent: 0 },
    ]);
  });

  // Empty input: a song that has never been played has no yearly data. The
  // helper should produce an empty array, not throw and not return a
  // sentinel year.
  test("empty yearlyPlayData returns empty array in either mode", () => {
    expect(buildYearlyChartData({}, {}, "count")).toEqual([]);
    expect(buildYearlyChartData({}, { 2010: 50 }, "percent")).toEqual([]);
  });

  // The composer ships year keys as strings (Object.keys / Record<number,
  // number> are stringified in JS). The helper must coerce keys to numbers
  // so the chart's XAxis numeric ordering works.
  test("string year keys are coerced to numbers", () => {
    const yearlyPlayData = { "2010": 12, "2008": 5 } as unknown as Record<number, number>;
    const result = buildYearlyChartData(yearlyPlayData, { 2008: 50, 2010: 70 }, "count");

    expect(result[0].year).toBe(2008);
    expect(typeof result[0].year).toBe("number");
  });
});

describe("expandYearlyDataToRange", () => {
  // The "All Years" toggle on the chart needs every year in the band's
  // touring window represented, even years where the song wasn't played, so
  // the X axis scale is consistent across songs. Missing years fill in as
  // 0 plays.
  test("fills missing years in [start, end] with 0 plays", () => {
    const yearlyPlayData = { 2010: 5, 2012: 3 };

    const expanded = expandYearlyDataToRange(yearlyPlayData, 2009, 2013);

    expect(expanded).toEqual({ 2009: 0, 2010: 5, 2011: 0, 2012: 3, 2013: 0 });
  });

  // Years already populated must not be clobbered by the zero-fill. Pins
  // the precedence: existing data wins over the default.
  test("preserves existing year values when filling", () => {
    const yearlyPlayData = { 2010: 17 };
    const expanded = expandYearlyDataToRange(yearlyPlayData, 2010, 2010);
    expect(expanded).toEqual({ 2010: 17 });
  });

  // Years OUTSIDE the requested range stay in the result. Important
  // because the song's earliest play might predate START_YEAR (rare but
  // possible for legacy entries) — we never want to silently drop them.
  test("keeps years outside [start, end] in the result", () => {
    const yearlyPlayData = { 1990: 2, 2010: 5 };
    const expanded = expandYearlyDataToRange(yearlyPlayData, 2009, 2011);
    expect(expanded).toEqual({ 1990: 2, 2009: 0, 2010: 5, 2011: 0 });
  });

  // Edge: empty input + range produces a fully-zero map. Lets the chart
  // render a flat line for songs that haven't been played in the window.
  test("empty input and a range produces all-zero years", () => {
    expect(expandYearlyDataToRange({}, 2008, 2010)).toEqual({ 2008: 0, 2009: 0, 2010: 0 });
  });

  // String year keys (the JSON-serialized shape from the loader) are
  // coerced to numbers so callers can hand the result back into
  // buildYearlyChartData without a second normalization pass.
  test("normalizes string year keys to numbers in the output", () => {
    const yearlyPlayData = { "2010": 5 } as unknown as Record<number, number>;
    const expanded = expandYearlyDataToRange(yearlyPlayData, 2010, 2011);

    expect(expanded[2010]).toBe(5);
    expect(expanded[2011]).toBe(0);
  });
});

describe("expandPlayedYears", () => {
  // The "Years Played" view of the chart shows the range from the song's
  // earliest play to its latest, with zero-fills for years it skipped in
  // between. Keeps the X axis continuous so a chart for "Triumph" played
  // in 2008 and 2012 doesn't visually compress 2008 → 2012 into adjacent
  // ticks. The min/max are derived from the keys of yearlyPlayData.
  test("zero-fills years between the earliest and latest played years", () => {
    const yearlyPlayData = { 2008: 3, 2012: 5 };
    expect(expandPlayedYears(yearlyPlayData)).toEqual({ 2008: 3, 2009: 0, 2010: 0, 2011: 0, 2012: 5 });
  });

  // No surprises when the song was played in every consecutive year — the
  // expansion is a no-op for already-dense data.
  test("returns the same data when years are already consecutive", () => {
    const yearlyPlayData = { 2010: 3, 2011: 5, 2012: 7 };
    expect(expandPlayedYears(yearlyPlayData)).toEqual({ 2010: 3, 2011: 5, 2012: 7 });
  });

  // A never-played song has no earliest/latest year. The function returns
  // an empty map rather than throwing on Math.min/max of an empty array.
  test("returns empty map when yearlyPlayData is empty", () => {
    expect(expandPlayedYears({})).toEqual({});
  });

  // Single-year case: min === max, so the result is exactly the input.
  test("single-year input returns just that year", () => {
    expect(expandPlayedYears({ 2015: 4 })).toEqual({ 2015: 4 });
  });
});
