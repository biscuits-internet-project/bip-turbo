export type YearlyChartMode = "count" | "percent";

export type YearlyChartPoint = { year: number; value: number };

/**
 * Builds the data series for the per-year plays chart on the song detail
 * page. "count" returns raw play counts; "percent" returns plays divided
 * by the total shows played that year, smoothing tour-volume variance.
 */
/**
 * Returns a copy of `yearlyPlayData` extended to cover every year in
 * [start, end], with missing years filled as 0. Keys outside the requested
 * range are preserved untouched. Output keys are normalized to numbers.
 */
export function expandYearlyDataToRange(
  yearlyPlayData: Record<number, number>,
  start: number,
  end: number,
): Record<number, number> {
  const result: Record<number, number> = {};
  for (const [yearKey, plays] of Object.entries(yearlyPlayData)) {
    result[Number.parseInt(yearKey, 10)] = plays;
  }
  for (let year = start; year <= end; year++) {
    if (result[year] === undefined) result[year] = 0;
  }
  return result;
}

/**
 * Returns a copy of `yearlyPlayData` covering every year from the song's
 * earliest played year to its latest, with zero-fills for years it skipped.
 * Keeps the chart's X axis continuous instead of compressing skipped years
 * into adjacent ticks.
 */
export function expandPlayedYears(yearlyPlayData: Record<number, number>): Record<number, number> {
  const years = Object.keys(yearlyPlayData).map((y) => Number.parseInt(y, 10));
  if (years.length === 0) return {};
  return expandYearlyDataToRange(yearlyPlayData, Math.min(...years), Math.max(...years));
}

export function buildYearlyChartData(
  yearlyPlayData: Record<number, number>,
  showsByYear: Record<number, number>,
  mode: YearlyChartMode,
): YearlyChartPoint[] {
  return Object.entries(yearlyPlayData)
    .map(([yearKey, plays]) => {
      const year = Number.parseInt(yearKey, 10);
      if (mode === "count") return { year, value: plays };
      const denominator = showsByYear[year] ?? 0;
      return { year, value: denominator > 0 ? plays / denominator : 0 };
    })
    .sort((a, b) => a.year - b.year);
}
