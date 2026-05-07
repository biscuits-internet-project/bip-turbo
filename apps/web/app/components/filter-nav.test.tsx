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

  // The panel always collapses on mobile (so the long year list doesn't
  // push the rest of the page out of the viewport) but stays expanded at
  // sm+ by default. The mobile toggle button is `sm:hidden`; desktop gets
  // a static heading.
  test("renders a mobile toggle button (sm:hidden)", async () => {
    await setupWithRouter(<FilterNav title="Filter by Year" filters={["2024"]} basePath="/shows/year/" />);

    const trigger = screen.getByRole("button", { name: /Filter by Year/ });
    expect(trigger.className).toContain("sm:hidden");
  });

  // On desktop the panel renders a non-button heading so the panel is
  // always expanded and there is no functional toggle visible.
  test("renders a static heading at sm+ (hidden sm:flex)", async () => {
    const { container } = await setupWithRouter(
      <FilterNav title="Filter by Year" filters={["2024"]} basePath="/shows/year/" />,
    );

    const desktopHeading = container.querySelector("h2");
    expect(desktopHeading?.className).toContain("hidden");
    expect(desktopHeading?.className).toContain("sm:flex");
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
});
