import { setup } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import { Dropdown } from "./dropdown";

const OPTIONS = [
  { value: "S1", label: "Set 1" },
  { value: "S2", label: "Set 2" },
];

describe("Dropdown", () => {
  // The trigger shows the label of the currently-selected option, so the
  // control reads as "Set 2" rather than the raw value.
  test("renders the selected option's label on the trigger", async () => {
    await setup(<Dropdown value="S2" onValueChange={vi.fn()} options={OPTIONS} />);
    expect(screen.getByRole("combobox")).toHaveTextContent("Set 2");
  });

  // No selection + a placeholder shows the placeholder on the trigger.
  test("renders the placeholder when no value matches", async () => {
    await setup(<Dropdown value="" onValueChange={vi.fn()} options={OPTIONS} placeholder="Pick a set" />);
    expect(screen.getByRole("combobox")).toHaveTextContent("Pick a set");
  });

  // Selecting an option fires onValueChange with the option's value (not its
  // label) so the caller stores the canonical key.
  test("selecting an option fires onValueChange with the value (not the label)", async () => {
    const onValueChange = vi.fn();
    const { user } = await setup(<Dropdown value="S1" onValueChange={onValueChange} options={OPTIONS} />);

    await user.click(screen.getByRole("combobox"));
    await user.click(await screen.findByRole("option", { name: "Set 2" }));
    expect(onValueChange).toHaveBeenCalledWith("S2");
  });

  // Grouped options render their group label and are individually selectable,
  // so the filter-bar selects that need optgroups can route through Dropdown.
  test("renders grouped options and selects one", async () => {
    const onValueChange = vi.fn();
    const groups = [
      { label: "Sets", options: [{ value: "S1", label: "Set 1" }] },
      { label: "Encores", options: [{ value: "E1", label: "Encore 1" }] },
    ];
    const { user } = await setup(<Dropdown value="S1" onValueChange={onValueChange} groups={groups} />);

    await user.click(screen.getByRole("combobox"));
    expect(await screen.findByText("Encores")).toBeInTheDocument();
    await user.click(await screen.findByRole("option", { name: "Encore 1" }));
    expect(onValueChange).toHaveBeenCalledWith("E1");
  });

  // Callers size the trigger via className, so it must survive the merge with
  // the component's own classes rather than being dropped.
  test("keeps caller-supplied className on the trigger", async () => {
    await setup(<Dropdown value="S1" onValueChange={vi.fn()} options={OPTIONS} className="w-40" />);
    expect(screen.getByRole("combobox").className).toContain("w-40");
  });
});
