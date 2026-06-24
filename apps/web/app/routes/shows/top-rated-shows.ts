import type { RatingMode } from "@bip/core";
import type { Setlist } from "@bip/domain";
import { type DehydratedState, dehydrate } from "@tanstack/react-query";
import type { ShowExternalSources } from "~/components/setlist/show-external-badges";
import type { PublicContext } from "~/lib/base-loaders";
import { showUserDataQueryKey } from "~/lib/query-keys";
import { createPrefetchClient } from "~/lib/query-prefetch";
import { services } from "~/server/services";
import { computeShowExternalSources } from "~/server/show-external-sources";
import { computeShowUserData } from "~/server/show-user-data";
import { resolveViewerRatingMode } from "~/server/viewer-rating";

const MIN_SHOW_RATINGS = 10;
const TOP_RATED_LIMIT = 100;

export interface TopRatedShowsLoaderData {
  setlists: Setlist[];
  year: number | null;
  mode: RatingMode;
  minShowRatings: number;
  countsByYear: Record<number, number>;
  allCount: number;
  externalSources: Record<string, ShowExternalSources>;
  dehydratedState: DehydratedState;
}

export async function getTopRatedShows(
  year: number | null,
  context: Pick<PublicContext, "currentUser">,
): Promise<TopRatedShowsLoaderData> {
  // Reorder per viewer: calibrated-mode viewers see the shrunk weighted ranking,
  // everyone else the canonical-average ranking.
  const { mode } = await resolveViewerRatingMode(context);
  // The calibrated score already shrinks thin shows toward the global average, so
  // it needs no ratings floor; the simple average has no such guard, so it keeps one
  // (else a single 5.0 vote tops the list).
  const minRatings = mode === "calibrated" ? 0 : MIN_SHOW_RATINGS;

  // One eligible+ranked set feeds both the list and the year-picker counts, so the
  // counts can't disagree with what the list shows.
  const ranked = await services.raterWeights.rankedShows(mode, minRatings);
  const showYear = (date: string) => Number(date.slice(0, 4));

  const inScope = year ? ranked.filter((show) => showYear(show.date) === year) : ranked;
  const showIds = inScope.slice(0, TOP_RATED_LIMIT).map((show) => show.id);
  const rawSetlists = await services.setlists.findManyByShowIds(showIds);
  // findManyByShowIds defaults to `date DESC` ordering, which wipes out the
  // rank order from the shows query. Reindex back into rank order here.
  const byShowId = new Map(rawSetlists.map((s) => [s.show.id, s]));
  const setlists = showIds.map((id) => byShowId.get(id)).filter((s): s is Setlist => s !== undefined);

  const externalSources = await computeShowExternalSources(setlists.map((s) => s.show));

  const queryClient = createPrefetchClient();
  await queryClient.prefetchQuery({
    queryKey: showUserDataQueryKey(showIds),
    queryFn: () => computeShowUserData(context, showIds),
  });

  // Per-year counts for the year picker, grouped off the same ranked set, capped
  // by the page's row limit so each number matches what the list shows when that
  // year is opened.
  const countsByYear: Record<number, number> = {};
  for (const show of ranked) {
    const yr = showYear(show.date);
    countsByYear[yr] = (countsByYear[yr] ?? 0) + 1;
  }
  for (const yr of Object.keys(countsByYear)) {
    countsByYear[Number(yr)] = Math.min(countsByYear[Number(yr)], TOP_RATED_LIMIT);
  }
  const allCount = Math.min(ranked.length, TOP_RATED_LIMIT);

  return {
    setlists,
    year,
    mode,
    minShowRatings: minRatings,
    countsByYear,
    allCount,
    externalSources,
    dehydratedState: dehydrate(queryClient),
  };
}
