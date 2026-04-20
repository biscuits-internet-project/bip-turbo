import { setup } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { PerformanceFilterControls } from "./performance-filter-controls";

const defaultProps = {
  selectedTimeRange: "all",
  activeToggleSet: new Set<string>(),
  updateFilter: vi.fn(),
  toggleFilter: vi.fn(),
  clearFilters: vi.fn(),
};

describe("PerformanceFilterControls", () => {
  // The search input is opt-in — it only renders when the parent provides
  // searchValue + onSearchChange. Pages that don't need search omit these props.
  test("renders search input when searchValue is provided", async () => {
    await setup(<PerformanceFilterControls {...defaultProps} searchValue="" onSearchChange={() => {}} />);

    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  test("does not render search input when searchValue is not provided", async () => {
    await setup(<PerformanceFilterControls {...defaultProps} />);

    expect(screen.queryByPlaceholderText("Search...")).not.toBeInTheDocument();
  });

  // The search input is controlled — the parent owns the value and receives
  // change events via onSearchChange. This lets the parent pre-filter data
  // before passing it to the table.
  test("typing in search input calls onSearchChange", async () => {
    const handleSearchChange = vi.fn();
    const { user } = await setup(
      <PerformanceFilterControls {...defaultProps} searchValue="" onSearchChange={handleSearchChange} />,
    );

    await user.type(screen.getByPlaceholderText("Search..."), "hello");
    expect(handleSearchChange).toHaveBeenCalled();
  });

  // Clear All appears in the select filter row (top row) when any filter is
  // active — search text, select dropdowns, or toggle chips. It's a single
  // entry point to reset everything.
  test("renders Clear All button when hasActiveFilters is true", async () => {
    await setup(<PerformanceFilterControls {...defaultProps} hasActiveFilters />);

    expect(screen.getByRole("button", { name: "Clear All" })).toBeInTheDocument();
  });

  test("does not render Clear All button when hasActiveFilters is false", async () => {
    await setup(<PerformanceFilterControls {...defaultProps} hasActiveFilters={false} />);

    expect(screen.queryByRole("button", { name: "Clear All" })).not.toBeInTheDocument();
  });

  // The Time Range dropdown renders with grouped options (Recent, Eras, Years).
  test("renders a single Time Range dropdown", async () => {
    await setup(<PerformanceFilterControls {...defaultProps} />);

    expect(screen.getByText("Time Range")).toBeInTheDocument();
    expect(screen.queryByText("Year")).not.toBeInTheDocument();
    expect(screen.queryByText("Era")).not.toBeInTheDocument();
  });

  // The hideTimeRange prop suppresses the dropdown for pre-baked tab pages
  // (e.g., /songs/recent) where the time range is already set by the route.
  test("does not render Time Range dropdown when hideTimeRange is true", async () => {
    await setup(<PerformanceFilterControls {...defaultProps} hideTimeRange />);

    expect(screen.queryByText("Time Range")).not.toBeInTheDocument();
  });

  // The "Played" dropdown is opt-in via playedFilter prop, but the component
  // only shows it when a qualifying filter is active (time range, toggles, or
  // search). Author and cover alone don't qualify — "not played" only makes
  // sense when narrowing to a subset of performances.
  test("hides played filter when no qualifying filters are active", async () => {
    await setup(<PerformanceFilterControls {...defaultProps} playedFilter="all" />);

    expect(screen.queryByText("Played")).not.toBeInTheDocument();
  });

  test("shows played filter when time range is selected", async () => {
    await setup(<PerformanceFilterControls {...defaultProps} playedFilter="all" selectedTimeRange="2024" />);

    expect(screen.getByText("Played")).toBeInTheDocument();
  });

  test("shows played filter when any toggle is active", async () => {
    await setup(<PerformanceFilterControls {...defaultProps} playedFilter="all" activeToggleSet={new Set(["jam"])} />);

    expect(screen.getByText("Played")).toBeInTheDocument();
  });

  test("shows played filter when search has text", async () => {
    await setup(
      <PerformanceFilterControls
        {...defaultProps}
        playedFilter="all"
        searchValue="Confrontation"
        onSearchChange={() => {}}
      />,
    );

    expect(screen.getByText("Played")).toBeInTheDocument();
  });

  test("hides played filter when only cover filter is set", async () => {
    await setup(<PerformanceFilterControls {...defaultProps} playedFilter="all" coverFilter="cover" />);

    expect(screen.queryByText("Played")).not.toBeInTheDocument();
  });

  test("hides played filter when only author is set", async () => {
    await setup(<PerformanceFilterControls {...defaultProps} playedFilter="all" selectedAuthor="marc brownstein" />);

    expect(screen.queryByText("Played")).not.toBeInTheDocument();
  });

  // When the played filter becomes hidden (qualifying filters removed), the
  // component resets played to null so stale "notPlayed" state doesn't linger
  // in the URL and silently affect the next API request.
  test("resets played filter when it becomes hidden", async () => {
    const handleUpdateFilter = vi.fn();
    const { rerender } = await setup(
      <PerformanceFilterControls
        {...defaultProps}
        updateFilter={handleUpdateFilter}
        playedFilter="notPlayed"
        activeToggleSet={new Set(["jam"])}
      />,
    );

    handleUpdateFilter.mockClear();

    rerender(
      <PerformanceFilterControls
        {...defaultProps}
        updateFilter={handleUpdateFilter}
        playedFilter="notPlayed"
        activeToggleSet={new Set()}
      />,
    );

    expect(handleUpdateFilter).toHaveBeenCalledWith({ played: null });
  });

  // When the played filter is already "all" (default), no reset is needed —
  // the value is harmless and firing updateFilter would cause unnecessary
  // re-renders.
  test("does not reset played filter when value is already all", async () => {
    const handleUpdateFilter = vi.fn();
    const { rerender } = await setup(
      <PerformanceFilterControls
        {...defaultProps}
        updateFilter={handleUpdateFilter}
        playedFilter="all"
        activeToggleSet={new Set(["jam"])}
      />,
    );

    handleUpdateFilter.mockClear();

    rerender(
      <PerformanceFilterControls
        {...defaultProps}
        updateFilter={handleUpdateFilter}
        playedFilter="all"
        activeToggleSet={new Set()}
      />,
    );

    expect(handleUpdateFilter).not.toHaveBeenCalled();
  });

  // Clicking Clear All delegates to the parent's clearFilters callback, which
  // resets all URL params and search text in the hook.
  test("clicking Clear All calls clearFilters", async () => {
    const handleClearFilters = vi.fn();
    const { user } = await setup(
      <PerformanceFilterControls {...defaultProps} clearFilters={handleClearFilters} hasActiveFilters />,
    );

    await user.click(screen.getByRole("button", { name: "Clear All" }));
    expect(handleClearFilters).toHaveBeenCalledTimes(1);
  });
});
