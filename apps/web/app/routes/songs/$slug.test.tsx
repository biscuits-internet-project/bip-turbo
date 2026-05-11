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
    showsByYear: {},
  })),
}));

// Return filtered data that excludes the all-timer performance, simulating
// a time range filter that narrows results. The All-Timers tab should still
// be visible since the unfiltered data has an all-timer.
vi.mock("~/hooks/use-performance-page-filters", () => ({
  usePerformancePageFilters: vi.fn(() => ({
    filteredData: [{ trackId: "t2", allTimer: false, show: { date: "2024-02-01" }, venue: {} }],
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

import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
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

    const graphsTab = screen.getByRole("tab", { name: /graphs/i });
    await user.click(graphsTab);

    expect(mockClearFilters).toHaveBeenCalled();
  });

  // The 4 stat cards (Times Played, First Played, Last Played, Most
  // Common Year) render as a 2x2 grid on mobile and 4x1 at lg+ so phone
  // users only scroll past two rows of cards instead of four.
  test("stat grid is 2 columns on mobile, 4 columns on lg", () => {
    renderSongPage();

    const timesPlayedLabel = screen.getByText(/Times Played/);
    const grid = timesPlayedLabel.closest("dl");
    expect(grid?.className).toContain("grid-cols-2");
    expect(grid?.className).toContain("lg:grid-cols-4");
    // No single-column stacking on mobile — each row pairs two cards.
    expect(grid?.className).not.toContain("grid-cols-1");
  });

  // The First/Last Played stat cards include a venue sublabel (sublabel2).
  // On mobile that wrapped venue line makes the cards taller than the
  // viewport allows for the 2x2 grid; we hide it via `hidden sm:block`
  // so phone users see just the date + label.
  test("StatBox sublabel2 (venue) is hidden on mobile (hidden sm:block)", () => {
    vi.mocked(useSerializedLoaderData).mockReturnValueOnce({
      song: {
        title: "I-Man",
        slug: "i-man",
        timesPlayed: 100,
        dateFirstPlayed: "1997-04-19",
        dateLastPlayed: null,
        actualLastPlayedDate: null,
        firstShowSlug: "1997-04-19-frat-party",
        lastShowSlug: null,
        firstVenue: { name: "University of Pennsylvania", city: "Philadelphia", state: "PA" },
        lastVenue: null,
        showsSinceLastPlayed: null,
        history: null,
        lyrics: null,
        tabs: null,
        guitarTabsUrl: null,
        notes: null,
        yearlyPlayData: {},
      },
      performances: [],
      showsByYear: {},
    });
    renderSongPage();

    const venueLine = screen.getByText(/University of Pennsylvania, Philadelphia, PA/);
    expect(venueLine.className).toContain("hidden");
    expect(venueLine.className).toContain("sm:block");
  });

  // The TabsList on song-detail clips at narrow widths because there can be
  // up to 6 tabs (All Performances, All-Timers, Stats, History, Lyrics,
  // Guitar Tabs). Mobile gets a single <select> dropdown instead while sm+
  // continues to use the horizontal tab strip.
  test("song tabs render as a select on mobile (sm:hidden) and tab strip on sm+", () => {
    renderSongPage();

    const tabList = screen.getByRole("tablist");
    expect(tabList.className).toContain("hidden");
    expect(tabList.className).toContain("sm:flex");

    const select = screen.getByLabelText(/song view/i);
    const wrapper = select.closest("div");
    expect(wrapper?.className).toContain("sm:hidden");
  });

  // The "last show" sublabel marks the song as having been played at the
  // most recent show. The backend computes `showsSinceLastPlayed` as a
  // strict count of shows AFTER the song's last performance, so 0 = "this
  // was the last show" and any positive value means there have been more
  // shows since.
  test("Last Played sublabel reads 'last show' only when showsSinceLastPlayed is 0", () => {
    vi.mocked(useSerializedLoaderData).mockReturnValueOnce({
      song: {
        title: "Shelby Rose",
        slug: "shelby-rose",
        timesPlayed: 50,
        dateFirstPlayed: "2010-01-01",
        dateLastPlayed: "2026-04-25",
        actualLastPlayedDate: "2026-04-25",
        firstShowSlug: "2010-01-01-show",
        lastShowSlug: "2026-04-25-show",
        firstVenue: null,
        lastVenue: null,
        showsSinceLastPlayed: 0,
        history: null,
        lyrics: null,
        tabs: null,
        guitarTabsUrl: null,
        notes: null,
        yearlyPlayData: {},
      },
      performances: [],
      showsByYear: {},
    });
    renderSongPage();
    expect(screen.getByText(/last show/i)).toBeInTheDocument();
  });

  // When at least one show has happened since the song's last performance,
  // the sublabel should report the count rather than claim "last show".
  // Singular form for exactly one show after.
  test("Last Played sublabel reads '1 show ago' when showsSinceLastPlayed is 1", () => {
    vi.mocked(useSerializedLoaderData).mockReturnValueOnce({
      song: {
        title: "Shelby Rose",
        slug: "shelby-rose",
        timesPlayed: 50,
        dateFirstPlayed: "2010-01-01",
        dateLastPlayed: "2026-04-24",
        actualLastPlayedDate: "2026-04-24",
        firstShowSlug: "2010-01-01-show",
        lastShowSlug: "2026-04-24-show",
        firstVenue: null,
        lastVenue: null,
        showsSinceLastPlayed: 1,
        history: null,
        lyrics: null,
        tabs: null,
        guitarTabsUrl: null,
        notes: null,
        yearlyPlayData: {},
      },
      performances: [],
      showsByYear: {},
    });
    renderSongPage();
    expect(screen.getByText(/1 show ago/)).toBeInTheDocument();
    expect(screen.queryByText(/last show/i)).not.toBeInTheDocument();
    // Avoid the "1 shows ago" plural-on-one bug.
    expect(screen.queryByText(/1 shows ago/)).not.toBeInTheDocument();
  });

  // Plural form for >1 shows after the song's last performance.
  test("Last Played sublabel reads 'N shows ago' when showsSinceLastPlayed is greater than 1", () => {
    vi.mocked(useSerializedLoaderData).mockReturnValueOnce({
      song: {
        title: "Shelby Rose",
        slug: "shelby-rose",
        timesPlayed: 50,
        dateFirstPlayed: "2010-01-01",
        dateLastPlayed: "2024-01-01",
        actualLastPlayedDate: "2024-01-01",
        firstShowSlug: "2010-01-01-show",
        lastShowSlug: "2024-01-01-show",
        firstVenue: null,
        lastVenue: null,
        showsSinceLastPlayed: 4,
        history: null,
        lyrics: null,
        tabs: null,
        guitarTabsUrl: null,
        notes: null,
        yearlyPlayData: {},
      },
      performances: [],
      showsByYear: {},
    });
    renderSongPage();
    expect(screen.getByText(/4 shows ago/)).toBeInTheDocument();
    expect(screen.queryByText(/last show/i)).not.toBeInTheDocument();
  });

  // The play-frequency stat card surfaces `averageShowsPerPlay` (shows
  // since debut / timesPlayed). Labeled "Average Gap" to share terminology
  // with the same-named column on /songs. Value is the bare number —
  // the surrounding label carries the unit.
  test("Average Gap StatBox renders label 'Average Gap' and the bare numeric value", () => {
    vi.mocked(useSerializedLoaderData).mockReturnValueOnce({
      song: {
        title: "Basis for a Day",
        slug: "basis-for-a-day",
        timesPlayed: 200,
        dateFirstPlayed: "1995-06-01",
        dateLastPlayed: "2024-01-01",
        averageShowsPerPlay: 5.7,
        showsSinceLastPlayed: 12,
        history: null,
        lyrics: null,
        tabs: null,
        guitarTabsUrl: null,
        notes: null,
        yearlyPlayData: {},
      },
      performances: [],
      showsByYear: {},
    });
    renderSongPage();

    expect(screen.getByText("Average Gap")).toBeInTheDocument();
    expect(screen.getByText("5.7")).toBeInTheDocument();
    // The previous label and the trailing "shows" suffix are gone.
    expect(screen.queryByText(/Song Performed Every/)).not.toBeInTheDocument();
    expect(screen.queryByText(/^shows$/)).not.toBeInTheDocument();
  });

  // Null `averageShowsPerPlay` (never-played or no-debut songs) renders
  // the standard em-dash placeholder, mirroring the other stat cards.
  test("Average Gap StatBox renders em-dash when averageShowsPerPlay is null", () => {
    vi.mocked(useSerializedLoaderData).mockReturnValueOnce({
      song: {
        title: "Munchkin Invasion",
        slug: "munchkin-invasion",
        timesPlayed: 0,
        dateFirstPlayed: null,
        dateLastPlayed: null,
        averageShowsPerPlay: null,
        showsSinceLastPlayed: null,
        history: null,
        lyrics: null,
        tabs: null,
        guitarTabsUrl: null,
        notes: null,
        yearlyPlayData: {},
      },
      performances: [],
      showsByYear: {},
    });
    renderSongPage();

    expect(screen.getByText("Average Gap")).toBeInTheDocument();
    // The Average Gap card should have an em-dash; other null cards may too.
    expect(screen.getAllByText("—").length).toBeGreaterThanOrEqual(1);
  });

  // StatBox uses light padding (sm:p-3) so the eight-card grid reads as a
  // compact info strip. Headline number shrinks on mobile so the value
  // fits on one line within the narrower box.
  test("StatBox uses light padding and scales headline with viewport", () => {
    renderSongPage();

    const timesPlayedLabel = screen.getByText(/Times Played/);
    const card = timesPlayedLabel.closest("div[class*='glass-content']");
    expect(card?.className).toContain("p-2");
    expect(card?.className).toContain("sm:p-3");
    expect(card?.className).not.toContain("sm:p-6");

    const value = screen.getByText("100");
    expect(value.className).toContain("text-xl");
    expect(value.className).toContain("sm:text-3xl");
  });
});
