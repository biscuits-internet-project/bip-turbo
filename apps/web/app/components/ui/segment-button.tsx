import { cn } from "~/lib/utils";

interface SegmentButtonProps {
  /** True when this segment is the currently-selected one. Drives the
   *  bottom-border color and the `aria-pressed` attribute that exposes
   *  the toggle state to screen readers. */
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

/**
 * Bottom-border tab/segment button. Used by SetlistViewControl
 * (setlist/gap chart/personal) and DebutYearChart (chart/table). Lives in
 * `~/components/ui/` because the visual primitive is shared across
 * feature areas — wrap it in feature-specific renderers rather than
 * duplicating the className.
 */
export function SegmentButton({ active, onClick, children }: SegmentButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "px-2 py-1 border-b-2 transition-colors cursor-pointer",
        active
          ? "border-brand-primary text-content-text-primary"
          : "border-transparent text-content-text-tertiary hover:text-content-text-secondary",
      )}
    >
      {children}
    </button>
  );
}
