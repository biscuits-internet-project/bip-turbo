import { type AllTimersPageView, CacheKeys } from "@bip/domain";
import { ArrowLeft, Flame } from "lucide-react";
import { Link } from "react-router-dom";
import { AuthorSearch } from "~/components/author/author-search";
import { PerformanceTable } from "~/components/performance";
import { PerformanceFilterControls } from "~/components/performance/performance-filter-controls";
import { SelectFilter } from "~/components/ui/filters";
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
    filteredPerformances,
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
    allPerformances,
    apiUrl: "/api/all-timers",
    searchFilter: searchPerformance,
  });

  const extraSelectFilters = (
    <>
      <SelectFilter
        id="cover-filter"
        label="Original / Cover"
        value={coverFilter}
        onValueChange={(value) => updateFilter({ cover: value })}
        options={[
          { value: "all", label: "All" },
          { value: "original", label: "Original" },
          { value: "cover", label: "Cover" },
        ]}
        placeholder="Type"
        width="w-[120px]"
      />
      <div className="flex flex-col">
        <label
          htmlFor="author-search"
          className="text-xs font-medium text-content-text-secondary uppercase tracking-wide mb-1.5 h-[18px] flex items-center"
        >
          Author
        </label>
        <AuthorSearch
          value={selectedAuthor}
          onValueChange={(value) => updateFilter({ author: value === "none" ? null : value })}
          placeholder="All Authors"
          className="w-[150px] sm:w-[200px] h-[42px]"
        />
      </div>
    </>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Flame className="h-6 w-6 text-orange-500" />
          <h1 className="text-3xl md:text-4xl font-bold text-content-text-primary">All-Timers</h1>
        </div>
        <Link
          to="/songs"
          className="flex items-center gap-1 text-content-text-tertiary hover:text-content-text-secondary text-sm transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          <span>Back to songs</span>
        </Link>
      </div>

      <PerformanceTable
        performances={filteredPerformances}
        showSongColumn
        headerContent={
          <PerformanceFilterControls
            selectedYear={selectedYear}
            selectedEra={selectedEra}
            activeToggleSet={activeToggleSet}
            updateFilter={updateFilter}
            toggleFilter={toggleFilter}
            clearFilters={clearFilters}
            extraSelectFilters={extraSelectFilters}
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
