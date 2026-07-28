import type { Setlist } from "@bip/domain";
import { type MediaCountFilterFlags, matchesMediaCounts } from "~/lib/show-source-filters";
import { isAnyTriStateActive } from "~/lib/tri-state-filter";

/**
 * Drop setlists whose show media counts don't match the active flags. The year
 * page loads one unfiltered set per (year, sort) and narrows it here in the
 * browser, so the nine photo/youtube tri-state combinations share a single
 * cached year blob — server-side and at the edge — instead of each fetching a
 * near-full-year payload of their own. Returns the input reference unchanged
 * when no flag is active, mirroring applyExternalSourceFilters.
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
