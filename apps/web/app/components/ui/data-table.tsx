import {
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

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
    <div className="space-y-6">
      {searchKey && !hideSearch && (
        <div className="flex items-center justify-between">
          <Input
            placeholder={searchPlaceholder}
            value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn(searchKey)?.setFilterValue(event.target.value)}
            className="max-w-sm search-input"
          />
          <div className="text-sm text-content-text-secondary">
            {table.getFilteredRowModel().rows.length} of {data.length} results
          </div>
        </div>
      )}

      <div className="card-premium rounded-lg shadow-lg overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-glass-border/60 hover:bg-transparent bg-glass-bg/30">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-content-text-secondary font-semibold text-base uppercase tracking-wide py-5 px-8 first:pl-8 last:pr-8"
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="bg-glass-bg/10">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`border-glass-border/30 transition-all duration-200 hover:bg-hover-glass/80 ${
                    index % 2 === 0 ? "bg-glass-bg/5" : "bg-glass-bg/15"
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-5 px-8 first:pl-8 last:pr-8 text-base">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-content-text-tertiary py-12 px-8">
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
