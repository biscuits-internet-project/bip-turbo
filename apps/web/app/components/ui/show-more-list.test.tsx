import { setup } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { ShowMoreList } from "./show-more-list";

const songs = ["Basis for a Day", "Helicopters", "Mulberry's Dream", "Aceetobee", "Little Lai"];

function renderList(items: string[], initialCount?: number) {
  return setup(
    <ShowMoreList
      items={items}
      initialCount={initialCount}
      getKey={(song) => song}
      renderItem={(song) => <span>{song}</span>}
    />,
  );
}

describe("ShowMoreList", () => {
  // The point of the component: a long list previews only its head, and the
  // button says exactly how many rows are being held back.
  test("renders only the first initialCount items with a 'Show N more' button", async () => {
    await renderList(songs, 3);

    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByText("Mulberry's Dream")).toBeInTheDocument();
    expect(screen.queryByText("Aceetobee")).not.toBeInTheDocument();
    const button = screen.getByRole("button", { name: "Show 2 more" });
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  test("defaults initialCount to 3", async () => {
    await renderList(songs);

    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  test("clicking reveals every item and flips the label to 'Show fewer'; clicking again collapses", async () => {
    const { user } = await renderList(songs, 3);

    await user.click(screen.getByRole("button", { name: "Show 2 more" }));
    expect(screen.getAllByRole("listitem")).toHaveLength(5);
    expect(screen.getByRole("button", { name: "Show fewer" })).toHaveAttribute("aria-expanded", "true");

    await user.click(screen.getByRole("button", { name: "Show fewer" }));
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByRole("button", { name: "Show 2 more" })).toBeInTheDocument();
  });

  // Nothing is hidden at or under the limit, so a toggle would be noise.
  test("renders no button when items are at or under initialCount", async () => {
    await renderList(songs.slice(0, 3), 3);

    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
