import { Link } from "react-router-dom";
import { cn } from "~/lib/utils";

const startYear = 1996;
const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => currentYear - i).reverse();

interface YearFilterNavProps {
  currentYear?: number | null;
  basePath: string;
  showAllButton?: boolean;
}

export function YearFilterNav({ currentYear, basePath, showAllButton }: YearFilterNavProps) {
  return (
    <div className="card-premium rounded-lg overflow-hidden">
      <div className="p-6 border-b border-content-bg-secondary">
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          Filter by Year
          {!showAllButton && (
            <span className="text-xs font-normal text-content-text-tertiary bg-content-bg-secondary px-2 py-1 rounded-full">
              {years.length} years
            </span>
          )}
          {showAllButton && (
            <Link
              to={basePath}
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 text-center relative overflow-hidden shadow-sm",
                currentYear === null
                  ? "text-white bg-gradient-to-r from-brand-primary to-brand-secondary border-2 border-brand-primary/50 shadow-lg shadow-brand-primary/30 scale-110 font-bold ring-2 ring-brand-primary/20"
                  : "text-content-text-secondary bg-content-bg-secondary hover:bg-content-bg-tertiary hover:text-white hover:scale-105 hover:shadow-md",
              )}
            >
              {years.length} years
            </Link>
          )}
        </h2>
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
          {years.map((y) => (
            <Link
              key={y}
              to={`${basePath}${y}`}
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 text-center relative overflow-hidden shadow-sm",
                y === currentYear
                  ? "text-white bg-gradient-to-r from-brand-primary to-brand-secondary border-2 border-brand-primary/50 shadow-lg shadow-brand-primary/30 scale-110 font-bold ring-2 ring-brand-primary/20"
                  : "text-content-text-secondary bg-content-bg-secondary hover:bg-content-bg-tertiary hover:text-white hover:scale-105 hover:shadow-md",
              )}
            >
              {y}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
