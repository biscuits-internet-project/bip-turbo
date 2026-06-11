import {
  type ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { SortableHeader } from "./sortable-header";

interface Row {
  id: string;
  name: string;
}

/**
 * Mount a minimal TanStack table with two columns so we can exercise the
 * SortableHeader component end-to-end: one sortable column, one non-sortable.
 */
function setup() {
  const columnHelper = createColumnHelper<Row>();
  const columns: ColumnDef<Row, unknown>[] = [
    columnHelper.accessor("name", {
      id: "name",
      enableSorting: true,
      header: ({ column }) => <SortableHeader column={column} label="Name" />,
    }) as ColumnDef<Row, unknown>,
    columnHelper.accessor("id", {
      id: "id",
      enableSorting: false,
      header: ({ column }) => <SortableHeader column={column} label="ID" />,
    }) as ColumnDef<Row, unknown>,
  ];
  function Harness() {
    const table = useReactTable<Row>({
      data: [
        { id: "1", name: "Tractorbeam" },
        { id: "2", name: "Above the Waves" },
      ],
      columns,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
    });
    return (
      <table>
        <thead>
          <tr>
            {table.getHeaderGroups()[0].headers.map((header) => (
              <th key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</th>
            ))}
          </tr>
        </thead>
      </table>
    );
  }
  return { user: userEvent.setup(), ...render(<Harness />) };
}

describe("SortableHeader", () => {
  // Sortable columns render an interactive button (clickable header) so the
  // user can toggle sort order. Non-sortable columns must NOT render a
  // button — clicking the label shouldn't do anything.
  test("sortable column renders a button; non-sortable renders plain text", () => {
    setup();
    expect(screen.getByRole("button", { name: /Name/ })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /ID/ })).not.toBeInTheDocument();
    // The non-sortable label still shows, just not as a button.
    expect(screen.getByText("ID")).toBeInTheDocument();
  });

  // Click cycles asc → desc → off. After each click the up/down indicator
  // should match the current sort state.
  test("clicking the sortable header toggles ascending then descending sort", async () => {
    const { user } = setup();
    const headerButton = screen.getByRole("button", { name: /Name/ });

    // First click sorts ascending — the active arrow is the up-icon (ArrowUp).
    await user.click(headerButton);
    expect(headerButton.querySelector("svg")).toBeTruthy();
    // The neutral up/down chevron (ArrowUpDown) is replaced by a directional
    // arrow once sorting is active. We can't easily inspect which icon Lucide
    // chose, but the "font-semibold" class flips on when sort is active —
    // use that as the structural signal.
    expect(headerButton.querySelector(".font-semibold")).toBeTruthy();

    // Second click flips to descending; semibold persists.
    await user.click(headerButton);
    expect(headerButton.querySelector(".font-semibold")).toBeTruthy();

    // Third click clears sort. The label loses the active styling.
    await user.click(headerButton);
    expect(headerButton.querySelector(".font-semibold")).toBeFalsy();
  });
});
