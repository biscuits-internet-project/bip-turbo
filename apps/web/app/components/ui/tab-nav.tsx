import { ChevronLeft, ChevronRight, type LucideIcon } from "lucide-react";
import { type MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { cn } from "~/lib/utils";

export interface TabNavItem {
  value: string;
  label: string;
  /** When set, the bar renders a real `<Link>` so route tabs keep their navigation semantics. */
  href?: string;
  icon?: LucideIcon;
  iconClassName?: string;
}

interface TabNavProps {
  items: TabNavItem[];
  value: string;
  onValueChange: (value: string) => void;
  ariaLabel: string;
  className?: string;
}

// Shown only on the edge that has more tabs off screen: a gradient fade over
// the tabs plus a small chevron near the corner. The chevron primarily signals
// "there's more this way"; clicking it also scrolls. The fade is an inline
// gradient to the page background (the `bg-*` utility for that token isn't
// registered in this Tailwind build).
function ScrollEdge({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  const isLeft = side === "left";
  return (
    <>
      <div
        aria-hidden
        className={cn("pointer-events-none absolute top-0 bottom-px z-[4] w-12", isLeft ? "left-0" : "right-0")}
        style={{
          backgroundImage: `linear-gradient(to ${isLeft ? "right" : "left"}, hsl(var(--background)), transparent)`,
        }}
      />
      <button
        type="button"
        onClick={onClick}
        aria-label={isLeft ? "Scroll tabs left" : "Scroll tabs right"}
        className={cn(
          "absolute top-1 z-[6] flex h-5 w-5 items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--content-bg-secondary))] text-content-text-secondary transition-colors hover:text-content-text-primary",
          isLeft ? "left-0.5" : "right-0.5",
        )}
      >
        {isLeft ? <ChevronLeft className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
      </button>
    </>
  );
}

// A tab click sets this so the request to snap survives the remount that
// happens when switching to/from the default tab (a separate route). The
// freshly mounted (or updated) bar consumes it and scrolls itself under the
// header. Module-scoped because it has to bridge that unmount/remount.
let snapPending = false;

/**
 * A horizontal tab strip that stays a tab strip when it overflows: it scrolls
 * sideways, and a chevron appears on whichever edge still has tabs off screen.
 * Clicking a chevron scrolls a screenful in that direction; the active tab is
 * kept centered so it's always visible. Clicking a tab snaps the strip to just
 * under the sticky header so every tab lands in the same place.
 */
export function TabNav({ items, value, onValueChange, ariaLabel, className }: TabNavProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateEdges = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft < max - 1);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateEdges();
    const observer = new ResizeObserver(updateEdges);
    observer.observe(el);
    // A window `resize` listener backs up the observer where it's unreliable.
    window.addEventListener("resize", updateEdges);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateEdges);
    };
  }, [updateEdges]);

  // Keep the active tab centered in the strip when it changes (and on first
  // paint), clamped so the first/last tab sits flush rather than being pulled
  // past the edge and clipped behind a phantom chevron.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const active = el.querySelector<HTMLElement>(`[data-value="${value}"]`);
    if (active) {
      const target = active.offsetLeft - (el.clientWidth - active.offsetWidth) / 2;
      el.scrollLeft = Math.max(0, Math.min(target, el.scrollWidth - el.clientWidth));
    }
    updateEdges();
  }, [value, updateEdges]);

  // A tab click just records intent; the scroll happens here, after the new
  // panel has laid out. Deferred past two frames because short panels (e.g.
  // Graphs) render async and would otherwise briefly collapse the page and
  // clamp the scroll back to the top before we could place the bar.
  const requestSnap = (event: MouseEvent<HTMLElement>) => {
    // Only arm the snap for a real tab change — clicking the active tab (or the
    // strip's padding) shouldn't leave a flag that fires on a later page visit.
    const clicked = (event.target as HTMLElement).closest("[data-value]");
    if (clicked && clicked.getAttribute("data-value") !== value) {
      snapPending = true;
    }
  };
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-runs on every tab change to consume a pending snap
  useEffect(() => {
    if (!snapPending) return;
    snapPending = false;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => containerRef.current?.scrollIntoView({ block: "start" }));
    });
  }, [value]);

  const scrollByStep = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.6, behavior: "smooth" });
  };

  // An href tab navigates through its own `<Link>` (which carries
  // `preventScrollReset`). Radix also fires `onValueChange` on the same click,
  // so forwarding it would double-navigate — and a caller whose handler is a
  // bare `navigate` would reset the page scroll. Only forward for value tabs.
  const handleValueChange = (next: string) => {
    if (items.find((item) => item.value === next)?.href) return;
    onValueChange(next);
  };

  return (
    <div ref={containerRef} className={cn("relative scroll-mt-16 short:scroll-mt-12", className)}>
      <div
        ref={scrollerRef}
        onScroll={updateEdges}
        className="scrollbar-none overflow-x-auto"
        style={{ scrollbarWidth: "none" }}
      >
        <Tabs value={value} onValueChange={handleValueChange}>
          <TabsList className="w-max" aria-label={ariaLabel} onClick={requestSnap}>
            {items.map((item) => {
              const Icon = item.icon;
              const content = (
                <>
                  {Icon && <Icon className={cn("h-4 w-4", item.iconClassName)} />}
                  {item.label}
                </>
              );
              return (
                <TabsTrigger key={item.value} value={item.value} data-value={item.value} asChild={Boolean(item.href)}>
                  {item.href ? (
                    <Link to={item.href} preventScrollReset>
                      {content}
                    </Link>
                  ) : (
                    content
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>
      {canScrollLeft && <ScrollEdge side="left" onClick={() => scrollByStep(-1)} />}
      {canScrollRight && <ScrollEdge side="right" onClick={() => scrollByStep(1)} />}
    </div>
  );
}
