import type { Column } from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpDown, ArrowUpIcon } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Header cell that toggles its column's sort direction on click. Renders
 * the active direction with a bold label + accent-colored arrow, and an
 * idle direction with a neutral chevron pair. Non-sortable columns render
 * as plain text so callers can use this for every header without branching.
 * Generic over the row shape — works for any TanStack `Column<T>`.
 */
export function SortableHeader<T>({ column, label }: { column: Column<T, unknown>; label: ReactNode }) {
  if (!column.getCanSort()) return <span>{label}</span>;
  return (
    <button
      type="button"
      // `flex flex-wrap` so the sort arrow drops onto its own line when
      // the column gets too narrow to hold both label + arrow inline
      // (lets narrow columns like Set squeeze to 1.5rem on mobile).
      className="cursor-pointer select-none hover:text-content-text-primary text-left flex flex-wrap items-start gap-x-1"
      onClick={() => column.toggleSorting()}
    >
      <span className={column.getIsSorted() ? "text-content-text-primary font-semibold" : ""}>{label}</span>
      <span className={column.getIsSorted() ? "text-brand-primary" : ""}>
        {column.getIsSorted() === "asc" ? (
          <ArrowUpIcon className="h-3 w-3 sm:h-4 sm:w-4 inline" />
        ) : column.getIsSorted() === "desc" ? (
          <ArrowDownIcon className="h-3 w-3 sm:h-4 sm:w-4 inline" />
        ) : (
          <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4 inline" />
        )}
      </span>
    </button>
  );
}
