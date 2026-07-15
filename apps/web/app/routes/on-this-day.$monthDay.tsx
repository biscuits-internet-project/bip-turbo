import { CacheKeys, type Setlist, type SongPagePerformance } from "@bip/domain";
import type { DehydratedState } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";
import type { ClientLoaderFunctionArgs } from "react-router";
import { Link, redirect } from "react-router";
import { MonthDayPicker } from "~/components/on-this-day/month-day-picker";
import { PerformanceTable } from "~/components/performance";
import { PerformanceFilterControls } from "~/components/performance/performance-filter-controls";
import { SetlistList } from "~/components/setlist/setlist-list";
import type { ShowExternalSources } from "~/components/setlist/show-external-badges";
import { searchPerformance, usePerformancePageFilters } from "~/hooks/use-performance-page-filters";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { showUserDataQueryKey, trackUserRatingsQueryKey } from "~/lib/query-keys";
import { createPrefetchClient, dehydrateAndClear } from "~/lib/query-prefetch";
import { addDaysYearAgnostic, formatMonthDay, formatMonthDayShort, isValidMonthDay } from "~/lib/utils";
import { services } from "~/server/services";
import { computeShowExternalSources } from "~/server/show-external-sources";
import { computeShowUserData } from "~/server/show-user-data";
import { computeTrackUserRatings } from "~/server/track-user-ratings";

interface LoaderData {
  setlists: Setlist[];
  performances: SongPagePerformance[];
  monthDay: string;
  displayLabel: string;
  previousMonthDay: string;
  nextMonthDay: string;
  externalSources: Record<string, ShowExternalSources>;
  dehydratedState: DehydratedState;
}

export function headers(): Headers {
  const headers = new Headers();
  // max-age only, no `s-maxage`. This route has no Cache-Tag mapping any
  // subset of shows, so the edge has no purge path for show mutations.
  // Origin work is covered by Redis (setlists + jam-charts caches).
  headers.set("Cache-Control", "public, max-age=300");
  return headers;
}

export const loader = publicLoader(async ({ params, context }): Promise<LoaderData> => {
  const { monthDay } = params;

  if (!monthDay) {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    throw redirect(`/on-this-day/${mm}-${dd}`);
  }

  if (!isValidMonthDay(monthDay)) {
    throw new Response(null, { status: 404 });
  }

  const setlistsCacheKey = CacheKeys.shows.list({ monthDay, sort: "desc" });
  const jamChartsCacheKey = CacheKeys.songs.jamChartsOnThisDay(monthDay);

  const [setlists, jamChartsResult] = await Promise.all([
    services.cache.getOrSet(setlistsCacheKey, async () => {
      return services.setlists.findMany({
        filters: { monthDay },
        sort: [{ field: "date", direction: "desc" }],
      });
    }),
    services.cache.getOrSet(jamChartsCacheKey, async () => {
      return services.songPageComposer.buildSongPerformances({ jamChart: true, monthDay });
    }),
  ]);

  const displayLabel = formatMonthDay(monthDay);
  const previousMonthDay = addDaysYearAgnostic(monthDay, -1);
  const nextMonthDay = addDaysYearAgnostic(monthDay, 1);

  const setlistShowIds = setlists.map((s) => s.show.id);
  // Performance rows reference shows from any year that share this month-day,
  // so they cover a different (and usually larger) id set than the setlists.
  // PerformanceTable's useAttendanceRowHighlight calls useShowUserData with
  // those ids, so we must prefetch that key in addition to the setlist key.
  const performanceShowIds = [...new Set(jamChartsResult.performances.map((p) => p.show.id))];
  const trackIds = jamChartsResult.performances.map((p) => p.trackId);

  const queryClient = createPrefetchClient();
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: showUserDataQueryKey(setlistShowIds),
      queryFn: () => computeShowUserData(context, setlistShowIds),
    }),
    queryClient.prefetchQuery({
      queryKey: showUserDataQueryKey(performanceShowIds),
      queryFn: () => computeShowUserData(context, performanceShowIds),
    }),
    queryClient.prefetchQuery({
      queryKey: trackUserRatingsQueryKey(trackIds),
      queryFn: () => computeTrackUserRatings(context, trackIds),
    }),
  ]);

  return {
    setlists,
    performances: jamChartsResult.performances,
    monthDay,
    displayLabel,
    previousMonthDay,
    nextMonthDay,
    externalSources: await computeShowExternalSources(setlists.map((s) => s.show)),
    dehydratedState: dehydrateAndClear(queryClient),
  };
});

