import { services } from "~/server/services";

/**
 * Filter flags accepted by {@link computeShowCountsByYear}. Mirrors the
 * toggle set in the year-page filter bar. All active flags combine with AND.
 */
export interface ShowCountsFilterFlags {
  photos?: boolean;
  youtube?: boolean;
  nugs?: boolean;
  archive?: boolean;
}

/**
 * Return the number of shows per year that satisfy every active filter. The
 * year page uses this to render counts beside each year in Filter-by-Year.
 *
 * One DB read (all show dates + denormalized flags) plus at most two Redis
 * reads (nugs/archive catalogs, each a full date-keyed map) — work is flat
 * regardless of how many years exist.
 */
export async function computeShowCountsByYear(flags: ShowCountsFilterFlags): Promise<Record<number, number>> {
  const needsNugs = Boolean(flags.nugs);
  const needsArchive = Boolean(flags.archive);

  const [showDates, nugsUrlsByDate, archiveUrlsByDate] = await Promise.all([
    services.shows.getShowDatesWithFlags(),
    needsNugs ? services.nugs.getReleaseUrlsByDate() : Promise.resolve<Record<string, string>>({}),
    needsArchive ? services.archiveDotOrg.getPrimaryUrlsByDate() : Promise.resolve<Record<string, string>>({}),
  ]);

  const counts: Record<number, number> = {};
  for (const show of showDates) {
    if (flags.photos && !show.hasPhotos) continue;
    if (flags.youtube && !show.hasYoutube) continue;
    if (needsNugs && !nugsUrlsByDate[show.date]) continue;
    if (needsArchive && !archiveUrlsByDate[show.date]) continue;

    const year = Number.parseInt(show.date.slice(0, 4), 10);
    counts[year] = (counts[year] ?? 0) + 1;
  }
  return counts;
}
