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

  // Default mode: collapsed on mobile (JS state) but force-expanded at >= md via
  // CSS, so there's no hydration flash from a JS breakpoint hook.
  test("expands at md via CSS and starts collapsed on mobile", () => {
    render(<CollapsibleSection title="Songs">body</CollapsibleSection>);

    const body = screen.getByTestId("collapsible-section-body");
    expect(body.className).toContain("md:grid-rows-[1fr]");
    expect(body.className).toContain("grid-rows-[0fr]");
  });

  test("toggling the header opens the collapsed mobile body", async () => {
    const { user } = await setup(<CollapsibleSection title="Songs">body</CollapsibleSection>);

    const body = screen.getByTestId("collapsible-section-body");
    expect(body.className).toContain("grid-rows-[0fr]");

    await user.click(screen.getByTestId("collapsible-section-toggle"));
    expect(body.className).toContain("grid-rows-[1fr]");
  });

  // collapsibleOnDesktop drops the md: force-open so the section collapses at
  // every width (the chevron stays visible on desktop too).
  test("collapsibleOnDesktop collapses at all widths", () => {
    render(
      <CollapsibleSection title="Songs" collapsibleOnDesktop>
        body
      </CollapsibleSection>,
    );

    const body = screen.getByTestId("collapsible-section-body");
    expect(body.className).not.toContain("md:grid-rows-[1fr]");
  });

  // breakpoint="sm" force-expands from the small breakpoint instead of md, for
  // filter chrome that only needs collapsing on phones.
  test("breakpoint='sm' force-opens at sm rather than md", () => {
    render(
      <CollapsibleSection title="Filter by Year" breakpoint="sm">
        body
      </CollapsibleSection>,
    );

    const body = screen.getByTestId("collapsible-section-body");
    expect(body.className).toContain("sm:grid-rows-[1fr]");
    expect(body.className).not.toContain("md:grid-rows-[1fr]");
  });

  // collapseOnLandscape re-collapses on short (landscape-phone) viewports even
  // above the breakpoint, so the filter chrome doesn't eat a rotated phone.
  test("collapseOnLandscape adds the short: re-collapse overrides", () => {
    render(
      <CollapsibleSection title="Filter by Year" breakpoint="sm" collapseOnLandscape>
        body
      </CollapsibleSection>,
    );

    const body = screen.getByTestId("collapsible-section-body");
    expect(body.className).toContain("short:!grid-rows-[0fr]");
  });

  // dividerWhenClosed draws a bottom border on the header only while collapsed,
  // so bare chrome (the filter panel) signals there's hidden content; the line
  // drops away once opened.
  test("dividerWhenClosed shows a bottom border only while closed", async () => {
    const { user } = await setup(
      <CollapsibleSection title="Filters" dividerWhenClosed>
        body
      </CollapsibleSection>,
    );

    const toggle = screen.getByTestId("collapsible-section-toggle");
    expect(toggle.className).toContain("border-b");

    await user.click(toggle);
    expect(toggle.className).not.toContain("border-b");
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
