import { setup } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { ToggleFilterGroup } from "./toggle-filter-group";

const filters = [
  { key: "encore", label: "Encore" },
  { key: "setOpener", label: "Set Opener" },
  { key: "segueIn", label: "Segue In" },
];

describe("ToggleFilterGroup", () => {
  // The group renders one button per filter definition. This is the baseline
  // rendering test — if it fails, the component isn't producing visible output.
  test("renders a button for each filter", async () => {
    await setup(<ToggleFilterGroup filters={filters} activeFilters={new Set()} onToggle={() => {}} />);

    expect(screen.getByRole("button", { name: "Encore" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Set Opener" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Segue In" })).toBeInTheDocument();
  });

  // Active chips get a filled background to visually distinguish them from
  // inactive ones. The active class is the primary brand color.
  test("active filter chip has active styling class", async () => {
    await setup(<ToggleFilterGroup filters={filters} activeFilters={new Set(["encore"])} onToggle={() => {}} />);

    const encoreButton = screen.getByRole("button", { name: "Encore" });
    expect(encoreButton.className).toContain("bg-brand-primary");

    const openerButton = screen.getByRole("button", { name: "Set Opener" });
    expect(openerButton.className).not.toContain("bg-brand-primary");
  });

  // Clicking a chip fires onToggle with that chip's key so the parent can
  // add/remove it from the active set. The component is controlled — it
  // doesn't manage its own state.
  test("clicking a chip calls onToggle with its key", async () => {
    const handleToggle = vi.fn();
    const { user } = await setup(
      <ToggleFilterGroup filters={filters} activeFilters={new Set()} onToggle={handleToggle} />,
    );

    await user.click(screen.getByRole("button", { name: "Segue In" }));
    expect(handleToggle).toHaveBeenCalledWith("segueIn");
  });
});
