import type { SongPagePerformance } from "@bip/domain";
import { mockShallowComponent, setupWithRouter } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

// Mock hooks used internally by PerformanceTable.
vi.mock("~/hooks/use-session", () => ({
  useSession: vi.fn(() => ({ user: null, supabase: null })),
}));
vi.mock("~/hooks/use-show-user-data", () => ({
  useShowUserData: vi.fn(() => ({
    attendanceMap: new Map(),
    userRatingMap: new Map(),
    averageRatingMap: new Map(),
    displayedRatingMap: new Map(),
    rankComparisonMap: new Map(),
    isLoading: false,
    error: null,
  })),
}));
vi.mock("~/hooks/use-track-user-ratings", () => ({
  useTrackUserRatings: vi.fn(() => ({ userRatingMap: new Map(), isLoading: false })),
}));

// Stub heavy child components rendered by the column factory.
vi.mock("./track-rating-cell", () => ({
  TrackRatingCell: (props: object) => mockShallowComponent("TrackRatingCell", props),
}));
vi.mock("./combined-notes", () => ({
  CombinedNotes: (props: object) => mockShallowComponent("CombinedNotes", props),
}));

import { useSession } from "~/hooks/use-session";
import { useShowUserData } from "~/hooks/use-show-user-data";
import { PerformanceTable } from "./performance-table";

function makePerformance(overrides: Partial<SongPagePerformance> = {}): SongPagePerformance {
  return {
    trackId: "track-1",
    show: { id: "show-1", slug: "2024-06-15-show-1", date: "2024-06-15", venueId: "venue-1", countForStats: true },
    venue: {
      id: "venue-1",
      slug: "the-cap",
      name: "The Capitol Theatre",
      city: "Port Chester",
      state: "NY",
      country: "USA",
    },
    songBefore: undefined,
    songAfter: undefined,
    rating: 4.5,
    ratingsCount: 12,
    notes: undefined,
    allTimer: false,
    segue: null,
    annotations: [],
    set: "S1",
    encoresInSet: 0,
    position: 3,
    tags: {
      setOpener: false,
      setCloser: false,
      encore: false,
      segueIn: false,
      segueOut: false,
      standalone: true,
      inverted: false,
      dyslexic: false,
    },
    ...overrides,
  };
}

