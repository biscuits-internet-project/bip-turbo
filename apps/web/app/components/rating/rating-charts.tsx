import type { RatingYearBucket } from "@bip/core";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartTooltipCard } from "~/components/ui/chart-tooltip";
import { SegmentButton } from "~/components/ui/segment-button";
import { CHART_BAR_CURSOR, CHART_COLORS, chartSeriesColor } from "~/lib/chart-colors";
import {
  availableYears,
  buildAverageMedianByYear,
  buildHistogramData,
  type HistogramMode,
  histogramYAxisConfig,
} from "~/lib/rating-charts";
import { START_YEAR } from "~/lib/song-filters";
import { cn } from "~/lib/utils";

interface RatingChartsProps {
  buckets: RatingYearBucket[];
  kind: "show" | "track";
}

/**
 * Charts view for a profile's rating tabs. Derives an all-time / per-year
 * star-value histogram and an average-vs-median trend line from the
 * aggregate bucket set, so the same component serves show and track ratings.
 * Renders nothing when there are no ratings — the tab's existing empty-state
 * card covers that case.
 */
export function RatingCharts({ buckets, kind }: RatingChartsProps) {
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [histogramMode, setHistogramMode] = useState<HistogramMode>("percent");
  if (buckets.length === 0) return null;

  const years = availableYears(buckets);
  const { series, data, seriesTotals } = buildHistogramData(buckets, selectedYears, histogramMode);
  // Always span the full band era so the trend's x-axis is consistent across
  // users and years with no ratings read as genuine gaps, not skipped.
  const trend = buildAverageMedianByYear(buckets, { start: START_YEAR, end: new Date().getFullYear() });
  const noun = kind === "show" ? "Show" : "Song Version";
  const isPercent = histogramMode === "percent";

  function toggleYear(year: number) {
    setSelectedYears((current) =>
      current.includes(year) ? current.filter((value) => value !== year) : [...current, year],
    );
  }

  const comparing = selectedYears.length > 0;

  // Pin the y-axis to a tight scale sized to the tallest bar (percent
  // fractions or integer counts), so columns fill the panel and a sparse
  // year doesn't get a stranded or fractional axis.
  const plottedMax = data.reduce((max, row) => series.reduce((m, key) => Math.max(m, row[key] as number), max), 0);
  const yAxis = histogramYAxisConfig(isPercent, plottedMax);

  return (
    <div className="space-y-4">
      <div className="glass-content rounded-lg p-6">
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <h3 className="text-lg font-semibold text-content-text-primary">{noun} Rating Distribution</h3>
          <fieldset className="flex border-0 p-0 m-0">
            <legend className="sr-only">Distribution units</legend>
            <SegmentButton size="md" active={!isPercent} onClick={() => setHistogramMode("count")}>
              Count
            </SegmentButton>
            <SegmentButton size="md" active={isPercent} onClick={() => setHistogramMode("percent")}>
              Percent
            </SegmentButton>
          </fieldset>
        </div>
        <fieldset className="flex flex-wrap gap-2 mb-4 border-0 p-0 m-0">
          <legend className="sr-only">Filter distribution by year</legend>
          <YearChip active={!comparing} onClick={() => setSelectedYears([])}>
            All Years
          </YearChip>
          {years.map((year) => (
            <YearChip key={year} active={selectedYears.includes(year)} onClick={() => toggleYear(year)}>
              {year}
            </YearChip>
          ))}
        </fieldset>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {/* Key on the series set so adding/removing a year remounts the
                bars: recharts dodges grouped bars by registration order, not
                declaration order, so without a remount a year added later
                lands on the right instead of its sorted slot. */}
            <BarChart key={series.join("-")} data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} opacity={0.3} />
              <XAxis dataKey="label" stroke={CHART_COLORS.axis} fontSize={12} />
              <YAxis
                stroke={CHART_COLORS.axis}
                fontSize={12}
                allowDecimals={yAxis.allowDecimals}
                domain={yAxis.domain}
                ticks={yAxis.ticks}
                tickFormatter={isPercent ? (value: number) => `${Math.round(value * 100)}%` : undefined}
              />
              <Tooltip
                content={<HistogramTooltip comparing={comparing} isPercent={isPercent} seriesTotals={seriesTotals} />}
                cursor={CHART_BAR_CURSOR}
                isAnimationActive={false}
              />
              {comparing && <Legend />}
              {series.map((key, index) => (
                <Bar key={key} dataKey={key} name={key} fill={chartSeriesColor(index)} radius={[2, 2, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-content rounded-lg p-6">
        <h3 className="text-lg font-semibold text-content-text-primary mb-4">Average &amp; Median by Year</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} opacity={0.3} />
              <XAxis dataKey="year" stroke={CHART_COLORS.axis} fontSize={12} />
              <YAxis stroke={CHART_COLORS.axis} fontSize={12} domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} />
              <Tooltip content={<TrendTooltip />} isAnimationActive={false} />
              <Legend />
              <Line
                type="monotone"
                dataKey="average"
                name="Average"
                stroke={chartSeriesColor(0)}
                strokeWidth={2}
                dot={{ fill: chartSeriesColor(0), strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="median"
                name="Median"
                stroke={chartSeriesColor(1)}
                strokeWidth={2}
                strokeDasharray="5 4"
                dot={{ fill: chartSeriesColor(1), strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

interface YearChipProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function YearChip({ active, onClick, children }: YearChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "px-2.5 py-1 text-xs font-medium rounded-full border transition-colors cursor-pointer",
        active
          ? "border-brand-primary bg-brand-primary/15 text-content-text-primary"
          : "border-content-glass-border text-content-text-tertiary hover:text-content-text-secondary",
      )}
    >
      {children}
    </button>
  );
}

interface TooltipEntry {
  name?: string;
  value?: number;
  color?: string;
  dataKey?: string;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: number | string;
}

/**
 * Histogram tooltip: shows the hovered star value and, per series, both the
 * rating count and its share of that series' total — so the user sees both
 * dimensions regardless of which units the chart is currently drawing. When
 * comparing years, each selected year gets its own line.
 */
function HistogramTooltip({
  active,
  payload,
  label,
  comparing,
  isPercent,
  seriesTotals,
}: ChartTooltipProps & { comparing: boolean; isPercent: boolean; seriesTotals: Record<string, number> }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <ChartTooltipCard>
      <div className="font-medium">{label} stars</div>
      {payload.map((entry) => {
        const key = entry.dataKey ?? "";
        const total = seriesTotals[key] ?? 0;
        const raw = entry.value ?? 0;
        const count = isPercent ? Math.round(raw * total) : raw;
        const fraction = total > 0 ? count / total : 0;
        const ratingsLabel = count === 1 ? "rating" : "ratings";
        return (
          <div key={key || entry.name}>
            {comparing ? <span style={{ color: entry.color }}>{entry.name}: </span> : null}
            {count} {ratingsLabel}
            <span className="text-content-text-tertiary"> · {(fraction * 100).toFixed(1)}%</span>
          </div>
        );
      })}
    </ChartTooltipCard>
  );
}

/** Trend tooltip: average and median for the hovered concert year. */
function TrendTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <ChartTooltipCard>
      <div className="font-medium">{label}</div>
      {payload.map((entry) => (
        <div key={entry.dataKey ?? entry.name} style={{ color: entry.color }}>
          {entry.name}: {(entry.value ?? 0).toFixed(2)}
        </div>
      ))}
    </ChartTooltipCard>
  );
}
