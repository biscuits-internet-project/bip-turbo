import { ArrowDownIcon, ArrowUpDown, ArrowUpIcon } from "lucide-react";
import type { ReactNode } from "react";

interface UrlSortableHeaderProps<S extends string> {
  sortKey: S;
  label: ReactNode;
  currentSort: S;
  currentDirection: "asc" | "desc";
  defaultDirection?: "asc" | "desc";
  onSortChange: (sort: S, direction: "asc" | "desc") => void;
}

/**
 * Sortable header for tables whose ordering lives in the URL rather than
 * TanStack column state. Mirrors the visual treatment of
 * [SortableHeader](./sortable-header.tsx) — active column gets a bold
 * label + accent arrow, idle columns get a neutral chevron pair — but
 * clicks invoke a callback so the route can navigate with the new sort.
 *
 * Click semantics: first click on an idle column applies
 * `defaultDirection` (defaults to desc, matching the rest of the site).
 * Re-clicking the active column flips between asc and desc.
 */
export function UrlSortableHeader<S extends string>({
  sortKey,
  label,
  currentSort,
  currentDirection,
  defaultDirection = "desc",
  onSortChange,
}: UrlSortableHeaderProps<S>) {
  const isActive = currentSort === sortKey;
  const nextDirection: "asc" | "desc" = isActive ? (currentDirection === "asc" ? "desc" : "asc") : defaultDirection;

  return (
    <button
      type="button"
      className="cursor-pointer select-none hover:text-content-text-primary text-left flex flex-wrap items-start gap-x-1"
      onClick={() => onSortChange(sortKey, nextDirection)}
    >
      <span className={isActive ? "text-content-text-primary font-semibold" : ""}>{label}</span>
      <span className={isActive ? "text-brand-primary" : ""}>
        {isActive && currentDirection === "asc" ? (
          <ArrowUpIcon className="h-3 w-3 sm:h-4 sm:w-4 inline" />
        ) : isActive ? (
          <ArrowDownIcon className="h-3 w-3 sm:h-4 sm:w-4 inline" />
        ) : (
          <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4 inline" />
        )}
      </span>
    </button>
  );
}
