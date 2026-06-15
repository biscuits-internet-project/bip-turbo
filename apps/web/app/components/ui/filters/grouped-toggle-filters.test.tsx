import { setup } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { TOGGLE_FILTER_DEFINITIONS } from "~/lib/song-filters";
import { GroupedToggleFilters } from "./grouped-toggle-filters";

const ALL_FILTERS = TOGGLE_FILTER_DEFINITIONS.map((filter) => ({ key: filter.key, label: filter.label }));

describe("GroupedToggleFilters", () => {
  // The three groups each render as one popover trigger button; the chips
  // themselves live inside the (closed) popover until it's opened.
  test("renders a popover trigger per group", async () => {
    await setup(<GroupedToggleFilters filters={ALL_FILTERS} activeFilters={new Set()} onToggle={() => {}} />);

    for (const label of ["Quality", "Position", "Attributes"]) {
      expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
    }
  });

  // A group whose chips are all hidden by the caller is not rendered. Quality's
  // chips (jamChart, allTimer, attended) hidden → no Quality button.
  test("skips a group with no visible chips", async () => {
    const hidden = new Set(["jamChart", "allTimer", "attended"]);
    const withoutQuality = ALL_FILTERS.filter((filter) => !hidden.has(filter.key));
    await setup(<GroupedToggleFilters filters={withoutQuality} activeFilters={new Set()} onToggle={() => {}} />);

    expect(screen.queryByRole("button", { name: "Quality" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Position" })).toBeInTheDocument();
  });

  // Active filters inside a group surface as a count badge on its trigger, so
  // the user sees there's an active filter without opening the popover.
  test("shows an active-count badge for a group with active filters", async () => {
    await setup(
      <GroupedToggleFilters
        filters={ALL_FILTERS}
        activeFilters={new Set(["split", "standalone"])}
        onToggle={() => {}}
      />,
    );

    // Attributes holds both active filters; its trigger shows the count.
    expect(screen.getByRole("button", { name: /Attributes/ }).textContent).toContain("2");
  });

  // Opening a group's popover reveals its chips.
  test("opening a group reveals its chips", async () => {
    const { user } = await setup(
      <GroupedToggleFilters filters={ALL_FILTERS} activeFilters={new Set()} onToggle={() => {}} />,
    );

    expect(screen.queryByRole("button", { name: "Split" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Attributes" }));
    expect(await screen.findByRole("button", { name: "Split" })).toBeInTheDocument();
  });

  // The component is controlled: clicking a chip reports its key to the parent.
  test("clicking a chip calls onToggle with its key", async () => {
    const handleToggle = vi.fn();
    const { user } = await setup(
      <GroupedToggleFilters filters={ALL_FILTERS} activeFilters={new Set()} onToggle={handleToggle} />,
    );

    await user.click(screen.getByRole("button", { name: "Attributes" }));
    await user.click(await screen.findByRole("button", { name: "Standalone" }));
    expect(handleToggle).toHaveBeenCalledWith("standalone");
  });
});
