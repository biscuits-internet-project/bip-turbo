import { mockShallowComponent } from "@test/test-utils";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test, vi } from "vitest";

vi.mock("~/hooks/use-performance-page-filters", () => ({
  usePerformancePageFilters: vi.fn(() => ({
    filteredData: [],
    isLoading: false,
    selectedTimeRange: "all",
    coverFilter: "all",
    selectedAuthor: null,
    playedFilter: "all",
    activeToggleSet: new Set(),
    hasActiveFilters: false,
    searchText: "",
    setSearchText: vi.fn(),
    updateFilter: vi.fn(),
    toggleFilter: vi.fn(),
    clearFilters: vi.fn(),
  })),
}));

vi.mock("~/components/performance/performance-filter-controls", () => ({
  PerformanceFilterControls: (props: object) => mockShallowComponent("PerformanceFilterControls", props),
}));

vi.mock("./songs-table", () => ({
  SongsTable: ({ filterComponent, ...rest }: { filterComponent?: React.ReactNode }) => (
    <div data-testid="SongsTable">
      {filterComponent}
      <span>props: {JSON.stringify(rest, Object.keys(rest).sort())}</span>
    </div>
  ),
}));

import { usePerformancePageFilters } from "~/hooks/use-performance-page-filters";
import { FilteredSongsTable } from "./filtered-songs-table";

function renderComponent(props: { extraParams?: Record<string, string>; hideTimeRange?: boolean }) {
  return render(
    <MemoryRouter>
      <FilteredSongsTable songs={[]} {...props} />
    </MemoryRouter>,
  );
}

describe("FilteredSongsTable", () => {
  // The component wires up usePerformancePageFilters, PerformanceFilterControls,
  // and SongsTable together — verify SongsTable renders.
  test("renders SongsTable", () => {
    renderComponent({});

    expect(screen.getByTestId("SongsTable")).toBeInTheDocument();
  });

  // extraParams should be forwarded to the hook so pre-baked tabs can
  // set a fixed time range for API requests.
  test("passes extraParams to usePerformancePageFilters", () => {
    renderComponent({ extraParams: { timeRange: "last10shows" } });

    expect(vi.mocked(usePerformancePageFilters)).toHaveBeenCalledWith(
      expect.objectContaining({ extraParams: { timeRange: "last10shows" } }),
    );
  });

  // When hideTimeRange is true, the PerformanceFilterControls should receive
  // it so the Time Range dropdown is suppressed.
  test("passes hideTimeRange to PerformanceFilterControls", () => {
    renderComponent({ hideTimeRange: true });

    const controls = screen.getByTestId("PerformanceFilterControls");
    expect(controls.textContent).toContain('"hideTimeRange":true');
  });

  // When hideTimeRange is not set, it defaults to undefined (falsy),
  // so the Time Range dropdown renders normally.
  test("does not pass hideTimeRange when not set", () => {
    renderComponent({});

    const controls = screen.getByTestId("PerformanceFilterControls");
    expect(controls.textContent).not.toContain('"hideTimeRange":true');
  });
});
