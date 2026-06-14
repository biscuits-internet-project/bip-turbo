import type { SongPagePerformance } from "@bip/domain";
import { type ReactNode, useMemo } from "react";
import { PerformanceTable } from "~/components/performance";
import { PerformanceFilterControls } from "~/components/performance/performance-filter-controls";
import { searchPerformance, usePerformancePageFilters } from "~/hooks/use-performance-page-filters";
import { controlsHiddenByPreset } from "~/lib/preset-filters";

interface FilteredSongPerformanceTableProps {
  /**
   * Initial (SSR) performances. The host page reads them from its own loader
   * and passes them in, so this component stays decoupled from any particular
   * loader-data shape and can be embedded anywhere (all-timers, jam-charts,
   * musician page, …).
   */
  performances: SongPagePerformance[];
  /** Endpoint hit on filter changes. Defaults to the generic performances API. */
  apiUrl?: string;
  /**
   * Filters applied on every fetch and pinned. The `filters` key (a CSV of
   * toggle keys, e.g. `allTimer`) is unioned with the user's active toggles;
   * any other key is set verbatim. The matching filter controls are hidden
   * automatically (see `controlsHiddenByPreset`) so the preset can't be cleared.
   */
  presetFilters?: Record<string, string>;
  /**
   * When true and no narrowing filter is active, render `emptyPrompt` in place
   * of the table — for an unscoped explorer where listing everything would be
   * too much. Pages that carry a preset scope leave this false.
   */
  requiresFilter?: boolean;
  emptyPrompt?: ReactNode;
  /** Collapse the filter chrome on desktop too (dense pages like the musician profile). */
  collapsibleOnDesktop?: boolean;
}

export function FilteredSongPerformanceTable({
  performances,
  apiUrl = "/api/songs/performances",
  presetFilters,
  requiresFilter = false,
  emptyPrompt = null,
  collapsibleOnDesktop,
}: FilteredSongPerformanceTableProps) {
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
  } = usePerformancePageFilters<SongPagePerformance>({
    initialData: performances,
    apiUrl,
    extraParams: presetFilters,
    searchFilter: searchPerformance,
  });

  const hidden = useMemo(() => controlsHiddenByPreset(presetFilters), [presetFilters]);
  const controls = (
    <PerformanceFilterControls
      selectedTimeRange={selectedTimeRange}
      activeToggleSet={activeToggleSet}
      updateFilter={updateFilter}
      toggleFilter={toggleFilter}
      clearFilters={clearFilters}
      kindFilter={hidden.has("kind") ? undefined : kindFilter}
      selectedAuthor={hidden.has("author") ? undefined : selectedAuthor}
      selectedMusician={hidden.has("musician") ? undefined : selectedMusician}
      showAllTimerToggle={!hidden.has("allTimer")}
      showJamChartToggle={!hidden.has("jamChart")}
      hideTimeRange={hidden.has("timeRange")}
      searchValue={searchText}
      onSearchChange={setSearchText}
      hasActiveFilters={hasActiveFilters}
      collapsibleOnDesktop={collapsibleOnDesktop}
    />
  );

  // Explorer guard: with no narrowing filter applied, show the prompt instead
  // of the (unbounded) table, but keep the controls so a filter can be added.
  if (requiresFilter && !hasActiveFilters) {
    return (
      <div>
        {controls}
        {emptyPrompt}
      </div>
    );
  }

  return (
    <div>
      <PerformanceTable
        performances={filteredPerformances}
        isLoading={isLoading}
        showSongColumn
        showAllTimerColumn
        mobileFlamePriority
        showGapColumns={false}
        headerContent={controls}
      />
    </div>
  );
}
