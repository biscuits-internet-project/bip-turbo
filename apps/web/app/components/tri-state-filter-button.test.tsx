import { setupWithRouter } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { TriStateFilterButton } from "./tri-state-filter-button";

const baseProps = {
  label: "Archive",
  href: "/shows/year/2024?archive=yes",
  icon: <span data-testid="icon">icon</span>,
};

describe("TriStateFilterButton", () => {
  // Label and icon are always rendered regardless of state — the only thing
  // state changes is styling and the aria-label phrasing.
  test("renders label and icon", async () => {
    await setupWithRouter(<TriStateFilterButton {...baseProps} state="empty" />);

    expect(screen.getByText("Archive")).toBeInTheDocument();
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  // The href flows straight through to the underlying Link so the parent
  // owns the cycle (empty→positive→negative→empty); the button doesn't
  // compute it.
  test("uses the provided href verbatim", async () => {
    await setupWithRouter(<TriStateFilterButton {...baseProps} state="positive" />);

    const link = screen.getByRole("link", { name: /archive/i });
    expect(link.getAttribute("href")).toBe("/shows/year/2024?archive=yes");
  });

  // Empty-state aria-label tells screen reader users the filter is off and
  // what clicking does — preserves accessibility parity with the visual cue
  // (border style) sighted users get.
  test("empty state announces 'not filtered, click to require'", async () => {
    await setupWithRouter(<TriStateFilterButton {...baseProps} state="empty" />);

    const link = screen.getByRole("link", { name: /archive/i });
    expect(link.getAttribute("aria-label")).toMatch(/not filtered/i);
    expect(link.getAttribute("aria-label")).toMatch(/click to require/i);
  });

  // Positive-state aria-label distinguishes "included" from "excluded" —
  // a key accessibility requirement since the only visual difference is
  // border color.
  test("positive state announces 'currently included, click to exclude'", async () => {
    await setupWithRouter(<TriStateFilterButton {...baseProps} state="positive" />);

    const link = screen.getByRole("link", { name: /archive/i });
    expect(link.getAttribute("aria-label")).toMatch(/currently included/i);
    expect(link.getAttribute("aria-label")).toMatch(/click to exclude/i);
  });

  // Negative-state aria-label closes the cycle: clicking returns to empty.
  test("negative state announces 'currently excluded, click to clear'", async () => {
    await setupWithRouter(<TriStateFilterButton {...baseProps} state="negative" />);

    const link = screen.getByRole("link", { name: /archive/i });
    expect(link.getAttribute("aria-label")).toMatch(/currently excluded/i);
    expect(link.getAttribute("aria-label")).toMatch(/click to clear/i);
  });

  // Negative state wraps the icon in a strikethrough overlay so the icon
  // visually reads as "excluded". The overlay is the only `.rotate-45`
  // element rendered, so its presence is a clean signal.
  test("negative state wraps the icon with a strikethrough overlay", async () => {
    const { unmount } = await setupWithRouter(<TriStateFilterButton {...baseProps} state="negative" />);
    expect(document.querySelector(".rotate-45")).not.toBeNull();
    unmount();

    await setupWithRouter(<TriStateFilterButton {...baseProps} state="empty" />);
    expect(document.querySelector(".rotate-45")).toBeNull();
  });

  // Each state is exposed via data-state so the three states are distinguishable
  // by contract; the per-state border/background is the visual cue and is a
  // browser concern.
  test.each(["empty", "positive", "negative"] as const)("exposes data-state='%s'", async (state) => {
    await setupWithRouter(<TriStateFilterButton {...baseProps} state={state} />);
    expect(screen.getByRole("link")).toHaveAttribute("data-state", state);
  });
});
