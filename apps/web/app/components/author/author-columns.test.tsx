import { setup } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import { getAuthorColumns } from "./author-columns";

type Row = { id: string; name: string; slug: string; songCount?: number };

function renderActionsCell(author: Row) {
  const columns = getAuthorColumns(vi.fn());
  const actions = columns.find((c) => c.id === "actions");
  const cell = actions?.cell;
  if (typeof cell !== "function") throw new Error("actions cell missing");
  return cell({ row: { original: author } } as never);
}

describe("author actions column", () => {
  // An author with no songs can be deleted, so the icon shows.
  test("renders a delete button for an author with no songs", async () => {
    await setup(
      <div>{renderActionsCell({ id: "jg", name: "Jon Gutwillig", slug: "jon-gutwillig", songCount: 0 })}</div>,
    );
    expect(screen.getByRole("button", { name: "Delete Jon Gutwillig" })).toBeInTheDocument();
  });

  // An author with songs can't be deleted (service guard), so no affordance.
  test("renders no delete button for an author with songs", async () => {
    await setup(
      <div>{renderActionsCell({ id: "jg", name: "Jon Gutwillig", slug: "jon-gutwillig", songCount: 7 })}</div>,
    );
    expect(screen.queryByRole("button", { name: "Delete Jon Gutwillig" })).not.toBeInTheDocument();
  });
});
