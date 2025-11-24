import { Link } from "react-router-dom";
import { cn } from "~/lib/utils";

interface YearFilterNavProps {
  title: string;
  filters: string[];
  currentFilter?: string | null;
  basePath: string;
  showAllButton?: boolean;
  allURL?: string;
  subtitle?: string;
  additionalText?: string;
  widerItems?: boolean;
  parameters?: string[];
  currentURLParameters?: URLSearchParams;
}

export function FilterNav({
  title,
  filters,
  currentFilter,
  basePath,
  showAllButton,
  allURL,
  subtitle,
  additionalText,
  widerItems = false,
  parameters = [],
  currentURLParameters = new URLSearchParams(),
}: YearFilterNavProps) {
  const subtitleCSS = "text-xs font-normal text-content-text-tertiary bg-content-bg-secondary px-2 py-1 rounded-full";
  const itemCSS = "px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 text-center relative shadow-sm";
  const highlightedItemCSS =
    "text-white bg-gradient-to-r from-brand-primary to-brand-secondary border-2 border-brand-primary/50 shadow-lg shadow-brand-primary/30 scale-110 font-bold ring-2 ring-brand-primary/20";
  const nonHighlightedItemCSS =
    "text-content-text-secondary bg-content-bg-secondary hover:bg-content-bg-tertiary hover:text-white hover:scale-105 hover:shadow-md";
  const columnCSS = widerItems
    ? "grid-cols-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6"
    : "grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12";

  const allSelected = currentFilter === null || currentFilter === undefined;
  const actualAllURL = allURL || basePath;
  const currentURL = allSelected ? actualAllURL : `${basePath}${currentFilter}`;
  return (
    <div className="card-premium rounded-lg overflow-hidden">
      <div className="p-6 border-b border-content-bg-secondary">
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          {title}
          {subtitle && <span className={subtitleCSS}>{subtitle}</span>}
          {additionalText && <span className={subtitleCSS}>{additionalText}</span>}
        </h2>
        <div className={`grid ${columnCSS} gap-2`}>
          {filters.map((filter) => (
            <Link
              key={filter}
              to={{ pathname: `${basePath}${filter}`, search: currentURLParameters.toString() }}
              className={cn(itemCSS, filter === currentFilter ? highlightedItemCSS : nonHighlightedItemCSS)}
            >
              {filter}
            </Link>
          ))}
          {showAllButton && (
            <Link to={actualAllURL} className={cn(itemCSS, allSelected ? highlightedItemCSS : nonHighlightedItemCSS)}>
              All
            </Link>
          )}
          {!allSelected &&
            parameters.map((parameter) => {
              const newParams = new URLSearchParams(currentURLParameters.toString());
              const hasParam = currentURLParameters.has(parameter);
              if (hasParam) {
                newParams.delete(parameter);
              } else {
                newParams.append(parameter, "true");
              }
              return (
                <Link
                  key={parameter}
                  to={{ pathname: currentURL, search: newParams.toString() }}
                  className={cn(itemCSS, hasParam ? highlightedItemCSS : nonHighlightedItemCSS)}
                >
                  {parameter}
                </Link>
              );
            })}
        </div>
      </div>
    </div>
  );
}
