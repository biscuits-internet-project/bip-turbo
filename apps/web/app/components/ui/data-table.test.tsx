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
  test("renders column headers and row cells", async () => {
    await setup(<DataTable columns={basicColumns} data={rows} hideSearch />);

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Count")).toBeInTheDocument();
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
    expect(screen.getByText("Gamma")).toBeInTheDocument();
  });

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

  test("empty state renders 'No results found'", async () => {
    await setup(<DataTable columns={basicColumns} data={[]} hideSearch />);

    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  test("isLoading state renders 'Loading...'", async () => {
    await setup(<DataTable columns={basicColumns} data={rows} hideSearch isLoading />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    // When loading, rows should not render
    expect(screen.queryByText("Alpha")).not.toBeInTheDocument();
  });

  test("hidePagination removes Previous/Next buttons", async () => {
    await setup(<DataTable columns={basicColumns} data={rows} hideSearch hidePagination />);

    expect(screen.queryByRole("button", { name: "Previous" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Next" })).not.toBeInTheDocument();
  });

  test("pagination buttons render when not hidden", async () => {
    await setup(<DataTable columns={basicColumns} data={rows} hideSearch />);

    expect(screen.getByRole("button", { name: "Previous" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
  });

  // TODO(Phase 1): un-skip once DataTable reads meta.width from column defs
  // instead of hardcoded column-ID widths. See project_songs_table_unification.md Phase 1.
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
