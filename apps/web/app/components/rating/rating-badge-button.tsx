import { useEffect, useRef, useState } from "react";
import { RatingComponent } from "~/components/rating/rating";
import { LoginPromptPopover } from "~/components/ui/login-prompt-popover";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { StarRating } from "~/components/ui/star-rating";
import { cn } from "~/lib/utils";

type RatingBadgeSize = "compact" | "regular";

interface RatingBadgeButtonProps {
  rateableId: string;
  rateableType: "Show" | "Track";
  showSlug: string;
  /** Community average; null when nothing has been rated yet. */
  initialRating: number | null;
  /** Count of community ratings; null/0 hides the count badge. */
  ratingsCount: number | null;
  /** Logged-in viewer's own rating, when present. */
  userRating?: number | null;
  isAuthenticated: boolean;
  /**
   * `compact` sizes the badge for dense table cells (no fixed height,
   * tight padding). `regular` sizes it for card headers next to other
   * buttons (`h-6 sm:h-8`). Defaults to `regular`.
   */
  size?: RatingBadgeSize;
  /** Forwarded to StarRating — skip post-submit revalidation. */
  skipRevalidation?: boolean;
  /**
   * Called after a successful rating submission so parents can update
   * neighboring state. Receives the new average + count.
   */
  onAverageRatingChange?: (average: number, count: number) => void;
}

/**
 * Shared rating badge + click-to-edit affordance. Wraps `RatingComponent`
 * (display) and `StarRating` (editor) in a single button that toggles
 * between them. Used by table cells (`size="compact"`) and SetlistCard
 * headers (`size="regular"`). When unauthenticated the button is wrapped
 * in a LoginPromptPopover that fires on click instead of expanding.
 */
