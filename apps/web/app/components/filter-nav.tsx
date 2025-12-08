import { Link } from "react-router-dom";
import { SONGS_FILTER_PARAM } from "~/components/song/song-filters";
import { cn } from "~/lib/utils";

interface FilterNavProps {
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
  filterAsParameter?: boolean;
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
  filterAsParameter = false,
  currentURLParameters = new URLSearchParams(),
}: FilterNavProps) {
  const subtitleCSS = cn(
    "text-xs font-normal text-content-text-tertiary",
    "bg-content-bg-secondary px-2 py-1 rounded-full",
  );
  const itemCSS = cn(
    "px-3 py-2 text-sm font-medium rounded-lg",
    "transition-all duration-300 text-center relative shadow-sm",
  );
  const highlightedItemCSS = cn(
    "text-white bg-gradient-to-r from-brand-primary to-brand-secondary",
    "border-2 border-brand-primary/50 shadow-lg shadow-brand-primary/30",
    "scale-110 font-bold ring-2 ring-brand-primary/20",
  );
  const nonHighlightedItemCSS = cn(
    "text-content-text-secondary bg-content-bg-secondary",
    "hover:bg-content-bg-tertiary hover:text-white hover:scale-105 hover:shadow-md",
  );
  const columnCSS = cn({
    "grid-cols-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6": widerItems,
    "grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12": !widerItems,
  });

  const allSelected = currentFilter === null || currentFilter === undefined;
  const actualAllURL = allURL || basePath;
  const currentURL = allSelected ? actualAllURL : filterAsParameter ? basePath : `${basePath}${currentFilter}`;
  return (
    <div className="card-premium rounded-lg overflow-hidden">
      <div className="p-6 border-b border-content-bg-secondary">
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          {title}
          {subtitle && <span className={subtitleCSS}>{subtitle}</span>}
          {additionalText && <span className={subtitleCSS}>{additionalText}</span>}
        </h2>
        <div className={cn("grid gap-2", columnCSS)}>
          {filters.map((filter) => {
            const linkURL = filterAsParameter ? `${basePath}` : `${basePath}${filter}`;
            const linkParams = filterAsParameter
              ? new URLSearchParams(currentURLParameters.toString())
              : currentURLParameters;
            if (filterAsParameter) {
              linkParams.set(SONGS_FILTER_PARAM, filter);
            }
            return (
              <Link
                key={filter}
                to={{ pathname: linkURL, search: linkParams.toString() }}
                className={cn(itemCSS, filter === currentFilter ? highlightedItemCSS : nonHighlightedItemCSS)}
              >
                {filter}
              </Link>
            );
          })}
          {showAllButton && (
            <Link to={actualAllURL} className={cn(itemCSS, allSelected ? highlightedItemCSS : nonHighlightedItemCSS)}>
              All
            </Link>
          )}
          {!allSelected &&
            parameters.map((parameter) => {
              const newParams = new URLSearchParams(currentURLParameters.toString());
              if (filterAsParameter && currentFilter) {
                newParams.set(SONGS_FILTER_PARAM, currentFilter);
              }
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
