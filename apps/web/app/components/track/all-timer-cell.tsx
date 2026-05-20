import { Flame } from "lucide-react";

/**
 * Table-cell renderer for the all-timer marker. The `h-6` wrapper matches
 * the default text-base line-height of adjacent cells so the 14px flame
 * sits on the same baseline as song-title text instead of floating high.
 *
 * `align` controls horizontal placement: `"center"` (default) suits the
 * standalone narrow column; `"start"` is used when the flame is rendered
 * inline beneath other content in a wider host cell (e.g. the perf-table
 * Date cell or the setlist Set cell on mobile).
 */
export function AllTimerCell({ align = "center" }: { align?: "center" | "start" }) {
  return (
    <div className={`flex h-6 items-center ${align === "center" ? "justify-center" : "justify-start"}`}>
      <Flame className="h-3.5 w-3.5 text-orange-500" aria-label="All-timer" />
    </div>
  );
}

/**
 * Meta options for the all-timer column — narrowest viable slot with no
 * horizontal padding so it never steals width from neighboring columns.
 * Setlist views override `hideOnMobile: true` since they render the
 * flame inline in their Set cell on mobile; the perf table keeps it
 * visible since there's no equivalent host cell there.
 */
export const allTimerColumnMeta = {
  fixedWidth: "1.5rem",
  mobileFixedWidth: "1rem",
  cellClassName: "px-0 sm:px-0",
} as const;
