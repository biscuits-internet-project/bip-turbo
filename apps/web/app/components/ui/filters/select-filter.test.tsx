import { screen } from "@testing-library/react";
import { setup } from "@test/test-utils";
import { describe, expect, test, vi } from "vitest";
import { SelectFilter } from "./select-filter";

const options = [
  { value: "all", label: "All" },
  { value: "original", label: "Original" },
  { value: "cover", label: "Cover" },
];

describe("SelectFilter", () => {
  // The label sits above the select trigger and is associated via htmlFor/id.
  // Confirms the component renders a visible label with the given text.
  test("renders label text", async () => {
    await setup(<SelectFilter id="test-filter" label="Type" value="all" onValueChange={() => {}} options={options} />);

    expect(screen.getByText("Type")).toBeInTheDocument();
  });

  // The trigger shows the currently selected option's label. When value
  // matches an option, its label is visible in the trigger.
  test("displays the selected value in the trigger", async () => {
    await setup(
      <SelectFilter id="test-filter" label="Type" value="cover" onValueChange={() => {}} options={options} />,
    );

    expect(screen.getByText("Cover")).toBeInTheDocument();
  });

  // When the user picks a new option, onValueChange fires with the option's
  // value string. This is the core contract between the filter and its parent.
  test("calls onValueChange when an option is selected", async () => {
    const handleChange = vi.fn();
    const { user } = await setup(
      <SelectFilter id="test-filter" label="Type" value="all" onValueChange={handleChange} options={options} />,
    );

    // Open the select dropdown
    await user.click(screen.getByRole("combobox"));
    // Select "Cover" option
    await user.click(screen.getByRole("option", { name: "Cover" }));

    expect(handleChange).toHaveBeenCalledWith("cover");
  });

  // The width prop lets callers control the trigger width to match the
  // layout context (e.g. "w-[130px]" for Year vs "w-[170px]" for Era).
  test("applies the width class to the trigger", async () => {
    await setup(
      <SelectFilter
        id="test-filter"
        label="Type"
        value="all"
        onValueChange={() => {}}
        options={options}
        width="w-[120px]"
      />,
    );

    const trigger = screen.getByRole("combobox");
    expect(trigger.className).toContain("w-[120px]");
  });
});
