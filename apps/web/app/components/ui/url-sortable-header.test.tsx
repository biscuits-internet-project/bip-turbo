import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { UrlSortableHeader } from "./url-sortable-header";

type Sort = "date" | "rating";

function setup(props: Partial<React.ComponentProps<typeof UrlSortableHeader<Sort>>> = {}) {
  const onSortChange = vi.fn();
  const utils = render(
    <UrlSortableHeader<Sort>
      sortKey="date"
      label="Show"
      currentSort={props.currentSort ?? "rating"}
      currentDirection={props.currentDirection ?? "desc"}
      defaultDirection={props.defaultDirection}
      onSortChange={onSortChange}
    />,
  );
  return { user: userEvent.setup(), onSortChange, ...utils };
}

describe("UrlSortableHeader", () => {
  test("renders the label inside a button", () => {
    setup();
    expect(screen.getByRole("button", { name: /Show/ })).toBeInTheDocument();
  });

  // The active column (currentSort === sortKey) is marked active so the table
  // can emphasize its label + arrow; an idle column is not.
  test("marks itself active only when its column is the active sort", () => {
    const { rerender } = setup({ currentSort: "rating" });
    expect(screen.getByRole("button", { name: /Show/ })).toHaveAttribute("data-active", "false");

    rerender(
      <UrlSortableHeader<Sort>
        sortKey="date"
        label="Show"
        currentSort="date"
        currentDirection="desc"
        onSortChange={vi.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: /Show/ })).toHaveAttribute("data-active", "true");
  });

  // Clicking an idle column applies the default direction (desc) so a fresh
  // sort lands "biggest/newest first" like the rest of the site.
  test("clicking an idle column requests the default desc direction", async () => {
    const { user, onSortChange } = setup({ currentSort: "rating", currentDirection: "asc" });
    await user.click(screen.getByRole("button", { name: /Show/ }));
    expect(onSortChange).toHaveBeenCalledWith("date", "desc");
  });

  // A column can opt into asc-first (e.g. Set/Track/Song columns) via
  // defaultDirection.
  test("clicking an idle column honors an asc defaultDirection", async () => {
    const { user, onSortChange } = setup({ currentSort: "rating", defaultDirection: "asc" });
    await user.click(screen.getByRole("button", { name: /Show/ }));
    expect(onSortChange).toHaveBeenCalledWith("date", "asc");
  });

  // Re-clicking the active column flips its direction rather than resetting
  // to the default — asc → desc and desc → asc.
  test("clicking the active ascending column flips to descending", async () => {
    const { user, onSortChange } = setup({ currentSort: "date", currentDirection: "asc" });
    await user.click(screen.getByRole("button", { name: /Show/ }));
    expect(onSortChange).toHaveBeenCalledWith("date", "desc");
  });

  test("clicking the active descending column flips to ascending", async () => {
    const { user, onSortChange } = setup({ currentSort: "date", currentDirection: "desc" });
    await user.click(screen.getByRole("button", { name: /Show/ }));
    expect(onSortChange).toHaveBeenCalledWith("date", "asc");
  });
});
