import type { Column } from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpDown, ArrowUpIcon } from "lucide-react";

/**
 * Header cell that toggles its column's sort direction on click. Renders
 * the active direction with a bold label + accent-colored arrow, and an
 * idle direction with a neutral chevron pair. Non-sortable columns render
 * as plain text so callers can use this for every header without branching.
 * Generic over the row shape — works for any TanStack `Column<T>`.
 */
export function SortableHeader<T>({ column, label }: { column: Column<T, unknown>; label: string }) {
  if (!column.getCanSort()) return <span>{label}</span>;
  return (
    <button
      type="button"
      className="cursor-pointer select-none hover:text-content-text-primary text-left"
      onClick={() => column.toggleSorting()}
    >
      <span className={column.getIsSorted() ? "text-content-text-primary font-semibold" : ""}>{label}</span>
      <span className={column.getIsSorted() ? "text-brand-primary ml-1" : "ml-1"}>
        {column.getIsSorted() === "asc" ? (
          <ArrowUpIcon className="h-4 w-4 inline" />
        ) : column.getIsSorted() === "desc" ? (
          <ArrowDownIcon className="h-4 w-4 inline" />
        ) : (
          <ArrowUpDown className="h-4 w-4 inline" />
        )}
      </span>
    </button>
  );
}
