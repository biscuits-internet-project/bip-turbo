import type { Attendance, SetlistLight } from "@bip/domain";
import { setupWithRouter } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import type { ShowExternalSources } from "./show-external-badges";

// Capture every render-props SetlistList passes to SetlistCard so tests can
// assert on the actual prop values (including nested objects that the generic
// mockShallowComponent helper strips via its JSON replacer).
const setlistCardMock = vi.fn();
vi.mock("./setlist-card", () => ({
  SetlistCard: (props: object) => {
    setlistCardMock(props);
    return <div data-testid="SetlistCard" />;
  },
}));

// Mock useShowUserData — SetlistList owns this call. Tests drive the return
// value to simulate the batched API response and assert on the options the
// wrapper passes through (notably initialData for SSR cache seeding).
const useShowUserDataMock = vi.fn();
vi.mock("~/hooks/use-show-user-data", () => ({
  useShowUserData: (showIds: string[], options?: object) => useShowUserDataMock(showIds, options),
}));

import { SetlistList } from "./setlist-list";

function makeSetlist(id: string, title: string, averageRating: number | null = 4.0, date = "2021-04-14"): SetlistLight {
  return {
    show: {
      id,
      slug: id,
      date,
      venueId: "venue-1",
      bandId: "band-1",
      notes: null,
      createdAt: new Date("2021-04-14"),
      updatedAt: new Date("2021-04-14"),
      likesCount: 0,
      relistenUrl: null,
      averageRating,
      ratingsCount: 10,
      showPhotosCount: 0,
      showYoutubesCount: 0,
      reviewsCount: 0,
    },
    venue: {
      id: "venue-1",
      name: "The Fillmore",
      slug: "the-fillmore",
      city: "Philadelphia",
      state: "PA",
      country: "USA",
      createdAt: new Date(),
      updatedAt: new Date(),
      timesPlayed: 5,
    },
    sets: [
      {
        label: "Set 1",
        sort: 1,
        tracks: [
          {
            id: `track-${id}`,
            showId: id,
            songId: "song-1",
            set: "1",
            position: 1,
            segue: null,
            likesCount: 0,
            note: null,
            allTimer: false,
            averageRating: null,
            ratingsCount: 0,
            song: { id: "song-1", title, slug: title.toLowerCase().replace(/\s+/g, "-") },
          },
        ],
      },
    ],
    annotations: [],
  };
}

function setMockReturn(
  overrides: {
    attendanceMap?: Map<string, Attendance | null>;
    userRatingMap?: Map<string, number | null>;
    averageRatingMap?: Map<string, { average: number; count: number } | null>;
  } = {},
) {
  useShowUserDataMock.mockReturnValue({
    attendanceMap: overrides.attendanceMap ?? new Map(),
    userRatingMap: overrides.userRatingMap ?? new Map(),
    averageRatingMap: overrides.averageRatingMap ?? new Map(),
    isLoading: false,
    error: null,
  });
}

