import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type RowData,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  // biome-ignore lint/correctness/noUnusedVariables: required by TanStack's module augmentation pattern
  interface ColumnMeta<TData extends RowData, TValue> {
    /**
     * Fixed width for this column under `table-layout: fixed` — typically
     * a `rem` value sized to the column's expected content (e.g. `"3rem"`
     * for short numbers like "378", `"1.5rem"` for an icon-only column).
     * Fixed columns never grow or shrink with the table. Leftover space
     * is divided among the remaining (flex) columns by `weight`.
     */
    fixedWidth?: string;
    /**
     * Optional mobile override for `fixedWidth`. Applied below the `sm`
     * breakpoint when the column would otherwise crowd siblings — e.g.
     * the Rating column wants 8rem on desktop to give the rating-count
     * button breathing room, but 5rem on phones so Song Before / After
     * can still hold a word per line.
     */
    mobileFixedWidth?: string;
    /**
     * Relative share of *leftover* horizontal space — what's left after
     * fixed-width columns claim theirs. Defaults to 1. Use > 1 for columns
     * holding long free text (titles, notes); < 1 to bias against. Ignored
     * when `fixedWidth` is set.
     */
    weight?: number;
    cellClassName?: string;
    /**
     * Optional extra classes for the header `<th>`. Use when the column
     * needs to override the default padding so the declared
     * `fixedWidth` / `mobileFixedWidth` actually controls the cell box
     * (e.g. icon-only columns with `cellClassName: "!px-0"` want the
     * matching `headerClassName: "!px-0"`).
     */
    headerClassName?: string;
    hideOnMobile?: boolean;
  }
}

import { type ReactNode, useEffect, useRef, useState } from "react";

import { Input } from "~/components/ui/input";
import { PaginationControls } from "~/components/ui/pagination-controls";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { cn } from "~/lib/utils";

/**
 * Convert a CSS length value (currently `rem` or `px`) to pixels. `rem`
 * resolves against the root font-size; `px` returns the number as-is.
 * Only the units actually used by `meta.fixedWidth` callers in this
 * codebase are supported on purpose — adding more units (`em`, `%`,
 * viewport units) would invite calling code to depend on context that
 * isn't reliably available at column-width compute time.
 */
function cssLengthToPx(value: string, rootFontSize: number): number {
  const trimmed = value.trim();
  if (trimmed.endsWith("rem")) return parseFloat(trimmed) * rootFontSize;
  if (trimmed.endsWith("px")) return parseFloat(trimmed);
  return parseFloat(trimmed) || 0;
}

/**
 * Tailwind's `sm` breakpoint. Columns with `meta.hideOnMobile` are
 * dropped from rendering entirely below this width via TanStack's
 * `columnVisibility` — driving it through TanStack (rather than CSS
 * `hidden sm:table-cell`) keeps `<colgroup>` indices aligned with the
 * actually-rendered TDs, so `<col>` widths land on the right columns.
 */
const SM_BREAKPOINT_PX = 640;

/**
 * Compute the `width` style for each visible leaf column. Columns with
 * `meta.fixedWidth` get their declared length verbatim; remaining columns
 * share `wrapperWidth - sum(fixedWidth)` by `meta.weight` (default 1).
 *
 * Callers pass `table.getVisibleLeafColumns()`, which already filters
 * out columns hidden via `columnVisibility` (e.g. `hideOnMobile` at
 * narrow widths). The math here just trusts that visibility decision.
 *
 * `wrapperWidth === 0` happens on SSR and on the first client render
 * before the ResizeObserver fires; in that window we fall back to plain
 * percentages so the table still renders. The percentages there can sum
 * to more than 100% if any column is also fixed-width (the percentage
 * ignores the fixed columns), but the misalignment lasts one paint
 * before pixel measurement takes over.
 */
