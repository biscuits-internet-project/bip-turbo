import type { SongPagePerformance } from "@bip/domain";
import { screen } from "@testing-library/react";
import { mockShallowComponent, setup } from "@test/test-utils";
import { beforeEach, describe, expect, test, vi } from "vitest";

// Mock hooks used internally by PerformanceTable.
vi.mock("~/hooks/use-session", () => ({
  useSession: vi.fn(() => ({ user: null, supabase: null, loading: false })),
}));
vi.mock("~/hooks/use-show-user-data", () => ({
  useShowUserData: vi.fn(() => ({
    attendanceMap: new Map(),
    userRatingMap: new Map(),
    averageRatingMap: new Map(),
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
    show: { id: "show-1", slug: "2024-06-15-show-1", date: "2024-06-15", venueId: "venue-1" },
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
    await setup(<PerformanceTable performances={performances} />);

    expect(screen.getAllByTestId("TrackRatingCell")).toHaveLength(2);
    expect(screen.getByText("2024-06-15")).toBeInTheDocument();
    expect(screen.getByText("2024-07-20")).toBeInTheDocument();
  });

  // The Song column is only needed on /songs/all-timers where performances
  // span multiple songs.
  test("renders Song column when showSongColumn is true, omits it otherwise", async () => {
    const performances = [makePerformance({ songTitle: "Cassidy", songSlug: "cassidy" })];

    const { unmount } = await setup(<PerformanceTable performances={performances} showSongColumn />);
    expect(screen.getByRole("link", { name: "Cassidy" })).toBeInTheDocument();
    unmount();

    await setup(<PerformanceTable performances={performances} />);
    expect(screen.queryByRole("link", { name: "Cassidy" })).not.toBeInTheDocument();
  });

  // The "Showing N of M" count gives users feedback on how many
  // performances match the current filters vs. the total.
  test('shows "Showing N of M performances" count', async () => {
    const performances = [
      makePerformance({ trackId: "t1" }),
      makePerformance({ trackId: "t2" }),
      makePerformance({ trackId: "t3" }),
    ];
    await setup(<PerformanceTable performances={performances} />);

    expect(screen.getByText("Showing 3 of 3 performances")).toBeInTheDocument();
  });

  // Clicking a filter chip narrows visible rows. The filter logic is
  // handled by usePerformanceFilters internally; this test verifies the
  // end-to-end wiring from chip click → filtered data → rendered rows.
  test("clicking a filter chip narrows rows to matches", async () => {
    const performances = [
      makePerformance({ trackId: "t-encore", tags: { ...makePerformance().tags, encore: true } }),
      makePerformance({ trackId: "t-opener", tags: { ...makePerformance().tags, setOpener: true } }),
      makePerformance({ trackId: "t-neither" }),
    ];

    const { user } = await setup(<PerformanceTable performances={performances} />);

    expect(screen.getAllByTestId("TrackRatingCell")).toHaveLength(3);

    await user.click(screen.getByRole("button", { name: "Encore" }));

    expect(screen.getAllByTestId("TrackRatingCell")).toHaveLength(1);
    expect(screen.getByText("Showing 1 of 3 performances")).toBeInTheDocument();
  });

  // Clear All resets all active filters, restoring the full performance list.
  test("Clear All button resets filters", async () => {
    const performances = [
      makePerformance({ trackId: "t-encore", tags: { ...makePerformance().tags, encore: true } }),
      makePerformance({ trackId: "t-other" }),
    ];

    const { user } = await setup(<PerformanceTable performances={performances} />);

    await user.click(screen.getByRole("button", { name: "Encore" }));
    expect(screen.getAllByTestId("TrackRatingCell")).toHaveLength(1);

    await user.click(screen.getByRole("button", { name: "Clear All" }));
    expect(screen.getAllByTestId("TrackRatingCell")).toHaveLength(2);
  });

  // Attended rows get a green left border via useAttendanceRowHighlight.
  // Verifies the hook→rowClassName→DataTable wiring is intact.
  test("attended rows get the attendance highlight class", async () => {
    vi.mocked(useShowUserData).mockReturnValue({
      attendanceMap: new Map([["s-attended", { id: "att-1" } as never]]),
      userRatingMap: new Map(),
      averageRatingMap: new Map(),
      isLoading: false,
      error: null,
    });

    const performances = [
      makePerformance({ trackId: "t1", show: { ...makePerformance().show, id: "s-attended" } }),
      makePerformance({ trackId: "t2", show: { ...makePerformance().show, id: "s-other" } }),
    ];
    await setup(<PerformanceTable performances={performances} />);

    const rows = screen.getAllByRole("row");
    // First data row (index 1, after header) should have the attended class
    const attendedRow = rows.find((row) => row.className.includes("border-l-green"));
    expect(attendedRow).toBeDefined();
  });

  // The isAuthenticated prop flows through to TrackRatingCell so it knows
  // whether to show an editable or read-only rating UI.
  test("passes isAuthenticated=true to TrackRatingCell when user is logged in", async () => {
    vi.mocked(useSession).mockReturnValue({
      user: { id: "u1" } as never,
      supabase: null,
      loading: false,
    });

    await setup(<PerformanceTable performances={[makePerformance()]} />);

    const cell = screen.getByTestId("TrackRatingCell");
    expect(cell.textContent).toContain('"isAuthenticated":true');
  });
});
