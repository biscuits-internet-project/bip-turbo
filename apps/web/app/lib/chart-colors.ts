/**
 * Shared recharts color palette. Recharts elements (XAxis/YAxis/Bar/Line)
 * take literal color strings via `stroke`/`fill` props, not className, so
 * the project's Tailwind/CSS design tokens aren't directly reachable —
 * this file is the single source of truth for the chart palette.
 */
export const CHART_COLORS = {
  axis: "#9CA3AF",
  grid: "#374151",
  accent: "#8B5CF6",
  tooltipBg: "#1F2937",
  tooltipBorder: "#374151",
  tooltipText: "#F3F4F6",
} as const;

/**
 * Distinct series colors for grouped/overlaid charts (e.g. comparing rating
 * distributions across multiple years side by side). Literal hex equivalents
 * of the --chart-primary/secondary/tertiary/quaternary/accent design tokens
 * in styles.css. Cycles when a chart has more series than colors.
 */
export const CHART_SERIES_COLORS = ["#8B5CF6", "#30E87D", "#BC9FDF", "#8CD9AC", "#F7C42B"] as const;

export function chartSeriesColor(index: number): string {
  return CHART_SERIES_COLORS[index % CHART_SERIES_COLORS.length];
}

/**
 * Recharts `cursor` for bar charts — the translucent highlight behind the
 * hovered bar. Shared so every bar chart's hover background reads the same
 * (a subtle grid-gray tint) rather than recharts' lighter default.
 */
export const CHART_BAR_CURSOR = { fill: CHART_COLORS.grid, opacity: 0.2 } as const;
