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
  }
}

import { type ReactNode, useState } from "react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";

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

  const paginationBlock = !hasResults ? null : (
    <div className="flex items-center justify-between px-2">
      {!hidePaginationText ? (
        <div className="text-sm text-content-text-secondary font-medium">
          {table.getFilteredRowModel().rows.length === 0
            ? "0 results"
            : `Showing ${table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to ${Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length,
              )} of ${table.getFilteredRowModel().rows.length} results`}
        </div>
      ) : (
        <div />
      )}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 text-sm text-content-text-secondary">
          <span>Page</span>
          <span className="font-semibold text-content-text-primary">
            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="hover:bg-brand-primary/20 hover:border-brand-primary/40"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="hover:bg-brand-primary/20 hover:border-brand-primary/40"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
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
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="text-left text-sm text-content-text-secondary">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="p-3 text-sm text-content-text-secondary"
                      style={{
                        width: header.column.columnDef.meta?.width,
                      }}
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
                    <TableCell key={cell.id} className="p-3">
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
