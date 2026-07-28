import { matchesTriState, type TriState } from "~/lib/tri-state-filter";

/**
 * One bit per media/source flag, packed into a single number so a year's show
 * counts can be shipped as a joint distribution rather than one total per
 * filter combination. Values are part of the wire format between
 * `computeShowCountFacets` and {@link showCountsByYearFromFacets} — changing
 * one silently remaps every cached blob, so treat them as fixed.
 */
const SHOW_FACET_BITS = {
  photos: 1,
  youtube: 2,
  nugs: 4,
  archive: 8,
  relisten: 16,
} as const;

type ShowFacetKey = keyof typeof SHOW_FACET_BITS;

/** Whether one show has each of the five media/sources. */
export type ShowFacetFlags = Record<ShowFacetKey, boolean>;

/**
 * Per-year show counts grouped by facet mask: `year → mask → count`.
 *
 * This is the filter-independent form of "how many shows does each year have".
 * Five binary flags means at most 32 buckets per year, so ~30 years of catalog
 * collapses to a few KB — small enough to ship whole and let the browser derive
 * the count for whichever of the 243 tri-state combinations is active, instead
 * of asking the server for a fresh total on every filter toggle.
 */
export type ShowCountFacets = Record<number, Record<number, number>>;

/** Tri-state per flag; anything absent or `"empty"` doesn't filter. */
export type ShowCountFilterFlags = Partial<Record<ShowFacetKey, TriState>>;

const FACET_KEYS = Object.keys(SHOW_FACET_BITS) as ShowFacetKey[];

/** Total number of distinct masks: one per subset of the five flags. */
const MASK_COUNT = 1 << FACET_KEYS.length;

/** Pack one show's flags into the mask that buckets it. */
export function showFacetMask(has: ShowFacetFlags): number {
  let mask = 0;
  for (const key of FACET_KEYS) {
    if (has[key]) mask |= SHOW_FACET_BITS[key];
  }
  return mask;
}

/**
 * Collapse a facet blob down to the per-year totals that Filter-by-Year renders
 * beside each year, keeping only shows that satisfy every active flag.
 *
 * Years whose buckets all fail the filter are omitted rather than zeroed, so a
 * caller can still tell "no data" from "no matches".
 */
export function showCountsByYearFromFacets(
  facets: ShowCountFacets,
  flags: ShowCountFilterFlags,
): Record<number, number> {
  // Decide the 32 masks once instead of re-testing five tri-states per year.
  const allowed: boolean[] = [];
  for (let mask = 0; mask < MASK_COUNT; mask++) {
    allowed[mask] = FACET_KEYS.every((key) => matchesTriState(flags[key], (mask & SHOW_FACET_BITS[key]) !== 0));
  }

  const counts: Record<number, number> = {};
  for (const [year, buckets] of Object.entries(facets)) {
    let total = 0;
    for (const [mask, count] of Object.entries(buckets)) {
      if (allowed[Number(mask)]) total += count;
    }
    if (total > 0) counts[Number(year)] = total;
  }
  return counts;
}