export function computeColumnWidths<TData, TValue>(
  cols: readonly { id: string; columnDef: ColumnDef<TData, TValue> }[],
  wrapperWidth: number,
  rootFontSize: number,
): string[] {
  const isMobile = wrapperWidth > 0 && wrapperWidth < SM_BREAKPOINT_PX;
  const fixedFor = (c: (typeof cols)[number]): string | undefined =>
    (isMobile && c.columnDef.meta?.mobileFixedWidth) || c.columnDef.meta?.fixedWidth;

  const fixedSum = cols.reduce((s, c) => {
    const fw = fixedFor(c);
    return fw ? s + cssLengthToPx(fw, rootFontSize) : s;
  }, 0);
  const totalWeight = cols.reduce((sum, c) => (fixedFor(c) ? sum : sum + (c.columnDef.meta?.weight ?? 1)), 0);
  const leftoverPx = Math.max(0, wrapperWidth - fixedSum);
  const usePixels = wrapperWidth > 0;

  return cols.map((column) => {
    const fixed = fixedFor(column);
    if (fixed) return fixed;
    const weight = column.columnDef.meta?.weight ?? 1;
    const share = totalWeight > 0 ? weight / totalWeight : 0;
    return usePixels ? `${share * leftoverPx}px` : `${share * 100}%`;
  });
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  getRowId?: (row: TData) => string;
  searchKey?: string;
  searchPlaceholder?: string;
  pageSize?: number;
  hideSearch?: boolean;
  hidePaginationText?: boolean;
  hidePagination?: boolean;
  searchActions?: ReactNode;
  filterComponent?: ReactNode;
  secondaryFilterComponent?: ReactNode;
  isLoading?: boolean;
  rowClassName?: (data: TData, index: number) => string | undefined;
  initialSorting?: SortingState;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search...",
  pageSize = 50,
  hideSearch = false,
  hidePaginationText = false,
  hidePagination = false,
  searchActions,
  filterComponent,
  secondaryFilterComponent,
  isLoading = false,
  rowClassName,
  initialSorting,
  getRowId,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting ?? []);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  // Measure the table wrapper so col widths can be computed in pixels.
  // Chrome's `table-layout: fixed` algorithm distributes leftover space
  // equally across flex `<col>`s when their widths are declared as
  // `calc()` expressions mixing % and rem — declared `weight` ratios are
  // ignored. Computing widths in pixels (resolved against the measured
  // wrapper) sidesteps that algorithm path so weights actually apply.
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [wrapperWidth, setWrapperWidth] = useState<number>(0);
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    setWrapperWidth(el.clientWidth);
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) setWrapperWidth(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Drop `hideOnMobile` columns below the `sm` breakpoint via TanStack's
  // columnVisibility (not CSS) so `<colgroup>` indices stay aligned with
  // the rendered TDs — CSS-hiding leaves phantom column slots in the
  // colgroup that Chrome's table-fixed layout mis-allocates space to.
  const hideOnMobileColumnIds = columns
    .map((c) => (c.meta?.hideOnMobile ? (c as { id?: string; accessorKey?: string }) : null))
    .filter((c): c is { id?: string; accessorKey?: string } => Boolean(c))
    .map((c) => c.id ?? (c.accessorKey as string))
    .filter(Boolean) as string[];
  const isMobile = wrapperWidth > 0 && wrapperWidth < SM_BREAKPOINT_PX;
  // biome-ignore lint/correctness/useExhaustiveDependencies: hideOnMobileColumnIds is derived from columns and stable across renders for a given table.
  useEffect(() => {
    setColumnVisibility((prev) => {
      const next: VisibilityState = { ...prev };
      for (const id of hideOnMobileColumnIds) next[id] = !isMobile;
      return next;
    });
  }, [isMobile, hideOnMobileColumnIds.join(",")]);

  const table = useReactTable({
    data,
    columns,
    ...(getRowId ? { getRowId } : {}),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    ...(hidePagination ? {} : { getPaginationRowModel: getPaginationRowModel() }),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    initialState: {
      pagination: {
        pageSize: hidePagination ? data.length : pageSize,
      },
    },
  });

  const hasResults = table.getFilteredRowModel().rows.length > 0;
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();

  const paginationBlock = !hasResults ? null : (
    <PaginationControls
      page={currentPage}
      totalPages={totalPages}
      pageSize={table.getState().pagination.pageSize}
      total={table.getFilteredRowModel().rows.length}
      onPageChange={(nextPage) => table.setPageIndex(nextPage - 1)}
      hidePaginationText={hidePaginationText}
    />
  );

  return (
    <div className="space-y-3 w-full max-w-full min-w-0 overflow-hidden">
      {searchKey && !hideSearch && (
        <div className="flex flex-col gap-3">
          <div className="flex items-end flex-wrap gap-x-6 gap-y-3">
            <div className="flex items-end gap-4">
              <Input
                placeholder={searchPlaceholder}
                value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
                onChange={(event) => table.getColumn(searchKey)?.setFilterValue(event.target.value)}
                className="w-auto min-w-[200px] sm:min-w-[350px] max-w-2xl pr-8 h-[42px] bg-glass-bg border border-glass-border text-white hover:bg-glass-bg/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/20 placeholder:text-content-text-tertiary"
              />
              {searchActions}
            </div>
            {filterComponent && <div className="flex items-end gap-4 flex-1">{filterComponent}</div>}
            <div className="text-sm text-content-text-secondary whitespace-nowrap pb-2 ml-auto">
              {table.getFilteredRowModel().rows.length} of {data.length} results
            </div>
          </div>
          {secondaryFilterComponent}
        </div>
      )}
      {!searchKey && filterComponent && <div>{filterComponent}</div>}

      {!hidePagination && paginationBlock}

      <div ref={wrapperRef} className="@container/datatable w-full min-w-0">
        <Table className="w-full">
          <colgroup>
            {(() => {
              const cols = table.getVisibleLeafColumns();
              const rootFontSize =
                typeof window === "undefined"
                  ? 16
                  : parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
              const widths = computeColumnWidths(cols, wrapperWidth, rootFontSize);
              return cols.map((column, i) => <col key={column.id} style={{ width: widths[i] }} />);
            })()}
          </colgroup>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="text-left text-sm text-content-text-secondary">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    // text-xs on mobile keeps multi-word headers ("Last
                    // Played", "Avg Gap") from forcing fixed-width columns
                    // wider than their numeric content actually needs.
                    className={cn(
                      "px-1.5 py-2 sm:px-2 sm:py-2.5 text-xs sm:text-sm text-content-text-secondary align-top",
                      header.column.columnDef.meta?.headerClassName,
                    )}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-content-text-tertiary py-12 px-4 sm:px-6 md:px-8"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-lg">Loading...</div>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`border-t border-glass-border/30 hover:bg-hover-glass ${rowClassName?.(row.original, index) ?? ""}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "px-1.5 py-2 sm:px-2 sm:py-2.5 align-top break-words",
                        cell.column.columnDef.meta?.cellClassName,
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-content-text-tertiary py-12 px-4 sm:px-6 md:px-8"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-lg">No results found</div>
                    {searchKey && table.getColumn(searchKey)?.getFilterValue() ? (
                      <div className="text-sm">Try adjusting your search terms</div>
                    ) : null}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {!hidePagination && paginationBlock}
    </div>
  );
}
