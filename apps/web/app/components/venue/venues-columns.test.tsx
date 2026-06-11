import type { ColumnDef, Row } from "@tanstack/react-table";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test, vi } from "vitest";
import type { VenueRow } from "~/lib/venue-rows";
import { getVenuesColumns } from "./venues-columns";

type CellRenderer = (ctx: { row: Pick<Row<VenueRow>, "original"> }) => React.ReactNode;

function row(overrides: Partial<VenueRow> = {}): VenueRow {
  return {
    id: "v1",
    name: "Starland Ballroom",
    slug: "starland-ballroom",
    city: "Sayreville",
    state: "NJ",
    country: "United States",
    showCount: 5,
    years: [2019, 2018, 2017],
    firstSlug: "2017-08-15-starland-ballroom",
    firstDate: "2017-08-15",
    lastSlug: "2019-12-31-starland-ballroom",
    lastDate: "2019-12-31",
    ...overrides,
  };
}

function column(id: string): ColumnDef<VenueRow> {
  const col = getVenuesColumns().find((c) => c.id === id);
  if (!col) throw new Error(`no column with id ${id}`);
  return col;
}

/** Invoke a column's cell renderer with a minimal context and render it. */
function renderCell(id: string, data: VenueRow) {
  const cell = column(id).cell as CellRenderer;
  return render(<MemoryRouter>{cell({ row: { original: data } })}</MemoryRouter>);
}

describe("getVenuesColumns", () => {
  // Years played shows the distinct-year count, with the full list as a hover
  // title (mirrors the venue detail page's value + sublabel).
  test("years column shows the count with the full year list as a title", () => {
    renderCell("years", row({ years: [2019, 2018, 2017] }));
    const titled = screen.getByText("3").closest("[title]");
    expect(titled?.getAttribute("title")).toBe("2019, 2018, 2017");
  });

  test("first-show column links to that show's page", () => {
    renderCell("firstShow", row({ firstSlug: "2017-08-15-starland-ballroom" }));
    expect(screen.getByRole("link").getAttribute("href")).toBe("/shows/2017-08-15-starland-ballroom");
  });

  // A venue with no shows has no first/last slug — render the placeholder, no link.
  test("first-show column renders a placeholder when there is no show", () => {
    renderCell("firstShow", row({ firstSlug: null, firstDate: null }));
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  // Mobile drops the date/years columns so the core Venue/Location/Shows
  // columns aren't squeezed off-screen; Name/Location/Shows always show.
  test("hides first/last show and years columns on mobile, keeps the rest", () => {
    const hidden = (id: string) => column(id).meta?.hideOnMobile === true;
    expect(hidden("firstShow")).toBe(true);
    expect(hidden("lastShow")).toBe(true);
    expect(hidden("years")).toBe(true);
    expect(hidden("name")).toBe(false);
    expect(hidden("location")).toBe(false);
    expect(hidden("shows")).toBe(false);
  });

  // The single search box stands in for the old multi-field card search, so the
  // name column's filter must match city/state/country too, not just the name.
  test("name column filter matches on city, not just name", () => {
    const filterFn = column("name").filterFn as (
      r: Pick<Row<VenueRow>, "original">,
      id: string,
      value: string,
    ) => boolean;
    expect(filterFn({ original: row() }, "name", "sayreville")).toBe(true);
    expect(filterFn({ original: row() }, "name", "nowhere")).toBe(false);
  });

  // Admins get a trailing actions column; non-admins never do.
  test("only admins get the actions column", () => {
    expect(getVenuesColumns({ isAdmin: true, onDeleted: vi.fn() }).some((c) => c.id === "actions")).toBe(true);
    expect(getVenuesColumns().some((c) => c.id === "actions")).toBe(false);
  });

  // In-use venues can't be deleted (the service guard rejects it), so the delete
  // button appears only on zero-show rows.
  test("admin delete button shows only for zero-show venues", () => {
    const actions = getVenuesColumns({ isAdmin: true, onDeleted: vi.fn() }).find((c) => c.id === "actions");
    if (!actions) throw new Error("expected an actions column");
    const cell = actions.cell as CellRenderer;

    const { rerender } = render(<MemoryRouter>{cell({ row: { original: row({ showCount: 0 }) } })}</MemoryRouter>);
    expect(screen.queryByRole("button")).toBeInTheDocument();

    rerender(<MemoryRouter>{cell({ row: { original: row({ showCount: 3 }) } })}</MemoryRouter>);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
