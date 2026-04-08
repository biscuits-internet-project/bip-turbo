import type { ReactNode } from "react";
import { SelectFilter } from "~/components/ui/filters";
import { ToggleFilterGroup } from "~/components/ui/filters/toggle-filter-group";
import { Input } from "~/components/ui/input";
import { ERA_OPTIONS, TOGGLE_FILTER_DEFINITIONS, YEAR_OPTIONS } from "~/lib/song-filters";

const ALL_TOGGLE_FILTERS = TOGGLE_FILTER_DEFINITIONS as unknown as Array<{ key: string; label: string }>;

const TOGGLE_FILTERS_WITHOUT_ALL_TIMER = ALL_TOGGLE_FILTERS.filter((filter) => filter.key !== "allTimer");

interface PerformanceFilterControlsProps {
  selectedYear: string;
  selectedEra: string;
  activeToggleSet: Set<string>;
  updateFilter: (updates: Record<string, string | null>) => void;
  toggleFilter: (key: string) => void;
  clearFilters: () => void;
  extraSelectFilters?: ReactNode;
  showAllTimerToggle?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  hasActiveFilters?: boolean;
}

export function PerformanceFilterControls({
  selectedYear,
  selectedEra,
  activeToggleSet,
  updateFilter,
  toggleFilter,
  clearFilters,
  extraSelectFilters,
  showAllTimerToggle = true,
  searchValue,
  onSearchChange,
  hasActiveFilters = false,
}: PerformanceFilterControlsProps) {
  const toggleFilters = showAllTimerToggle ? ALL_TOGGLE_FILTERS : TOGGLE_FILTERS_WITHOUT_ALL_TIMER;

  return (
    <div className="space-y-4">
      <div className="flex items-end flex-wrap gap-x-4 gap-y-3">
        {searchValue !== undefined && onSearchChange && (
          <Input
            placeholder="Search..."
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            className="w-auto min-w-[200px] sm:min-w-[250px] max-w-md h-[42px] bg-glass-bg border border-glass-border text-white hover:bg-glass-bg/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/20 placeholder:text-content-text-tertiary"
          />
        )}
        <SelectFilter
          id="year-filter"
          label="Year"
          value={selectedYear}
          onValueChange={(value) => updateFilter({ year: value, era: null })}
          options={[{ value: "all", label: "All Years" }, ...YEAR_OPTIONS]}
          width="w-[130px]"
        />
        <SelectFilter
          id="era-filter"
          label="Era"
          value={selectedEra}
          onValueChange={(value) => updateFilter({ era: value, year: null })}
          options={[{ value: "all", label: "All Eras" }, ...ERA_OPTIONS]}
          width="w-[170px]"
        />
        {extraSelectFilters}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="px-3 py-1 text-sm rounded-md bg-transparent border border-glass-border text-content-text-tertiary hover:text-content-text-secondary h-[42px]"
          >
            Clear All
          </button>
        )}
      </div>
      <ToggleFilterGroup filters={toggleFilters} activeFilters={activeToggleSet} onToggle={toggleFilter} />
    </div>
  );
}
