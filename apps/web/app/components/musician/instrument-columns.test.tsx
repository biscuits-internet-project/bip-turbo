import { setup } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import { getInstrumentColumns } from "./instrument-columns";

type Row = { id: string; name: string; slug: string; usageCount?: number };

function renderActionsCell(instrument: Row) {
  const columns = getInstrumentColumns(vi.fn());
  const actions = columns.find((c) => c.id === "actions");
  const cell = actions?.cell;
  if (typeof cell !== "function") throw new Error("actions cell missing");
  // The cell only reads row.original, so a minimal context is enough.
  return cell({ row: { original: instrument } } as never);
}

describe("instrument actions column", () => {
  // A free instrument can be deleted, so the icon shows.
  test("renders a delete button for an unused instrument", async () => {
    await setup(<div>{renderActionsCell({ id: "g1", name: "Guitar", slug: "guitar", usageCount: 0 })}</div>);
    expect(screen.getByRole("button", { name: "Delete Guitar" })).toBeInTheDocument();
  });

  // An in-use instrument can't be deleted (service guard), so no affordance.
  test("renders no delete button for an in-use instrument", async () => {
    await setup(<div>{renderActionsCell({ id: "g1", name: "Guitar", slug: "guitar", usageCount: 3 })}</div>);
    expect(screen.queryByRole("button", { name: "Delete Guitar" })).not.toBeInTheDocument();
  });
});
