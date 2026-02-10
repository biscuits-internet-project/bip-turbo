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
    "bg-content-bg-secondary px-2 py-0.5 rounded-full",
  );
  const itemCSS = cn("px-2 py-1.5 text-sm font-medium rounded-md", "transition-all duration-200 text-center");
  const highlightedItemCSS = cn("text-white bg-gradient-to-r from-brand-primary to-brand-secondary", "font-semibold");
  const nonHighlightedItemCSS = cn(
    "text-content-text-secondary bg-content-bg-secondary",
    "hover:bg-content-bg-tertiary hover:text-white",
  );
  const toggleCSS = cn(
    "px-3 py-1.5 text-sm font-medium rounded-md",
    "transition-all duration-200 flex items-center gap-2",
  );
  const toggleActiveCSS = cn("text-white bg-content-bg-tertiary border border-brand-primary/50");
  const toggleInactiveCSS = cn(
    "text-content-text-secondary bg-content-bg-secondary",
    "hover:bg-content-bg-tertiary hover:text-white",
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
      <div className="px-4 py-3">
        {canBeCollapsed ? (
          <button
            type="button"
            className={cn(
              "w-full flex items-center gap-2 text-sm font-semibold text-white mb-3 cursor-pointer select-none transition-colors",
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
          <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
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
          <div className={cn("grid gap-1.5", columnCSS)}>
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
          </div>
          {/* Parameter toggles rendered separately below the grid */}
          {!allSelected && parameters.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-content-bg-secondary">
              <span className="text-xs text-content-text-tertiary self-center">Filters:</span>
              {parameters.map((parameter) => {
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
                    className={cn(toggleCSS, hasParam ? toggleActiveCSS : toggleInactiveCSS)}
                  >
                    <span
                      className={cn(
                        "w-3.5 h-3.5 rounded-sm border flex items-center justify-center text-[10px]",
                        hasParam ? "bg-brand-primary border-brand-primary text-white" : "border-content-text-tertiary",
                      )}
                    >
                      {hasParam && "✓"}
                    </span>
                    {parameter}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
