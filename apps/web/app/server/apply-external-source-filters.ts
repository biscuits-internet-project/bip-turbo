import type { Setlist } from "@bip/domain";
import type { ShowExternalSources } from "~/components/setlist/show-external-badges";
import type { TriState } from "~/lib/tri-state-filter";

/**
 * Tri-state flags for the external-source filters that are NOT queryable in
 * Prisma (nugs/archive live in Redis catalogs). Photo and YouTube filters
 * live on the denormalized show counts and are applied in the DB query.
 *
 * - "positive" → keep only setlists with the source
 * - "negative" → keep only setlists without the source
 * - "empty" / undefined → no filter
 */
export interface ExternalSourceFilterFlags {
  nugs?: TriState;
  archive?: TriState;
}

function isActive(state: TriState | undefined): boolean {
  return state === "positive" || state === "negative";
}

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
  if (!isActive(flags.nugs) && !isActive(flags.archive)) return setlists;

  return setlists.filter((setlist) => {
    const sources = externalSources[setlist.show.id];
    const hasNugs = Boolean(sources?.nugsUrls?.length);
    const hasArchive = Boolean(sources?.archiveUrl);

    if (flags.nugs === "positive" && !hasNugs) return false;
    if (flags.nugs === "negative" && hasNugs) return false;
    if (flags.archive === "positive" && !hasArchive) return false;
    if (flags.archive === "negative" && hasArchive) return false;
    return true;
  });
}
