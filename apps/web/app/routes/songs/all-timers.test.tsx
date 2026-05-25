import { mockShallowComponent } from "@test/test-utils";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test, vi } from "vitest";

// Mock server-side modules
vi.mock("~/server/services", () => ({ services: {} }));
vi.mock("~/lib/base-loaders", () => ({ publicLoader: vi.fn() }));
vi.mock("@bip/domain", () => ({
  // Loader imports CacheKeys.songs.allTimers() at module top level.
  CacheKeys: { songs: { allTimers: () => "test-key" } },
}));
vi.mock("~/lib/noteworthy-performance-loader", () => ({
  createNoteworthyLoader: vi.fn(),
}));
vi.mock("~/lib/noteworthy-performance-page", () => ({
  NoteworthyPerformancePage: (props: object) => mockShallowComponent("NoteworthyPerformancePage", props),
}));

// Mock hooks
vi.mock("~/hooks/use-serialized-loader-data", () => ({
  useSerializedLoaderData: vi.fn(() => ({ performances: [] })),
}));
vi.mock("~/hooks/use-performance-page-filters", () => ({
  usePerformancePageFilters: vi.fn(() => ({
    filteredData: [],
    isLoading: false,
    selectedTimeRange: "all",
    coverFilter: "all",
    selectedAuthor: null,
    activeToggleSet: new Set(),
    hasActiveFilters: false,
    searchText: "",
    setSearchText: vi.fn(),
    updateFilter: vi.fn(),
    toggleFilter: vi.fn(),
    clearFilters: vi.fn(),
  })),
  searchPerformance: vi.fn(),
}));

// Stub child components
vi.mock("~/components/performance", () => ({
  PerformanceTable: (props: object) => mockShallowComponent("PerformanceTable", props),
}));
vi.mock("~/components/performance/performance-filter-controls", () => ({
  PerformanceFilterControls: (props: object) => mockShallowComponent("PerformanceFilterControls", props),
}));

import AllTimersPage from "./all-timers";

function renderAllTimers() {
  return render(
    <MemoryRouter initialEntries={["/songs/all-timers"]}>
      <AllTimersPage />
    </MemoryRouter>,
  );
}

describe("AllTimersPage", () => {
  // The layout tab bar handles the All-Timers heading,
  // so the page should not render its own.
  test("does not render its own All-Timers heading", () => {
    renderAllTimers();

    expect(screen.queryByRole("heading", { name: /all-timers/i })).not.toBeInTheDocument();
  });

  // Navigation between song pages is handled by the layout tab bar.
  test("does not render a Back to songs link", () => {
    renderAllTimers();

    expect(screen.queryByRole("link", { name: /back to songs/i })).not.toBeInTheDocument();
  });

  // The page delegates to NoteworthyPerformancePage with the
  // all-timers-specific endpoint and both noteworthy toggle chips
  // hidden (All-Timer because the whole page is all-timers, Jam Chart
  // for the same scope-redundancy reason).
  test("renders NoteworthyPerformancePage with the all-timers API url and both toggles hidden", () => {
    renderAllTimers();

    const page = screen.getByTestId("NoteworthyPerformancePage");
    expect(page).toBeInTheDocument();
    expect(page.textContent).toContain('"apiUrl":"/api/all-timers"');
    expect(page.textContent).toContain('"hideAllTimerToggle":true');
    expect(page.textContent).toContain('"hideJamChartToggle":true');
  });
});
