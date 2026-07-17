import { matchesTriState, type TriState } from "~/lib/tri-state-filter";
import { services } from "~/server/services";

/**
 * Tri-state filter flags for {@link computeShowCountsByYear}. Mirrors the
 * toggle set in the year-page filter bar — each filter can be positive
 * (must have media), negative (must NOT have media), or empty (don't filter).
 * All non-empty flags combine with AND.
 */
export interface ShowCountsFilterFlags {
  photos?: TriState;
  youtube?: TriState;
  nugs?: TriState;
  archive?: TriState;
  relisten?: TriState;
}

function isActive(state: TriState | undefined): boolean {
  return state === "positive" || state === "negative";
}

/**
 * Return the number of shows per year that satisfy every active filter. The
 * year page uses this to render counts beside each year in Filter-by-Year.
 *
 * One DB read (all show dates + denormalized flags) plus at most three Redis
 * reads (nugs/archive/relisten catalogs, each a full date-keyed map) — work is
 * flat regardless of how many years exist. Both positive and negative tri-state
 * branches need the catalog: deciding "not in nugs" requires knowing which
 * dates are in nugs.
 */
export async function computeShowCountsByYear(flags: ShowCountsFilterFlags): Promise<Record<number, number>> {
  const needsNugs = isActive(flags.nugs);
  const needsArchive = isActive(flags.archive);
  const needsRelisten = isActive(flags.relisten);

  const [showDates, nugsUrlsByDate, archiveUrlsByDate, relistenUrlsByDate] = await Promise.all([
    services.shows.getShowDatesWithFlags(),
    needsNugs ? services.nugs.getReleaseUrlsByDate() : Promise.resolve<Record<string, string[]>>({}),
    needsArchive ? services.archiveDotOrg.getPrimaryUrlsByDate() : Promise.resolve<Record<string, string>>({}),
    needsRelisten ? services.relisten.getUrlsByDate() : Promise.resolve<Record<string, string>>({}),
  ]);

  const counts: Record<number, number> = {};
  for (const show of showDates) {
    if (!matchesTriState(flags.photos, show.hasPhotos)) continue;
    if (!matchesTriState(flags.youtube, show.hasYoutube)) continue;
    if (!matchesTriState(flags.nugs, Boolean(nugsUrlsByDate[show.date]?.length))) continue;
    if (!matchesTriState(flags.archive, Boolean(archiveUrlsByDate[show.date]))) continue;
    if (!matchesTriState(flags.relisten, Boolean(relistenUrlsByDate[show.date]))) continue;

    const year = Number.parseInt(show.date.slice(0, 4), 10);
    counts[year] = (counts[year] ?? 0) + 1;
  }
  return counts;
}
