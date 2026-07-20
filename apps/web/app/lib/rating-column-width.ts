import { clampRatingDecimals } from "@bip/domain";

/**
 * Fixed width for a rating-table column, sized to the busiest badge form at the
 * viewer's chosen precision: "★ 5.0000 · 999 | 4½" — the score, the 3-digit vote
 * count, and the viewer's own half-step rating (4½ is the widest valid user
 * value; ratings cap at 5). Each extra decimal is ~one tabular digit (~0.5rem)
 * wider, so the width scales off the 2-decimal base (8.25rem desktop / 6.75rem
 * mobile, measured ~120px / ~103px busiest with ~12px / ~5px slack). The setlist
 * and performance tables share this so their rating columns read consistently.
 * The 5-star editor pops in a popover overlaying the badge, so the column never
 * needs a wider expanded state.
 *
 * Lives in `lib` rather than beside the rating cell so the column factories can
 * import it even in tests that mock the cell component.
 */
export function ratingColumnWidth(decimals: number): { fixedWidth: string; mobileFixedWidth: string } {
  const extra = (clampRatingDecimals(decimals) - 2) * 0.5;
  return { fixedWidth: `${8.25 + extra}rem`, mobileFixedWidth: `${6.75 + extra}rem` };
}