describe("SetlistList", () => {
  beforeEach(() => {
    // Clear mock call history so call-index assertions are scoped to each test.
    setlistCardMock.mockClear();
    useShowUserDataMock.mockClear();
  });

  // Baseline: renders one SetlistCard per setlist, confirming the list iterates.
  test("renders one SetlistCard per setlist", async () => {
    setMockReturn();
    const setlists = [
      makeSetlist("show-1", "Basis for a Day"),
      makeSetlist("show-2", "Spacebirdmatingcall"),
      makeSetlist("show-3", "Munchkin Invasion"),
    ];
    await setupWithRouter(<SetlistList setlists={setlists} externalSources={{}} />);

    expect(setlistCardMock).toHaveBeenCalledTimes(3);
  });

  // Each card receives the externalSources entry keyed by its own show.id. This
  // is the core value-add of the list: callers hand a map, cards get slices.
  test("passes per-show externalSources slice to each card", async () => {
    setMockReturn();
    const showOneSources = { nugs: [], youtube: [] } as unknown as ShowExternalSources;
    const showTwoSources = { nugs: [{ id: "n1" }], youtube: [] } as unknown as ShowExternalSources;
    const externalSources: Record<string, ShowExternalSources> = {
      "show-1": showOneSources,
      "show-2": showTwoSources,
    };
    await setupWithRouter(
      <SetlistList
        setlists={[makeSetlist("show-1", "Basis for a Day"), makeSetlist("show-2", "Spacebirdmatingcall")]}
        externalSources={externalSources}
      />,
    );

    expect(setlistCardMock.mock.calls[0][0].externalSources).toBe(showOneSources);
    expect(setlistCardMock.mock.calls[1][0].externalSources).toBe(showTwoSources);
  });

  // Threads userAttendance / userRating through from useShowUserData's maps so
  // each card gets only its own slice — the wrapper owns the per-show lookup.
  test("threads per-show attendance and user rating from the hook", async () => {
    const attendance1 = { id: "att-1", showId: "show-1", userId: "u" } as Attendance;
    setMockReturn({
      attendanceMap: new Map([["show-1", attendance1]]),
      userRatingMap: new Map([["show-2", 5]]),
    });

    await setupWithRouter(
      <SetlistList
        setlists={[makeSetlist("show-1", "Basis for a Day"), makeSetlist("show-2", "Spacebirdmatingcall")]}
        externalSources={{}}
      />,
    );

    expect(setlistCardMock.mock.calls[0][0].userAttendance).toBe(attendance1);
    expect(setlistCardMock.mock.calls[0][0].userRating).toBeNull();
    expect(setlistCardMock.mock.calls[1][0].userAttendance).toBeNull();
    expect(setlistCardMock.mock.calls[1][0].userRating).toBe(5);
  });

  // averageRatingMap (live data from the client query) wins when present;
  // otherwise we fall back to the statically-denormalized setlist.show.averageRating
  // so ratings still display on first render before the client query resolves.
  test("showRating prefers averageRatingMap over the denormalized value, falls back when missing", async () => {
    setMockReturn({
      averageRatingMap: new Map([["show-1", { average: 4.75, count: 20 }]]),
    });

    await setupWithRouter(
      <SetlistList
        setlists={[makeSetlist("show-1", "Basis for a Day", 4.0), makeSetlist("show-2", "Spacebirdmatingcall", 3.2)]}
        externalSources={{}}
      />,
    );

    expect(setlistCardMock.mock.calls[0][0].showRating).toBe(4.75);
    expect(setlistCardMock.mock.calls[1][0].showRating).toBe(3.2);
  });

  // SetlistList must hand the hook every show id so the batched POST fetches
  // user data for every card in one round-trip instead of one per card.
  test("calls useShowUserData with every show id in the list", async () => {
    setMockReturn();
    await setupWithRouter(
      <SetlistList
        setlists={[
          makeSetlist("show-a", "Basis for a Day"),
          makeSetlist("show-b", "Spacebirdmatingcall"),
          makeSetlist("show-c", "Munchkin Invasion"),
        ]}
        externalSources={{}}
      />,
    );

    expect(useShowUserDataMock).toHaveBeenCalled();
    const passed = useShowUserDataMock.mock.calls[0][0] as string[];
    expect(passed).toEqual(["show-a", "show-b", "show-c"]);
  });

  // When a loader pre-fetched show user data, SetlistList forwards it to the
  // hook as initialData so React Query seeds the cache and cards render
  // attendance / rating badges on first paint (no hydration flicker).
  test("forwards initialUserData to the hook as initialData", async () => {
    setMockReturn();
    const initialUserData = {
      attendances: { "show-1": null },
      userRatings: { "show-1": null },
      averageRatings: { "show-1": { average: 4.2, count: 3 } },
    };
    await setupWithRouter(
      <SetlistList
        setlists={[makeSetlist("show-1", "Basis for a Day")]}
        externalSources={{}}
        initialUserData={initialUserData}
      />,
    );

    expect(useShowUserDataMock).toHaveBeenCalledWith(["show-1"], { initialData: initialUserData });
  });

  // Empty list with no `empty` prop: render nothing, no cards, no stray DOM.
  test("renders nothing when setlists is empty and no empty prop is given", async () => {
    setMockReturn();
    await setupWithRouter(<SetlistList setlists={[]} externalSources={{}} />);
    expect(setlistCardMock).not.toHaveBeenCalled();
  });

  // The `empty` prop lets callers push their empty-state UI into the wrapper
  // so a single <SetlistList> element handles both the populated and empty
  // cases; no outer ternary is required at the call site.
  test("renders the empty prop when setlists is empty", async () => {
    setMockReturn();
    await setupWithRouter(
      <SetlistList
        setlists={[]}
        externalSources={{}}
        empty={<div data-testid="empty-state">No shows on this date</div>}
      />,
    );
    expect(setlistCardMock).not.toHaveBeenCalled();
    expect(screen.getByTestId("empty-state")).toHaveTextContent("No shows on this date");
  });

  // groupByMonth on the /shows/year page: setlists already arrive sorted; the
  // wrapper groups them into per-month buckets and emits a `#month-N` scroll
  // anchor before each group for the month-jump nav.
  test("groupByMonth renders a scroll anchor and cards per month, preserving input order", async () => {
    setMockReturn();
    const setlists = [
      makeSetlist("dec-2", "Basis for a Day", 4.0, "2024-12-31"),
      makeSetlist("dec-1", "Spacebirdmatingcall", 4.0, "2024-12-29"),
      makeSetlist("nov-1", "Munchkin Invasion", 4.0, "2024-11-15"),
      makeSetlist("oct-1", "Crickets", 4.0, "2024-10-02"),
    ];
    const { container } = await setupWithRouter(<SetlistList setlists={setlists} externalSources={{}} groupByMonth />);

    // Anchors exist for the months present in the input (and only those)
    expect(container.querySelector("#month-11")).toBeInTheDocument(); // December
    expect(container.querySelector("#month-10")).toBeInTheDocument(); // November
    expect(container.querySelector("#month-9")).toBeInTheDocument(); // October
    expect(container.querySelector("#month-0")).toBeNull(); // January absent

    // All four cards rendered, input order preserved so the two December shows
    // come first (newest → oldest).
    expect(setlistCardMock).toHaveBeenCalledTimes(4);
    expect(setlistCardMock.mock.calls[0][0].setlist.show.id).toBe("dec-2");
    expect(setlistCardMock.mock.calls[1][0].setlist.show.id).toBe("dec-1");
    expect(setlistCardMock.mock.calls[2][0].setlist.show.id).toBe("nov-1");
    expect(setlistCardMock.mock.calls[3][0].setlist.show.id).toBe("oct-1");
  });

  // The empty prop is only for the empty case — it must not leak into renders
  // that have setlists, so callers can always pass it safely.
  test("does not render the empty prop when setlists is non-empty", async () => {
    setMockReturn();
    await setupWithRouter(
      <SetlistList
        setlists={[makeSetlist("show-1", "Basis for a Day")]}
        externalSources={{}}
        empty={<div data-testid="empty-state">Should not appear</div>}
      />,
    );
    expect(screen.queryByTestId("empty-state")).toBeNull();
  });
});
