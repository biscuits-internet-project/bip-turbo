import { Flame } from "lucide-react";

/**
 * Table-cell renderer for the all-timer marker. The `h-6` wrapper matches
 * the default text-base line-height of adjacent cells so the 14px flame
 * sits on the same baseline as song-title text instead of floating high.
 */
export function AllTimerCell() {
  return (
    <div className="flex h-6 items-center justify-center">
      <Flame className="h-3.5 w-3.5 text-orange-500" aria-label="All-timer" />
    </div>
  );
}

/**
 * Meta options for the all-timer column — narrowest viable slot with no
 * horizontal padding so it never steals width from neighboring columns.
 */
export const allTimerColumnMeta = { width: "16px", cellClassName: "px-0 sm:px-0" } as const;
