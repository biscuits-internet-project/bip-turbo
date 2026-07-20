import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { TriState } from "~/lib/tri-state-filter";
import { cn } from "~/lib/utils";

interface TriStateFilterButtonProps {
  /** Current state of the filter — drives styling and aria-label phrasing. */
  state: TriState;
  /** Visible button text — also used inside the aria-label. */
  label: string;
  /** Icon node rendered to the left of the label. The negative state wraps
   * this in a strikethrough overlay; the icon itself stays unchanged. */
  icon: ReactNode;
  /** Destination link for the button click — typically the current path with
   * the filter param advanced one step in the cycle. */
  href: string;
}

const STATE_DESCRIPTION: Record<TriState, string> = {
  empty: "not filtered",
  positive: "currently included",
  negative: "currently excluded",
};

const NEXT_DESCRIPTION: Record<TriState, string> = {
  empty: "click to require",
  positive: "click to exclude",
  negative: "click to clear",
};

/**
 * One button in a tri-state filter strip. Centralizes the empty / positive
 * / negative className branches and the strikethrough overlay so callers
 * only own the cycle decision (which state comes next) and the icon choice.
 */
export function TriStateFilterButton({ state, label, icon, href }: TriStateFilterButtonProps) {
  return (
    <Link
      to={href}
      // Semantic hook for the current filter state, so tests assert state
      // rather than the per-state border/background styling.
      data-state={state}
      aria-label={`${label} filter — ${STATE_DESCRIPTION[state]}, ${NEXT_DESCRIPTION[state]}`}
      className={cn(
        "px-2 py-1 text-xs font-medium rounded-md transition-all duration-200 flex items-center gap-1.5 border",
        state === "positive" && "text-white border-brand-primary/50",
        state === "negative" && "text-white bg-red-600/10 border-red-500/50",
        state === "empty" && "text-content-text-secondary hover:text-white border-transparent",
      )}
    >
      <FilterIcon state={state}>{icon}</FilterIcon>
      {/* Label hides below sm so the mobile strip fits all filters on one
          icon-only row; the aria-label above keeps the name for assistive tech. */}
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}

/**
 * Wraps an icon in a diagonal strikethrough overlay for the negative state.
 * In other states the icon renders unchanged so all three buttons keep the
 * same visual rhythm.
 */
function FilterIcon({ state, children }: { state: TriState; children: ReactNode }) {
  if (state !== "negative") return <>{children}</>;

  return (
    <span className="relative inline-flex h-3.5 w-3.5 items-center justify-center" aria-hidden="true">
      {children}
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="block h-[2px] w-full rotate-45 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.5)]" />
      </span>
    </span>
  );
}
