import { ChevronDown, Filter } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { AuthorSearch } from "~/components/author/author-search";
import { SelectFilter } from "~/components/ui/filters";
import { ToggleFilterGroup } from "~/components/ui/filters/toggle-filter-group";
import { Input } from "~/components/ui/input";
import { TIME_RANGE_GROUPS, TOGGLE_FILTER_DEFINITIONS } from "~/lib/song-filters";
import { cn } from "~/lib/utils";

const ALL_TOGGLE_FILTERS = TOGGLE_FILTER_DEFINITIONS as unknown as Array<{ key: string; label: string }>;

const TOGGLE_FILTERS_WITHOUT_ALL_TIMER = ALL_TOGGLE_FILTERS.filter((filter) => filter.key !== "allTimer");

const labelClass =
  "text-xs font-medium text-content-text-secondary uppercase tracking-wide mb-1.5 h-[18px] flex items-center";

interface PerformanceFilterControlsProps {
  selectedTimeRange: string;
  activeToggleSet: Set<string>;
  updateFilter: (updates: Record<string, string | null>) => void;
  toggleFilter: (key: string) => void;
  clearFilters: () => void;
  extraSelectFilters?: ReactNode;
  showAllTimerToggle?: boolean;
  hideTimeRange?: boolean;
  coverFilter?: string;
  selectedAuthor?: string | null;
  playedFilter?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  hasActiveFilters?: boolean;
}

export function PerformanceFilterControls({
  selectedTimeRange,
  activeToggleSet,
  updateFilter,
  toggleFilter,
  clearFilters,
  extraSelectFilters,
  showAllTimerToggle = true,
  hideTimeRange = false,
  coverFilter,
  selectedAuthor,
  playedFilter,
  searchValue,
  onSearchChange,
  hasActiveFilters = false,
}: PerformanceFilterControlsProps) {
  const toggleFilters = showAllTimerToggle ? ALL_TOGGLE_FILTERS : TOGGLE_FILTERS_WITHOUT_ALL_TIMER;
  const showPlayedFilter =
    playedFilter !== undefined &&
    (hideTimeRange ||
      selectedTimeRange !== "all" ||
      activeToggleSet.size > 0 ||
      (searchValue !== undefined && searchValue.length > 0));

  useEffect(() => {
    if (!showPlayedFilter && playedFilter !== undefined && playedFilter !== "all") {
      updateFilter({ played: null });
    }
  }, [showPlayedFilter, playedFilter, updateFilter]);

  const activeFilterCount =
    (searchValue && searchValue.length > 0 ? 1 : 0) +
    (!hideTimeRange && selectedTimeRange !== "all" ? 1 : 0) +
    (coverFilter && coverFilter !== "all" ? 1 : 0) +
    (selectedAuthor ? 1 : 0) +
    (playedFilter && playedFilter !== "all" ? 1 : 0) +
    activeToggleSet.size;

  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setMobileOpen((open) => !open)}
        // Mobile toggle re-shows on phone-landscape viewports — a
        // rotated phone has the same vertical-space crunch as portrait,
        // so the filter chrome collapses there too.
        className="sm:hidden short:!flex w-full flex items-center justify-between px-3 py-2 rounded-md bg-glass-bg border border-glass-border text-sm font-medium text-content-text-primary"
        aria-expanded={mobileOpen}
      >
        <span className="flex items-center gap-2">
          <Filter className="h-4 w-4" aria-hidden="true" />
          Filters
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-brand-primary/20 text-brand-primary text-xs">
              {activeFilterCount}
            </span>
          )}
        </span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", mobileOpen && "rotate-180")} />
      </button>
      <div
        data-testid="filter-content-wrapper"
        className={cn(
          "space-y-3 sm:block",
          mobileOpen ? "block" : "hidden",
          // …but on phone-landscape viewports follow the toggle state
          // instead of the sm: force-open. User can still expand by
          // clicking the toggle button.
          !mobileOpen && "short:!hidden",
        )}
      >
        <div className="flex items-end flex-wrap gap-x-3 gap-y-2">
          {searchValue !== undefined && onSearchChange && (
            <Input
              placeholder="Search..."
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              className="w-full sm:w-auto sm:min-w-[250px] sm:max-w-md h-[34px] text-sm bg-glass-bg border border-glass-border text-white hover:bg-glass-bg/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/20 placeholder:text-content-text-tertiary"
            />
          )}
          {!hideTimeRange && (
            <SelectFilter
              id="time-range-filter"
              label="Time Range"
              value={selectedTimeRange}
              onValueChange={(value) => updateFilter({ timeRange: value })}
              options={[{ value: "all", label: "All Time" }]}
              groups={TIME_RANGE_GROUPS}
              width="w-[200px]"
            />
          )}
          {coverFilter !== undefined && (
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
          )}
          {selectedAuthor !== undefined && (
            <div className="flex flex-col">
              <label htmlFor="author-search" className={labelClass}>
                Author
              </label>
              <AuthorSearch
                value={selectedAuthor}
                onValueChange={(value) => updateFilter({ author: value === "none" ? null : value })}
                placeholder="All Authors"
                className="w-[150px] sm:w-[200px] h-[34px] text-sm"
              />
            </div>
          )}
          {showPlayedFilter && (
            <SelectFilter
              id="played-filter"
              label="Played"
              value={playedFilter}
              onValueChange={(value) => updateFilter({ played: value })}
              options={[
                { value: "all", label: "All" },
                { value: "notPlayed", label: "Not Played" },
              ]}
              width="w-[150px]"
            />
          )}
          {extraSelectFilters}
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <ToggleFilterGroup filters={toggleFilters} activeFilters={activeToggleSet} onToggle={toggleFilter} />
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="px-3 py-1.5 text-sm rounded-md bg-transparent border border-glass-border text-content-text-tertiary hover:text-content-text-secondary transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