export function RatingBadgeButton({
  rateableId,
  rateableType,
  showSlug,
  initialRating,
  ratingsCount,
  userRating,
  isAuthenticated,
  size = "regular",
  skipRevalidation,
  onAverageRatingChange,
}: RatingBadgeButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayedRating, setDisplayedRating] = useState(initialRating ?? 0);
  const [displayedCount, setDisplayedCount] = useState(ratingsCount ?? 0);
  // Track the user's rating locally so it survives re-opening the editor
  // after a fresh submission. The `userRating` prop is the source of truth
  // on mount and on re-mount, but during a session a re-rate updates this
  // local copy via StarRating's `onRatingChange` — without it the editor
  // would re-seed with the stale prop value the next time it opens, since
  // Track ratings skip route revalidation.
  const [localUserRating, setLocalUserRating] = useState<number | null>(userRating ?? null);
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const localHasRated = localUserRating != null;

  // Sync display + rated state when props change. Handles two cases:
  // (1) async data arriving after first render (e.g. useTrackUserRatings
  // resolving) and (2) React reusing the same DOM position for different
  // data after a sort/filter reorder.
  useEffect(() => {
    setDisplayedRating(initialRating ?? 0);
    setDisplayedCount(ratingsCount ?? 0);
  }, [initialRating, ratingsCount]);

  useEffect(() => {
    setLocalUserRating(userRating ?? null);
  }, [userRating]);

  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    };
  }, []);

  const handleRatingChange = (average: number, count: number) => {
    setIsAnimating(true);
    setDisplayedRating(average);
    setDisplayedCount(count);
    setIsExpanded(false);
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    animationTimeoutRef.current = setTimeout(() => setIsAnimating(false), 600);
    onAverageRatingChange?.(average, count);
  };

  // Size variants pick layout + height classes. `compact` is inline-flex
  // so the table cell can hug the content width; `regular` uses flex with
  // explicit height to align next to neighbor buttons (Saw it?, etc.).
  const layoutClass =
    size === "compact"
      ? "inline-flex items-center justify-center gap-1 py-1 rounded-md"
      : "flex items-center justify-center gap-1 h-6 sm:h-8 rounded-md transition-all";

  // Padding tightens when the personal score renders to compensate for the
  // busier row (divider + extra value).
  const paddingClass =
    size === "compact" ? (localHasRated ? "px-1" : "px-2") : localHasRated ? "px-1.5 sm:px-2" : "px-2 sm:px-3";

  const stateClass = localHasRated
    ? "bg-amber-500/10 border border-amber-500/50 shadow-[0_0_8px_rgba(245,158,11,0.2)]"
    : "glass-secondary border border-dashed border-glass-border hover:border-amber-500/30";

  // Badge is always the compact RatingComponent; tapping opens a Popover
  // with the 5-star picker (overlay rather than inline expansion). Same
  // behavior on desktop and mobile so the rating column never needs to
  // hold the wider expanded state.
  const compactButton = (
    <button
      type="button"
      onClick={(e) => e.stopPropagation()}
      className={cn(
        layoutClass,
        paddingClass,
        "origin-center hover:brightness-110 cursor-pointer",
        stateClass,
        isAnimating && "animate-[avg-rating-update_0.5s_ease-out]",
      )}
    >
      <RatingComponent
        rating={displayedRating || null}
        ratingsCount={displayedCount || null}
        userRating={localUserRating}
      />
    </button>
  );

  if (!isAuthenticated) {
    return (
      <div className="w-auto">
        <LoginPromptPopover message="Sign in to rate">{compactButton}</LoginPromptPopover>
      </div>
    );
  }

  return (
    <div className="w-auto">
      <Popover open={isExpanded} onOpenChange={setIsExpanded}>
        <PopoverTrigger asChild>{compactButton}</PopoverTrigger>
        {/*
         * `side="top"` + negative sideOffset positions the popover so
         * its bottom edge sits over the badge, visually replacing the
         * collapsed star + count with the 5-star picker rather than
         * floating in empty space below. Styling mirrors the desktop
         * inline-expanded state — amber tint + border + soft glow when
         * the user has rated, glass / dashed-border when they haven't —
         * so opening the picker reads as the same component, just
         * floated on mobile.
         *
         * The inline `background` style uses the raw `--popover` CSS
         * variable directly because this Tailwind v4 theme registers
         * `--color-*` tokens (used by Tailwind `bg-*` classes)
         * separately from the older HSL-component `--popover` token
         * shared with Radix — `bg-popover` / `bg-background` resolve to
         * `transparent`. The amber tint layers on top via `bg-amber-500/10`.
         */}
        <PopoverContent
          // Sized + colored to mirror the inline-expanded badge:
          // same py-1 + px padding, same border + glow as the rated
          // state. `min-h-8` + `sideOffset={-32}` makes the popover at
          // least as tall as the underlying badge on desktop (~30px) so
          // it fully covers the badge with `align="center"` + `side="top"`.
          //
          // Background is OPAQUE: rgb(33, 24, 11) = amber-500 (rgb 245,
          // 158, 11) composited at 10% opacity over the dark page bg
          // (--background ≈ rgb 9, 9, 11). Same visual color as the
          // inline `bg-amber-500/10` reads against the row, without
          // letting other cells show through.
          className={cn(
            "w-auto rounded-md flex items-center gap-1 min-h-8",
            localHasRated ? "!p-1" : "!py-1 !px-2",
            localHasRated
              ? "border border-amber-500/50 shadow-[0_0_8px_rgba(245,158,11,0.2)]"
              : "glass-secondary border border-dashed border-glass-border",
          )}
          style={localHasRated ? { backgroundColor: "rgb(33, 24, 11)" } : undefined}
          align="center"
          side="top"
          sideOffset={-32}
        >
          <StarRating
            rateableId={rateableId}
            rateableType={rateableType}
            showSlug={showSlug}
            initialRating={localUserRating}
            onRatingChange={setLocalUserRating}
            onAverageRatingChange={handleRatingChange}
            skipRevalidation={skipRevalidation}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
