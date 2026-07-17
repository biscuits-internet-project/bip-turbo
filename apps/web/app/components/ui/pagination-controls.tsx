import type { KeyboardEvent } from "react";
import { Button } from "~/components/ui/button";

interface PaginationControlsProps {
  /** 1-indexed current page. */
  page: number;
  totalPages: number;
  /** Page size + total row count drive the "Showing X to Y of N" copy. */
  pageSize: number;
  total: number;
  onPageChange: (nextPage: number) => void;
  /** Hides the "Showing N to M of T" copy on the left while keeping the controls. */
  hidePaginationText?: boolean;
  /**
   * Optional opt-in "Show all / Paginate" toggle. Rendered next to the
   * results count when both `onToggleShowAll` and `canShowAll` are provided.
   * DataTable wires this up via the `useShowAll` hook; standalone callers
   * (server-side paginators) omit these props and the toggle stays hidden.
   */
  showAll?: boolean;
  onToggleShowAll?: (next: boolean) => void;
  canShowAll?: boolean;
}

/**
 * Shared Previous / Page-input / Next pagination strip. Used by DataTable for
 * its client-side TanStack pagination and by any route-level paginator that
 * wants the same visual treatment — caller wires onPageChange to either a
 * table method or a URL navigation.
 */
export function PaginationControls({
  page,
  totalPages,
  pageSize,
  total,
  onPageChange,
  hidePaginationText = false,
  showAll = false,
  onToggleShowAll,
  canShowAll = false,
}: PaginationControlsProps) {
  function handlePageInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    const value = Number(event.currentTarget.value);
    if (Number.isNaN(value)) return;
    const clamped = Math.max(1, Math.min(totalPages, value));
    onPageChange(clamped);
    event.currentTarget.value = String(clamped);
  }

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  const showAllToggle = canShowAll && onToggleShowAll && (
    <button
      type="button"
      onClick={() => onToggleShowAll(!showAll)}
      className="text-sm text-content-text-secondary underline decoration-dotted underline-offset-4 hover:text-brand-primary focus:outline-none focus-visible:ring-1 focus-visible:ring-ring/20 rounded-sm"
    >
      {showAll ? "Paginate" : "Show all"}
    </button>
  );

  return (
    <div className="flex items-center justify-between px-2 gap-3">
      {!hidePaginationText ? (
        <div className="flex items-center gap-3 min-w-0">
          {total === 0 ? (
            <span className="text-sm text-content-text-secondary font-medium">0 results</span>
          ) : (
            <span className="text-sm text-content-text-secondary font-medium">
              <span className="hidden sm:inline">{`Showing ${from} to ${to} of ${total} results`}</span>
              <span className="sm:hidden">{`${from}–${to} of ${total}`}</span>
            </span>
          )}
          {showAllToggle}
        </div>
      ) : (
        <div className="flex items-center">{showAllToggle ?? null}</div>
      )}
      {totalPages > 1 && (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page <= 1}
            className="hover:bg-brand-primary/20 hover:border-brand-primary/40"
          >
            Previous
          </Button>
          <span className="flex items-center gap-1.5 text-sm text-content-text-secondary">
            Page
            <input
              type="number"
              min={1}
              max={totalPages}
              defaultValue={page}
              key={page}
              onKeyDown={handlePageInputKeyDown}
              className="w-12 rounded border px-2 py-1 text-center text-sm text-white focus:outline-none focus:ring-1 focus:ring-ring/20 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
            className="hover:bg-brand-primary/20 hover:border-brand-primary/40"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
