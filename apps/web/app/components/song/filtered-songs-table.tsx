import type { Song } from "@bip/domain";
import { useMemo } from "react";
import { PerformanceFilterControls } from "~/components/performance/performance-filter-controls";
import { usePerformancePageFilters } from "~/hooks/use-performance-page-filters";
import { hasNarrowingFilter } from "~/lib/played-filter";
import { SongsTable } from "./songs-table";

interface FilteredSongsTableProps {
  songs: Song[];
  extraParams?: Record<string, string>;
  hideTimeRange?: boolean;
  /**
   * Scope the table to a single author (author page / musician page): the
   * author filter is hidden and every fetch is pinned to this author. Unlike
   * the /songs index — whose React Router loader is filter-aware — these pages
   * have unrelated (often heavy) loaders, so filter changes client-fetch
   * `/api/songs` with the author pinned rather than revalidating the loader.
   */
  pinnedAuthorId?: string;
}

const searchFilter = (song: Song, query: string) => song.title.toLowerCase().includes(query);

export function FilteredSongsTable({ songs, extraParams, hideTimeRange, pinnedAuthorId }: FilteredSongsTableProps) {
  const effectiveExtraParams = useMemo(
    () => (pinnedAuthorId ? { ...extraParams, author: pinnedAuthorId } : extraParams),
    [pinnedAuthorId, extraParams],
  );
  const {
    filteredData: filteredSongs,
    isLoading,
    selectedTimeRange,
    kindFilter,
    selectedAuthor,
    selectedMusician,
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
    extraParams: effectiveExtraParams,
    searchFilter,
    // /songs and its tabs run their loader through fetchFilteredSongs, so
    // React Router's loader revalidation refreshes data on filter changes —
    // the hook's client fetch would be a duplicate request. Pinned (author /
    // musician) pages have their own loaders, so they DO client-fetch.
    skipClientFetch: !pinnedAuthorId,
  });

  // Show the Filtered Plays column only when a narrowing filter is active
  // (date range, attended, a toggle like Set Opener/Encore, or a musician).
  // Cover and author aren't narrowing — they pick which songs appear but every
  // matching song still surfaces its full play history. A musician IS narrowing
  // (like the time range), so it surfaces the filtered columns. Tab-baked
  // extraParams (e.g. /songs/this-year) always carry a time range, so they
  // count as a date range here.
  const hasDateRange = selectedTimeRange !== "all" || !!extraParams;
  const hasAttendedUser = activeToggleSet.has("attended");
  const hasToggleFilters = [...activeToggleSet].some((key) => key !== "attended");
  const showFilteredPlays =
    hasNarrowingFilter({ hasDateRange, hasAttendedUser, hasToggleFilters, hasMusician: !!selectedMusician }) &&
    playedFilter !== "notPlayed";

  const filterControls = (
    <PerformanceFilterControls
      selectedTimeRange={selectedTimeRange}
      activeToggleSet={activeToggleSet}
      updateFilter={updateFilter}
      toggleFilter={toggleFilter}
      clearFilters={clearFilters}
      kindFilter={pinnedAuthorId ? undefined : kindFilter}
      selectedAuthor={pinnedAuthorId ? undefined : selectedAuthor}
      selectedMusician={selectedMusician}
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
