import { mockShallowComponent } from "@test/test-utils";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test, vi } from "vitest";

// Mock server-side modules
vi.mock("~/server/services", () => ({ services: {} }));
vi.mock("~/lib/base-loaders", () => ({ publicLoader: vi.fn() }));
vi.mock("@bip/domain", () => ({}));

// Mock hooks
vi.mock("~/hooks/use-serialized-loader-data", () => ({
  useSerializedLoaderData: vi.fn(() => ({ performances: [] })),
}));
vi.mock("~/hooks/use-performance-page-filters", () => ({
  usePerformancePageFilters: vi.fn(() => ({
    filteredData: [],
    isLoading: false,
    selectedYear: "all",
    selectedEra: "all",
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
  // The "All-Timers" header with flame icon is now handled by the layout tab bar,
  // so the page should not render its own heading.
  test("does not render its own All-Timers heading", () => {
    renderAllTimers();

    expect(screen.queryByRole("heading", { name: /all-timers/i })).not.toBeInTheDocument();
  });

  // The "Back to songs" link is replaced by the layout tab bar navigation.
  test("does not render a Back to songs link", () => {
    renderAllTimers();

    expect(screen.queryByRole("link", { name: /back to songs/i })).not.toBeInTheDocument();
  });

  // The PerformanceTable should still render as the main content.
  test("renders the PerformanceTable with showSongColumn", () => {
    renderAllTimers();

    const table = screen.getByTestId("PerformanceTable");
    expect(table).toBeInTheDocument();
    expect(table.textContent).toContain('"showSongColumn":true');
  });
});
