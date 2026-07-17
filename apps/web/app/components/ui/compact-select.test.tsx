import { setup } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import { CompactSelect } from "./compact-select";

const OPTIONS = [
  { value: "S1", label: "Set 1" },
  { value: "S2", label: "Set 2" },
];

describe("CompactSelect", () => {
  // The trigger button shows the label of the currently-selected option
  // — verified by rendering with `value` matching an option.
  test("renders the selected option's label on the trigger", async () => {
    await setup(<CompactSelect value="S2" onValueChange={vi.fn()} options={OPTIONS} />);
    expect(screen.getByRole("combobox")).toHaveTextContent("Set 2");
  });

  // No selection + a placeholder renders the placeholder on the trigger.
  test("renders the placeholder when no value matches", async () => {
    await setup(<CompactSelect value="" onValueChange={vi.fn()} options={OPTIONS} placeholder="Pick a set" />);
    expect(screen.getByRole("combobox")).toHaveTextContent("Pick a set");
  });

  // Selecting an option fires onValueChange with the option's value (not
  // its label) so the caller can store the canonical key.
  test("selecting an option fires onValueChange with the value (not the label)", async () => {
    const onValueChange = vi.fn();
    const { user } = await setup(<CompactSelect value="S1" onValueChange={onValueChange} options={OPTIONS} />);

    await user.click(screen.getByRole("combobox"));
    await user.click(await screen.findByText("Set 2"));
    expect(onValueChange).toHaveBeenCalledWith("S2");
  });

  // Callers size the trigger via className, so it has to survive the merge
  // with the component's own classes rather than being dropped.
  test("keeps caller-supplied className on the trigger", async () => {
    await setup(<CompactSelect value="S1" onValueChange={vi.fn()} options={OPTIONS} className="w-40" />);
    expect(screen.getByRole("combobox").className).toContain("w-40");
  });
});
