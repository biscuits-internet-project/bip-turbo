import { Flame } from "lucide-react";
import { cn } from "~/lib/utils";

interface TrackIconProps {
  /**
   * Track-like shape carrying the two flags the icon dispatches on.
   * Accepts a narrow shape (not full `Track`) so call sites can pass
   * partial projections without ceremony.
   */
  track: { allTimer?: boolean | null; note?: string | null };
  /**
   * Sizing/layout classes applied to the flame. Default `h-4 w-4` matches
   * standalone-section sizing; dense table cells override to smaller.
   */
  iconClassName?: string;
  /** Extra classes applied to the outer wrapper span. */
  className?: string;
}

/**
 * Visual marker for noteworthy tracks. Renders the orange flame when the
 * track is an all-timer, the off-white flame when it carries a curated
 * jam-chart note but isn't an all-timer, and nothing otherwise. The
 * surrounding hover/click affordance for showing the note text is
 * provided by the caller (e.g. AllTimerCell wraps the flame in a
 * TrackRatingOverlay; the setlist flow view does the same for the whole
 * row); this component is intentionally inert.
 */
export function TrackIcon({ track, iconClassName, className }: TrackIconProps) {
  const allTimer = !!track.allTimer;
  const note = !!track.note?.trim();

  if (!allTimer && !note) return null;

  const colorClass = allTimer ? "text-orange-500" : "text-content-text-primary";
  const sizeClass = iconClassName ?? "h-4 w-4";
  const label = allTimer ? "All-timer" : "Jam chart";
  return (
    <span className={cn("inline-flex items-center", className)}>
      <Flame className={cn(sizeClass, "shrink-0", colorClass)} aria-label={label} />
    </span>
  );
}
