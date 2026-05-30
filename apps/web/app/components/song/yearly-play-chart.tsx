import { useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltipCard } from "~/components/ui/chart-tooltip";
import { SegmentButton } from "~/components/ui/segment-button";
import { CHART_COLORS } from "~/lib/chart-colors";
import { START_YEAR } from "~/lib/song-filters";
import {
  buildYearlyChartData,
  expandPlayedYears,
  expandYearlyDataToRange,
  type YearlyChartMode,
} from "~/lib/yearly-chart-data";

type YearScope = "played" | "all";

interface YearlyPlayChartProps {
  yearlyPlayData: Record<number, number>;
  showsByYear: Record<number, number>;
}

/**
 * Per-year plays chart for the song detail page. Toggle between raw counts
 * and percent-of-shows-that-year — the percent view smooths tour-volume
 * variance so a "rare" song read isn't conflated with a light touring year.
 */
export function YearlyPlayChart({ yearlyPlayData, showsByYear }: YearlyPlayChartProps) {
  const [mode, setMode] = useState<YearlyChartMode>("percent");
  const [yearScope, setYearScope] = useState<YearScope>("all");

  const dataInput =
    yearScope === "all"
      ? expandYearlyDataToRange(yearlyPlayData, START_YEAR, new Date().getFullYear())
      : expandPlayedYears(yearlyPlayData);
  const data = buildYearlyChartData(dataInput, showsByYear, mode);
  const isPercent = mode === "percent";

  return (
    <div className="glass-content rounded-lg p-6">
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <h3 className="text-lg font-semibold text-content-text-primary">Played by Year</h3>
        <div className="flex items-center flex-wrap gap-y-2">
          <fieldset className="flex border-0 p-0 m-0">
            <legend className="sr-only">Chart units</legend>
            <SegmentButton size="md" active={mode === "count"} onClick={() => setMode("count")}>
              # Plays
            </SegmentButton>
            <SegmentButton size="md" active={isPercent} onClick={() => setMode("percent")}>
              % of Shows
            </SegmentButton>
          </fieldset>
          <div className="mx-3 h-5 w-px bg-content-text-tertiary/30" aria-hidden="true" />
          <fieldset className="flex border-0 p-0 m-0">
            <legend className="sr-only">Year scope</legend>
            <SegmentButton size="md" active={yearScope === "played"} onClick={() => setYearScope("played")}>
              Years Played
            </SegmentButton>
            <SegmentButton size="md" active={yearScope === "all"} onClick={() => setYearScope("all")}>
              All Years
            </SegmentButton>
          </fieldset>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} opacity={0.3} />
            <XAxis dataKey="year" stroke={CHART_COLORS.axis} fontSize={12} />
            <YAxis
              stroke={CHART_COLORS.axis}
              fontSize={12}
              tickFormatter={isPercent ? (v: number) => `${Math.round(v * 100)}%` : undefined}
            />
            <Tooltip content={<YearlyChartTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={CHART_COLORS.accent}
              strokeWidth={2}
              dot={{ fill: CHART_COLORS.accent, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: CHART_COLORS.accent, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

interface YearlyChartTooltipProps {
  active?: boolean;
  payload?: Array<{ payload?: { year: number; count: number; percent: number } }>;
  label?: number | string;
}

/**
 * Custom recharts tooltip that always renders both raw count and percentage
 * for the hovered year. The chart toggle still controls which series is
 * drawn, but hovering surfaces both dimensions so users don't have to flip
 * modes to compare them.
 */
export function YearlyChartTooltip({ active, payload }: YearlyChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const datum = payload[0]?.payload;
  if (!datum) return null;

  const { year, count, percent } = datum;
  const playsLabel = count === 1 ? "play" : "plays";
  const percentText = percent > 0 ? `${Math.round(percent * 100)}% of shows` : null;

  return (
    <ChartTooltipCard>
      <div className="font-medium">{year}</div>
      <div>
        {count} {playsLabel}
        {percentText ? <span className="text-content-text-tertiary"> · {percentText}</span> : null}
      </div>
    </ChartTooltipCard>
  );
}
