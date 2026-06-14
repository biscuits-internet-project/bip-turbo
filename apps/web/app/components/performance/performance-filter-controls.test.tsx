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

  // On tab routes like /songs/this-year and /songs/recent, the time range is
  // baked into the route and the dropdown is hidden (hideTimeRange). The local
  // selectedTimeRange stays "all" because it isn't driven by URL params there,
  // so we treat hideTimeRange itself as an active time-range scope.
  test("shows played filter when hideTimeRange is true (fixed-scope tab routes)", async () => {
    await setup(<PerformanceFilterControls {...defaultProps} playedFilter="all" hideTimeRange />);

    expect(screen.getByText("Played")).toBeInTheDocument();
  });

  test("hides played filter when only kind filter is set", async () => {
    await setup(<PerformanceFilterControls {...defaultProps} playedFilter="all" kindFilter="cover" />);

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

  // The filter chrome is a "Search & Filters" collapsible toggle (chevron +
  // slide). It's force-open from sm+ (it only crowds phones) so desktop users
  // see filters by default; on phones it starts collapsed behind the toggle.
  test("renders a Search & Filters toggle that force-opens the body from sm+", async () => {
    await setup(<PerformanceFilterControls {...defaultProps} searchValue="" onSearchChange={() => {}} />);

    expect(screen.getByRole("button", { name: /^Search & Filters/ })).toBeInTheDocument();
    const body = screen.getByTestId("collapsible-section-body");
    expect(body.className).toContain("sm:grid-rows-[1fr]");
  });

  // On desktop the toggle itself is hidden (the filters render bare); the header
  // wrapper carries sm:hidden so only phones/landscape show the toggle.
  test("hides the toggle entirely at sm+ (filters render bare on desktop)", async () => {
    await setup(<PerformanceFilterControls {...defaultProps} searchValue="" onSearchChange={() => {}} />);

    const toggle = screen.getByRole("button", { name: /^Search & Filters/ });
    expect(toggle.parentElement?.className).toContain("sm:hidden");
  });

  // On phones the body starts collapsed (grid-rows-[0fr]) and opens to
  // grid-rows-[1fr] when the toggle is clicked.
  test("filter body is collapsed by default and opens when the toggle is clicked", async () => {
    const { user } = await setup(
      <PerformanceFilterControls {...defaultProps} searchValue="" onSearchChange={() => {}} />,
    );

    const body = screen.getByTestId("collapsible-section-body");
    expect(body.className).toContain("grid-rows-[0fr]");

    await user.click(screen.getByRole("button", { name: /^Search & Filters/ }));
    expect(body.className).toContain("grid-rows-[1fr]");
  });

  // Phone-landscape collapse: a rotated phone has the same vertical-space crunch
  // as portrait, so the body re-collapses on short viewports even above sm.
  test("re-collapses on landscape phones via short:!grid-rows-[0fr]", async () => {
    await setup(<PerformanceFilterControls {...defaultProps} searchValue="" onSearchChange={() => {}} />);

    const body = screen.getByTestId("collapsible-section-body");
    expect(body.className).toContain("short:!grid-rows-[0fr]");
  });

  // The Filters toggle shows an active-filter count so users know there's state
  // hidden behind it without expanding.
  test("Filters toggle shows count badge when filters are active", async () => {
    await setup(
      <PerformanceFilterControls
        {...defaultProps}
        searchValue=""
        onSearchChange={() => {}}
        hasActiveFilters
        activeToggleSet={new Set(["jam", "encore"])}
        selectedTimeRange="2024"
      />,
    );

    const toggle = screen.getByRole("button", { name: /^Search & Filters/ });
    // Badge is the count of active filters (timeRange + 2 toggles = 3).
    expect(toggle.textContent).toMatch(/3/);
  });

  // The Musician picker is opt-in via the selectedMusician prop (mirrors the
  // Author picker). Rendering the label confirms the control is wired in.
  test("renders the Musician picker when selectedMusician is provided", async () => {
    await setup(<PerformanceFilterControls {...defaultProps} selectedMusician={null} />);

    expect(screen.getByText("Musician")).toBeInTheDocument();
  });

  test("does not render the Musician picker when selectedMusician is omitted", async () => {
    await setup(<PerformanceFilterControls {...defaultProps} />);

    expect(screen.queryByText("Musician")).not.toBeInTheDocument();
  });

  // A selected musician counts toward the active-filter badge so the collapsed
  // mobile chrome reflects the hidden filter.
  test("Filters toggle counts a selected musician toward the active-filter badge", async () => {
    await setup(
      <PerformanceFilterControls
        {...defaultProps}
        searchValue=""
        onSearchChange={() => {}}
        hasActiveFilters
        selectedMusician="sam-altman"
      />,
    );

    const toggle = screen.getByRole("button", { name: /^Search & Filters/ });
    expect(toggle.textContent).toMatch(/1/);
  });

  // On dense pages (the musician profile) the filter chrome collapses on desktop
  // too: with collapsibleOnDesktop the body drops its sm force-open so it stays
  // collapsed at every width until the user opens it.
  test("collapsibleOnDesktop collapses the filters at all widths (no sm force-open)", async () => {
    await setup(
      <PerformanceFilterControls {...defaultProps} searchValue="" onSearchChange={() => {}} collapsibleOnDesktop />,
    );

    const body = screen.getByTestId("collapsible-section-body");
    expect(body.className).not.toContain("sm:grid-rows-[1fr]");
    expect(body.className).toContain("grid-rows-[0fr]");
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
