import type { TriState } from "~/lib/tri-state-filter";
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
}

function isActive(state: TriState | undefined): boolean {
  return state === "positive" || state === "negative";
}

/**
 * Return the number of shows per year that satisfy every active filter. The
 * year page uses this to render counts beside each year in Filter-by-Year.
 *
 * One DB read (all show dates + denormalized flags) plus at most two Redis
 * reads (nugs/archive catalogs, each a full date-keyed map) — work is flat
 * regardless of how many years exist. Both positive and negative tri-state
 * branches need the catalog: deciding "not in nugs" requires knowing which
 * dates are in nugs.
 */
export async function computeShowCountsByYear(flags: ShowCountsFilterFlags): Promise<Record<number, number>> {
  const needsNugs = isActive(flags.nugs);
  const needsArchive = isActive(flags.archive);

  const [showDates, nugsUrlsByDate, archiveUrlsByDate] = await Promise.all([
    services.shows.getShowDatesWithFlags(),
    needsNugs ? services.nugs.getReleaseUrlsByDate() : Promise.resolve<Record<string, string[]>>({}),
    needsArchive ? services.archiveDotOrg.getPrimaryUrlsByDate() : Promise.resolve<Record<string, string>>({}),
  ]);

  const counts: Record<number, number> = {};
  for (const show of showDates) {
    if (flags.photos === "positive" && !show.hasPhotos) continue;
    if (flags.photos === "negative" && show.hasPhotos) continue;
    if (flags.youtube === "positive" && !show.hasYoutube) continue;
    if (flags.youtube === "negative" && show.hasYoutube) continue;

    const hasNugs = Boolean(nugsUrlsByDate[show.date]?.length);
    if (flags.nugs === "positive" && !hasNugs) continue;
    if (flags.nugs === "negative" && hasNugs) continue;

    const hasArchive = Boolean(archiveUrlsByDate[show.date]);
    if (flags.archive === "positive" && !hasArchive) continue;
    if (flags.archive === "negative" && hasArchive) continue;

    const year = Number.parseInt(show.date.slice(0, 4), 10);
    counts[year] = (counts[year] ?? 0) + 1;
  }
  return counts;
}
