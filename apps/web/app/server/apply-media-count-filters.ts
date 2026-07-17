import type { Setlist } from "@bip/domain";
import { isAnyTriStateActive, matchesTriState, type TriState } from "~/lib/tri-state-filter";

/**
 * Tri-state flags for the year-page media toggles that ride on a show's
 * denormalized counts (showPhotosCount / showYoutubesCount).
 *
 * - "positive" → keep only shows WITH the media
 * - "negative" → keep only shows WITHOUT the media
 * - "empty" / undefined → no filter
 */
export type MediaCountFilterFlags = {
  photos?: TriState;
  youtube?: TriState;
};

/**
 * Drop setlists whose show media counts don't match the active flags. The year
 * page caches one unfiltered set per (year, sort) and narrows it here, so the
 * nine photo/youtube tri-state combinations share a single cached year blob
 * instead of each caching a near-full-year payload. Returns the input
 * reference unchanged when no flag is active (preserves reference equality for
 * the loader's every-request use), mirroring applyExternalSourceFilters.
 */
export function applyMediaCountFilters<T extends Pick<Setlist, "show">>(
  setlists: T[],
  flags: MediaCountFilterFlags,
): T[] {
  if (!isAnyTriStateActive(flags)) return setlists;

  return setlists.filter(
    (setlist) =>
      matchesTriState(flags.photos, setlist.show.showPhotosCount > 0) &&
      matchesTriState(flags.youtube, setlist.show.showYoutubesCount > 0),
  );
}
