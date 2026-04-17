import type { Song } from "@bip/domain";
import { PerformanceFilterControls } from "~/components/performance/performance-filter-controls";
import { usePerformancePageFilters } from "~/hooks/use-performance-page-filters";
import { SongsTable } from "./songs-table";

interface FilteredSongsTableProps {
  songs: Song[];
  extraParams?: Record<string, string>;
  hideTimeRange?: boolean;
}

const searchFilter = (song: Song, query: string) => song.title.toLowerCase().includes(query);

export function FilteredSongsTable({ songs, extraParams, hideTimeRange }: FilteredSongsTableProps) {
  const {
    filteredData: filteredSongs,
    isLoading,
    selectedTimeRange,
    coverFilter,
    selectedAuthor,
    playedFilter,
    activeToggleSet,
    hasActiveFilters,
    searchText,
    setSearchText,
    updateFilter,
    toggleFilter,
    clearFilters,
  } = usePerformancePageFilters<Song>({
    initialData: songs,
    apiUrl: "/api/songs",
    extraParams,
    searchFilter,
  });

  const hasDateRange = selectedTimeRange !== "all";
  const showPlayedFilter = hasDateRange || activeToggleSet.has("attended");

  const filterControls = (
    <PerformanceFilterControls
      selectedTimeRange={selectedTimeRange}
      activeToggleSet={activeToggleSet}
      updateFilter={updateFilter}
      toggleFilter={toggleFilter}
      clearFilters={clearFilters}
      coverFilter={coverFilter}
      selectedAuthor={selectedAuthor}
      playedFilter={showPlayedFilter ? playedFilter : undefined}
      searchValue={searchText}
      onSearchChange={setSearchText}
      hasActiveFilters={hasActiveFilters}
      hideTimeRange={hideTimeRange}
    />
  );

  return <SongsTable songs={filteredSongs} filterComponent={filterControls} isLoading={isLoading} />;
}
