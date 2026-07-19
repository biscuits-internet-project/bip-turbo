import { setupWithRouter } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";

import { TabNav } from "./tab-nav";

const ITEMS = [
  { value: "a", label: "First" },
  { value: "b", label: "Second" },
  { value: "c", label: "Third" },
];

afterEach(() => {
  vi.restoreAllMocks();
});

describe("TabNav", () => {
  // jsdom reports zero element widths and never fires ResizeObserver, so the
  // bar (not the dropdown) is the default rendered state — the tabs show inline.
  test("renders the bar with every tab and marks the active one", async () => {
    await setupWithRouter(<TabNav items={ITEMS} value="b" onValueChange={vi.fn()} ariaLabel="Views" />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs.map((t) => t.textContent)).toEqual(["First", "Second", "Third"]);
    expect(screen.getByRole("tab", { name: "Second" })).toHaveAttribute("data-state", "active");
  });

  // Clicking a value-mode tab reports the selected value so the caller can
  // navigate or update state.
  test("clicking a tab fires onValueChange with its value", async () => {
    const onValueChange = vi.fn();
    const { user } = await setupWithRouter(
      <TabNav items={ITEMS} value="a" onValueChange={onValueChange} ariaLabel="Views" />,
    );
    await user.click(screen.getByRole("tab", { name: "Third" }));
    expect(onValueChange).toHaveBeenCalledWith("c");
  });

  // An item with `href` renders a real anchor so route tabs keep native
  // navigation (open-in-new-tab, prefetch) instead of a plain button.
  test("renders href items as links", async () => {
    const items = [{ value: "/songs", label: "All Songs", href: "/songs" }];
    await setupWithRouter(<TabNav items={items} value="/songs" onValueChange={vi.fn()} ariaLabel="Songs view" />);
    expect(screen.getByText("All Songs").closest("a")).toHaveAttribute("href", "/songs");
  });

  // With the tabs fitting (jsdom reports zero widths → no overflow), neither
  // scroll chevron is shown.
  test("shows no scroll chevrons when the tabs fit", async () => {
    await setupWithRouter(<TabNav items={ITEMS} value="a" onValueChange={vi.fn()} ariaLabel="Views" />);
    expect(screen.queryByLabelText(/scroll tabs/i)).not.toBeInTheDocument();
  });

  // When the strip overflows and is scrolled to the start, only the "more to
  // the right" chevron shows. Stubbing the measured widths drives that branch.
  test("shows a right scroll chevron when tabs overflow to the right", async () => {
    vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockReturnValue(1000);
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(100);
    await setupWithRouter(<TabNav items={ITEMS} value="a" onValueChange={vi.fn()} ariaLabel="Views" />);
    expect(screen.getByLabelText("Scroll tabs right")).toBeInTheDocument();
    expect(screen.queryByLabelText("Scroll tabs left")).not.toBeInTheDocument();
  });

  // Clicking a scroll chevron scrolls the strip in that direction.
  test("clicking the right chevron scrolls the strip", async () => {
    vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockReturnValue(1000);
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(100);
    const scrollBy = vi.fn();
    HTMLElement.prototype.scrollBy = scrollBy;
    const { user } = await setupWithRouter(
      <TabNav items={ITEMS} value="a" onValueChange={vi.fn()} ariaLabel="Views" />,
    );
    await user.click(screen.getByLabelText("Scroll tabs right"));
    expect(scrollBy).toHaveBeenCalledWith(expect.objectContaining({ left: expect.any(Number) }));
  });
});
