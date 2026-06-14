import { setupWithRouter } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { FilterNav } from "./filter-nav";

describe("FilterNav", () => {
  // The (N) per-filter count is helpful on desktop but causes the labels
  // to overlap on mobile (filter-by-year grid is too narrow). Hiding the
  // count span via `hidden sm:inline` keeps the data in the DOM but
  // suppresses it visually until sm+.
  test("filter count spans use 'hidden sm:inline' so they hide on mobile", async () => {
    await setupWithRouter(
      <FilterNav
        title="Filter by Year"
        filters={["2024", "2025"]}
        basePath="/shows/year/"
        filterCounts={{ "2024": 12, "2025": 7 }}
      />,
    );

    const countSpan = screen.getByText("(12)");
    expect(countSpan.className).toContain("hidden");
    expect(countSpan.className).toContain("sm:inline");
  });

  // The "All" button's count should follow the same hide-on-mobile rule
  // so it does not overlap the "All" label on phones.
  test("allCount span uses 'hidden sm:inline' so it hides on mobile", async () => {
    await setupWithRouter(
      <FilterNav title="Filter by Year" filters={["2024"]} basePath="/shows/year/" showAllButton allCount={100} />,
    );

    const countSpan = screen.getByText("(100)");
    expect(countSpan.className).toContain("hidden");
    expect(countSpan.className).toContain("sm:inline");
  });

  // The title is the collapsible toggle (a heading wrapping a button), so it's
  // reachable both as a heading and as a clickable control.
  test("renders the title as a collapsible toggle heading", async () => {
    await setupWithRouter(<FilterNav title="Filter by Year" filters={["2024"]} basePath="/shows/year/" />);

    expect(screen.getByRole("heading", { name: /Filter by Year/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Filter by Year/ })).toBeInTheDocument();
  });

  // Each filter is a link to its year route, preserving any active URL params.
  test("renders each filter as a link to its route", async () => {
    await setupWithRouter(<FilterNav title="Filter by Year" filters={["2024", "2025"]} basePath="/shows/year/" />);

    expect(screen.getByRole("link", { name: "2024" })).toHaveAttribute("href", "/shows/year/2024");
    expect(screen.getByRole("link", { name: "2025" })).toHaveAttribute("href", "/shows/year/2025");
  });

  // The panel collapses on phones but force-opens from sm+ (it's filter chrome,
  // which only crowds small screens — hence sm, not the md content default).
  test("force-opens from sm+ via sm:grid-rows-[1fr]", async () => {
    await setupWithRouter(<FilterNav title="Filter by Year" filters={["2024"]} basePath="/shows/year/" />);

    const body = screen.getByTestId("collapsible-section-body");
    expect(body.className).toContain("sm:grid-rows-[1fr]");
    expect(body.className).not.toContain("md:grid-rows-[1fr]");
  });

  // Phone-landscape collapse: a rotated phone has the same vertical-space crunch
  // as portrait, so the panel re-collapses on short viewports even above sm.
  test("re-collapses on short (landscape) viewports via short:!grid-rows-[0fr]", async () => {
    await setupWithRouter(<FilterNav title="Filter by Year" filters={["2024"]} basePath="/shows/year/" />);

    const body = screen.getByTestId("collapsible-section-body");
    expect(body.className).toContain("short:!grid-rows-[0fr]");
  });
});
