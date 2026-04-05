import type { ColumnDef } from "@tanstack/react-table";
import { screen } from "@testing-library/react";
import { setup } from "@test/test-utils";
import { describe, expect, test } from "vitest";
import { DataTable } from "./data-table";

type Row = { id: string; name: string; count: number };

const rows: Row[] = [
  { id: "1", name: "Alpha", count: 3 },
  { id: "2", name: "Beta", count: 1 },
  { id: "3", name: "Gamma", count: 2 },
];

const basicColumns: ColumnDef<Row>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "count", header: "Count" },
];

describe("DataTable", () => {
  // Baseline smoke test: given columns + data, the table renders header labels
  // and one row per data item. If this fails, every other test is suspect.
  test("renders column headers and row cells", async () => {
    await setup(<DataTable columns={basicColumns} data={rows} hideSearch />);

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Count")).toBeInTheDocument();
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
    expect(screen.getByText("Gamma")).toBeInTheDocument();
  });

  // The built-in search input (rendered when `searchKey` is set) filters the
  // table on that column using TanStack's column filter. Verifies the
  // input→filter wiring; pages like /songs and /admin/authors rely on it.
  test("search filter narrows visible rows by searchKey", async () => {
    const { user } = await setup(
      <DataTable columns={basicColumns} data={rows} searchKey="name" searchPlaceholder="Search..." />,
    );

    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();

    const input = screen.getByPlaceholderText("Search...");
    await user.type(input, "Alp");

    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.queryByText("Beta")).not.toBeInTheDocument();
    expect(screen.queryByText("Gamma")).not.toBeInTheDocument();
  });

  // The `rowClassName` callback lets callers style individual rows based on
  // row data (e.g., attendance-row highlighting on top-rated shows).
  test("rowClassName callback adds class to each row", async () => {
    await setup(
      <DataTable
        columns={basicColumns}
        data={rows}
        hideSearch
        rowClassName={(row) => (row.count > 1 ? "big-count" : undefined)}
      />,
    );

    // Row with count=3 (Alpha) and count=2 (Gamma) should have the class; count=1 (Beta) should not
    const alphaRow = screen.getByText("Alpha").closest("tr");
    const betaRow = screen.getByText("Beta").closest("tr");
    const gammaRow = screen.getByText("Gamma").closest("tr");

    expect(alphaRow?.className).toContain("big-count");
    expect(gammaRow?.className).toContain("big-count");
    expect(betaRow?.className ?? "").not.toContain("big-count");
  });

  // When `data` is empty, the table shows a friendly empty-state message
  // instead of a bare table body. Matters for filtered views where the user's
  // query yields zero rows.
  test("empty state renders 'No results found'", async () => {
    await setup(<DataTable columns={basicColumns} data={[]} hideSearch />);

    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  // When `isLoading=true`, rows are hidden and a loading indicator appears in
  // their place. Used by /songs during filter-refetch to avoid showing stale
  // data while the new API response is in flight.
  test("isLoading state renders 'Loading...'", async () => {
    await setup(<DataTable columns={basicColumns} data={rows} hideSearch isLoading />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    // When loading, rows should not render
    expect(screen.queryByText("Alpha")).not.toBeInTheDocument();
  });

  // Callers that render all rows at once (like /songs, which has <1000 songs
  // total) pass `hidePagination` to suppress the paginator. Confirms that the
  // Previous/Next buttons don't render in that mode.
  test("hidePagination removes Previous/Next buttons", async () => {
    await setup(<DataTable columns={basicColumns} data={rows} hideSearch hidePagination />);

    expect(screen.queryByRole("button", { name: "Previous" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Next" })).not.toBeInTheDocument();
  });

  // The default/non-hidePagination mode shows Previous and Next buttons.
  // Complement to the previous test — together they pin pagination visibility
  // to the `hidePagination` prop exactly.
  test("pagination buttons render when not hidden", async () => {
    await setup(<DataTable columns={basicColumns} data={rows} hideSearch />);

    expect(screen.getByRole("button", { name: "Previous" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
  });

  // Pending: DataTable currently hardcodes column widths by ID
  // (header.id === "title" etc.), a leaky abstraction. This test pins the
  // desired behavior — a column's `meta.width` is applied as the header's
  // CSS width — and should be un-skipped once DataTable reads from
  // `column.columnDef.meta?.width` instead.
  test.skip("honors meta.width on column defs", async () => {
    const columnsWithWidths: ColumnDef<Row>[] = [
      { accessorKey: "name", header: "Name", meta: { width: "60%" } },
      { accessorKey: "count", header: "Count", meta: { width: "40%" } },
    ];

    await setup(<DataTable columns={columnsWithWidths} data={rows} hideSearch />);

    const nameHeader = screen.getByText("Name").closest("th");
    const countHeader = screen.getByText("Count").closest("th");

    expect(nameHeader?.style.width).toBe("60%");
    expect(countHeader?.style.width).toBe("40%");
  });
});
