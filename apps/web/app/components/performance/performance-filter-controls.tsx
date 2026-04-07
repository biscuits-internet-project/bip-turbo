import type { ReactNode } from "react";
import { SelectFilter } from "~/components/ui/filters";
import { ToggleFilterGroup } from "~/components/ui/filters/toggle-filter-group";
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
}: PerformanceFilterControlsProps) {
  const toggleFilters = showAllTimerToggle ? ALL_TOGGLE_FILTERS : TOGGLE_FILTERS_WITHOUT_ALL_TIMER;

  return (
    <div className="space-y-4">
      <div className="flex items-end flex-wrap gap-x-4 gap-y-3">
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
      </div>
      <ToggleFilterGroup
        filters={toggleFilters}
        activeFilters={activeToggleSet}
        onToggle={toggleFilter}
        onClearAll={clearFilters}
      />
    </div>
  );
}
