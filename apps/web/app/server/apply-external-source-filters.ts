import type { Setlist } from "@bip/domain";
import type { ShowExternalSources } from "~/components/setlist/show-external-badges";
import { isAnyTriStateActive, matchesTriState, type TriState } from "~/lib/tri-state-filter";

/**
 * Tri-state flags for the external-source filters that are NOT queryable in
 * Prisma (nugs/archive/relisten live in Redis catalogs). The photo/youtube
 * counterpart lives on the denormalized show counts and is applied by
 * applyMediaCountFilters.
 *
 * - "positive" → keep only setlists with the source
 * - "negative" → keep only setlists without the source
 * - "empty" / undefined → no filter
 */
export type ExternalSourceFilterFlags = {
  nugs?: TriState;
  archive?: TriState;
  relisten?: TriState;
};

/**
 * Drop setlists whose resolved external sources don't match the active
 * flags. Returns the input reference unchanged when no flag is active so
 * callers can use it unconditionally on every request without breaking
 * downstream reference equality.
 */
export function applyExternalSourceFilters<T extends Pick<Setlist, "show">>(
  setlists: T[],
  externalSources: Record<string, ShowExternalSources>,
  flags: ExternalSourceFilterFlags,
): T[] {
  if (!isAnyTriStateActive(flags)) return setlists;

  return setlists.filter((setlist) => {
    const sources = externalSources[setlist.show.id];
    const hasNugs = Boolean(sources?.nugsUrls?.length);
    const hasArchive = Boolean(sources?.archiveUrl);
    const hasRelisten = Boolean(sources?.relistenUrl);
    return (
      matchesTriState(flags.nugs, hasNugs) &&
      matchesTriState(flags.archive, hasArchive) &&
      matchesTriState(flags.relisten, hasRelisten)
    );
  });
}
