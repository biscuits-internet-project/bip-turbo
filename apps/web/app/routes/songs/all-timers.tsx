import { type AllTimersPageView, CacheKeys } from "@bip/domain";
import { type DehydratedState, dehydrate } from "@tanstack/react-query";
import { PerformanceTable } from "~/components/performance";
import { PerformanceFilterControls } from "~/components/performance/performance-filter-controls";
import { searchPerformance, usePerformancePageFilters } from "~/hooks/use-performance-page-filters";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { showUserDataQueryKey, trackUserRatingsQueryKey } from "~/lib/query-keys";
import { createPrefetchClient } from "~/lib/query-prefetch";
import { services } from "~/server/services";
import { computeShowUserData } from "~/server/show-user-data";
import { computeTrackUserRatings } from "~/server/track-user-ratings";

type LoaderData = AllTimersPageView & { dehydratedState: DehydratedState };

export const loader = publicLoader(async ({ context }): Promise<LoaderData> => {
  const cacheKey = CacheKeys.songs.allTimers();
  const cacheOptions = { ttl: 3600 };

  const view = await services.cache.getOrSet(
    cacheKey,
    async () => services.songPageComposer.buildAllTimers(),
    cacheOptions,
  );

  const trackIds = view.performances.map((p) => p.trackId);
  const showIds = [...new Set(view.performances.map((p) => p.show.id))];
  const queryClient = createPrefetchClient();
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: trackUserRatingsQueryKey(trackIds),
      queryFn: () => computeTrackUserRatings(context, trackIds),
    }),
    queryClient.prefetchQuery({
      queryKey: showUserDataQueryKey(showIds),
      queryFn: () => computeShowUserData(context, showIds),
    }),
  ]);

  return { ...view, dehydratedState: dehydrate(queryClient) };
});

export function meta() {
  return [{ title: "All-Timers | Songs" }, { name: "description", content: "The best performances across all songs" }];
}

export default function AllTimersPage() {
  const { performances: allPerformances } = useSerializedLoaderData<LoaderData>();
  const {
    filteredData: filteredPerformances,
    isLoading,
    selectedTimeRange,
    coverFilter,
    selectedAuthor,
    activeToggleSet,
    hasActiveFilters,
    searchText,
    setSearchText,
    updateFilter,
    toggleFilter,
    clearFilters,
  } = usePerformancePageFilters({
    initialData: allPerformances,
    apiUrl: "/api/all-timers",
    searchFilter: searchPerformance,
  });

  return (
    <div>
      <PerformanceTable
        performances={filteredPerformances}
        isLoading={isLoading}
        showSongColumn
        showGapColumns={false}
        headerContent={
          <PerformanceFilterControls
            selectedTimeRange={selectedTimeRange}
            activeToggleSet={activeToggleSet}
            updateFilter={updateFilter}
            toggleFilter={toggleFilter}
            clearFilters={clearFilters}
            coverFilter={coverFilter}
            selectedAuthor={selectedAuthor}
            showAllTimerToggle={false}
            searchValue={searchText}
            onSearchChange={setSearchText}
            hasActiveFilters={hasActiveFilters}
          />
        }
      />
    </div>
  );
}
