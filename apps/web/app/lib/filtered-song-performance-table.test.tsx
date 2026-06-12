import { mockShallowComponent } from "@test/test-utils";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test, vi } from "vitest";

const usePerformancePageFilters = vi.fn();
vi.mock("~/hooks/use-performance-page-filters", () => ({
  usePerformancePageFilters: (opts: object) => usePerformancePageFilters(opts),
  searchPerformance: vi.fn(),
}));
// Render headerContent (where the filter controls live) so the controls mount.
vi.mock("~/components/performance", () => ({
  PerformanceTable: ({ headerContent }: { headerContent?: React.ReactNode }) => (
    <div data-testid="PerformanceTable">{headerContent}</div>
  ),
}));
vi.mock("~/components/performance/performance-filter-controls", () => ({
  PerformanceFilterControls: (props: object) => mockShallowComponent("PerformanceFilterControls", props),
}));

const { FilteredSongPerformanceTable } = await import("./filtered-song-performance-table");

function hookReturn(overrides: Record<string, unknown> = {}) {
  return {
    filteredData: [],
    isLoading: false,
    selectedTimeRange: "all",
    kindFilter: "all",
    selectedAuthor: null,
    selectedMusician: null,
    activeToggleSet: new Set(),
    hasActiveFilters: false,
    searchText: "",
    setSearchText: vi.fn(),
    updateFilter: vi.fn(),
    toggleFilter: vi.fn(),
    clearFilters: vi.fn(),
    ...overrides,
  };
}

function renderTable(props: Record<string, unknown> = {}) {
  return render(
    <MemoryRouter>
      <FilteredSongPerformanceTable performances={[]} {...props} />
    </MemoryRouter>,
  );
}

describe("FilteredSongPerformanceTable", () => {
  // The initial list comes from the page's own loader via the `performances`
  // prop; the component never reaches into route loader data itself (so it can
  // be embedded on pages whose loader shape is unrelated).
  test("seeds the filter hook with the performances prop and presetFilters", () => {
    usePerformancePageFilters.mockReturnValue(hookReturn());
    const performances = [{ trackId: "t-1" }];

    renderTable({ performances, presetFilters: { filters: "allTimer" } });

    expect(usePerformancePageFilters).toHaveBeenCalledWith(
      expect.objectContaining({
        initialData: performances,
        apiUrl: "/api/songs/performances",
        extraParams: { filters: "allTimer" },
      }),
    );
  });

  // presetFilters drive which controls are hidden (via controlsHiddenByPreset):
  // allTimer hides the All-Timer + Jam Chart chips, musician hides the Musician
  // + Type controls.
  test("presetFilters hide the derived filter controls", () => {
    usePerformancePageFilters.mockReturnValue(hookReturn());

    renderTable({ presetFilters: { filters: "allTimer", musician: "m-1" } });

    const controls = screen.getByTestId("PerformanceFilterControls");
    expect(controls.textContent).toContain('"showAllTimerToggle":false');
    expect(controls.textContent).toContain('"showJamChartToggle":false');
    // Hidden select controls are omitted (undefined → absent from JSON).
    expect(controls.textContent).not.toContain('"selectedMusician"');
    expect(controls.textContent).not.toContain('"kindFilter"');
  });

  // Default (no hiddenFilters): every toggle stays visible.
  test("shows both noteworthy toggles by default", () => {
    usePerformancePageFilters.mockReturnValue(hookReturn());

    renderTable();

    const controls = screen.getByTestId("PerformanceFilterControls");
    expect(controls.textContent).toContain('"showAllTimerToggle":true');
    expect(controls.textContent).toContain('"showJamChartToggle":true');
  });

  // requiresFilter explorer mode: with no active filter, render the prompt (and
  // the controls, so the user can add one) instead of the performance table.
  test("requiresFilter renders the empty prompt and no table when no filter is active", () => {
    usePerformancePageFilters.mockReturnValue(hookReturn({ hasActiveFilters: false }));

    renderTable({
      requiresFilter: true,
      emptyPrompt: <div data-testid="too-many">Add a filter to narrow it down</div>,
    });

    expect(screen.getByTestId("too-many")).toBeInTheDocument();
    expect(screen.queryByTestId("PerformanceTable")).not.toBeInTheDocument();
    // Controls still render so a filter can be applied.
    expect(screen.getByTestId("PerformanceFilterControls")).toBeInTheDocument();
  });

  // requiresFilter with an active filter → the table renders normally.
  test("requiresFilter renders the table once a filter is active", () => {
    usePerformancePageFilters.mockReturnValue(hookReturn({ hasActiveFilters: true }));

    renderTable({ requiresFilter: true, emptyPrompt: <div data-testid="too-many">Add a filter</div> });

    expect(screen.getByTestId("PerformanceTable")).toBeInTheDocument();
    expect(screen.queryByTestId("too-many")).not.toBeInTheDocument();
  });
});
