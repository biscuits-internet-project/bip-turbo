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
