import { FilterNav } from "~/components/filter-nav";

const startYear = 1995;
const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => currentYear - i).reverse();

interface YearFilterNavProps {
  currentYear?: number | null;
  basePath: string;
  showAllButton?: boolean;
  additionalText?: string;
  parameters?: string[];
  currentURLParameters?: URLSearchParams;
}

export function YearFilterNav({
  currentYear,
  basePath,
  showAllButton,
  additionalText,
  parameters,
  currentURLParameters,
}: YearFilterNavProps) {
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
    />
  );
}
