import type { ColumnDef } from "@tanstack/react-table";
import { setup } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { computeColumnWidths, DataTable } from "./data-table";

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

  // When there are zero results, pagination controls should not render at
  // all — Previous/Next buttons and "Page X of Y" are meaningless with no
  // data to page through.
  test("hides pagination controls when data is empty", async () => {
    await setup(<DataTable columns={basicColumns} data={[]} hideSearch />);

    expect(screen.queryByRole("button", { name: "Previous" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Next" })).not.toBeInTheDocument();
    expect(screen.queryByText(/Page/)).not.toBeInTheDocument();
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

  // The default/non-hidePagination mode shows Previous and Next buttons
  // above and below the table when there are multiple pages.
  test("pagination buttons render when there are multiple pages", async () => {
    const manyRows = Array.from({ length: 6 }, (_, i) => ({
      id: String(i),
      name: `Row ${i}`,
      count: i,
    }));

    await setup(<DataTable columns={basicColumns} data={manyRows} hideSearch pageSize={3} />);

    expect(screen.getAllByRole("button", { name: "Previous" })).toHaveLength(2);
    expect(screen.getAllByRole("button", { name: "Next" })).toHaveLength(2);
  });

  // When all data fits on a single page, page navigation controls are hidden
  // (Previous/Next buttons and page input) but the results summary still shows.
  test("page controls are hidden when data fits on one page", async () => {
    await setup(<DataTable columns={basicColumns} data={rows} hideSearch />);

    expect(screen.queryByRole("button", { name: "Previous" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Next" })).not.toBeInTheDocument();
    expect(screen.getAllByText(/Showing 1 to 3 of 3 results/)).toHaveLength(2);
  });

  // The page input shows "Page [input] of N" between Previous and Next.
  test("renders page input with current page and total", async () => {
    const manyRows = Array.from({ length: 10 }, (_, i) => ({
      id: String(i),
      name: `Row ${i}`,
      count: i,
    }));

    await setup(<DataTable columns={basicColumns} data={manyRows} hideSearch pageSize={3} />);

    // 10 rows / 3 per page = 4 pages
    const pageInputs = screen.getAllByRole("spinbutton");
    expect(pageInputs.length).toBeGreaterThanOrEqual(2); // top + bottom
    expect(pageInputs[0]).toHaveValue(1);
    expect(screen.getAllByText(/of 4/).length).toBeGreaterThanOrEqual(2);
  });

  // Typing a page number into the input navigates to that page.
  test("typing a page number in the input navigates to that page", async () => {
    const manyRows = Array.from({ length: 6 }, (_, i) => ({
      id: String(i),
      name: `Row ${i}`,
      count: i,
    }));

    const { user } = await setup(<DataTable columns={basicColumns} data={manyRows} hideSearch pageSize={3} />);

    expect(screen.getByText("Row 0")).toBeInTheDocument();

    // Clear the input and type "2", then press Enter
    const pageInputs = screen.getAllByRole("spinbutton");
    await user.clear(pageInputs[0]);
    await user.type(pageInputs[0], "2{Enter}");

    expect(screen.getByText("Row 3")).toBeInTheDocument();
    expect(screen.queryByText("Row 0")).not.toBeInTheDocument();
  });

  // Out-of-range values are clamped: below 1 goes to page 1, above max goes to last page.
  test("page input clamps out-of-range values", async () => {
    const manyRows = Array.from({ length: 6 }, (_, i) => ({
      id: String(i),
      name: `Row ${i}`,
      count: i,
    }));

    const { user } = await setup(<DataTable columns={basicColumns} data={manyRows} hideSearch pageSize={3} />);

    const pageInputs = screen.getAllByRole("spinbutton");

    // Type a number higher than max pages (2) — should clamp to last page
    await user.clear(pageInputs[0]);
    await user.type(pageInputs[0], "99{Enter}");

    expect(screen.getByText("Row 3")).toBeInTheDocument(); // page 2
    expect(screen.queryByText("Row 0")).not.toBeInTheDocument();
  });

  // Page input should not render when hidePagination is true.
  test("page input hidden when hidePagination is true", async () => {
    const manyRows = Array.from({ length: 10 }, (_, i) => ({
      id: String(i),
      name: `Row ${i}`,
      count: i,
    }));

    await setup(<DataTable columns={basicColumns} data={manyRows} hideSearch hidePagination />);

    expect(screen.queryByRole("spinbutton")).not.toBeInTheDocument();
  });

  // Columns marked `meta.hideOnMobile` are dropped from rendering below the
  // `sm` breakpoint — driven through TanStack's `columnVisibility` (not CSS
  // `hidden sm:table-cell`) so the `<colgroup>` indices stay aligned with
  // the actually-rendered TDs.
  //
  // jsdom doesn't fire ResizeObserver, so wrapperWidth stays 0 here. The
  // gating treats unmeasured (wrapperWidth=0) as desktop — preferring a
  // full render over preemptive hiding. So in this test the hideOnMobile
  // column should still render.
  test("hideOnMobile meta column renders by default (wrapper unmeasured)", async () => {
    const columnsWithHidden: ColumnDef<Row>[] = [
      { accessorKey: "name", header: "Name" },
      { accessorKey: "count", header: "Count", meta: { hideOnMobile: true } },
    ];

    await setup(<DataTable columns={columnsWithHidden} data={rows} hideSearch />);

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Count")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  // Column widths come from a <colgroup>. Each column uses either a
  // `fixedWidth` (CSS length, applied verbatim) or a `weight` (share of
  // pixel space left after fixed-width columns claim theirs). The wrapper
  // width is measured at runtime via ResizeObserver; on first paint
  // (before measurement) widths fall back to relative percentages.
  test("first-paint render uses percentage widths for flex columns", async () => {
    const columnsWithWeights: ColumnDef<Row>[] = [
      { accessorKey: "name", header: "Name", meta: { weight: 3 } },
      { accessorKey: "count", header: "Count" /* default weight 1 */ },
    ];

    const { container } = await setup(<DataTable columns={columnsWithWeights} data={rows} hideSearch />);

    const cols = container.querySelectorAll("colgroup col");
    expect(cols).toHaveLength(2);
    // 3 of 4 total weight = 75%; 1 of 4 = 25%. (jsdom doesn't fire
    // ResizeObserver, so we stay on the percentage fallback path.)
    expect((cols[0] as HTMLElement).style.width).toBe("75%");
    expect((cols[1] as HTMLElement).style.width).toBe("25%");
  });

  // Fixed-width columns get their declared length verbatim regardless of
  // measurement state — flex columns share whatever's left.
  test("fixedWidth columns get their length verbatim", async () => {
    const columns: ColumnDef<Row>[] = [
      { accessorKey: "name", header: "Name" /* flex weight 1 */ },
      { accessorKey: "count", header: "Count", meta: { fixedWidth: "3rem" } },
    ];

    const { container } = await setup(<DataTable columns={columns} data={rows} hideSearch />);

    const cols = container.querySelectorAll("colgroup col");
    expect((cols[0] as HTMLElement).style.width).toBe("100%");
    expect((cols[1] as HTMLElement).style.width).toBe("3rem");
  });
});

describe("computeColumnWidths", () => {
  // The DOM render path is exercised in the DataTable tests above but
  // only on the pre-measurement (percentage) branch — jsdom doesn't fire
  // ResizeObserver. Drive the post-measurement branch directly so we
  // catch regressions in the pixel math: fixedWidth columns get their
  // declared length, the rest split the remainder by weight.
  type R = { id: string };
  const c = (
    id: string,
    meta?: { weight?: number; fixedWidth?: string },
  ): { id: string; columnDef: ColumnDef<R, unknown> } => ({
    id,
    columnDef: { id, meta } as ColumnDef<R, unknown>,
  });

  test("with a measured wrapper, flex columns split leftover pixels by weight", () => {
    const cols = [c("song", { weight: 3 }), c("date", { weight: 1 })];
    const widths = computeColumnWidths<R, unknown>(cols, /* wrapperWidth */ 1000, /* rootFontSize */ 16);
    // 100% goes to flex; song gets 3/4 = 750px, date gets 250px.
    expect(widths).toEqual(["750px", "250px"]);
  });

  test("fixedWidth columns subtract from leftover; flex columns share the rest", () => {
    const cols = [c("song", { weight: 3 }), c("plays", { fixedWidth: "4rem" }), c("date", { weight: 1 })];
    // 4rem = 64px at 16px root; leftover = 1000-64 = 936; song gets 3/4 = 702, date 234.
    const widths = computeColumnWidths<R, unknown>(cols, 1000, 16);
    expect(widths).toEqual(["702px", "4rem", "234px"]);
  });

  test("wrapperWidth=0 (SSR / first paint) falls back to percentage shares for flex columns", () => {
    const cols = [c("song", { weight: 3 }), c("plays", { fixedWidth: "4rem" }), c("date", { weight: 1 })];
    const widths = computeColumnWidths<R, unknown>(cols, 0, 16);
    // Pixel math is suppressed; flex shares fall back to percentages of the full container.
    // Fixed col still applied. The shares ignore the fixedWidth and may sum > 100% for
    // a single frame before measurement takes over — intentional, documented in the helper.
    expect(widths).toEqual(["75%", "4rem", "25%"]);
  });
});
