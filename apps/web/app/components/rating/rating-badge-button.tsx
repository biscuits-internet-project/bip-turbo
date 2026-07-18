import { useEffect, useRef, useState } from "react";
import { RatingComponent } from "~/components/rating/rating";
import { LoginPromptPopover } from "~/components/ui/login-prompt-popover";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { StarRating } from "~/components/ui/star-rating";
import { usePreferences } from "~/hooks/use-preferences";
import { ROW_CHIP_HOVER } from "~/lib/interaction-styles";
import { cn } from "~/lib/utils";

export type RatingBadgeSize = "compact" | "regular";

/**
 * The badge's surface when the color scale is off. Note `glass-secondary` sets
 * `border` with `!important`, which defeats any border utility OR inline border
 * style placed alongside it — the chrome options here are alternatives for that
 * reason, never combined.
 */
const BADGE_CHROME = "glass-secondary";

/**
 * The gold edge marking a badge the viewer has rated, worn only when the color
 * scale is off — with the scale on, the tinted score says it already and the
 * badge wears a neutral hairline instead (see `SCALE_CHROME`).
 *
 * Assert on `data-rated`, never on these classes.
 */
const RATED_GOLD_CHROME =
  "border border-rating-gold/50 shadow-[0_0_8px_hsl(var(--rating-gold)/0.2)] hover:border-rating-gold/80 hover:bg-rating-gold/10";

/**
 * The badge edge worn when the scale is on: a neutral hairline that gives the
 * badge a shape without spending a color. The score and star are already tinted,
 * so anything colored here is a third voice saying what they say — and gold
 * specifically then competes with the tint rather than framing it.
 *
 * Deliberately not `glass-secondary`: that sets `border` with `!important` and
 * would silently eat this.
 */
const SCALE_CHROME =
  "border border-content-text-secondary/28 hover:border-content-text-secondary/60 hover:bg-content-text-secondary/10";

/**
 * Layout + padding for the badge chip, by size and whether the viewer has
 * rated (a rated badge tightens padding to fit the divider + personal value).
 * Exported so the rating-display settings preview renders the same chip shape
 * without the button, popover, and click behavior.
 */
export function ratingBadgeLayoutClass(size: RatingBadgeSize, hasRated: boolean): string {
  const layout =
    size === "compact"
      ? "inline-flex items-center justify-center gap-1 py-1 rounded-md"
      : "flex items-center justify-center gap-1 h-6 sm:h-8 rounded-md";
  const padding = size === "compact" ? (hasRated ? "px-1" : "px-2") : hasRated ? "px-1.5 sm:px-2" : "px-2 sm:px-3";
  return cn(layout, padding);
}

/**
 * The badge's edge, one of three never-layered surfaces (see `BADGE_CHROME`).
 * Scale on: a neutral hairline, since the tinted score carries the color. Scale
 * off: gold once rated, glass until then. `colorEnabled` is passed in rather
 * than read from preferences so the settings preview can force each column.
 */
export function ratingBadgeStateClass(colorEnabled: boolean, hasRated: boolean): string {
  return colorEnabled ? SCALE_CHROME : hasRated ? RATED_GOLD_CHROME : BADGE_CHROME;
}

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
  const { colorCodeRatings } = usePreferences();

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

  const stateClass = ratingBadgeStateClass(colorCodeRatings, localHasRated);

  // The picker has to be opaque or the rows under it read through. Only
  // `glass-secondary` brings its own fill (plus a backdrop blur); the gold and
  // scale chromes are border-only, so those cases need the page color spelled
  // out. The badge itself stays transparent to its row either way.
  const popoverStyle: React.CSSProperties = {
    ...(stateClass === BADGE_CHROME ? {} : { backgroundColor: "hsl(var(--background))" }),
  };

  // Badge is always the compact RatingComponent; tapping opens a Popover
  // with the 5-star picker (overlay rather than inline expansion). Same
  // behavior on desktop and mobile so the rating column never needs to
  // hold the wider expanded state.
  const compactButton = (
    <button
      type="button"
      onClick={(e) => e.stopPropagation()}
      // Semantic hook for "the viewer has rated this", so callers and tests
      // don't have to recognize the rated state by pattern-matching styling
      // classes that are free to change.
      data-rated={localHasRated}
      className={cn(
        ratingBadgeLayoutClass(size, localHasRated),
        ROW_CHIP_HOVER,
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
         * floating in empty space below. Wears the same chrome as the badge
         * it covers, so opening the picker reads as the same component just
         * floated on mobile — and `glass-secondary`'s backdrop blur keeps the
         * rows beneath from reading through the picker.
         */}
        <PopoverContent
          // `min-h-8` + `sideOffset={-32}` makes the popover at least as tall
          // as the underlying badge on desktop (~30px) so it fully covers the
          // badge with `align="center"` + `side="top"`. Padding still tracks
          // the rated state because that changes the badge's width underneath.
          data-rated={localHasRated}
          className={cn(
            "w-auto rounded-md flex items-center gap-1 min-h-8",
            localHasRated ? "!p-1" : "!py-1 !px-2",
            stateClass,
          )}
          style={popoverStyle}
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
