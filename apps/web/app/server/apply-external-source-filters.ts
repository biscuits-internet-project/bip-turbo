import type { Setlist } from "@bip/domain";
import type { ShowExternalSources } from "~/components/setlist/show-external-badges";
import { type ExternalSourceFilterFlags, matchesExternalSources } from "~/lib/show-source-filters";
import { isAnyTriStateActive } from "~/lib/tri-state-filter";

export type { ExternalSourceFilterFlags };

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

  return setlists.filter((setlist) => matchesExternalSources(flags, externalSources[setlist.show.id]));
}
