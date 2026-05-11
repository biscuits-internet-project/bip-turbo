import { useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { START_YEAR } from "~/lib/song-filters";
import { cn } from "~/lib/utils";
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
            <ToggleButton active={mode === "count"} onClick={() => setMode("count")}>
              # Plays
            </ToggleButton>
            <ToggleButton active={isPercent} onClick={() => setMode("percent")}>
              % of Shows
            </ToggleButton>
          </fieldset>
          <div className="mx-3 h-5 w-px bg-content-text-tertiary/30" aria-hidden="true" />
          <fieldset className="flex border-0 p-0 m-0">
            <legend className="sr-only">Year scope</legend>
            <ToggleButton active={yearScope === "played"} onClick={() => setYearScope("played")}>
              Years Played
            </ToggleButton>
            <ToggleButton active={yearScope === "all"} onClick={() => setYearScope("all")}>
              All Years
            </ToggleButton>
          </fieldset>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis dataKey="year" stroke="#9CA3AF" fontSize={12} />
            <YAxis
              stroke="#9CA3AF"
              fontSize={12}
              tickFormatter={isPercent ? (v: number) => `${Math.round(v * 100)}%` : undefined}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                borderRadius: "6px",
                color: "#F3F4F6",
              }}
              labelStyle={{ color: "#F3F4F6" }}
              formatter={(value: number | undefined) => {
                const safe = value ?? 0;
                return isPercent ? [`${Math.round(safe * 100)}%`, "% of Shows"] : [String(safe), "Plays"];
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8B5CF6"
              strokeWidth={2}
              dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#8B5CF6", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

interface ToggleButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function ToggleButton({ active, onClick, children }: ToggleButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 text-sm font-medium border-b-2 transition-colors cursor-pointer",
        active
          ? "border-brand-primary text-content-text-primary"
          : "border-transparent text-content-text-tertiary hover:text-content-text-secondary",
      )}
    >
      {children}
    </button>
  );
}
