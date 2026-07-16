import type { RatingValueBucket } from "@bip/core";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltipCard } from "~/components/ui/chart-tooltip";
import { usePreferences } from "~/hooks/use-preferences";
import { CHART_BAR_CURSOR, CHART_COLORS } from "~/lib/chart-colors";
import { ALL_YEARS_SERIES, buildHistogramData, histogramYAxisConfig, RATING_BUCKETS } from "~/lib/rating-charts";
import { ratingColor } from "~/lib/rating-colors";

interface RatingDistributionChartProps {
  buckets: RatingValueBucket[];
  /**
   * Tighter height + margins for the in-overlay variant (per-track hover
   * panel) vs. the roomier right-rail card. Defaults to the rail size.
   */
  compact?: boolean;
  /**
   * Suppress the built-in "Rating distribution · N ratings" header. The
   * right-rail card supplies its own collapsible header, so it hides this
   * one to avoid a duplicate title; the per-track overlay keeps it.
   */
  hideHeader?: boolean;
}

/**
 * Single rateable's rating distribution as a 10-bar histogram (0.5–5 in
 * half steps). Drives the show-level right-rail card and the per-track
 * overlay from the same `{ value, count }` buckets. Renders nothing when
 * nothing has been rated — callers don't have to guard the empty case.
 *
 * Reuses the profile charts' `buildHistogramData` (with no year selection,
 * so it collapses to a single all-time series) and `histogramYAxisConfig`
 * so the axis scaling and zero-fill stay identical across every histogram.
 */
export function RatingDistributionChart({
  buckets,
  compact = false,
  hideHeader = false,
}: RatingDistributionChartProps) {
  // buildHistogramData is year-aware; this chart has no year axis, so stamp
  // every bucket with a single sentinel year and read back the combined
  // all-years series it produces.
  const yearless = buckets.map((bucket) => ({ year: 0, value: bucket.value, count: bucket.count }));
  const { data, seriesTotals } = buildHistogramData(yearless, [], "count");
  const total = seriesTotals[ALL_YEARS_SERIES] ?? 0;
  if (total === 0) return null;

  const max = data.reduce((highest, row) => Math.max(highest, row[ALL_YEARS_SERIES] as number), 0);
  const yAxis = histogramYAxisConfig(false, max);
  const height = compact ? "h-28" : "h-44";

  return (
    <div>
      {!hideHeader && (
        <div className="flex items-center justify-between mb-2 gap-2">
          <h4 className="text-sm font-semibold text-content-text-primary">Rating distribution</h4>
          <span className="text-xs text-content-text-tertiary">
            {total} {total === 1 ? "rating" : "ratings"}
          </span>
        </div>
      )}
      <div className={height}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="12%">
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} opacity={0.3} />
            <XAxis
              dataKey="label"
              stroke={CHART_COLORS.axis}
              fontSize={compact ? 10 : 12}
              tick={<RatingAxisTick fontSize={compact ? 10 : 12} />}
            />
            <YAxis
              stroke={CHART_COLORS.axis}
              fontSize={compact ? 10 : 12}
              allowDecimals={false}
              domain={yAxis.domain}
              ticks={yAxis.ticks}
              width={30}
            />
            <Tooltip
              content={<RatingHistogramTooltip total={total} />}
              cursor={CHART_BAR_CURSOR}
              isAnimationActive={false}
            />
            {/* Skip the grow-in animation in the compact (popup) variant —
                bars animating every time the hover panel opens reads as
                jittery; the roomier rail card still animates on mount. */}
            <Bar
              dataKey={ALL_YEARS_SERIES}
              fill={CHART_COLORS.accent}
              radius={[2, 2, 0, 0]}
              isAnimationActive={!compact}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

interface RatingAxisTickProps {
  /** Injected by recharts when this element is passed as `tick`. */
  x?: number;
  y?: number;
  payload?: { value?: string | number; index?: number };
  fontSize?: number;
}

/**
 * X-axis tick that renders each star value in the color that value carries
 * everywhere else, so the axis doubles as a legend for the rating color scale
 * without spending any layout on one.
 *
 * Recovers the numeric rating from `payload.index` rather than the tick label,
 * because the axis is keyed on the formatted glyph ("3½") and the color is a
 * function of the number. The histogram always renders all of RATING_BUCKETS,
 * zero-filled, so row index and bucket index line up.
 */
export function RatingAxisTick({ x, y, payload, fontSize }: RatingAxisTickProps) {
  const { colorCodeRatings } = usePreferences();
  const value = payload?.index === undefined ? undefined : RATING_BUCKETS[payload.index];
  const fill = colorCodeRatings && value !== undefined ? ratingColor(value) : CHART_COLORS.axis;
  return (
    <text x={x} y={y} dy={10} textAnchor="middle" fontSize={fontSize} fill={fill}>
      {payload?.value}
    </text>
  );
}

interface RatingHistogramTooltipProps {
  active?: boolean;
  payload?: Array<{ value?: number; dataKey?: string }>;
  label?: number | string;
  /** Sample size, so the tooltip can show each bar's share of the whole. */
  total: number;
}

/**
 * Histogram tooltip: the hovered star value plus its rating count and the
 * share of all ratings that count represents, so volume and proportion read
 * together regardless of the chart's units.
 */
export function RatingHistogramTooltip({ active, payload, label, total }: RatingHistogramTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const count = payload[0]?.value ?? 0;
  const fraction = total > 0 ? count / total : 0;
  return (
    <ChartTooltipCard>
      <div className="font-medium">{label} stars</div>
      <div>
        {count} {count === 1 ? "rating" : "ratings"}
        <span className="text-content-text-tertiary"> · {(fraction * 100).toFixed(1)}%</span>
      </div>
    </ChartTooltipCard>
  );
}
