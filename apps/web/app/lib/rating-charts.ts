import type { RatingYearBucket } from "@bip/core";
import { formatHalfStep } from "~/components/rating/rating";

/**
 * The 0.5-step star values a rating can take, low to high. The histogram
 * always renders all ten so empty buckets read as genuine gaps rather than
 * a compressed axis.
 */
export const RATING_BUCKETS = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5] as const;

/** Series key used for the combined, all-years histogram. */
export const ALL_YEARS_SERIES = "all";

/** Histogram y-axis units: raw rating counts, or each series' share of its own total. */
export type HistogramMode = "count" | "percent";

export interface HistogramData {
  /** Recharts series keys to draw: `["all"]` combined, else one per year. */
  series: string[];
  /**
   * One row per bucket value; each series key maps to that bucket's count, or
   * its fraction (0–1) of the series total when mode is "percent".
   */
  data: Array<{ value: number; label: string } & Record<string, number | string>>;
  /**
   * Total rating count per series key. Lets the tooltip recover the raw count
   * from a percent bar (and the percent from a count bar) so it can always
   * show both, regardless of the active units.
   */
  seriesTotals: Record<string, number>;
}

export interface AverageMedianPoint {
  year: number;
  /** null for a year in the spanned range that has no ratings (line breaks there). */
  average: number | null;
  median: number | null;
}

function inSelectedYears(bucket: RatingYearBucket, years: number[]): boolean {
  return years.length === 0 || years.includes(bucket.year);
}

/**
 * Build histogram rows for Recharts. With no years selected, one combined
 * "all" series sums every year; with years selected, one series per year so
 * the bars sit side by side for comparison. Every bucket value appears in
 * every row (zero-filled) so the x-axis is stable as the selection changes.
 *
 * In "percent" mode each value is divided by its own series total, so a
 * year that was rated more often doesn't dwarf a lighter year — the bars
 * compare shape, not volume.
 */
export function buildHistogramData(
  buckets: RatingYearBucket[],
  selectedYears: number[],
  mode: HistogramMode = "count",
): HistogramData {
  const series = selectedYears.length === 0 ? [ALL_YEARS_SERIES] : [...selectedYears].sort((a, b) => a - b).map(String);

  const data = RATING_BUCKETS.map((value) => {
    const row: { value: number; label: string } & Record<string, number | string> = {
      value,
      label: formatHalfStep(value),
    };
    for (const key of series) {
      row[key] = 0;
    }
    return row;
  });

  const rowByValue = new Map(data.map((row) => [row.value, row]));
  for (const bucket of buckets) {
    if (!inSelectedYears(bucket, selectedYears)) continue;
    const row = rowByValue.get(bucket.value);
    if (!row) continue; // value outside the 0.5-step grid; ignore defensively
    const key = selectedYears.length === 0 ? ALL_YEARS_SERIES : String(bucket.year);
    row[key] = (row[key] as number) + bucket.count;
  }

  const seriesTotals: Record<string, number> = {};
  for (const key of series) {
    seriesTotals[key] = data.reduce((sum, row) => sum + (row[key] as number), 0);
  }

  if (mode === "percent") {
    for (const key of series) {
      const total = seriesTotals[key];
      if (total === 0) continue;
      for (const row of data) {
        row[key] = (row[key] as number) / total;
      }
    }
  }

  return { series, data, seriesTotals };
}

// Round percentage gridline steps, finest first.
const PERCENT_AXIS_STEPS = [0.05, 0.1, 0.2, 0.25, 0.5];
const PERCENT_AXIS_MAX_TICKS = 7;

function percentCeiling(maxFraction: number, step: number): number {
  // Next step multiple strictly above the tallest bar, so a bar that lands
  // exactly on a tick (e.g. two ratings split 50/50) still gets headroom
  // instead of clipping the top edge. Capped at 100%; a flat/empty chart
  // still draws one step.
  return Math.min(1, (Math.floor(maxFraction / step + 1e-9) + 1) * step);
}

/**
 * Y-axis ticks for the percent histogram: a "nice ticks" scale sized to the
 * tallest bar so columns fill the panel (~80–98% height) with a little
 * headroom, instead of hugging the floor under a fixed 100% axis or clipping
 * the top edge. Picks the finest round step (5/10/20/25/50%) that keeps the
 * gridline count sane, so the common range stays on 10% steps (a 56%-tall
 * sparse-year bar reads on the same 10% grid as the all-years view) and only
 * widens to 20%+ once a tall axis would otherwise crowd.
 */
export function percentAxisTicks(maxFraction: number): number[] {
  const step =
    PERCENT_AXIS_STEPS.find(
      (candidate) => percentCeiling(maxFraction, candidate) / candidate <= PERCENT_AXIS_MAX_TICKS - 1 + 1e-9,
    ) ?? PERCENT_AXIS_STEPS[PERCENT_AXIS_STEPS.length - 1];
  const ceiling = percentCeiling(maxFraction, step);
  const ticks: number[] = [];
  for (let tick = 0; tick <= ceiling + 1e-9; tick += step) {
    ticks.push(Math.round(tick * 100) / 100);
  }
  return ticks;
}

