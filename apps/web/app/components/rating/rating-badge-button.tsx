import { useEffect, useRef, useState } from "react";
import { RatingComponent } from "~/components/rating/rating";
import { LoginPromptPopover } from "~/components/ui/login-prompt-popover";
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

  const ratingButton = (
    <button
      type="button"
      onClick={(e) => {
        if (!isAuthenticated) return;
        e.stopPropagation();
        setIsExpanded((open) => !open);
      }}
      className={cn(
        layoutClass,
        paddingClass,
        "origin-center hover:brightness-110 cursor-pointer",
        stateClass,
        isAnimating && "animate-[avg-rating-update_0.5s_ease-out]",
      )}
    >
      {isExpanded ? (
        <StarRating
          rateableId={rateableId}
          rateableType={rateableType}
          showSlug={showSlug}
          initialRating={localUserRating}
          onRatingChange={setLocalUserRating}
          onAverageRatingChange={handleRatingChange}
          skipRevalidation={skipRevalidation}
        />
      ) : (
        <RatingComponent
          rating={displayedRating || null}
          ratingsCount={displayedCount || null}
          userRating={localUserRating}
        />
      )}
    </button>
  );

  if (!isAuthenticated) {
    return (
      <div className="w-auto">
        <LoginPromptPopover message="Sign in to rate">{ratingButton}</LoginPromptPopover>
      </div>
    );
  }

  return <div className="w-auto">{ratingButton}</div>;
}
