import { compareByShowDate } from "./show-ordering";

/** Fewest / most decimal places the rating precision setting allows. */
export const RATING_DISPLAY_DECIMALS_MIN = 1;
export const RATING_DISPLAY_DECIMALS_MAX = 4;
/** Decimals shown when the viewer hasn't chosen — and the fixed precision the global sort rounds at. */
export const RATING_DISPLAY_DECIMALS_DEFAULT = 2;

/** Clamp a decimals value to the allowed 1-4 range (guards against a bad stored/query value). */
export function clampRatingDecimals(decimals: number): number {
  return Math.min(RATING_DISPLAY_DECIMALS_MAX, Math.max(RATING_DISPLAY_DECIMALS_MIN, Math.trunc(decimals)));
}

/** The rating score as the user sees it on a badge, at their chosen decimal precision. */
export function formatRatingScore(value: number, decimals: number = RATING_DISPLAY_DECIMALS_DEFAULT): string {
  return value.toFixed(clampRatingDecimals(decimals));
}

/**
 * The rating score rounded to exactly the value the badge renders. Derived from
 * the same `toFixed` as {@link formatRatingScore} so the sort key equals the
 * displayed number to the bit — two shows that print the same score compare equal.
 */
export function roundRatingForDisplay(value: number, decimals: number = RATING_DISPLAY_DECIMALS_DEFAULT): number {
  return Number(value.toFixed(clampRatingDecimals(decimals)));
}

/** A show carrying its displayed rating + the count shown beside it, for ranking. */
export interface DisplayedRatingRankable {
  /** The score as displayed (already mode-appropriate: canonical or calibrated). */
  rating: number;
  /** The rating count shown beside the score (deduped for simple, weighted for calibrated). */
  count: number;
  show: Parameters<typeof compareByShowDate>[0]["show"];
}

/**
 * Best-first (`.sort`) comparator that ranks shows the way the screen reads them:
 * by the ROUNDED displayed score DESC (so two shows printing the same number tie
 * rather than flipping on invisible precision), then by rating count DESC (more
 * ratings ranks higher), then by the canonical show ordering DESC (newest-first),
 * mirroring `showOrderBySql(..., "DESC")`, as a fully deterministic final key.
 *
 * `decimals` defaults to {@link RATING_DISPLAY_DECIMALS_DEFAULT}: the Top Rated
 * ranking is one global artifact shared by every viewer, so it rounds at the fixed
 * default rather than any one viewer's per-user precision setting.
 */
export function displayedRatingComparator(
  decimals: number = RATING_DISPLAY_DECIMALS_DEFAULT,
): (a: DisplayedRatingRankable, b: DisplayedRatingRankable) => number {
  return (a, b) => {
    const ratingA = roundRatingForDisplay(a.rating, decimals);
    const ratingB = roundRatingForDisplay(b.rating, decimals);
    if (ratingA !== ratingB) return ratingB - ratingA;
    if (a.count !== b.count) return b.count - a.count;
    // DESC of the chronological ASC comparator: newest-first among full ties.
    return -compareByShowDate(a, b);
  };
}
