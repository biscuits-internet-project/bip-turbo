import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "~/lib/utils";

function getLink(filter: string, basePath: string, currentURLParameters: URLSearchParams) {
  return { pathname: `${basePath}${filter}`, search: currentURLParameters.toString() };
}

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
  currentURLParameters?: URLSearchParams;
  defaultExpanded?: boolean;
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
  defaultExpanded = true,
}: FilterNavProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

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
    "grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8": widerItems,
    "grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12": !widerItems,
  });

  const allSelected = currentFilter === null || currentFilter === undefined;
  const actualAllURL = allURL || basePath;
  const canBeCollapsed = !defaultExpanded;

  return (
    <div className="card-premium rounded-lg overflow-hidden">
      <div className="p-6 border-b border-content-bg-secondary">
        {canBeCollapsed ? (
          <button
            type="button"
            className={cn(
              "w-full flex items-center gap-2 text-base font-semibold text-white mb-4 cursor-pointer select-none transition-colors",
              {
                "hover:text-brand-primary": expanded,
                "hover:text-brand-secondary": !expanded,
              },
            )}
            style={{ cursor: "pointer" }}
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
          >
            {title}
            {subtitle && <span className={subtitleCSS}>{subtitle}</span>}
            {additionalText && <span className={subtitleCSS}>{additionalText}</span>}
            <span
              className={cn("transition-transform duration-300 ml-2", {
                "rotate-90": expanded,
                "rotate-0": !expanded,
              })}
              aria-hidden
            >
              ▶
            </span>
          </button>
        ) : (
          <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            {title}
            {subtitle && <span className={subtitleCSS}>{subtitle}</span>}
            {additionalText && <span className={subtitleCSS}>{additionalText}</span>}
          </h2>
        )}
        <div
          className={cn("overflow-hidden transition-all duration-300", {
            "max-h-[1000px] opacity-100": expanded || !canBeCollapsed,
            "max-h-0 opacity-0 pointer-events-none": !expanded && canBeCollapsed,
          })}
        >
          <div className={cn("grid gap-2", columnCSS)}>
            {filters.map((filter) => {
              const link = getLink(filter, basePath, currentURLParameters);
              return (
                <Link
                  key={filter}
                  to={link}
                  className={cn(itemCSS, filter === currentFilter ? highlightedItemCSS : nonHighlightedItemCSS)}
                >
                  {filter}
                </Link>
              );
            })}
            {showAllButton && (
              <Link
                to={actualAllURL}
                className={cn(itemCSS, {
                  [highlightedItemCSS]: allSelected,
                  [nonHighlightedItemCSS]: !allSelected,
                })}
              >
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
                const link = getLink(currentFilter || "", basePath, newParams);
                return (
                  <Link
                    key={parameter}
                    to={link}
                    className={cn(itemCSS, {
                      [highlightedItemCSS]: hasParam,
                      [nonHighlightedItemCSS]: !hasParam,
                    })}
                  >
                    {parameter}
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
