import type { Song } from "@bip/domain";
import { PerformanceFilterControls } from "~/components/performance/performance-filter-controls";
import { usePerformancePageFilters } from "~/hooks/use-performance-page-filters";
import { hasNarrowingFilter } from "~/lib/played-filter";
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
    // /songs and its tabs run their loader through fetchFilteredSongs, so
    // React Router's loader revalidation refreshes data on filter changes.
    // The hook's client fetch would be a duplicate request.
    skipClientFetch: true,
  });

  // Show the Filtered Plays column only when a narrowing filter is active
  // (date range, attended, or a toggle like Set Opener/Encore). Cover and
  // author aren't narrowing — they pick which songs appear but every
  // matching song still surfaces its full play history. Tab-baked
  // extraParams (e.g. /songs/this-year) always carry a time range, so they
  // count as a date range here.
  const hasDateRange = selectedTimeRange !== "all" || !!extraParams;
  const hasAttendedUser = activeToggleSet.has("attended");
  const hasToggleFilters = [...activeToggleSet].some((key) => key !== "attended");
  const showFilteredPlays =
    hasNarrowingFilter({ hasDateRange, hasAttendedUser, hasToggleFilters }) && playedFilter !== "notPlayed";

  const filterControls = (
    <PerformanceFilterControls
      selectedTimeRange={selectedTimeRange}
      activeToggleSet={activeToggleSet}
      updateFilter={updateFilter}
      toggleFilter={toggleFilter}
      clearFilters={clearFilters}
      coverFilter={coverFilter}
      selectedAuthor={selectedAuthor}
      playedFilter={playedFilter}
      searchValue={searchText}
      onSearchChange={setSearchText}
      hasActiveFilters={hasActiveFilters}
      hideTimeRange={hideTimeRange}
    />
  );

  return (
    <SongsTable
      songs={filteredSongs}
      filterComponent={filterControls}
      isLoading={isLoading}
      showFilteredPlays={showFilteredPlays}
    />
  );
}