/**
 * Integer y-axis ticks for the count histogram. Uses a 1-2-5 step sized to
 * keep the gridline count under ~7, with the ceiling snapped tight to the
 * tallest bar. Explicit ticks because recharts' own integer auto-scale
 * inflates a small max (a 1-rating year would draw a 0–4 axis to fit five
 * ticks, stranding the bar at a quarter height).
 */
export function countAxisTicks(maxCount: number): number[] {
  if (maxCount <= 0) return [0, 1];
  let step = 1;
  for (let magnitude = 1; ; magnitude *= 10) {
    const candidate = [1, 2, 5].map((base) => base * magnitude).find((s) => Math.ceil(maxCount / s) <= 6);
    if (candidate) {
      step = candidate;
      break;
    }
  }
  const ceiling = Math.ceil(maxCount / step) * step;
  const ticks: number[] = [];
  for (let tick = 0; tick <= ceiling; tick += step) {
    ticks.push(tick);
  }
  return ticks;
}

export interface HistogramYAxisConfig {
  allowDecimals: boolean;
  domain: [number, number];
  ticks: number[];
}

/**
 * Y-axis props for the distribution histogram. Both modes pin an explicit
 * tight scale so a sparse year reads cleanly: count mode uses integer
 * gridlines (no fractional "0.5 rating" ticks, no inflated headroom), percent
 * mode uses the nice-tick fraction scale from `percentAxisTicks`.
 */
export function histogramYAxisConfig(isPercent: boolean, plottedMax: number): HistogramYAxisConfig {
  const ticks = isPercent ? percentAxisTicks(plottedMax) : countAxisTicks(plottedMax);
  return { allowDecimals: isPercent, domain: [0, ticks[ticks.length - 1]], ticks };
}

/**
 * Weighted median of discrete value/count pairs without materializing the
 * underlying rows. Walks the sorted buckets to the two middle positions and
 * averages them — so an even total straddling two buckets returns their
 * midpoint (e.g. counts split evenly across 3 and 4 → 3.5).
 */
function weightedMedian(pairs: Array<{ value: number; count: number }>): number {
  const total = pairs.reduce((sum, pair) => sum + pair.count, 0);
  if (total === 0) return 0;
  const sorted = [...pairs].sort((a, b) => a.value - b.value);
  const lowerPosition = Math.floor((total + 1) / 2);
  const upperPosition = Math.ceil((total + 1) / 2);

  let cumulative = 0;
  let lowerValue: number | null = null;
  let upperValue: number | null = null;
  for (const pair of sorted) {
    cumulative += pair.count;
    if (lowerValue === null && cumulative >= lowerPosition) lowerValue = pair.value;
    if (upperValue === null && cumulative >= upperPosition) {
      upperValue = pair.value;
      break;
    }
  }
  return ((lowerValue ?? 0) + (upperValue ?? 0)) / 2;
}

/**
 * Per-concert-year average and weighted median rating for the trend line.
 * Both summarize the same per-year buckets so a user can see mean vs. median
 * drift apart when their ratings skew.
 *
 * Without a range, returns only the years that have ratings. With a range,
 * emits one point per year across the whole span (widened if needed so no
 * data year is dropped) — years with no ratings get null average/median, so
 * the x-axis always covers the full era and the line breaks over empty years.
 */
export function buildAverageMedianByYear(
  buckets: RatingYearBucket[],
  range?: { start: number; end: number },
): AverageMedianPoint[] {
  const byYear = new Map<number, Array<{ value: number; count: number }>>();
  for (const bucket of buckets) {
    const list = byYear.get(bucket.year) ?? [];
    list.push({ value: bucket.value, count: bucket.count });
    byYear.set(bucket.year, list);
  }

  const statByYear = new Map<number, { average: number; median: number }>();
  for (const [year, pairs] of byYear) {
    const total = pairs.reduce((sum, pair) => sum + pair.count, 0);
    const weightedSum = pairs.reduce((sum, pair) => sum + pair.value * pair.count, 0);
    statByYear.set(year, { average: total === 0 ? 0 : weightedSum / total, median: weightedMedian(pairs) });
  }

  if (!range) {
    return [...statByYear.entries()].sort(([a], [b]) => a - b).map(([year, stat]) => ({ year, ...stat }));
  }

  const dataYears = [...statByYear.keys()];
  const start = Math.min(range.start, ...dataYears);
  const end = Math.max(range.end, ...dataYears);
  const points: AverageMedianPoint[] = [];
  for (let year = start; year <= end; year++) {
    const stat = statByYear.get(year);
    points.push({ year, average: stat?.average ?? null, median: stat?.median ?? null });
  }
  return points;
}

/** Distinct concert years present in the buckets, earliest first (left-to-right chip order). */
export function availableYears(buckets: RatingYearBucket[]): number[] {
  return [...new Set(buckets.map((bucket) => bucket.year))].sort((a, b) => a - b);
}
