import { Link } from "react-router-dom";
import { cn } from "~/lib/utils";

type SegmentSize = "sm" | "md";

/**
 * The shared bottom-border segment treatment. Lives as a function so the
 * button and link forms can't drift — the only difference between them is
 * whether activating a segment changes local state or navigates.
 */
function segmentClass(active: boolean, size: SegmentSize): string {
  return cn(
    "border-b-2 transition-colors cursor-pointer",
    size === "md" ? "px-3 py-1.5 text-sm font-medium" : "px-2 py-1",
    active
      ? "border-brand-primary text-content-text-primary"
      : "border-transparent text-content-text-tertiary hover:text-content-text-secondary",
  );
}

interface SegmentButtonProps {
  /** True when this segment is the currently-selected one. Drives the
   *  bottom-border color and the `aria-pressed` attribute that exposes
   *  the toggle state to screen readers. */
  active: boolean;
  onClick: () => void;
  /**
   * "sm" (default) is the compact rail size used by setlist/debut controls;
   * "md" is the larger chart-header size (matches the in-chart unit/scope
   * switches on the song and ratings charts).
   */
  size?: SegmentSize;
  children: React.ReactNode;
}

/**
 * Bottom-border tab/segment button. Used by SetlistViewControl
 * (setlist/gap chart/personal), DebutYearChart (chart/table), and the
 * chart-header unit/scope/view toggles on the song and ratings charts.
 * Lives in `~/components/ui/` because the visual primitive is shared across
 * feature areas — wrap it in feature-specific renderers rather than
 * duplicating the className.
 */
export function SegmentButton({ active, onClick, size = "sm", children }: SegmentButtonProps) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} className={segmentClass(active, size)}>
      {children}
    </button>
  );
}

interface SegmentLinkProps {
  active: boolean;
  /** Destination for this segment. */
  to: string;
  size?: SegmentSize;
  children: React.ReactNode;
}

/**
 * Navigating counterpart to SegmentButton, for toggles where each segment is
 * its own route rather than local state — so the choice is bookmarkable and
 * middle-clickable. `aria-current="page"` (not `aria-pressed`) is the right
 * state for a link that points at the page you're on.
 */
export function SegmentLink({ active, to, size = "sm", children }: SegmentLinkProps) {
  return (
    <Link to={to} aria-current={active ? "page" : undefined} className={segmentClass(active, size)}>
      {children}
    </Link>
  );
}
