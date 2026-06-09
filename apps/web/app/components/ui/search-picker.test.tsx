import { setup } from "@test/test-utils";
import { screen, waitFor } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import { SearchPicker } from "./search-picker";

interface Item {
  id: string;
  name: string;
}

const ITEMS: Item[] = [
  { id: "1", name: "Apple" },
  { id: "2", name: "Banana" },
  { id: "3", name: "Cherry" },
];

// Default props shared across happy-path tests. Individual tests override
// only the props they need so each test reads as a delta from the baseline.
function baseProps(overrides: Partial<React.ComponentProps<typeof SearchPicker<Item>>> = {}) {
  return {
    value: null,
    onValueChange: vi.fn(),
    fetchResults: vi.fn().mockResolvedValue([]),
    itemId: (item: Item) => item.id,
    itemLabel: (item: Item) => item.name,
    placeholder: "Pick one…",
    ...overrides,
  };
}

describe("SearchPicker", () => {
  // Renders the placeholder when no value is selected and no initial item
  // is provided. This is the cold-start state for most pickers.
  test("renders the placeholder when value is null and no initial item", async () => {
    await setup(<SearchPicker<Item> {...baseProps({ placeholder: "Pick a fruit" })} />);
    expect(screen.getByRole("combobox")).toHaveTextContent("Pick a fruit");
  });

  // When an initial item is provided (the caller already has the record),
  // the trigger shows its label without waiting for the user to interact.
  test("renders the initial item's label on the trigger", async () => {
    await setup(<SearchPicker<Item> {...baseProps({ value: "1", initialItem: { id: "1", name: "Apple" } })} />);
    expect(screen.getByRole("combobox")).toHaveTextContent("Apple");
  });

  // When only `fetchById` is provided (no initialItem), the trigger seeds
  // its label asynchronously. Useful for forms that only know the id.
  test("seeds the trigger label by calling fetchById", async () => {
    const fetchById = vi.fn().mockResolvedValue({ id: "2", name: "Banana" });

    await setup(<SearchPicker<Item> {...baseProps({ value: "2", fetchById })} />);

    await waitFor(() => expect(fetchById).toHaveBeenCalledWith("2"));
    await waitFor(() => expect(screen.getByRole("combobox")).toHaveTextContent("Banana"));
  });

  // Debounce contract: fetchResults fires after a 300ms quiet period, not
  // on every keystroke. We assert via the call count after waiting past
  // the debounce window. Real timers keep this aligned with production
  // behavior — fake timers + cmdk's internal scheduling fight each other.
  test("debounces fetchResults so a burst of input collapses to one call", async () => {
    const fetchResults = vi.fn().mockResolvedValue(ITEMS);

    const { user } = await setup(<SearchPicker<Item> {...baseProps({ fetchResults })} />);

    // Mount fires the initial empty-query fetch via the debounced effect.
    await waitFor(() => expect(fetchResults).toHaveBeenCalledWith(""));
    fetchResults.mockClear();

    await user.click(screen.getByRole("combobox"));
    const input = await screen.findByPlaceholderText("Search…");
    await user.type(input, "app");

    await waitFor(() => expect(fetchResults).toHaveBeenCalledWith("app"), { timeout: 1500 });
    // The intermediate "a" and "ap" debounced away — at most one call for
    // the final query (a small amount of slop is fine because user.type
    // delays between keystrokes).
    const appCalls = fetchResults.mock.calls.filter((args) => args[0] === "app");
    expect(appCalls.length).toBe(1);
  });

  // Clicking an item reports its id via onValueChange and closes the
  // popover. This is the core selection path the wrappers depend on.
  test("clicking a result fires onValueChange with the item id and closes the popover", async () => {
    const onValueChange = vi.fn();
    const fetchResults = vi.fn().mockResolvedValue(ITEMS);

    const { user } = await setup(<SearchPicker<Item> {...baseProps({ onValueChange, fetchResults })} />);

    await user.click(screen.getByRole("combobox"));
    const cherry = await screen.findByText("Cherry");
    await user.click(cherry);

    expect(onValueChange).toHaveBeenCalledWith("3");
    await waitFor(() => expect(screen.queryByPlaceholderText("Search…")).not.toBeInTheDocument());
  });

  // When `noneLabel` is set, an extra clear-selection row appears at the
  // top of the list. Selecting it fires onValueChange(null) so callers
  // can drop the current selection.
  test("noneLabel renders a clear-selection row that reports null", async () => {
    const onValueChange = vi.fn();
    const fetchResults = vi.fn().mockResolvedValue(ITEMS);

    const { user } = await setup(
      <SearchPicker<Item> {...baseProps({ value: "1", onValueChange, fetchResults, noneLabel: "Clear" })} />,
    );

    await user.click(screen.getByRole("combobox"));
    await user.click(await screen.findByText("Clear"));

    expect(onValueChange).toHaveBeenCalledWith(null);
  });

  // Without `noneLabel`, the clear row is suppressed entirely. Pickers
  // that require a selection use this to prevent accidental clearing.
  test("noneLabel undefined suppresses the clear-selection row", async () => {
    const fetchResults = vi.fn().mockResolvedValue(ITEMS);

    const { user } = await setup(<SearchPicker<Item> {...baseProps({ fetchResults })} />);

    await user.click(screen.getByRole("combobox"));
    await screen.findByText("Apple");
    expect(screen.queryByText("Clear")).not.toBeInTheDocument();
    expect(screen.queryByText(/^No /)).not.toBeInTheDocument();
  });

  // `loadOnOpen` triggers an immediate fetch when the popover opens —
  // bypassing the debounce delay — so wrappers like AuthorSearch can
  // populate a top-N list before the user types anything.
  test("loadOnOpen fires fetchResults('') immediately on open", async () => {
    const fetchResults = vi.fn().mockResolvedValue(ITEMS);

    const { user } = await setup(<SearchPicker<Item> {...baseProps({ fetchResults, loadOnOpen: true })} />);

    // Drain the initial mount fetch so we don't conflate it with the open.
    await waitFor(() => expect(fetchResults).toHaveBeenCalled());
    fetchResults.mockClear();

    await user.click(screen.getByRole("combobox"));
    await waitFor(() => expect(fetchResults).toHaveBeenCalledWith(""));
  });

  // `emptyMessage` accepts a function of the current query so wrappers
  // can show "Type to search…" until the query is long enough, then
  // "No results." when it is.
  test("emptyMessage function receives the current query", async () => {
    const fetchResults = vi.fn().mockResolvedValue([]);

    const { user } = await setup(
      <SearchPicker<Item>
        {...baseProps({
          fetchResults,
          emptyMessage: (q) => (q.length < 2 ? "Type more" : "No matches"),
        })}
      />,
    );

    await user.click(screen.getByRole("combobox"));
    expect(await screen.findByText("Type more")).toBeInTheDocument();

    const input = screen.getByPlaceholderText("Search…");
    await user.type(input, "xyz");
    expect(await screen.findByText("No matches", undefined, { timeout: 1500 })).toBeInTheDocument();
  });

  // `allowCreate` exposes a "Create …" row at the top of the list. Default
  // shouldShow requires 2+ trimmed chars and no exact-match in items.
  test("allowCreate shows a create row at 2+ chars when no exact match exists", async () => {
    const fetchResults = vi.fn().mockResolvedValue([]);
    const onCreate = vi.fn().mockResolvedValue({ id: "9", name: "Durian" });
    const onValueChange = vi.fn();

    const { user } = await setup(
      <SearchPicker<Item>
        {...baseProps({
          fetchResults,
          onValueChange,
          allowCreate: { label: (q) => `Create "${q}"`, onCreate },
        })}
      />,
    );

    await user.click(screen.getByRole("combobox"));
    const input = await screen.findByPlaceholderText("Search…");
    await user.type(input, "Du");

    const createRow = await screen.findByText('Create "Du"', undefined, { timeout: 1500 });
    await user.click(createRow);

    await waitFor(() => expect(onCreate).toHaveBeenCalledWith("Du"));
    await waitFor(() => expect(onValueChange).toHaveBeenCalledWith("9"));
  });

  // Default shouldShow hides the create row when the query matches an
  // existing item exactly (case-insensitive). Prevents duplicate creation
  // when the user typed something already in the catalog.
  test("allowCreate hides the create row when an exact match already exists", async () => {
    const fetchResults = vi.fn().mockResolvedValue([{ id: "1", name: "Apple" }]);

    const { user } = await setup(
      <SearchPicker<Item>
        {...baseProps({
          fetchResults,
          allowCreate: { label: (q) => `Create "${q}"`, onCreate: vi.fn() },
        })}
      />,
    );

    await user.click(screen.getByRole("combobox"));
    const input = await screen.findByPlaceholderText("Search…");
    await user.type(input, "apple");

    // Give the debounce + fetch a chance to settle; the existing item is
    // already in items so the create row should never appear.
    await screen.findByText("Apple");
    expect(screen.queryByText(/Create "/)).not.toBeInTheDocument();
  });

  // `onItemChange` surfaces the full selected record (not just its id) so a
  // parent can react to the picked item's fields — e.g. the lineup editor
  // pre-filling a musician's default instrument. Fires on explicit selection.
  test("clicking a result fires onItemChange with the full item", async () => {
    const onItemChange = vi.fn();
    const fetchResults = vi.fn().mockResolvedValue(ITEMS);

    const { user } = await setup(<SearchPicker<Item> {...baseProps({ onItemChange, fetchResults })} />);

    await user.click(screen.getByRole("combobox"));
    await user.click(await screen.findByText("Banana"));

    expect(onItemChange).toHaveBeenCalledWith({ id: "2", name: "Banana" });
  });

  // Clearing the selection via the none row reports null through onItemChange
  // too, so the parent can reset any derived state.
  test("selecting the clear row fires onItemChange with null", async () => {
    const onItemChange = vi.fn();
    const fetchResults = vi.fn().mockResolvedValue(ITEMS);

    const { user } = await setup(
      <SearchPicker<Item> {...baseProps({ value: "1", onItemChange, fetchResults, noneLabel: "Clear" })} />,
    );

    await user.click(screen.getByRole("combobox"));
    await user.click(await screen.findByText("Clear"));

    expect(onItemChange).toHaveBeenCalledWith(null);
  });

  // fetchResults rejecting (e.g. server 500) is handled gracefully: items
  // clear and the configured emptyMessage shows. Prevents a transient
  // network error from corrupting the local items list.
  test("fetchResults rejecting clears the list without surfacing the error", async () => {
    const fetchResults = vi.fn().mockRejectedValue(new Error("network down"));

    const { user } = await setup(<SearchPicker<Item> {...baseProps({ fetchResults, emptyMessage: "no results" })} />);

    await user.click(screen.getByRole("combobox"));
    expect(await screen.findByText("no results")).toBeInTheDocument();
  });
});
