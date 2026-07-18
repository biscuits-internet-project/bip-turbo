import { setupWithRouter } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { FilterNav } from "./filter-nav";

describe("FilterNav", () => {
  // The (N) per-filter count is kept in the DOM (for sm+ and screen readers)
  // even though CSS hides it on mobile, where it would overlap the label.
  test("renders the per-filter count", async () => {
    await setupWithRouter(
      <FilterNav
        title="Filter by Year"
        filters={["2024", "2025"]}
        basePath="/shows/year/"
        filterCounts={{ "2024": 12, "2025": 7 }}
      />,
    );

    expect(screen.getByText("(12)")).toBeInTheDocument();
  });

  // The "All" button's count follows the same rule.
  test("renders the allCount", async () => {
    await setupWithRouter(
      <FilterNav title="Filter by Year" filters={["2024"]} basePath="/shows/year/" showAllButton allCount={100} />,
    );

    expect(screen.getByText("(100)")).toBeInTheDocument();
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
});
