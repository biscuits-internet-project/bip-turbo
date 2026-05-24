import { setup } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import { GlassSelect, glassSelectContentClass, glassSelectTriggerClass } from "./glass-select";

const OPTIONS = [
  { value: "S1", label: "Set 1" },
  { value: "S2", label: "Set 2" },
];

describe("GlassSelect", () => {
  // The trigger button shows the label of the currently-selected option
  // — verified by rendering with `value` matching an option.
  test("renders the selected option's label on the trigger", async () => {
    await setup(<GlassSelect value="S2" onValueChange={vi.fn()} options={OPTIONS} />);
    expect(screen.getByRole("combobox")).toHaveTextContent("Set 2");
  });

  // No selection + a placeholder renders the placeholder on the trigger.
  test("renders the placeholder when no value matches", async () => {
    await setup(<GlassSelect value="" onValueChange={vi.fn()} options={OPTIONS} placeholder="Pick a set" />);
    expect(screen.getByRole("combobox")).toHaveTextContent("Pick a set");
  });

  // Selecting an option fires onValueChange with the option's value (not
  // its label) so the caller can store the canonical key.
  test("selecting an option fires onValueChange with the value (not the label)", async () => {
    const onValueChange = vi.fn();
    const { user } = await setup(<GlassSelect value="S1" onValueChange={onValueChange} options={OPTIONS} />);

    await user.click(screen.getByRole("combobox"));
    await user.click(await screen.findByText("Set 2"));
    expect(onValueChange).toHaveBeenCalledWith("S2");
  });

  // The trigger applies the project's glass styling so it visually
  // matches the /songs filter dropdowns and other GlassSelect consumers.
  test("applies the glass trigger styling", async () => {
    await setup(<GlassSelect value="S1" onValueChange={vi.fn()} options={OPTIONS} />);
    const trigger = screen.getByRole("combobox");
    expect(trigger.className).toContain("bg-glass-bg");
    expect(trigger.className).toContain("border-glass-border");
  });

  // The shared className constants are exported so other components
  // (notably SelectFilter, used on /songs) can reuse them and stay in
  // visual lockstep with GlassSelect.
  test("exposes shared class-name constants for sibling components", () => {
    expect(glassSelectTriggerClass).toContain("bg-glass-bg");
    expect(glassSelectContentClass).toContain("bg-glass-bg");
  });

  // Caller-supplied className stacks with the glass classes so layouts
  // can specify width / sizing without losing the visual treatment.
  test("merges caller-supplied className with the trigger's glass classes", async () => {
    await setup(<GlassSelect value="S1" onValueChange={vi.fn()} options={OPTIONS} className="w-40" />);
    const trigger = screen.getByRole("combobox");
    expect(trigger.className).toContain("w-40");
    expect(trigger.className).toContain("bg-glass-bg");
  });
});
