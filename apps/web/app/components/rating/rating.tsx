import { Star } from "lucide-react";
import { usePreferences } from "~/hooks/use-preferences";
import { ratingColor } from "~/lib/rating-colors";

interface RatingProps {
  rating: number | null;
  ratingsCount?: number | null;
  /**
   * The viewer's own rating for this rateable, if any. A positive number
   * renders to the right of a divider so viewers can compare their score
   * to the community average at a glance. `null`, `0`, or `undefined` are
   * treated as "not rated" — the divider and slot don't render.
   */
  userRating?: number | null;
  /**
   * Forces the color scale on (`true`) or off (`false`) regardless of the
   * viewer's saved preference. Only the settings preview sets it, to show the
   * same rating both ways; leave it undefined everywhere else so the viewer's
   * own preference decides.
   */
  colorCode?: boolean;
}

/**
 * Formats a rating using whole numbers + ½ glyph since the rating UI only
 * supports whole and half increments. 4.5 → "4½", 5 → "5", 0.5 → "½".
 */
export function formatHalfStep(value: number): string {
  const whole = Math.floor(value);
  const hasHalf = value - whole >= 0.25; // tolerate float drift
  if (hasHalf) return whole === 0 ? "½" : `${whole}½`;
  return String(whole);
}

/**
 * Inline style that puts a rating value on the purple-to-green scale, or
 * nothing when the viewer has opted out. A style rather than a class because
 * the color is a continuous function of the value.
 */
function ratingColorStyle(value: number, enabled: boolean): { color: string } | undefined {
  return enabled ? { color: ratingColor(value) } : undefined;
}

/**
 * Star followed by a rating value on the color scale. `label` carries the
 * formatted text because callers format differently (a community average wants
 * 2 decimals, a personal score wants the ½ glyph) while the color always comes
 * from the underlying number.
 *
 * The star takes the value's color alongside it when the scale is on, so the
 * badge reads as one tinted unit rather than a gold mark competing with a
 * colored number. With the scale off it falls back to gold, which is then the
 * badge's only color.
 */
export function StarValue({ value, label, colorCode }: { value: number; label: string; colorCode?: boolean }) {
  const { colorCodeRatings } = usePreferences();
  const tint = ratingColorStyle(value, colorCode ?? colorCodeRatings);
  return (
    <span className="inline-flex items-center whitespace-nowrap">
      <Star className="h-3 w-3 sm:h-4 sm:w-4 shrink-0 text-rating-gold mr-0.5 sm:mr-1" style={tint} />
      <span className="font-medium text-xs sm:text-sm text-content-text-primary" style={tint}>
        {label}
      </span>
    </span>
  );
}

export const RatingComponent = ({ rating, ratingsCount, userRating, colorCode }: RatingProps) => {
  const { colorCodeRatings } = usePreferences();
  const colorEnabled = colorCode ?? colorCodeRatings;

  if (!rating) return <div className="text-xs sm:text-sm text-content-text-secondary">Rate</div>;
  const hasUserRating = typeof userRating === "number" && userRating > 0;
  // Tighter inter-element gaps when the user has rated — the row is
  // already busier and the extra divider+value eats horizontal room the
  // table cell can't easily spare on phone-landscape viewports.
  const outerGap = hasUserRating ? "gap-1" : "gap-1 sm:gap-1.5";
  return (
    <div className={`flex items-center ${outerGap}`}>
      <StarValue value={rating} label={rating.toFixed(2)} colorCode={colorCode} />
      {ratingsCount &&
        ratingsCount > 0 &&
        (hasUserRating ? (
          // With a personal score, bundle dot+count in a single inline
          // group with no gap so the `·` sits flush next to the number —
          // saves horizontal room a busier row can't spare. The no-user
          // branch below uses the parent flex gap on both sides of the
          // dot for a roomier feel.
          <span className="inline-flex items-center text-content-text-tertiary text-[10px] sm:text-xs">
            <span className="mr-0.5">·</span>
            {ratingsCount}
          </span>
        ) : (
          <>
            <span className="text-content-text-tertiary text-[10px] sm:text-xs">·</span>
            <span className="text-content-text-tertiary text-[10px] sm:text-xs">{ratingsCount}</span>
          </>
        ))}
      {hasUserRating && (
        <>
          <span className="text-content-text-tertiary text-xs sm:text-sm">|</span>
          <span
            data-testid="user-rating-value"
            // Smaller than the community avg — user's own value is glance-
            // ably present but doesn't compete with the headline number.
            // `whitespace-nowrap` keeps the half glyph on the same baseline
            // as its integer; the slot is wide enough for "5½" while still
            // centering "5".
            className="font-medium text-[10px] sm:text-xs text-content-text-primary inline-block min-w-[2ch] text-center whitespace-nowrap"
            style={ratingColorStyle(userRating, colorEnabled)}
          >
            {formatHalfStep(userRating)}
          </span>
        </>
      )}
    </div>
  );
};
