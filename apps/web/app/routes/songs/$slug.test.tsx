import { mockShallowComponent } from "@test/test-utils";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";

// Mock `useNavigate` + `useParams` to drive the URL-syncing tab logic
// without needing a Routes definition. Other react-router exports
// (MemoryRouter, Link, etc.) keep their real implementations.
const mockNavigate = vi.fn();
const mockParams: { slug?: string; tab?: string } = { slug: "basis-for-a-day" };
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockParams,
  };
});

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
      authors: [],
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
vi.mock("~/hooks/use-track-user-ratings", () => ({
  useTrackUserRatings: () => ({
    userRatingMap: new Map(),
    averageRatingMap: new Map(),
    displayRatingMap: new Map(),
    comparisonMap: new Map(),
    isLoading: false,
  }),
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
    // Reset URL params to the default (no :tab) between tests so each
    // test starts on the "All Performances" tab.
    mockParams.slug = "basis-for-a-day";
    mockParams.tab = undefined;
  });

  // The :tab URL segment is the source of truth for the active tab —
  // back/forward and shareable links should land on the right pane.
  test("activates the tab specified by the URL :tab segment", () => {
    mockParams.tab = "stats";
    renderSongPage();

    const statsTab = screen.getByRole("tab", { name: /graphs/i });
    expect(statsTab).toHaveAttribute("data-state", "active");
  });

  // A typo'd or unknown :tab segment falls back to "All Performances"
  // instead of rendering nothing — guards against broken inbound links.
  test("falls back to the All Performances tab when :tab is unknown", () => {
    mockParams.tab = "definitely-not-a-tab";
    renderSongPage();

    const performancesTab = screen.getByRole("tab", { name: /all performances/i });
    expect(performancesTab).toHaveAttribute("data-state", "active");
  });

  // Clicking a non-default tab navigates to the nested URL so the new
  // URL can be bookmarked / shared / used by the back button.
  test("clicking a tab navigates to /songs/:slug/:tab", async () => {
    const user = userEvent.setup();
    renderSongPage();

    await user.click(screen.getByRole("tab", { name: /graphs/i }));
    // preventScrollReset keeps the viewport in place when switching tabs.
    expect(mockNavigate).toHaveBeenCalledWith("/songs/basis-for-a-day/stats", { preventScrollReset: true });
  });

  // The default ("performances") tab navigates back to the bare song
  // URL so there's no redundant `/performances` suffix in the URL.
  test("clicking the All Performances tab navigates to bare /songs/:slug", async () => {
    mockParams.tab = "stats";
    const user = userEvent.setup();
    renderSongPage();

    await user.click(screen.getByRole("tab", { name: /all performances/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/songs/basis-for-a-day", { preventScrollReset: true });
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

  // The 4 stat cards (Times Played, First Played, Last Played, Most Common
  // Year) render together in one grouping list. Their responsive 2x2 → 4x1
  // column layout is a browser concern.
  test("renders the four stat cards in a grouping list", () => {
    renderSongPage();

    const grid = screen.getByText(/Times Played/).closest("dl");
    expect(grid).not.toBeNull();
    expect(screen.getByText(/Most Common Year/)).toBeInTheDocument();
  });

  // The First/Last Played stat cards include a venue sublabel (sublabel2).
  // It renders into the DOM; CSS hides it on mobile (a browser concern).
  test("StatBox renders the venue sublabel", () => {
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
        authors: [],
      },
      performances: [],
      showsByYear: {},
    });
    renderSongPage();

    expect(screen.getByText(/University of Pennsylvania, Philadelphia, PA/)).toBeInTheDocument();
  });

  // Song views run through the shared TabNav: a tab strip that collapses to a
  // dropdown when the tabs don't fit (there can be up to 7). jsdom reports zero
  // widths, so it renders the bar; the collapse-to-dropdown path is covered in
  // tab-nav.test.tsx. The control carries the "Song view" accessible name.
  test("song tabs render through a labelled TabNav strip", () => {
    renderSongPage();

    const tablist = screen.getByRole("tablist", { name: /song view/i });
    expect(tablist).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /all performances/i })).toBeInTheDocument();
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
        authors: [],
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
        authors: [],
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
        authors: [],
      },
      performances: [],
      showsByYear: {},
    });
    renderSongPage();
    expect(screen.getByText(/4 shows ago/)).toBeInTheDocument();
    expect(screen.queryByText(/last show/i)).not.toBeInTheDocument();
  });

  // The gap stat card surfaces both `averageGapShows` and `medianGapShows`
  // (mean and median of closed gaps from `tracks.gap`). One combined box
  // labeled "Avg / Median Gap" with the value rendered as "AVG / MEDIAN".
  test("Avg / Median Gap StatBox renders both values to one decimal", () => {
    vi.mocked(useSerializedLoaderData).mockReturnValueOnce({
      song: {
        title: "Basis for a Day",
        slug: "basis-for-a-day",
        timesPlayed: 200,
        dateFirstPlayed: "1995-06-01",
        dateLastPlayed: "2024-01-01",
        averageGapShows: 5.7,
        medianGapShows: 4,
        showsSinceLastPlayed: 12,
        history: null,
        lyrics: null,
        tabs: null,
        guitarTabsUrl: null,
        notes: null,
        yearlyPlayData: {},
        authors: [],
      },
      performances: [],
      showsByYear: {},
    });
    renderSongPage();

    expect(screen.getByText("Avg / Median Gap")).toBeInTheDocument();
    expect(screen.getByText("5.7 / 4.0")).toBeInTheDocument();
  });

  // Songs with no closed gaps (never played, or played only once — debuts
  // have no `tracks.gap`) get null for both avg and median. The box still
  // renders, with a single em-dash for the whole value rather than a
  // confusing "— / —" pair.
  test("Avg / Median Gap StatBox renders em-dash when both are null", () => {
    vi.mocked(useSerializedLoaderData).mockReturnValueOnce({
      song: {
        title: "Munchkin Invasion",
        slug: "munchkin-invasion",
        timesPlayed: 0,
        dateFirstPlayed: null,
        dateLastPlayed: null,
        averageGapShows: null,
        medianGapShows: null,
        showsSinceLastPlayed: null,
        history: null,
        lyrics: null,
        tabs: null,
        guitarTabsUrl: null,
        notes: null,
        yearlyPlayData: {},
        authors: [],
      },
      performances: [],
      showsByYear: {},
    });
    renderSongPage();

    expect(screen.getByText("Avg / Median Gap")).toBeInTheDocument();
    expect(screen.getAllByText("—").length).toBeGreaterThanOrEqual(1);
  });

  // The song's kind (original/cover/mashup/improvisation) is editable in the
  // admin form, so the public page must surface it for every value — not just
  // mashup — or an admin can set a kind and never see it reflected.
  function loaderDataWithKind(kind: string | null) {
    return {
      song: {
        title: "Basis for a Day",
        slug: "basis-for-a-day",
        timesPlayed: 100,
        dateFirstPlayed: null,
        dateLastPlayed: null,
        kind,
        history: null,
        lyrics: null,
        tabs: null,
        guitarTabsUrl: null,
        notes: null,
        yearlyPlayData: {},
        authors: [],
      },
      performances: [],
      showsByYear: {},
    };
  }

  test.each([
    "original",
    "cover",
    "mashup",
    "improvisation",
  ])("renders the '%s' kind label on the song page", (kind) => {
    vi.mocked(useSerializedLoaderData).mockReturnValueOnce(loaderDataWithKind(kind));
    renderSongPage();

    expect(screen.getByText(kind)).toBeInTheDocument();
  });

  // A song with no kind and no author must not render an empty subtitle row.
  test("renders no kind label when kind is null", () => {
    vi.mocked(useSerializedLoaderData).mockReturnValueOnce(loaderDataWithKind(null));
    renderSongPage();

    for (const kind of ["original", "cover", "mashup", "improvisation"]) {
      expect(screen.queryByText(kind)).not.toBeInTheDocument();
    }
  });
});
