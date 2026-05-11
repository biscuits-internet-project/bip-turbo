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

  return (
    <div className="flex items-center justify-between px-2">
      {!hidePaginationText ? (
        total === 0 ? (
          <div className="text-sm text-content-text-secondary font-medium">0 results</div>
        ) : (
          <div className="text-sm text-content-text-secondary font-medium">
            <span className="hidden sm:inline">{`Showing ${from} to ${to} of ${total} results`}</span>
            <span className="sm:hidden">{`${from}–${to} of ${total}`}</span>
          </div>
        )
      ) : (
        <div />
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
              className="w-12 rounded border border-glass-border bg-glass-bg px-2 py-1 text-center text-sm text-white focus:outline-none focus:ring-1 focus:ring-ring/20 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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
