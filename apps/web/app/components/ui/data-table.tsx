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
    width?: string;
    cellClassName?: string;
    hideOnMobile?: boolean;
  }
}

import { type ReactNode, useState } from "react";

import { Input } from "~/components/ui/input";
import { PaginationControls } from "~/components/ui/pagination-controls";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { cn } from "~/lib/utils";

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
    <div className="space-y-3 w-full max-w-full overflow-hidden">
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

      <div className="overflow-x-auto w-full">
        <Table className="w-full table-auto sm:table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="text-left text-sm text-content-text-secondary">
                {headerGroup.headers.map((header) => {
                  const hideOnMobile = header.column.columnDef.meta?.hideOnMobile;
                  // Width hint applies only at sm+ — on mobile we let
                  // table-auto size columns to content. Without this,
                  // desktop-tuned widths (e.g. 180px for the perf-table
                  // Date column) would starve other columns on phones.
                  const width = header.column.columnDef.meta?.width;
                  const widthStyle = width ? ({ "--col-w": width } as React.CSSProperties) : undefined;
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "px-1.5 py-2 sm:p-3 text-sm text-content-text-secondary align-top",
                        hideOnMobile && "hidden sm:table-cell",
                        width && "sm:w-[var(--col-w)]",
                      )}
                      style={widthStyle}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
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
                        "px-1.5 py-2 sm:p-3 align-top break-words",
                        cell.column.columnDef.meta?.hideOnMobile && "hidden sm:table-cell",
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
