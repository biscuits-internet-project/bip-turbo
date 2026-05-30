import { cn } from "~/lib/utils";

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
  size?: "sm" | "md";
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
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "border-b-2 transition-colors cursor-pointer",
        size === "md" ? "px-3 py-1.5 text-sm font-medium" : "px-2 py-1",
        active
          ? "border-brand-primary text-content-text-primary"
          : "border-transparent text-content-text-tertiary hover:text-content-text-secondary",
      )}
    >
      {children}
    </button>
  );
}
