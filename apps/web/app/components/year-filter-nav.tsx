import { FilterNav } from "~/components/filter-nav";

const startYear = 1996;
const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => currentYear - i).reverse();

interface YearFilterNavProps {
  currentYear?: number | null;
  basePath: string;
  showAllButton?: boolean;
  additionalText?: string;
}

export function YearFilterNav({ currentYear, basePath, showAllButton, additionalText }: YearFilterNavProps) {
  return FilterNav({
    title: "Filter by Year",
    filters: years.map(String),
    currentFilter: currentYear ? String(currentYear) : null,
    basePath,
    showAllButton,
    subtitle: `${years.length} years`,
    additionalText,
  });
}
