import { setup, setupWithRouter } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { SegmentButton, SegmentLink } from "./segment-button";

describe("SegmentButton", () => {
  // aria-pressed reflects the `active` prop so screen readers announce the
  // current selection. The visual branch (brand-primary underline vs
  // transparent) follows the same flag; the browser owns its appearance.
  test("active=true sets aria-pressed", async () => {
    await setup(
      <SegmentButton active={true} onClick={vi.fn()}>
        chart
      </SegmentButton>,
    );
    expect(screen.getByRole("button", { name: "chart" })).toHaveAttribute("aria-pressed", "true");
  });

  test("active=false clears aria-pressed", async () => {
    await setup(
      <SegmentButton active={false} onClick={vi.fn()}>
        table
      </SegmentButton>,
    );
    expect(screen.getByRole("button", { name: "table" })).toHaveAttribute("aria-pressed", "false");
  });

  // Clicking fires the supplied handler. Verified via spy rather than
  // observing visual state — the caller owns the active/inactive flip.
  test("invokes onClick when clicked", async () => {
    const onClick = vi.fn();
    const { user } = await setup(
      <SegmentButton active={false} onClick={onClick}>
        gap chart
      </SegmentButton>,
    );
    await user.click(screen.getByRole("button", { name: "gap chart" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  // Rendered as a button (not a div/anchor) so it inherits keyboard
  // activation (Enter/Space) and focus management for free. type="button"
  // prevents accidental form submits when nested inside a <form>.
  test("renders as <button type='button'>", async () => {
    const { container } = await setup(
      <SegmentButton active={true} onClick={vi.fn()}>
        personal
      </SegmentButton>,
    );
    const button = container.querySelector("button");
    expect(button).not.toBeNull();
    expect(button).toHaveAttribute("type", "button");
  });
});

describe("SegmentLink", () => {
  // The navigating counterpart, for toggles where each segment is its own
  // route rather than local state. `aria-current="page"` is the right state for
  // a link pointing at the page you're already on — `aria-pressed` would claim
  // it's a toggle button.
  test("marks the active segment with aria-current, not aria-pressed", async () => {
    await setupWithRouter(
      <SegmentLink active={true} to="/shows/stats">
        table
      </SegmentLink>,
    );

    const link = screen.getByRole("link", { name: "table" });
    expect(link).toHaveAttribute("aria-current", "page");
    expect(link).not.toHaveAttribute("aria-pressed");
  });

  test("leaves aria-current off the inactive segment", async () => {
    await setupWithRouter(
      <SegmentLink active={false} to="/shows/year/2001">
        setlist
      </SegmentLink>,
    );

    expect(screen.getByRole("link", { name: "setlist" })).not.toHaveAttribute("aria-current");
  });

  // Renders a real anchor so the segment is middle-clickable and shareable —
  // the whole reason this exists alongside the button form.
  test("renders an anchor pointing at its destination", async () => {
    await setupWithRouter(
      <SegmentLink active={false} to="/shows/stats?timeRange=2001">
        table
      </SegmentLink>,
    );

    expect(screen.getByRole("link", { name: "table" })).toHaveAttribute("href", "/shows/stats?timeRange=2001");
  });
});
