import { CHART_COLORS } from "~/lib/chart-colors";

/**
 * The dark, bordered card shell every bespoke recharts tooltip in the app
 * renders into (song play chart, debut-year chart, rating charts). Recharts
 * elements take literal colors, not classNames, so the palette comes from
 * CHART_COLORS via inline style. Pass the per-chart rows as children.
 */
export function ChartTooltipCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-md border px-3 py-2 text-sm"
      style={{
        backgroundColor: CHART_COLORS.tooltipBg,
        borderColor: CHART_COLORS.tooltipBorder,
        color: CHART_COLORS.tooltipText,
      }}
    >
      {children}
    </div>
  );
}
