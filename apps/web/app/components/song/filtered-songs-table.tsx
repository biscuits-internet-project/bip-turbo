import type { Song } from "@bip/domain";
import { useMemo } from "react";
import { PerformanceFilterControls } from "~/components/performance/performance-filter-controls";
import { usePerformancePageFilters } from "~/hooks/use-performance-page-filters";
import { hasNarrowingFilter } from "~/lib/played-filter";
import { controlsHiddenByPreset } from "~/lib/preset-filters";
import { SongsTable } from "./songs-table";

interface FilteredSongsTableProps {
  songs: Song[];
  extraParams?: Record<string, string>;
  hideTimeRange?: boolean;
  /**
   * Filters applied on every fetch and pinned (author page / musician page) —
   * e.g. `{ author: id }` or `{ musician: id }`. Unlike the /songs index, whose
   * React Router loader is filter-aware, these pages have unrelated (often
   * heavy) loaders, so a preset switches the table to client-fetch `/api/songs`
   * with the preset pinned rather than revalidating the loader. The matching
   * filter controls are hidden automatically (see `controlsHiddenByPreset`).
   * Pass a referentially stable object (memoize at the call site) so the client
   * fetch doesn't re-run every render.
   */
  presetFilters?: Record<string, string>;
  /**
   * Musician profile: show the standard single column set sourced from this
   * musician's scoped stats, instead of pairing all-time and filtered columns.
   */
  filteredAsPrimary?: boolean;
}

const searchFilter = (song: Song, query: string) => song.title.toLowerCase().includes(query);

export function FilteredSongsTable({
  songs,
  extraParams,
  hideTimeRange,
  presetFilters,
  filteredAsPrimary,
}: FilteredSongsTableProps) {
  const effectiveExtraParams = useMemo(
    () => (presetFilters ? { ...extraParams, ...presetFilters } : extraParams),
    [presetFilters, extraParams],
  );
  const hidden = useMemo(() => controlsHiddenByPreset(presetFilters), [presetFilters]);
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
    skipClientFetch: !presetFilters,
  });

  // Show the Filtered Plays column only when a narrowing filter is active
  // (date range, attended, a toggle like Set Opener/Encore, or a musician).
  // Cover and author aren't narrowing — they pick which songs appear but every
  // matching song still surfaces its full play history. A musician IS narrowing
  // (like the time range), so it surfaces the filtered columns — including a
  // pinned musician (which rides presetFilters, not the visible filter state).
  // Tab-baked extraParams (e.g. /songs/this-year) always carry a time range, so
  // they count as a date range here.
  const hasDateRange = selectedTimeRange !== "all" || !!extraParams;
  const hasAttendedUser = activeToggleSet.has("attended");
  const hasToggleFilters = [...activeToggleSet].some((key) => key !== "attended");
  const hasMusician = !!selectedMusician || presetFilters?.musician != null;
  const showFilteredPlays =
    hasNarrowingFilter({ hasDateRange, hasAttendedUser, hasToggleFilters, hasMusician }) &&
    playedFilter !== "notPlayed";

  const filterControls = (
    <PerformanceFilterControls
      selectedTimeRange={selectedTimeRange}
      activeToggleSet={activeToggleSet}
      updateFilter={updateFilter}
      toggleFilter={toggleFilter}
      clearFilters={clearFilters}
      kindFilter={hidden.has("kind") ? undefined : kindFilter}
      selectedAuthor={hidden.has("author") ? undefined : selectedAuthor}
      selectedMusician={hidden.has("musician") ? undefined : selectedMusician}
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
      filteredAsPrimary={filteredAsPrimary}
    />
  );
}
