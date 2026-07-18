import { setup } from "@test/test-utils";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { CollapsibleSection } from "./collapsible-section";

describe("CollapsibleSection", () => {
  test("renders the title heading, count badge, and headerExtra", () => {
    render(
      <CollapsibleSection title="Songs" count={12} headerExtra={<span data-testid="extra" />}>
        body
      </CollapsibleSection>,
    );

    expect(screen.getByRole("heading", { name: "Songs" })).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByTestId("extra")).toBeInTheDocument();
  });

  // The count badge lives outside the heading element so the heading's
  // accessible name stays exactly the title (callers query it by name).
  test("keeps the count out of the heading's accessible name", () => {
    render(
      <CollapsibleSection title="Songs" count={12}>
        body
      </CollapsibleSection>,
    );

    expect(screen.getByRole("heading", { name: "Songs" })).toBeInTheDocument();
  });

  test("toggling the header opens the collapsed mobile body", async () => {
    const { user } = await setup(<CollapsibleSection title="Songs">body</CollapsibleSection>);

    const body = screen.getByTestId("collapsible-section-body");
    const toggle = screen.getByTestId("collapsible-section-toggle");
    expect(body).toHaveAttribute("data-open", "false");
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);
    expect(body).toHaveAttribute("data-open", "true");
    expect(toggle).toHaveAttribute("aria-expanded", "true");
  });

  // The force-open-at-breakpoint behaviour is implemented as static Tailwind
  // classes on purpose (a JS media hook would flash on hydration), so the class
  // string IS the contract and there's no runtime state to assert — the browser
  // verifies the classes actually take effect. These three cases guard the
  // prop→class branch only.
  test("default force-opens at md; breakpoint='sm' force-opens at sm; collapsibleOnDesktop force-opens at neither", () => {
    const { rerender } = render(<CollapsibleSection title="Songs">body</CollapsibleSection>);
    expect(screen.getByTestId("collapsible-section-body").className).toContain("md:grid-rows-[1fr]");

    rerender(
      <CollapsibleSection title="Songs" breakpoint="sm">
        body
      </CollapsibleSection>,
    );
    let body = screen.getByTestId("collapsible-section-body");
    expect(body.className).toContain("sm:grid-rows-[1fr]");
    expect(body.className).not.toContain("md:grid-rows-[1fr]");

    rerender(
      <CollapsibleSection title="Songs" collapsibleOnDesktop>
        body
      </CollapsibleSection>,
    );
    body = screen.getByTestId("collapsible-section-body");
    expect(body.className).not.toContain("md:grid-rows-[1fr]");
  });

  // collapseOnLandscape re-collapses on short (landscape-phone) viewports even
  // above the breakpoint. Same class-is-contract exception as above.
  test("collapseOnLandscape adds the short: re-collapse override", () => {
    render(
      <CollapsibleSection title="Filter by Year" breakpoint="sm" collapseOnLandscape>
        body
      </CollapsibleSection>,
    );

    expect(screen.getByTestId("collapsible-section-body").className).toContain("short:!grid-rows-[0fr]");
  });

  // titleAs lets a nested card (the lineup) drop to an h3 while page sections
  // default to h2.
  test("renders the title as the requested heading level", () => {
    render(
      <CollapsibleSection title="Lineup" titleAs="h3">
        body
      </CollapsibleSection>,
    );

    expect(screen.getByRole("heading", { level: 3, name: "Lineup" })).toBeInTheDocument();
  });
});
