import { type AllTimersPageView, CacheKeys } from "@bip/domain";
import { PerformanceTable } from "~/components/performance";
import { PerformanceFilterControls } from "~/components/performance/performance-filter-controls";
import { searchPerformance, usePerformancePageFilters } from "~/hooks/use-performance-page-filters";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { services } from "~/server/services";

export const loader = publicLoader(async (): Promise<AllTimersPageView> => {
  const cacheKey = CacheKeys.songs.allTimers();
  const cacheOptions = { ttl: 3600 };

  return await services.cache.getOrSet(cacheKey, async () => services.songPageComposer.buildAllTimers(), cacheOptions);
});

export function meta() {
  return [{ title: "All-Timers | Songs" }, { name: "description", content: "The best performances across all songs" }];
}

export default function AllTimersPage() {
  const { performances: allPerformances } = useSerializedLoaderData<AllTimersPageView>();
  const {
    filteredData: filteredPerformances,
    isLoading,
    selectedYear,
    selectedEra,
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
        headerContent={
          <PerformanceFilterControls
            selectedYear={selectedYear}
            selectedEra={selectedEra}
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
