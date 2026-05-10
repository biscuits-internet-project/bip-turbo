import { cn } from "~/lib/utils";
import type { SetlistView } from "./setlist-card";

interface SetlistViewControlProps {
  view: SetlistView;
  onChange: (next: SetlistView) => void;
  averageSongGap: number | null;
  medianSongGap: number | null;
}

/**
 * Toggle for setlist ↔ gap chart, paired on the same row with the
 * "Average song gap" summary so the two pieces of meta-information stay
 * visually grouped. Used both above and below the gap-chart table; the
 * setlist view renders a single instance below the flow text.
 */
export function SetlistViewControl({
  view,
  onChange,
  averageSongGap,
  medianSongGap,
}: SetlistViewControlProps) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <div className="inline-flex items-center">
        <button
          type="button"
          aria-pressed={view === "setlist"}
          onClick={() => onChange("setlist")}
          className={cn(
            "px-2 py-1 border-b-2 transition-colors cursor-pointer",
            view === "setlist"
              ? "border-brand-primary text-content-text-primary"
              : "border-transparent text-content-text-tertiary hover:text-content-text-secondary",
          )}
        >
          setlist
        </button>
        <button
          type="button"
          aria-pressed={view === "gap-chart"}
          onClick={() => onChange("gap-chart")}
          className={cn(
            "px-2 py-1 border-b-2 transition-colors cursor-pointer",
            view === "gap-chart"
              ? "border-brand-primary text-content-text-primary"
              : "border-transparent text-content-text-tertiary hover:text-content-text-secondary",
          )}
        >
          gap chart
        </button>
      </div>
      {averageSongGap !== null && medianSongGap !== null && (
        // text-right tucks the wrapped numbers under the right edge when
        // narrow viewports force "Average / Median song gap:" onto its own
        // line — keeps the numbers anchored where the eye expects them.
        <span className="text-content-text-secondary text-right">
          Average / Median song gap: {averageSongGap.toFixed(1)} / {medianSongGap.toFixed(1)}
        </span>
      )}
    </div>
  );
}
