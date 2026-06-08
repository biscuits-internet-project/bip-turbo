import { PerformanceTable } from "~/components/performance";
import { PerformanceFilterControls } from "~/components/performance/performance-filter-controls";
import { searchPerformance, usePerformancePageFilters } from "~/hooks/use-performance-page-filters";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import type { NoteworthyLoaderData } from "~/lib/noteworthy-performance-loader";

/**
 * Shared page body for the cross-song noteworthy-performance pages
 * (`/songs/all-timers`, `/songs/jam-charts`). The two routes differ
 * only in (a) the API endpoint they refetch from when filters change
 * and (b) which toggle chip is hidden because it matches the page's
 * base condition (All-Timer chip on all-timers, Jam Chart chip on
 * jam-charts).
 *
 * Kept in its own client-safe module — the loader factory lives in
 * `noteworthy-performance-loader.ts` so route components can render
 * this component without dragging server imports into the client
 * bundle (see PR #58 + apps/web/CLAUDE.md).
 */
export function NoteworthyPerformancePage({
  apiUrl,
  hideAllTimerToggle = false,
  hideJamChartToggle = false,
}: {
  apiUrl: string;
  hideAllTimerToggle?: boolean;
  hideJamChartToggle?: boolean;
}) {
  const { performances: allPerformances } = useSerializedLoaderData<NoteworthyLoaderData>();
  const {
    filteredData: filteredPerformances,
    isLoading,
    selectedTimeRange,
    kindFilter,
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
    apiUrl,
    searchFilter: searchPerformance,
  });

  return (
    <div>
      <PerformanceTable
        performances={filteredPerformances}
        isLoading={isLoading}
        showSongColumn
        showAllTimerColumn
        mobileFlamePriority
        showGapColumns={false}
        headerContent={
          <PerformanceFilterControls
            selectedTimeRange={selectedTimeRange}
            activeToggleSet={activeToggleSet}
            updateFilter={updateFilter}
            toggleFilter={toggleFilter}
            clearFilters={clearFilters}
            kindFilter={kindFilter}
            selectedAuthor={selectedAuthor}
            showAllTimerToggle={!hideAllTimerToggle}
            showJamChartToggle={!hideJamChartToggle}
            searchValue={searchText}
            onSearchChange={setSearchText}
            hasActiveFilters={hasActiveFilters}
          />
        }
      />
    </div>
  );
}
