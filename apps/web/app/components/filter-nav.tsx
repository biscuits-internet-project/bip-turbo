import { Link } from "react-router-dom";
import { cn } from "~/lib/utils";

interface YearFilterNavProps {
  title: string;
  items: string[];
  currentItem?: string | null;
  basePath: string;
  showAllButton?: boolean;
  subtitle?: string;
  additionalText?: string;
}

export function FilterNav({
  title,
  items,
  currentItem,
  basePath,
  showAllButton,
  subtitle,
  additionalText,
}: YearFilterNavProps) {
  const subtitleCSS = "text-xs font-normal text-content-text-tertiary bg-content-bg-secondary px-2 py-1 rounded-full";
  const itemCSS =
    "px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 text-center relative overflow-hidden shadow-sm";
  const highlightedItemCSS =
    "text-white bg-gradient-to-r from-brand-primary to-brand-secondary border-2 border-brand-primary/50 shadow-lg shadow-brand-primary/30 scale-110 font-bold ring-2 ring-brand-primary/20";
  const nonHighlightedItemCSS =
    "text-content-text-secondary bg-content-bg-secondary hover:bg-content-bg-tertiary hover:text-white hover:scale-105 hover:shadow-md";
  return (
    <div className="card-premium rounded-lg overflow-hidden">
      <div className="p-6 border-b border-content-bg-secondary">
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          {title}
          {subtitle && <span className={subtitleCSS}>{subtitle}</span>}
          {additionalText && <span className={subtitleCSS}>{additionalText}</span>}
        </h2>
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
          {items.map((item) => (
            <Link
              key={item}
              to={`${basePath}${item}`}
              className={cn(itemCSS, item === currentItem ? highlightedItemCSS : nonHighlightedItemCSS)}
            >
              {item}
            </Link>
          ))}
          {showAllButton && (
            <Link
              to={basePath}
              className={cn(itemCSS, currentItem === null ? highlightedItemCSS : nonHighlightedItemCSS)}
            >
              All
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
