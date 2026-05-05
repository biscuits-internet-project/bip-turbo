import type { FilterCondition } from "@bip/core/_shared/database/types";
import type { Setlist, Show } from "@bip/domain";
import type { ShowExternalSources } from "~/components/setlist/show-external-badges";
import type { PublicContext } from "~/lib/base-loaders";
import { services } from "~/server/services";
import { computeShowExternalSources } from "~/server/show-external-sources";
import { computeShowUserData, type ShowUserDataResponse } from "~/server/show-user-data";

const MIN_SHOW_RATINGS = 10;
const TOP_RATED_LIMIT = 100;

export interface TopRatedShowsLoaderData {
  setlists: Setlist[];
  year: number | null;
  minShowRatings: number;
  countsByYear: Record<number, number>;
  allCount: number;
  externalSources: Record<string, ShowExternalSources>;
  initialUserData: ShowUserDataResponse;
}

export async function getTopRatedShows(
  year: number | null,
  context: Pick<PublicContext, "currentUser">,
): Promise<TopRatedShowsLoaderData> {
  const yearFilters: FilterCondition<Show>[] = year
    ? [
        {
          field: "date",
          operator: "gte",
          value: `${year}-01-01`,
        },
        {
          field: "date",
          operator: "lte",
          value: `${year}-12-31`,
        },
      ]
    : [];
  const shows = await services.shows.search("", {
    pagination: { page: 1, limit: TOP_RATED_LIMIT },
    sort: [
      { field: "averageRating", direction: "desc" },
      { field: "ratingsCount", direction: "desc" },
      { field: "date", direction: "desc" },
    ],
    filters: [
      {
        field: "averageRating",
        operator: "gt",
        value: 0,
      },
      {
        field: "ratingsCount",
        operator: "gt",
        value: MIN_SHOW_RATINGS,
      },
      ...yearFilters,
    ],
    includes: ["venue"],
  });

  const showIds = shows.map((show) => show.id);
  const rawSetlists = await services.setlists.findManyByShowIds(showIds);
  // findManyByShowIds defaults to `date DESC` ordering, which wipes out the
  // rank order from the shows query. Reindex back into rank order here.
  const byShowId = new Map(rawSetlists.map((s) => [s.show.id, s]));
  const setlists = showIds.map((id) => byShowId.get(id)).filter((s): s is Setlist => s !== undefined);

  const externalSources = await computeShowExternalSources(setlists.map((s) => s.show));
  const initialUserData = await computeShowUserData(context, showIds);

  // Per-year counts for the year picker, capped by the page's row limit so
  // the number matches what actually appears when the user clicks that year.
  // Each year route returns at most TOP_RATED_LIMIT rows.
  const ratedShows = await services.shows.findMany({
    filters: [{ field: "ratingsCount", operator: "gt", value: MIN_SHOW_RATINGS }],
  });
  const countsByYear: Record<number, number> = {};
  for (const show of ratedShows) {
    const showYear = Number(String(show.date).slice(0, 4));
    countsByYear[showYear] = (countsByYear[showYear] ?? 0) + 1;
  }
  for (const yearKey of Object.keys(countsByYear)) {
    const n = Number(yearKey);
    countsByYear[n] = Math.min(countsByYear[n], TOP_RATED_LIMIT);
  }
  const allCount = Math.min(ratedShows.length, TOP_RATED_LIMIT);

  return {
    setlists,
    year,
    minShowRatings: MIN_SHOW_RATINGS,
    countsByYear,
    allCount,
    externalSources,
    initialUserData,
  };
}