describe("PerformanceTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Baseline rendering: the composed PerformanceTable renders rows with
  // Date, Venue, and a TrackRatingCell stub for each performance.
  test("renders a row per performance with date and rating cell", async () => {
    const performances = [
      makePerformance({
        trackId: "t1",
        show: { ...makePerformance().show, id: "s1", date: "2024-06-15" },
      }),
      makePerformance({
        trackId: "t2",
        show: { ...makePerformance().show, id: "s2", date: "2024-07-20" },
      }),
    ];
    await setupWithRouter(<PerformanceTable performances={performances} />);

    expect(screen.getAllByTestId("TrackRatingCell")).toHaveLength(2);
    // Dates render via ShowDate (M/D/YYYY at sm+, M/D/YY on mobile); both
    // spans are in the DOM regardless of viewport.
    expect(screen.getByText("6/15/2024")).toBeInTheDocument();
    expect(screen.getByText("7/20/2024")).toBeInTheDocument();
  });

  // The Song column is only needed on /songs/all-timers where performances
  // span multiple songs.
  test("renders Song column when showSongColumn is true, omits it otherwise", async () => {
    const performances = [makePerformance({ songTitle: "Cassidy", songSlug: "cassidy" })];

    const { unmount } = await setupWithRouter(<PerformanceTable performances={performances} showSongColumn />);
    expect(screen.getByRole("link", { name: "Cassidy" })).toBeInTheDocument();
    unmount();

    await setupWithRouter(<PerformanceTable performances={performances} />);
    expect(screen.queryByRole("link", { name: "Cassidy" })).not.toBeInTheDocument();
  });

  // Performances at count_for_stats=false shows (TV appearances, soundchecks,
  // radio sessions, cancelled stubs) get a muted/greyed row so users see
  // visually why this performance doesn't appear in stats.
  test("greys out rows where show.countForStats is false", async () => {
    const performances = [
      makePerformance({
        trackId: "t-stats",
        show: { ...makePerformance().show, id: "s-stats", countForStats: true },
      }),
      makePerformance({
        trackId: "t-not-stats",
        show: { ...makePerformance().show, id: "s-not-stats", countForStats: false },
      }),
    ];
    await setupWithRouter(<PerformanceTable performances={performances} />);

    const rows = screen.getAllByRole("row");
    const greyedRow = rows.find((row) => row.getAttribute("data-counts-for-stats") === "false");
    expect(greyedRow).toBeDefined();
    const bodyRows = rows.filter((row) => row.querySelector("td"));
    const otherRows = bodyRows.filter((row) => row !== greyedRow);
    for (const row of otherRows) {
      expect(row.getAttribute("data-counts-for-stats")).toBe("true");
    }
  });

  // The grey-row signal (count_for_stats=false) and the attended-row signal
  // (attendance) are independent axes — a user attending a soundcheck is
  // meaningful even if it doesn't count for stats. The row should carry BOTH
  // signals when both apply.
  test("a count_for_stats=false show that the user attended gets both signals", async () => {
    vi.mocked(useShowUserData).mockReturnValue({
      attendanceMap: new Map([["s-soundcheck", { id: "att-1" } as never]]),
      userRatingMap: new Map(),
      averageRatingMap: new Map(),
      displayedRatingMap: new Map(),
      rankComparisonMap: new Map(),
      isLoading: false,
      error: null,
    });

    const performances = [
      makePerformance({
        trackId: "t-soundcheck",
        show: { ...makePerformance().show, id: "s-soundcheck", countForStats: false },
      }),
    ];
    await setupWithRouter(<PerformanceTable performances={performances} />);

    const row = screen.getAllByRole("row").find((r) => r.getAttribute("data-counts-for-stats") === "false");
    expect(row).toBeDefined();
    expect(row?.getAttribute("data-attended")).toBe("true");
  });

  // Attended rows are highlighted via useAttendanceRowHighlight. Verifies the
  // hook→rowAttributes→DataTable wiring is intact.
  test("attended rows carry the data-attended hook", async () => {
    vi.mocked(useShowUserData).mockReturnValue({
      attendanceMap: new Map([["s-attended", { id: "att-1" } as never]]),
      userRatingMap: new Map(),
      averageRatingMap: new Map(),
      displayedRatingMap: new Map(),
      rankComparisonMap: new Map(),
      isLoading: false,
      error: null,
    });

    const performances = [
      makePerformance({ trackId: "t1", show: { ...makePerformance().show, id: "s-attended" } }),
      makePerformance({ trackId: "t2", show: { ...makePerformance().show, id: "s-other" } }),
    ];
    await setupWithRouter(<PerformanceTable performances={performances} />);

    const rows = screen.getAllByRole("row");
    const attendedRow = rows.find((row) => row.getAttribute("data-attended") === "true");
    expect(attendedRow).toBeDefined();

    // The other body row is a show the user did not attend.
    const nonAttendedRow = rows.find((row) => row.querySelector("td") && row.getAttribute("data-attended") === "false");
    expect(nonAttendedRow).toBeDefined();
  });

  // The isAuthenticated prop flows through to TrackRatingCell so it knows
  // whether to show an editable or read-only rating UI.
  test("passes isAuthenticated=true to TrackRatingCell when user is logged in", async () => {
    vi.mocked(useSession).mockReturnValue({
      user: { id: "u1" } as never,
      supabase: null,
    });

    await setupWithRouter(<PerformanceTable performances={[makePerformance()]} />);

    const cell = screen.getByTestId("TrackRatingCell");
    expect(cell.textContent).toContain('"isAuthenticated":true');
  });

  // The headerContent prop lets callers inject filter UI (Year/Era selects,
  // toggle chips, etc.) above the table. PerformanceTable passes it through
  // to DataTable's filterComponent slot.
  test("renders headerContent when provided", async () => {
    await setupWithRouter(
      <PerformanceTable
        performances={[makePerformance()]}
        headerContent={<div data-testid="filter-controls">Filter controls here</div>}
      />,
    );

    expect(screen.getByTestId("filter-controls")).toBeInTheDocument();
    expect(screen.getByText("Filter controls here")).toBeInTheDocument();
  });

  // When all performances fit on a single page, pagination nav controls
  // (Previous/Next) are hidden to avoid showing disabled "Page 1 of 1" UI.
  test("hides pagination nav when data fits on one page", async () => {
    await setupWithRouter(<PerformanceTable performances={[makePerformance()]} />);

    expect(screen.queryByRole("button", { name: "Previous" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Next" })).not.toBeInTheDocument();
  });
});
