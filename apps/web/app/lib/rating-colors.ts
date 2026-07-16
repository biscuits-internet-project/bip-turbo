/**
 * Maps a rating to the color its digits render in, so a viewer can tell a
 * strong show from a weak one, and their own score from the crowd's, without
 * reading the numbers. The value is dynamic, so it can't be a Tailwind
 * className — like `chart-colors.ts`, this file holds literal hex equivalents
 * of design tokens and is the single source of truth for the ramp.
 *
 * Deliberately anchored to the nominal 0.5-5 scale rather than to the observed
 * distribution (show averages cluster around a 4.00 median). A fixed ramp is
 * legible without knowing the stats, and leaving a 4 visibly short of green
 * reflects what a 4 actually means.
 */

/**
 * Ramp endpoints, as literal hex equivalents of the design tokens named below.
 * They're duplicated from `styles.css` rather than read from it because the
 * ramp interpolates *between* them: that needs numeric channels, which a CSS
 * custom property can't give a pure function at module scope. `rating-colors.test.ts`
 * pins each one to its token, so a retuned token fails the build instead of
 * silently leaving the ramp on the old color.
 */
export const RATING_COLOR_PURPLE = "#ac6ef7"; // --color-brand-primary
export const RATING_COLOR_NEUTRAL = "#bcbcc2"; // --color-content-text-secondary
export const RATING_COLOR_GREEN = "#30e87d"; // --color-brand-tertiary

/** The token each endpoint mirrors, as the drift test reads them from styles.css. */
export const RATING_COLOR_TOKENS = {
  "--color-brand-primary": RATING_COLOR_PURPLE,
  "--color-content-text-secondary": RATING_COLOR_NEUTRAL,
  "--color-brand-tertiary": RATING_COLOR_GREEN,
} as const;

/** Ratings at or above this read as better than typical, below as worse. */
export const RATING_COLOR_PIVOT = 3.5;
/**
 * Distance from the pivot at which each end is fully reached: 0.5 and 5.0, the
 * ends of the rating scale itself. The two differ because the pivot isn't the
 * midpoint of the scale, so a symmetric span would have to clamp one side and
 * render every rating below it in the same flat color. Covering the whole scale
 * costs an uneven rate instead (green deepens faster per star than purple),
 * which is the better trade: no rating is ever indistinguishable from another.
 */
export const RATING_COLOR_SPAN_LOW = RATING_COLOR_PIVOT - 0.5;
export const RATING_COLOR_SPAN_HIGH = 5 - RATING_COLOR_PIVOT;

export function ratingColor(value: number): string {
  const above = value >= RATING_COLOR_PIVOT;
  const span = above ? RATING_COLOR_SPAN_HIGH : RATING_COLOR_SPAN_LOW;
  const distance = Math.min(Math.abs(value - RATING_COLOR_PIVOT) / span, 1);
  return mix(RATING_COLOR_NEUTRAL, above ? RATING_COLOR_GREEN : RATING_COLOR_PURPLE, distance);
}

function mix(from: string, to: string, amount: number): string {
  const a = channels(from);
  const b = channels(to);
  const mixed = a.map((channel, i) => Math.round(channel + (b[i] - channel) * amount));
  return `#${mixed.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

function channels(hex: string): [number, number, number] {
  const packed = Number.parseInt(hex.slice(1), 16);
  return [(packed >> 16) & 255, (packed >> 8) & 255, packed & 255];
}
