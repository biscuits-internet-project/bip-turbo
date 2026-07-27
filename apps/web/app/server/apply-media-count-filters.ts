import type { Setlist } from "@bip/domain";
import { type MediaCountFilterFlags, matchesMediaCounts } from "~/lib/show-source-filters";
import { isAnyTriStateActive } from "~/lib/tri-state-filter";

export type { MediaCountFilterFlags };

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

  return setlists.filter((setlist) =>
    matchesMediaCounts(flags, setlist.show.showPhotosCount, setlist.show.showYoutubesCount),
  );
}
