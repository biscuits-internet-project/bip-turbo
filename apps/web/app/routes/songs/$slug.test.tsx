import { mockShallowComponent } from "@test/test-utils";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";

// Mock server-side modules
vi.mock("~/server/services", () => ({ services: {} }));
vi.mock("~/lib/base-loaders", () => ({ publicLoader: vi.fn() }));
vi.mock("~/lib/seo", () => ({ getSongMeta: vi.fn(() => []), getSongStructuredData: vi.fn(() => "{}") }));

// Mock hooks
const mockClearFilters = vi.fn();
vi.mock("~/hooks/use-serialized-loader-data", () => ({
  useSerializedLoaderData: vi.fn(() => ({
    song: {
      title: "Basis for a Day",
      slug: "basis-for-a-day",
      timesPlayed: 100,
      dateFirstPlayed: null,
      dateLastPlayed: null,
      history: null,
      lyrics: null,
      tabs: null,
      guitarTabsUrl: null,
      notes: null,
      yearlyPlayData: {},
    },
    performances: [
      { trackId: "t1", allTimer: true, show: { date: "2024-01-01" }, venue: {} },
      { trackId: "t2", allTimer: false, show: { date: "2024-02-01" }, venue: {} },
    ],
  })),
}));

// Return filtered data that excludes the all-timer performance, simulating
// a time range filter that narrows results. The All-Timers tab should still
// be visible since the unfiltered data has an all-timer.
vi.mock("~/hooks/use-performance-page-filters", () => ({
  usePerformancePageFilters: vi.fn(() => ({
    filteredData: [
      { trackId: "t2", allTimer: false, show: { date: "2024-02-01" }, venue: {} },
    ],
    isLoading: false,
    selectedYear: "2024",
    selectedEra: "all",
    activeToggleSet: new Set(),
    hasActiveFilters: true,
    searchText: "",
    setSearchText: vi.fn(),
    updateFilter: vi.fn(),
    toggleFilter: vi.fn(),
    clearFilters: mockClearFilters,
  })),
  searchPerformance: vi.fn(),
}));

// Stub heavy child components
vi.mock("~/components/performance", () => ({
  PerformanceTable: (props: object) => mockShallowComponent("PerformanceTable", props),
}));
vi.mock("~/components/performance/performance-filter-controls", () => ({
  PerformanceFilterControls: (props: object) => mockShallowComponent("PerformanceFilterControls", props),
}));
vi.mock("~/components/rating", () => ({
  RatingComponent: () => <div data-testid="RatingComponent" />,
}));
vi.mock("~/components/admin/admin-only", () => ({
  AdminOnly: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock("recharts", () => ({
  CartesianGrid: () => null,
  Line: () => null,
  LineChart: () => null,
  ResponsiveContainer: () => null,
  Tooltip: () => null,
  XAxis: () => null,
  YAxis: () => null,
}));

import SongPage from "./$slug";

function renderSongPage() {
  return render(
    <MemoryRouter initialEntries={["/songs/basis-for-a-day"]}>
      <SongPage />
    </MemoryRouter>,
  );
}

describe("SongPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // The All-Timers tab visibility should be based on the unfiltered data,
  // not the filtered data. Filters can exclude all-timer performances,
  // but the tab should remain visible.
  test("shows All-Timers tab even when filters exclude all-timer performances", () => {
    renderSongPage();

    expect(screen.getByRole("tab", { name: /all-timers/i })).toBeInTheDocument();
  });

  // Switching tabs should reset filters so the user starts fresh on each tab.
  test("clears filters when switching tabs", async () => {
    const user = userEvent.setup();
    renderSongPage();

    const statsTab = screen.getByRole("tab", { name: /stats/i });
    await user.click(statsTab);

    expect(mockClearFilters).toHaveBeenCalled();
  });
});
