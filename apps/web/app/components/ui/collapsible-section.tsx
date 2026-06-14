import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { cn } from "~/lib/utils";

/** Per-breakpoint class sets for the force-open behavior — full static strings
 *  so Tailwind can see them (no dynamic `${bp}:` interpolation). */
const FORCE_OPEN_AT = {
  sm: {
    rows: "sm:grid-rows-[1fr]",
    overflow: "sm:overflow-visible",
    hide: "sm:hidden",
    cursor: "sm:cursor-default",
  },
  md: {
    rows: "md:grid-rows-[1fr]",
    overflow: "md:overflow-visible",
    hide: "md:hidden",
    cursor: "md:cursor-default",
  },
};

interface CollapsibleSectionProps {
  /** Heading text/content. Rendered in its own heading element so callers can
   *  target it by accessible name. */
  title: ReactNode;
  /** Title element. Page sections use the default h2; a nested card (the show
   *  lineup) drops to h3; chrome that shouldn't appear in the page's heading
   *  outline (the filter panel) uses "div". */
  titleAs?: "h2" | "h3" | "div";
  /** Optional count badge shown beside the title (outside the heading, so the
   *  heading's accessible name stays exactly the title). */
  count?: number;
  /** Extra inline header content beside the title — e.g. the lineup's deviation
   *  sparkle or the filter chrome's subtitle pills. */
  headerExtra?: ReactNode;
  /**
   * Collapse on desktop too. Default false: collapsed on mobile via JS state
   * but force-expanded at/above `breakpoint` via pure CSS, which avoids the
   * hydration flash a `useIsMobile`-style hook would cause (server renders
   * desktop-open, then snaps shut on mount). When true, the section collapses
   * at every width and the chevron stays visible on desktop.
   */
  collapsibleOnDesktop?: boolean;
  /**
   * Width at/above which the section force-expands (ignored when
   * `collapsibleOnDesktop`). "md" (default) suits content sections; "sm" matches
   * the filter chrome, which only needs collapsing on phones.
   */
  breakpoint?: "sm" | "md";
  /**
   * Also collapse on short (landscape-phone) viewports, even above `breakpoint`
   * — a rotated phone has the same vertical-space crunch as portrait. The filter
   * chrome opts in; content sections leave it off.
   */
  collapseOnLandscape?: boolean;
  /**
   * When force-expanded (at/above `breakpoint`), hide the whole header rather
   * than just its chevron, so the expanded content shows with no title bar. The
   * filter chrome uses this: on desktop the filters render bare (no "Search &
   * Filters" toggle), and the toggle only appears where the panel can collapse
   * (phones, landscape). Ignored when `collapsibleOnDesktop` (the toggle must
   * stay visible where the panel always collapses).
   */
  hideHeaderWhenExpanded?: boolean;
  /**
   * Draw a subtle bottom divider under the header while closed (removed when
   * open). For bare chrome with no surrounding card — the filter panel — it
   * signals "there's collapsed content here" so the toggle doesn't blend into
   * adjacent controls. Carded/large-heading sections don't need it.
   */
  dividerWhenClosed?: boolean;
  /** Classes for the outer wrapper. */
  className?: string;
  /** Classes for the clickable header row. */
  headerClassName?: string;
  /** Classes for the heading element. */
  titleClassName?: string;
  /** Classes for the content padding wrapper. */
  contentClassName?: string;
  children: ReactNode;
}

/**
 * A titled section whose body collapses behind a tappable header. The body uses
 * the `grid-rows-[1fr]/[0fr]` + `transition-[grid-template-rows]` idiom (with an
 * inner `overflow-hidden`) so the open/close animates without measuring height,
 * and the breakpoint behavior is pure CSS (`sm:`/`md:` overrides) rather than a
 * JS media hook. JS state drives only the manual mobile toggle.
 */
export function CollapsibleSection({
  title,
  titleAs: TitleTag = "h2",
  count,
  headerExtra,
  collapsibleOnDesktop = false,
  breakpoint = "md",
  collapseOnLandscape = false,
  hideHeaderWhenExpanded = false,
  dividerWhenClosed = false,
  className,
  headerClassName,
  titleClassName,
  contentClassName,
  children,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(false);
  const forceOpen = FORCE_OPEN_AT[breakpoint];

  return (
    <div className={className}>
      <TitleTag
        className={cn(
          "m-0",
          titleClassName,
          // Hide the whole header where the panel is force-expanded; re-show it
          // on landscape phones where the panel re-collapses.
          hideHeaderWhenExpanded && !collapsibleOnDesktop && forceOpen.hide,
          hideHeaderWhenExpanded && collapseOnLandscape && "short:!block",
        )}
      >
        <button
          type="button"
          data-testid="collapsible-section-toggle"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className={cn(
            "w-full flex flex-row items-center justify-between gap-2 text-left font-[inherit] cursor-pointer",
            !collapsibleOnDesktop && forceOpen.cursor,
            collapseOnLandscape && "short:!cursor-pointer",
            dividerWhenClosed && !open && "border-b border-glass-border pb-3",
            headerClassName,
          )}
        >
          <span className="flex items-center gap-1.5 min-w-0">
            {title}
            {headerExtra}
            {/* Decorative: the same count renders elsewhere on the page, so it's
                hidden from the heading's accessible name (which stays the title). */}
            {count !== undefined && (
              <span
                aria-hidden
                className="shrink-0 rounded-full bg-glass-bg px-2 py-0.5 text-sm font-normal text-content-text-tertiary"
              >
                {count}
              </span>
            )}
          </span>
          {/* Disclosure convention: points right (▶) when closed, rotates down
              (▼) when open — the arrow points toward the content it reveals. */}
          <ChevronDown
            aria-hidden
            className={cn(
              "h-4 w-4 shrink-0 transition-transform",
              !collapsibleOnDesktop && forceOpen.hide,
              collapseOnLandscape && "short:!block",
              !open && "-rotate-90",
            )}
          />
        </button>
      </TitleTag>
      <div
        data-testid="collapsible-section-body"
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out",
          !collapsibleOnDesktop && forceOpen.rows,
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          collapseOnLandscape && !open && "short:!grid-rows-[0fr]",
        )}
      >
        <div
          className={cn(
            "overflow-hidden",
            !collapsibleOnDesktop && forceOpen.overflow,
            collapseOnLandscape && !open && "short:!overflow-hidden",
          )}
        >
          <div className={contentClassName}>{children}</div>
        </div>
      </div>
    </div>
  );
}
