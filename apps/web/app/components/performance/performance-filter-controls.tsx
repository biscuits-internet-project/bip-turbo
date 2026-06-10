import { ChevronDown, Filter } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { AuthorSearch } from "~/components/author/author-search";
import { MusicianSearch } from "~/components/musician/musician-search";
import { SelectFilter } from "~/components/ui/filters";
import { ToggleFilterGroup } from "~/components/ui/filters/toggle-filter-group";
import { Input } from "~/components/ui/input";
import { TIME_RANGE_GROUPS, TOGGLE_FILTER_DEFINITIONS } from "~/lib/song-filters";
import { cn } from "~/lib/utils";

const ALL_TOGGLE_FILTERS = TOGGLE_FILTER_DEFINITIONS as unknown as Array<{ key: string; label: string }>;

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
  /**
   * When false, hide the "Jam Chart" toggle chip. Set on the dedicated
   * Jam Charts page (the whole result set is already jam-charts there)
   * and on the All-Timers page (same reasoning as why "All-Timer" is
   * hidden there) so toggle filters within those views express
   * additional narrowing rather than redundant scope.
   */
  showJamChartToggle?: boolean;
  hideTimeRange?: boolean;
  kindFilter?: string;
  selectedAuthor?: string | null;
  selectedMusician?: string | null;
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
  showJamChartToggle = true,
  hideTimeRange = false,
  kindFilter,
  selectedAuthor,
  selectedMusician,
  playedFilter,
  searchValue,
  onSearchChange,
  hasActiveFilters = false,
}: PerformanceFilterControlsProps) {
  const toggleFilters = ALL_TOGGLE_FILTERS.filter((filter) => {
    if (!showAllTimerToggle && filter.key === "allTimer") return false;
    if (!showJamChartToggle && filter.key === "jamChart") return false;
    return true;
  });
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
    (kindFilter && kindFilter !== "all" ? 1 : 0) +
    (selectedAuthor ? 1 : 0) +
    (selectedMusician ? 1 : 0) +
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
          Search &amp; Filters
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
          {selectedMusician !== undefined && (
            <div className="flex flex-col">
              <label htmlFor="musician-search" className={labelClass}>
                Musician
              </label>
              <MusicianSearch
                value={selectedMusician}
                onValueChange={(value) => updateFilter({ musician: value === "none" ? null : value })}
                // Carry the slug (not the id) in the URL so a shared
                // ?musician= link is readable. The /api/musicians endpoint
                // resolves the slug back to a record for pre-fill.
                itemId={(musician) => musician.slug ?? musician.id}
                // Show a deep open-list (the roster is 130+) so most names are
                // visible without typing.
                topLimit={40}
                placeholder="All Musicians"
                className="w-[150px] sm:w-[200px] h-[34px] text-sm"
              />
            </div>
          )}
          {kindFilter !== undefined && (
            <SelectFilter
              id="kind-filter"
              label="Type"
              value={kindFilter}
              onValueChange={(value) => updateFilter({ kind: value })}
              options={[
                { value: "all", label: "All" },
                { value: "original", label: "Original" },
                { value: "cover", label: "Cover" },
                { value: "mashup", label: "Mashup" },
                { value: "improvisation", label: "Improvisation" },
              ]}
              placeholder="Type"
              width="w-[150px]"
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
