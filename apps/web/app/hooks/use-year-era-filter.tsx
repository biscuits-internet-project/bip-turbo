import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SelectFilter } from "~/components/ui/filters";
import { ERA_OPTIONS, matchesDateRange, SONG_FILTERS, YEAR_OPTIONS } from "~/lib/song-filters";

/**
 * Manages Year/Era filter state with URL param sync and mutual exclusivity.
 * Returns the filter UI component and a function to filter items by date.
 *
 * Year and Era are mutually exclusive: selecting a Year clears the Era and
 * vice versa. State is synced to URL search params (?year=, ?era=) so
 * filter selections are shareable and survive page reloads.
 */
export function useYearEraFilter() {
  const [searchParams] = useSearchParams();

  const [selectedYear, setSelectedYear] = useState<string>(searchParams.get("year") || "all");
  const [selectedEra, setSelectedEra] = useState<string>(searchParams.get("era") || "all");

  const updateUrl = (year: string, era: string) => {
    const newParams = new URLSearchParams(window.location.search);
    if (year !== "all") {
      newParams.set("year", year);
    } else {
      newParams.delete("year");
    }
    if (era !== "all") {
      newParams.set("era", era);
    } else {
      newParams.delete("era");
    }
    const newUrl = newParams.toString()
      ? `${window.location.pathname}?${newParams.toString()}`
      : window.location.pathname;
    window.history.replaceState({}, "", newUrl);
  };

  const handleYearChange = (value: string) => {
    setSelectedYear(value);
    const newEra = value !== "all" ? "all" : selectedEra;
    if (value !== "all") {
      setSelectedEra("all");
    }
    updateUrl(value, newEra);
  };

  const handleEraChange = (value: string) => {
    setSelectedEra(value);
    const newYear = value !== "all" ? "all" : selectedYear;
    if (value !== "all") {
      setSelectedYear("all");
    }
    updateUrl(newYear, value);
  };

  const filterByDate = useMemo(() => {
    const dateRangeKey = selectedYear !== "all" ? selectedYear : selectedEra !== "all" ? selectedEra : null;
    if (!dateRangeKey || !(dateRangeKey in SONG_FILTERS)) return null;
    return SONG_FILTERS[dateRangeKey];
  }, [selectedYear, selectedEra]);

  function filterPerformancesByDate<T extends { show: { date: string } }>(items: T[]): T[] {
    if (!filterByDate) return items;
    return items.filter((item) => matchesDateRange(item.show.date, filterByDate));
  }

  const yearEraFilterComponent = (
    <div className="flex items-end flex-wrap gap-x-4 gap-y-3">
      <SelectFilter
        id="year-filter"
        label="Year"
        value={selectedYear}
        onValueChange={handleYearChange}
        options={[{ value: "all", label: "All Years" }, ...YEAR_OPTIONS]}
        width="w-[130px]"
      />
      <SelectFilter
        id="era-filter"
        label="Era"
        value={selectedEra}
        onValueChange={handleEraChange}
        options={[{ value: "all", label: "All Eras" }, ...ERA_OPTIONS]}
        width="w-[170px]"
      />
    </div>
  );

  return {
    selectedYear,
    selectedEra,
    handleYearChange,
    handleEraChange,
    filterByDate,
    filterPerformancesByDate,
    yearEraFilterComponent,
    hasDateRange: selectedYear !== "all" || selectedEra !== "all",
  };
}
