import type { SongPagePerformance } from "@bip/domain";
import { mockShallowComponent, setup } from "@test/test-utils";
import { screen } from "@testing-library/react";
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
    // Attended row should have both the green background tint and the left
    // border highlight. The !border-l-green-500 class uses Tailwind's
    // important modifier to avoid border conflicts with TableRow's border-b.
    const attendedRow = rows.find((row) => row.className.includes("bg-green-500"));
    expect(attendedRow).toBeDefined();
    expect(attendedRow?.className).toContain("!border-l-green-500");
    expect(attendedRow?.className).toContain("!border-l-2");

    // Non-attended rows should have neither class
    const nonAttendedRow = rows.find(
      (row) => row.className.includes("hover:bg-hover-glass") && !row.className.includes("bg-green-500"),
    );
    expect(nonAttendedRow).toBeDefined();
    expect(nonAttendedRow?.className).not.toContain("!border-l-green-500");
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

  // The headerContent prop lets callers inject filter UI (Year/Era selects,
  // toggle chips, etc.) above the table. PerformanceTable passes it through
  // to DataTable's filterComponent slot.
  test("renders headerContent when provided", async () => {
    await setup(
      <PerformanceTable
        performances={[makePerformance()]}
        headerContent={<div data-testid="filter-controls">Filter controls here</div>}
      />,
    );

    expect(screen.getByTestId("filter-controls")).toBeInTheDocument();
    expect(screen.getByText("Filter controls here")).toBeInTheDocument();
  });

  // PerformanceTable shows pagination controls (Previous/Next buttons) so
  // users can navigate large performance lists without scrolling through
  // hundreds of rows.
  test("renders pagination controls above and below the table", async () => {
    await setup(<PerformanceTable performances={[makePerformance()]} />);

    expect(screen.getAllByRole("button", { name: "Previous" })).toHaveLength(2);
    expect(screen.getAllByRole("button", { name: "Next" })).toHaveLength(2);
  });
});
