import { mockShallowComponent } from "@test/test-utils";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test, vi } from "vitest";

const usePerformancePageFiltersMock = vi.fn();

vi.mock("~/hooks/use-performance-page-filters", () => ({
  usePerformancePageFilters: (...args: unknown[]) => usePerformancePageFiltersMock(...args),
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

import { FilteredSongsTable } from "./filtered-songs-table";

interface HookReturnOverrides {
  selectedTimeRange?: string;
  coverFilter?: "all" | "cover" | "original";
  selectedAuthor?: string | null;
  activeToggleSet?: Set<string>;
  playedFilter?: string;
  hasFilters?: boolean;
}

function setHookReturn(overrides: HookReturnOverrides = {}) {
  const selectedTimeRange = overrides.selectedTimeRange ?? "all";
  const coverFilter = overrides.coverFilter ?? "all";
  const selectedAuthor = overrides.selectedAuthor ?? null;
  const activeToggleSet = overrides.activeToggleSet ?? new Set<string>();
  const hasFilters =
    overrides.hasFilters ??
    (selectedTimeRange !== "all" || coverFilter !== "all" || selectedAuthor !== null || activeToggleSet.size > 0);
  usePerformancePageFiltersMock.mockReturnValue({
    filteredData: [],
    isLoading: false,
    selectedTimeRange,
    coverFilter,
    selectedAuthor,
    playedFilter: overrides.playedFilter ?? "all",
    activeToggleSet,
    hasFilters,
    hasActiveFilters: hasFilters,
    searchText: "",
    setSearchText: vi.fn(),
    updateFilter: vi.fn(),
    toggleFilter: vi.fn(),
    clearFilters: vi.fn(),
  });
}

function renderComponent(props: { extraParams?: Record<string, string>; hideTimeRange?: boolean } = {}) {
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
    setHookReturn();
    renderComponent();

    expect(screen.getByTestId("SongsTable")).toBeInTheDocument();
  });

  // extraParams should be forwarded to the hook so pre-baked tabs can
  // set a fixed time range for API requests.
  test("passes extraParams to usePerformancePageFilters", () => {
    setHookReturn();
    renderComponent({ extraParams: { timeRange: "last10shows" } });

    expect(usePerformancePageFiltersMock).toHaveBeenCalledWith(
      expect.objectContaining({ extraParams: { timeRange: "last10shows" } }),
    );
  });

  // /songs and its tabs fetch through the loader (via fetchFilteredSongs),
  // so the hook's client fetch would be a duplicate request. Pins that
  // FilteredSongsTable opts out of the hook's internal fetch path.
  test("passes skipClientFetch: true to usePerformancePageFilters", () => {
    setHookReturn();
    renderComponent();

    expect(usePerformancePageFiltersMock).toHaveBeenCalledWith(expect.objectContaining({ skipClientFetch: true }));
  });

  // When hideTimeRange is true, the PerformanceFilterControls should receive
  // it so the Time Range dropdown is suppressed.
  test("passes hideTimeRange to PerformanceFilterControls", () => {
    setHookReturn();
    renderComponent({ hideTimeRange: true });

    const controls = screen.getByTestId("PerformanceFilterControls");
    expect(controls.textContent).toContain('"hideTimeRange":true');
  });

  // When hideTimeRange is not set, it defaults to undefined (falsy),
  // so the Time Range dropdown renders normally.
  test("does not pass hideTimeRange when not set", () => {
    setHookReturn();
    renderComponent();

    const controls = screen.getByTestId("PerformanceFilterControls");
    expect(controls.textContent).not.toContain('"hideTimeRange":true');
  });

  // When no filter scope is active (no URL filters and no extraParams),
  // the Filtered Plays column is unnecessary — every row's filtered count
  // would equal its all-time count. Hide the column to keep the table clean.
  test("showFilteredPlays=false when no URL filters and no extraParams", () => {
    setHookReturn();
    renderComponent();

    const table = screen.getByTestId("SongsTable");
    expect(table.textContent).toContain('"showFilteredPlays":false');
  });

  // A time-range filter narrows which plays count, so the filtered count
  // meaningfully differs from the all-time count — column should show.
  test("showFilteredPlays=true when a time range is selected", () => {
    setHookReturn({ selectedTimeRange: "1999" });
    renderComponent();

    const table = screen.getByTestId("SongsTable");
    expect(table.textContent).toContain('"showFilteredPlays":true');
  });

  // Toggle filters (Set Opener, Encore, Attended, etc.) restrict which
  // performances count — the filtered count is real information.
  test("showFilteredPlays=true when a toggle filter is active", () => {
    setHookReturn({ activeToggleSet: new Set(["encore"]) });
    renderComponent();

    const table = screen.getByTestId("SongsTable");
    expect(table.textContent).toContain('"showFilteredPlays":true');
  });

  // Cover and author aren't "narrowing" filters — they pick which songs
  // appear but every matching song still shows its full play history, so
  // filteredTimesPlayed would just equal timesPlayed. Hide to avoid a
  // duplicate column. Same rule the "not played" filter control uses.
  test("showFilteredPlays=false when only cover filter is active", () => {
    setHookReturn({ coverFilter: "cover" });
    renderComponent();

    const table = screen.getByTestId("SongsTable");
    expect(table.textContent).toContain('"showFilteredPlays":false');
  });

  // Same reasoning as cover: picking an author filters the song list but
  // doesn't change each song's play count, so the filtered column adds
  // nothing.
  test("showFilteredPlays=false when only author filter is active", () => {
    setHookReturn({ selectedAuthor: "00000000-0000-0000-0000-000000000000" });
    renderComponent();

    const table = screen.getByTestId("SongsTable");
    expect(table.textContent).toContain('"showFilteredPlays":false');
  });

  // Cover + author combined are still non-narrowing — same rule applies.
  test("showFilteredPlays=false when only cover+author are active", () => {
    setHookReturn({ coverFilter: "original", selectedAuthor: "00000000-0000-0000-0000-000000000000" });
    renderComponent();

    const table = screen.getByTestId("SongsTable");
    expect(table.textContent).toContain('"showFilteredPlays":false');
  });

  // Cover alongside a narrowing filter: the narrowing one decides. Cover
  // doesn't erase the need for the column when a time range is also set.
  test("showFilteredPlays=true when cover and a time range are both active", () => {
    setHookReturn({ coverFilter: "cover", selectedTimeRange: "1999" });
    renderComponent();

    const table = screen.getByTestId("SongsTable");
    expect(table.textContent).toContain('"showFilteredPlays":true');
  });

  // On /songs/this-year and /songs/recent the date range is baked into the
  // route via extraParams (the URL has no filter params). The Filtered Plays
  // column should still appear because the tab itself IS the filter scope.
  test("showFilteredPlays=true when extraParams is set even without URL filters", () => {
    setHookReturn();
    renderComponent({ extraParams: { timeRange: "thisYear" } });

    const table = screen.getByTestId("SongsTable");
    expect(table.textContent).toContain('"showFilteredPlays":true');
  });

  // "Not Played" returns songs NOT played within the filter, so the
  // filtered count would be 0 for every row — a useless column. Hide it
  // regardless of other active filters.
  test("showFilteredPlays=false when playedFilter is 'notPlayed'", () => {
    setHookReturn({ selectedTimeRange: "1999", playedFilter: "notPlayed" });
    renderComponent({ extraParams: { timeRange: "thisYear" } });

    const table = screen.getByTestId("SongsTable");
    expect(table.textContent).toContain('"showFilteredPlays":false');
  });
});
