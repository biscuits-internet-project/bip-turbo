import { setup } from "@test/test-utils";
import { screen, within } from "@testing-library/react";
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

  // Grouped options should render with group labels so users can visually
  // distinguish between Recent, Eras, and Years in the Time Range dropdown.
  test("renders grouped options with group labels when groups prop is provided", async () => {
    const groups = [
      {
        label: "Recent",
        options: [
          { value: "last10shows", label: "Last 10 Shows" },
          { value: "thisYear", label: "This Year" },
        ],
      },
      {
        label: "Eras",
        options: [
          { value: "marlon", label: "Marlon Era" },
          { value: "allen", label: "Allen Era" },
        ],
      },
    ];

    const { user } = await setup(
      <SelectFilter id="test-filter" label="Time Range" value="all" onValueChange={() => {}} groups={groups} />,
    );
    await user.click(screen.getByRole("combobox"));

    // Group labels should be visible
    expect(screen.getByText("Recent")).toBeInTheDocument();
    expect(screen.getByText("Eras")).toBeInTheDocument();

    // Options within groups should be selectable
    expect(screen.getByRole("option", { name: "Last 10 Shows" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "This Year" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Marlon Era" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Allen Era" })).toBeInTheDocument();
  });

  // When both standalone options and groups are provided, standalone options
  // render before the groups (e.g., "All Time" above the grouped options).
  test("renders standalone options before groups when both are provided", async () => {
    const standaloneOptions = [{ value: "all", label: "All Time" }];
    const groups = [
      {
        label: "Recent",
        options: [{ value: "last10shows", label: "Last 10 Shows" }],
      },
    ];

    const { user } = await setup(
      <SelectFilter
        id="test-filter"
        label="Time Range"
        value="all"
        onValueChange={() => {}}
        options={standaloneOptions}
        groups={groups}
      />,
    );
    await user.click(screen.getByRole("combobox"));

    expect(screen.getByRole("option", { name: "All Time" })).toBeInTheDocument();
    expect(screen.getByText("Recent")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Last 10 Shows" })).toBeInTheDocument();

    // "All Time" should appear before "Last 10 Shows" in the DOM
    const listbox = screen.getByRole("listbox");
    const allOptions = within(listbox).getAllByRole("option");
    expect(allOptions[0]).toHaveTextContent("All Time");
    expect(allOptions[1]).toHaveTextContent("Last 10 Shows");
  });
});
