import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { type ReactNode, useState } from "react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  pageSize?: number;
  hideSearch?: boolean;
  hidePaginationText?: boolean;
  hidePagination?: boolean;
  searchActions?: ReactNode;
  filterComponent?: ReactNode;
  isLoading?: boolean;
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
  isLoading = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
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

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      {searchKey && !hideSearch && (
        <div className="flex items-end justify-between gap-6">
          <div className="flex items-end gap-4">
            <Input
              placeholder={searchPlaceholder}
              value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn(searchKey)?.setFilterValue(event.target.value)}
              className="w-auto min-w-[400px] max-w-2xl pr-8 h-[42px] bg-glass-bg border border-glass-border text-white hover:bg-glass-bg/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/20 placeholder:text-content-text-tertiary"
            />
            {searchActions}
          </div>
          {filterComponent && <div className="flex items-end gap-4 flex-1">{filterComponent}</div>}
          <div className="text-sm text-content-text-secondary whitespace-nowrap pb-2">
            {table.getFilteredRowModel().rows.length} of {data.length} results
          </div>
        </div>
      )}

      <div className="card-premium rounded-lg shadow-lg overflow-hidden w-full">
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-glass-border/60 hover:bg-transparent bg-glass-bg/30">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-content-text-secondary font-semibold text-base uppercase tracking-wide py-5 px-4 sm:px-6 md:px-8 first:pl-4 sm:first:pl-6 md:first:pl-8 last:pr-4 sm:last:pr-6 md:last:pr-8"
                      style={{
                        width:
                          header.id === "title"
                            ? "30%"
                            : header.id === "timesPlayed"
                              ? "10%"
                              : header.id === "yearlyPlayData"
                                ? "10%"
                                : "25%",
                      }}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="bg-glass-bg/10">
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
                  className={`border-glass-border/30 transition-all duration-200 hover:bg-hover-glass/80 ${
                    index % 2 === 0 ? "bg-glass-bg/5" : "bg-glass-bg/15"
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="py-5 px-4 sm:px-6 md:px-8 first:pl-4 sm:first:pl-6 md:first:pl-8 last:pr-4 sm:last:pr-6 md:last:pr-8 text-base"
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

      {!hidePagination && (
        <div className="flex items-center justify-between px-2">
          {!hidePaginationText ? (
            <div className="text-sm text-content-text-secondary font-medium">
              Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length,
              )}{" "}
              of {table.getFilteredRowModel().rows.length} results
            </div>
          ) : (
            <div></div>
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
      )}
    </div>
  );
}
