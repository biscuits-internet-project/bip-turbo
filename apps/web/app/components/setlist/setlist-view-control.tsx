import { cn } from "~/lib/utils";
import type { SetlistView } from "./setlist-card";

/**
 * Summary line displayed beside the toggle. The caller (SetlistCard) builds
 * one of these for the active view — catalog stats for setlist/gap-chart,
 * user-history stats for personal — so the toggle component stays a dumb
 * renderer without view-specific branching.
 */
export interface SetlistViewSummary {
  /** Prefix text. `"Average / median song gap"` or `"Your average / median song gap"`. */
  label: string;
  /** Average gap value. Null when no rows qualify; the line is hidden. */
  average: number | null;
  /** Median gap value. Null when no rows qualify; the line is hidden. */
  median: number | null;
  /**
   * Count of debuts. Surfaced as a `· N debut(s)` suffix because debuts are
   * excluded from avg/median but are themselves a strong rarity signal.
   */
  debutCount: number;
}

interface SetlistViewControlProps {
  view: SetlistView;
  onChange: (next: SetlistView) => void;
  /**
   * When true, renders the third "personal gap chart" segment. Caller
   * passes Boolean(user) — the option is hidden for anonymous viewers
   * since the personal-view data is per-user.
   */
  showPersonal?: boolean;
  /**
   * Computed summary for the active view. Omit to hide the summary line
   * entirely (e.g. while data is still loading).
   */
  summary?: SetlistViewSummary;
}

/**
 * Toggle for setlist ↔ gap chart ↔ personal gap chart, paired on the same
 * row with the active view's "average song gap" summary so toggle and
 * meta-info stay visually grouped. Used both above and below tabular
 * views; the flow view renders one instance below the text.
 */
export function SetlistViewControl({ view, onChange, showPersonal, summary }: SetlistViewControlProps) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <div className="inline-flex items-center">
        <SegmentButton view={view} target="setlist" label="setlist" onChange={onChange} />
        <SegmentButton view={view} target="gap-chart" label="gap chart" onChange={onChange} />
        {showPersonal && <SegmentButton view={view} target="personal" label="personal gap chart" onChange={onChange} />}
      </div>
      {summary && <SummaryLine summary={summary} />}
    </div>
  );
}

function SummaryLine({ summary }: { summary: SetlistViewSummary }) {
  const debutSuffix =
    summary.debutCount > 0 ? `${summary.debutCount} ${summary.debutCount === 1 ? "debut" : "debuts"}` : "";
  const { average, median } = summary;

  // text-right tucks the wrapped numbers under the right edge when narrow
  // viewports force the prefix onto its own line — keeps the numbers
  // anchored where the eye expects them.
  if (average !== null && median !== null) {
    return (
      <span className="text-content-text-secondary text-right">
        {summary.label}: {average.toFixed(1)} / {median.toFixed(1)}
        {debutSuffix && ` · ${debutSuffix}`}
      </span>
    );
  }
  if (debutSuffix) {
    return <span className="text-content-text-secondary text-right">{debutSuffix}</span>;
  }
  return null;
}

function SegmentButton({
  view,
  target,
  label,
  onChange,
}: {
  view: SetlistView;
  target: SetlistView;
  label: string;
  onChange: (next: SetlistView) => void;
}) {
  const active = view === target;
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={() => onChange(target)}
      className={cn(
        "px-2 py-1 border-b-2 transition-colors cursor-pointer",
        active
          ? "border-brand-primary text-content-text-primary"
          : "border-transparent text-content-text-tertiary hover:text-content-text-secondary",
      )}
    >
      {label}
    </button>
  );
}
