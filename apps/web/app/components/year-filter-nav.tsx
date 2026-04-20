import { FilterNav } from "~/components/filter-nav";
import { YEAR_OPTIONS } from "~/lib/song-filters";

const years = [...YEAR_OPTIONS].reverse().map((o) => o.value);

interface YearFilterNavProps {
  currentYear?: number | null;
  basePath: string;
  showAllButton?: boolean;
  additionalText?: string;
  parameters?: string[];
  currentURLParameters?: URLSearchParams;
  /** Optional per-year show counts (year → count). Rendered beside each year. */
  counts?: Record<number, number>;
}

export function YearFilterNav({
  currentYear,
  basePath,
  showAllButton,
  additionalText,
  parameters,
  currentURLParameters,
  counts,
}: YearFilterNavProps) {
  const filterCounts: Record<string, number> | undefined = counts
    ? Object.fromEntries(years.map((y) => [String(y), counts[Number(y)] ?? 0]))
    : undefined;

  return (
    <FilterNav
      title="Filter by Year"
      filters={years.map(String)}
      currentFilter={currentYear ? String(currentYear) : null}
      basePath={basePath}
      showAllButton={showAllButton}
      subtitle={`${years.length} years`}
      additionalText={additionalText}
      parameters={parameters}
      currentURLParameters={currentURLParameters}
      filterCounts={filterCounts}
    />
  );
}
