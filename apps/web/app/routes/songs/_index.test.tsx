import { mockShallowComponent } from "@test/test-utils";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test, vi } from "vitest";

// Mock server-side modules that can't run in jsdom
vi.mock("~/server/services", () => ({ services: {} }));
vi.mock("~/lib/base-loaders", () => ({ publicLoader: vi.fn() }));
vi.mock("~/lib/seo", () => ({ getSongsMeta: vi.fn() }));
vi.mock("~/lib/song-utilities", () => ({ addVenueInfoToSongs: vi.fn() }));
vi.mock("@bip/domain/cache-keys", () => ({ CacheKeys: { songs: { index: vi.fn() } } }));

// Mock the loader data hook to return minimal song data
vi.mock("~/hooks/use-serialized-loader-data", () => ({
  useSerializedLoaderData: vi.fn(() => ({
    songs: [],
    trendingSongs: [],
    yearlyTrendingSongs: [],
    recentShowsCount: 10,
  })),
}));

// Mock the filter hook to return default state
vi.mock("~/hooks/use-performance-page-filters", () => ({
  usePerformancePageFilters: vi.fn(() => ({
    filteredData: [],
    isLoading: false,
    selectedYear: "all",
    selectedEra: "all",
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

// Stub heavy child components
vi.mock("../../components/song/songs-table", () => ({
  SongsTable: (props: object) => mockShallowComponent("SongsTable", props),
}));
vi.mock("~/components/performance/performance-filter-controls", () => ({
  PerformanceFilterControls: (props: object) => mockShallowComponent("PerformanceFilterControls", props),
}));
vi.mock("~/components/admin/admin-only", () => ({
  AdminOnly: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import Songs from "./_index";

function renderSongsIndex() {
  return render(
    <MemoryRouter initialEntries={["/songs"]}>
      <Songs />
    </MemoryRouter>,
  );
}

describe("Songs index page", () => {
  // The heading is now in the layout, so the index page should not render its own.
  test("does not render its own SONGS heading", () => {
    renderSongsIndex();

    expect(screen.queryByText("SONGS")).not.toBeInTheDocument();
  });

  // The all-timers link is now a tab in the layout, so the index page should not
  // render a separate link to it.
  test("does not render an all-timers link", () => {
    renderSongsIndex();

    expect(screen.queryByRole("link", { name: /all-timers/i })).not.toBeInTheDocument();
  });

  // The admin "New Song" button is now in the layout, so the index page should
  // not render its own.
  test("does not render a New Song button", () => {
    renderSongsIndex();

    expect(screen.queryByRole("link", { name: /new song/i })).not.toBeInTheDocument();
  });

  // The SongsTable should still render as the main content of the tab.
  test("renders the SongsTable", () => {
    renderSongsIndex();

    expect(screen.getByTestId("SongsTable")).toBeInTheDocument();
  });
});
