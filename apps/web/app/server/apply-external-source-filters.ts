import type { SetlistLight } from "@bip/domain";
import type { ShowExternalSources } from "~/components/setlist/show-external-badges";

/**
 * Flags for the external-source filters that are NOT queryable in Prisma
 * (nugs/archive live in Redis catalogs). Photo and YouTube filters live on
 * the denormalized show counts and are applied in the DB query, not here.
 */
export interface ExternalSourceFilterFlags {
  nugs?: boolean;
  archive?: boolean;
}

/**
 * Drop setlists whose resolved external sources don't include the links
 * required by the active flags. Returns the input reference unchanged when
 * no flag is set so callers can use it unconditionally on every request.
 */
export function applyExternalSourceFilters<T extends Pick<SetlistLight, "show">>(
  setlists: T[],
  externalSources: Record<string, ShowExternalSources>,
  flags: ExternalSourceFilterFlags,
): T[] {
  if (!flags.nugs && !flags.archive) return setlists;

  return setlists.filter((setlist) => {
    const sources = externalSources[setlist.show.id];
    if (flags.nugs && !sources?.nugsUrl) return false;
    if (flags.archive && !sources?.archiveUrl) return false;
    return true;
  });
}
