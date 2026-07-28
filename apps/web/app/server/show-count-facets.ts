import { type ShowCountFacets, showFacetMask } from "~/lib/show-count-facets";
import { services } from "~/server/services";

/**
 * Build the per-year, per-facet show counts that back Filter-by-Year.
 *
 * Returns the joint distribution rather than a filtered total so the year page
 * can ship one blob and let the browser derive the count for whichever filter
 * combination is active — the page's whole payload stays filter-independent,
 * which is what lets a filter toggle skip the loader entirely.
 *
 * One DB read (all show dates + denormalized flags) plus three catalog reads
 * (nugs/archive/relisten, each a full date-keyed map). The catalogs are memoized
 * in-process by DateIndexedCatalog and the same page already reads all three for
 * its badge strip, so in practice this adds no round trip.
 */
export async function computeShowCountFacets(): Promise<ShowCountFacets> {
  const [showDates, nugsUrlsByDate, archiveUrlsByDate, relistenUrlsByDate] = await Promise.all([
    services.shows.getShowDatesWithFlags(),
    services.nugs.getReleaseUrlsByDate(),
    services.archiveDotOrg.getPrimaryUrlsByDate(),
    services.relisten.getUrlsByDate(),
  ]);

  const facets: ShowCountFacets = {};
  for (const show of showDates) {
    const mask = showFacetMask({
      photos: show.hasPhotos,
      youtube: show.hasYoutube,
      nugs: Boolean(nugsUrlsByDate[show.date]?.length),
      archive: Boolean(archiveUrlsByDate[show.date]),
      relisten: Boolean(relistenUrlsByDate[show.date]),
    });

    const year = Number.parseInt(show.date.slice(0, 4), 10);
    const buckets = facets[year] ?? {};
    buckets[mask] = (buckets[mask] ?? 0) + 1;
    facets[year] = buckets;
  }
  return facets;
}