export function meta({ data }: { data: LoaderData }) {
  if (!data) return [{ title: "On This Day | Biscuits Internet Project" }];
  return [
    { title: `On This Day: ${data.displayLabel} | Biscuits Internet Project` },
    { name: "description", content: `Disco Biscuits shows and jam-chart performances on ${data.displayLabel}` },
  ];
}

export const clientLoader = async ({ serverLoader }: ClientLoaderFunctionArgs) => {
  return serverLoader();
};
clientLoader.hydrate = true;

const JAM_CHARTS_PAGE_SIZE = 10;

export default function OnThisDay() {
  const { setlists, performances, displayLabel, monthDay, previousMonthDay, nextMonthDay, externalSources } =
    useSerializedLoaderData<LoaderData>();

  const {
    filteredData: filteredPerformances,
    isLoading,
    selectedTimeRange,
    kindFilter,
    selectedAuthor,
    selectedMusician,
    activeToggleSet,
    hasActiveFilters,
    searchText,
    setSearchText,
    updateFilter,
    toggleFilter,
    clearFilters,
  } = usePerformancePageFilters({
    initialData: performances,
    apiUrl: "/api/songs/performances",
    extraParams: { filters: "jamChart", monthDay },
    searchFilter: searchPerformance,
  });

  return (
    <div className="py-2">
      <div className="space-y-6 md:space-y-8">
        <div className="relative">
          <h1 className="page-heading">ON THIS DAY</h1>
          <div className="flex justify-between items-center -mt-4">
            <Link
              to={`/on-this-day/${previousMonthDay}`}
              prefetch="intent"
              className="flex items-center gap-1 text-content-text-tertiary hover:text-content-text-secondary text-sm transition-colors"
            >
              <ChevronLeft className="h-3 w-3" />
              <span className="sm:hidden">{formatMonthDayShort(previousMonthDay)}</span>
              <span className="hidden sm:inline">{formatMonthDay(previousMonthDay)}</span>
            </Link>
            <MonthDayPicker monthDay={monthDay} displayLabel={displayLabel} />
            <Link
              to={`/on-this-day/${nextMonthDay}`}
              prefetch="intent"
              className="flex items-center gap-1 text-content-text-tertiary hover:text-content-text-secondary text-sm transition-colors"
            >
              <span className="sm:hidden">{formatMonthDayShort(nextMonthDay)}</span>
              <span className="hidden sm:inline">{formatMonthDay(nextMonthDay)}</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Flame className="h-6 w-6 text-content-text-secondary" />
              <h2 className="text-2xl font-bold text-content-text-primary">Jam Charts</h2>
            </div>
            <Link
              to="/songs/jam-charts"
              className="text-content-text-tertiary hover:text-content-text-secondary text-sm transition-colors"
            >
              View all →
            </Link>
          </div>
          {performances.length === 0 ? (
            <div className="text-center py-2">
              <p className="text-content-text-secondary text-lg">None on this date</p>
            </div>
          ) : (
            <PerformanceTable
              performances={filteredPerformances}
              isLoading={isLoading}
              showSongColumn
              showAllTimerColumn
              mobileFlamePriority
              showGapColumns={false}
              pageSize={JAM_CHARTS_PAGE_SIZE}
              headerContent={
                performances.length > JAM_CHARTS_PAGE_SIZE ? (
                  <PerformanceFilterControls
                    selectedTimeRange={selectedTimeRange}
                    activeToggleSet={activeToggleSet}
                    updateFilter={updateFilter}
                    toggleFilter={toggleFilter}
                    clearFilters={clearFilters}
                    kindFilter={kindFilter}
                    selectedAuthor={selectedAuthor}
                    selectedMusician={selectedMusician}
                    showJamChartToggle={false}
                    searchValue={searchText}
                    onSearchChange={setSearchText}
                    hasActiveFilters={hasActiveFilters}
                  />
                ) : undefined
              }
            />
          )}
        </div>

        <div className="space-y-4">
          <SetlistList
            setlists={setlists}
            externalSources={externalSources}
            empty={
              <div className="text-center py-8">
                <p className="text-content-text-secondary text-lg">No shows on {displayLabel}.</p>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}
