import type { SongPagePerformance } from "@bip/domain";
import { mockShallowComponent, setup } from "@test/test-utils";
import { screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

// Mock hooks BEFORE importing the component under test.
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

// Stub heavy child components.
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
  const base: SongPagePerformance = {
    trackId: "track-1",
    show: {
      id: "show-1",
      slug: "2024-06-15-show-1",
      date: "2024-06-15",
      venueId: "venue-1",
    },
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
  };
  return { ...base, ...overrides };
}

describe("PerformanceTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    // Baseline smoke test: each performance in the input array becomes one
    // row containing its date, set, and (via the stubbed TrackRatingCell)
    // rating. If this fails, every other PerformanceTable test is suspect.
    test("renders a row per performance with date + set + venue", async () => {
      const performances = [
        makePerformance({
          trackId: "t1",
          show: { ...makePerformance().show, id: "s1", date: "2024-06-15" },
          set: "S1",
        }),
        makePerformance({
          trackId: "t2",
          show: { ...makePerformance().show, id: "s2", date: "2024-07-20" },
          set: "E1",
        }),
      ];
      await setup(<PerformanceTable performances={performances} />);

      // Two rating-cell stubs = two rendered rows
      expect(screen.getAllByTestId("TrackRatingCell")).toHaveLength(2);
      expect(screen.getByText("2024-06-15")).toBeInTheDocument();
      expect(screen.getByText("2024-07-20")).toBeInTheDocument();
    });

    // The Song column is only relevant on /songs/all-timers (which mixes
    // performances from many songs). On /songs/$slug (one song), it's noise.
    // Verifies the `showSongColumn` flag controls this cleanly.
    test("renders Song column when showSongColumn=true, omits it otherwise", async () => {
      const performances = [makePerformance({ songTitle: "Cassidy", songSlug: "cassidy" })];

      const { unmount } = await setup(<PerformanceTable performances={performances} showSongColumn />);
      expect(screen.getByRole("link", { name: "Cassidy" })).toBeInTheDocument();
      unmount();

      await setup(<PerformanceTable performances={performances} />);
      expect(screen.queryByRole("link", { name: "Cassidy" })).not.toBeInTheDocument();
    });

    // The count line tells users how many performances match the current
    // filter vs. how many exist total. Critical feedback when filter chips
    // are active — without it, users can't tell an empty result from a broken
    // filter.
    test('shows "Showing N of M performances" count', async () => {
      const performances = [
        makePerformance({ trackId: "t1" }),
        makePerformance({ trackId: "t2" }),
        makePerformance({ trackId: "t3" }),
      ];
      await setup(<PerformanceTable performances={performances} />);

      expect(screen.getByText("Showing 3 of 3 performances")).toBeInTheDocument();
    });

    // TrackRatingCell is stubbed out (see vi.mock above) because it has its
    // own state and network calls. But PerformanceTable is responsible for
    // wiring the right props to it per row — trackId, showSlug, rating, etc.
    // This test is the gate for that prop-passing contract.
    test("passes correct props to TrackRatingCell per row", async () => {
      const performances = [
        makePerformance({
          trackId: "t1",
          show: { ...makePerformance().show, slug: "show-a" },
          rating: 4.5,
          ratingsCount: 10,
        }),
        makePerformance({
          trackId: "t2",
          show: { ...makePerformance().show, slug: "show-b" },
          rating: 3.2,
          ratingsCount: 7,
        }),
      ];
      await setup(<PerformanceTable performances={performances} />);

      const cells = screen.getAllByTestId("TrackRatingCell");
      // First row
      expect(within(cells[0]).getByText(/"trackId":"t1"/)).toBeInTheDocument();
      expect(within(cells[0]).getByText(/"showSlug":"show-a"/)).toBeInTheDocument();
      expect(within(cells[0]).getByText(/"initialRating":4.5/)).toBeInTheDocument();
      expect(within(cells[0]).getByText(/"ratingsCount":10/)).toBeInTheDocument();
      expect(within(cells[0]).getByText(/"isAuthenticated":false/)).toBeInTheDocument();
      // Second row
      expect(within(cells[1]).getByText(/"trackId":"t2"/)).toBeInTheDocument();
      expect(within(cells[1]).getByText(/"showSlug":"show-b"/)).toBeInTheDocument();
    });

    // The `isAuthenticated` prop passed to TrackRatingCell is derived from
    // `useSession().user`. Controls whether ratings are read-only or editable.
    // Verifies auth state flows correctly from hook to child prop.
    test("isAuthenticated flag on TrackRatingCell tracks useSession.user", async () => {
      vi.mocked(useSession).mockReturnValue({
        user: { id: "u1" } as never,
        supabase: null,
        loading: false,
      });

      await setup(<PerformanceTable performances={[makePerformance({ trackId: "t1" })]} />);

      const cell = screen.getByTestId("TrackRatingCell");
      expect(within(cell).getByText(/"isAuthenticated":true/)).toBeInTheDocument();
    });
  });

  describe("filter toggles", () => {
    const performances = [
      makePerformance({
        trackId: "t-encore",
        tags: { ...makePerformance().tags, encore: true },
      }),
      makePerformance({
        trackId: "t-opener",
        tags: { ...makePerformance().tags, setOpener: true },
      }),
      makePerformance({
        trackId: "t-neither",
      }),
    ];

    // The core filter behavior: clicking a tag chip (like "Encore") reduces
    // the visible rows to performances where that tag is true.
    test("clicking a filter chip narrows rows to matches", async () => {
      const { user } = await setup(<PerformanceTable performances={performances} />);

      // All 3 rows visible initially
      expect(screen.getAllByTestId("TrackRatingCell")).toHaveLength(3);

      await user.click(screen.getByRole("button", { name: "Encore" }));

      // Only the encore row remains
      expect(screen.getAllByTestId("TrackRatingCell")).toHaveLength(1);
      expect(screen.getByText("Showing 1 of 3 performances")).toBeInTheDocument();
    });

    // Multiple active chips are combined with OR (not AND): a row matches if
    // ANY active filter matches. Important UX choice — AND would quickly
    // produce zero results for overlapping tag combinations.
    test("multiple active filter chips use OR semantics", async () => {
      const { user } = await setup(<PerformanceTable performances={performances} />);

      await user.click(screen.getByRole("button", { name: "Encore" }));
      await user.click(screen.getByRole("button", { name: "Set Opener" }));

      // Encore (1) OR Set Opener (1) = 2 rows
      expect(screen.getAllByTestId("TrackRatingCell")).toHaveLength(2);
      expect(screen.getByText("Showing 2 of 3 performances")).toBeInTheDocument();
    });

    // The "Attended" filter is different from tag filters — it reads from
    // the attendance map returned by useShowUserData rather than from
    // performance.tags. Verifies that cross-source filter composition works.
    test("Attended filter uses attendanceMap from useShowUserData", async () => {
      vi.mocked(useShowUserData).mockReturnValue({
        attendanceMap: new Map([["s-attended", { id: "att-1" } as never]]),
        userRatingMap: new Map(),
        averageRatingMap: new Map(),
        isLoading: false,
        error: null,
      });

      const attendedPerformances = [
        makePerformance({ trackId: "t1", show: { ...makePerformance().show, id: "s-attended" } }),
        makePerformance({ trackId: "t2", show: { ...makePerformance().show, id: "s-other" } }),
      ];
      const { user } = await setup(<PerformanceTable performances={attendedPerformances} />);

      expect(screen.getAllByTestId("TrackRatingCell")).toHaveLength(2);

      await user.click(screen.getByRole("button", { name: "Attended" }));

      expect(screen.getAllByTestId("TrackRatingCell")).toHaveLength(1);
    });

    // Clear All is an affordance for recovering from over-filtering. It
    // should be hidden when no filters are active (to avoid button noise)
    // and visible + functional when ≥1 is active.
    test("Clear All button appears when filters are active and resets them", async () => {
      const { user } = await setup(<PerformanceTable performances={performances} />);

      expect(screen.queryByRole("button", { name: "Clear All" })).not.toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Encore" }));
      expect(screen.getByRole("button", { name: "Clear All" })).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Clear All" }));
      expect(screen.queryByRole("button", { name: "Clear All" })).not.toBeInTheDocument();
      expect(screen.getAllByTestId("TrackRatingCell")).toHaveLength(3);
    });

    // Filter chips are toggles, not radio buttons — clicking an active chip
    // turns it off. Verifies the toggle semantics; without this, a user could
    // get stuck with a filter they can't remove (except via Clear All).
    test("clicking same filter chip twice toggles it off", async () => {
      const { user } = await setup(<PerformanceTable performances={performances} />);

      await user.click(screen.getByRole("button", { name: "Encore" }));
      expect(screen.getAllByTestId("TrackRatingCell")).toHaveLength(1);

      await user.click(screen.getByRole("button", { name: "Encore" }));
      expect(screen.getAllByTestId("TrackRatingCell")).toHaveLength(3);
    });
  });

  describe("sorting", () => {
    // The table defaults to newest-first sorting by date. Critical for the
    // /songs/all-timers page where users scan the most recent all-timer
    // performances first.
    test("default sort is date descending", async () => {
      const performances = [
        makePerformance({ trackId: "old", show: { ...makePerformance().show, id: "s-old", date: "2020-01-01" } }),
        makePerformance({ trackId: "new", show: { ...makePerformance().show, id: "s-new", date: "2024-01-01" } }),
        makePerformance({ trackId: "mid", show: { ...makePerformance().show, id: "s-mid", date: "2022-01-01" } }),
      ];
      await setup(<PerformanceTable performances={performances} />);

      // Dates are links inside date cells — grab in document order
      const dateLinks = screen.getAllByRole("link").filter((el) => /^\d{4}-\d{2}-\d{2}$/.test(el.textContent ?? ""));
      expect(dateLinks.map((el) => el.textContent)).toEqual(["2024-01-01", "2022-01-01", "2020-01-01"]);
    });
  });

  describe("column cells", () => {
    // Each Date cell is wrapped in an <a href="/shows/{slug}"> so users can
    // click through to a specific show. Confirms the href structure.
    test("Date cell links to /shows/{show.slug}", async () => {
      const performances = [
        makePerformance({
          trackId: "t1",
          show: { ...makePerformance().show, id: "s1", slug: "2024-06-15-the-cap", date: "2024-06-15" },
        }),
      ];
      await setup(<PerformanceTable performances={performances} />);

      const dateLink = screen.getByRole("link", { name: "2024-06-15" });
      expect(dateLink).toHaveAttribute("href", "/shows/2024-06-15-the-cap");
    });

    // The Venue cell renders name + city + state inside a link to the show
    // (same href target as the Date cell — two affordances, one destination).
    test("Venue cell shows name/city/state and links to the show", async () => {
      const performances = [
        makePerformance({
          show: { ...makePerformance().show, slug: "2024-06-15-the-cap" },
          venue: {
            id: "v1",
            slug: "the-cap",
            name: "The Capitol Theatre",
            city: "Port Chester",
            state: "NY",
            country: "USA",
          },
        }),
      ];
      await setup(<PerformanceTable performances={performances} />);

      // Name + "City, State" appear. (Rendered in one <a>, separated by <br/>.)
      expect(screen.getByText(/The Capitol Theatre/)).toBeInTheDocument();
      expect(screen.getByText(/Port Chester, NY/)).toBeInTheDocument();
      // Clicking the venue text goes to the show page, not the venue page
      const venueLink = screen.getByRole("link", { name: /The Capitol Theatre/ });
      expect(venueLink).toHaveAttribute("href", "/shows/2024-06-15-the-cap");
    });

    // The venue cell guards against missing city — if `venue.city` is falsy,
    // the cell renders nothing (rather than showing partial info or "undefined").
    test("Venue cell renders nothing when city is missing", async () => {
      const performances = [
        makePerformance({
          venue: {
            id: "v1",
            slug: "nowhere",
            name: "Nowhere",
            city: "",
            state: null,
            country: "USA",
          },
        }),
      ];
      await setup(<PerformanceTable performances={performances} />);

      expect(screen.queryByText("Nowhere")).not.toBeInTheDocument();
    });

    // The Set cell renders the set label (e.g. "S1", "E1"), and falls back
    // to an em-dash if `set` is empty. Keeps the column aligned visually.
    test("Set cell shows the set label when present, em-dash otherwise", async () => {
      const performances = [makePerformance({ trackId: "t1", set: "S2" }), makePerformance({ trackId: "t2", set: "" })];
      await setup(<PerformanceTable performances={performances} />);

      expect(screen.getByText("S2")).toBeInTheDocument();
      expect(screen.getByText("—")).toBeInTheDocument();
    });

    // The Sequence cell shows "SongBefore > CurrentSong > SongAfter" with
    // segue arrows, or commas when there's no segue. Both flanking songs
    // link to their /songs/{slug} pages; the current song is bold and
    // unlinked (it's the row's song).
    test("Sequence cell shows songBefore > current > songAfter with segues", async () => {
      const performances = [
        makePerformance({
          songBefore: {
            id: "b-id",
            songId: "b-id",
            segue: ">",
            songSlug: "tractorbeam",
            songTitle: "Tractorbeam",
          },
          songAfter: {
            id: "a-id",
            songId: "a-id",
            segue: null,
            songSlug: "basis-for-a-day",
            songTitle: "Basis For A Day",
          },
          segue: ">",
        }),
      ];
      await setup(<PerformanceTable performances={performances} songTitle="Cassidy" />);

      // Both flanking songs are rendered as links
      const before = screen.getByRole("link", { name: "Tractorbeam" });
      expect(before).toHaveAttribute("href", "/songs/tractorbeam");
      const after = screen.getByRole("link", { name: "Basis For A Day" });
      expect(after).toHaveAttribute("href", "/songs/basis-for-a-day");
      // Current song is plain text, not a link
      expect(screen.getByText("Cassidy")).toBeInTheDocument();
      expect(screen.queryByRole("link", { name: "Cassidy" })).not.toBeInTheDocument();
    });

    // The Sequence cell uses comma separators between non-segued songs
    // (commas visually distinct from ">" segue arrows). Confirms the fallback
    // path when `before.segue` / current `segue` are falsy.
    test("Sequence cell uses commas when there is no segue between songs", async () => {
      const performances = [
        makePerformance({
          songBefore: {
            id: "b-id",
            songId: "b-id",
            segue: null,
            songSlug: "tractorbeam",
            songTitle: "Tractorbeam",
          },
          songAfter: {
            id: "a-id",
            songId: "a-id",
            segue: null,
            songSlug: "basis-for-a-day",
            songTitle: "Basis For A Day",
          },
          segue: null,
        }),
      ];
      await setup(<PerformanceTable performances={performances} songTitle="Cassidy" />);

      // Both flanking songs render but no ">" segue indicator should appear
      expect(screen.getByRole("link", { name: "Tractorbeam" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Basis For A Day" })).toBeInTheDocument();
      // Raw ">" character not present as segue indicator
      expect(screen.queryByText(">", { exact: true })).not.toBeInTheDocument();
    });

    // The Notes cell combines track-level `notes` + any `annotations` and
    // passes them to CombinedNotes (stubbed). Verifies the items array it
    // receives includes both sources.
    test("Notes cell passes combined annotations + notes to CombinedNotes", async () => {
      const performances = [
        makePerformance({
          trackId: "t1",
          notes: "Extended outro",
          annotations: [
            { id: "a1", trackId: "t1", desc: "with guest vocalist", createdAt: new Date(), updatedAt: new Date() },
          ],
        }),
      ];
      await setup(<PerformanceTable performances={performances} />);

      const stub = screen.getByTestId("CombinedNotes");
      // Both annotation desc + track note appear in the props blob
      expect(stub.textContent).toContain("with guest vocalist");
      expect(stub.textContent).toContain("Extended outro");
    });

    // The Notes cell should render nothing (not even the CombinedNotes stub)
    // when both `notes` and `annotations` are empty. Keeps the column from
    // leaking empty wrappers into the DOM.
    test("Notes cell renders nothing when notes and annotations are both empty", async () => {
      const performances = [makePerformance({ trackId: "t1", notes: undefined, annotations: [] })];
      await setup(<PerformanceTable performances={performances} />);

      expect(screen.queryByTestId("CombinedNotes")).not.toBeInTheDocument();
    });

    // The all-timer flame column only appears when `showAllTimerColumn=true`
    // and the row's `allTimer` flag is true. Used to visually mark standout
    // performances on the /songs/all-timers page.
    test("allTimer column renders flame icon only when allTimer=true and column is enabled", async () => {
      const performances = [
        makePerformance({ trackId: "t-yes", allTimer: true }),
        makePerformance({ trackId: "t-no", allTimer: false }),
      ];
      const { container } = await setup(<PerformanceTable performances={performances} showAllTimerColumn />);

      // lucide-react Flame icon has class "lucide-flame" — one flame = one all-timer row
      const flames = container.querySelectorAll(".lucide-flame");
      expect(flames.length).toBe(1);
    });

    // When `showAllTimerColumn=false` (the default), no flame column renders
    // regardless of how many rows are all-timers. Confirms the column-level
    // gate is stronger than the per-row allTimer flag.
    test("allTimer column is absent when showAllTimerColumn=false", async () => {
      const performances = [makePerformance({ trackId: "t1", allTimer: true })];
      const { container } = await setup(<PerformanceTable performances={performances} />);

      expect(container.querySelectorAll(".lucide-flame").length).toBe(0);
    });

    // The Song column falls back to a plain <span> (not a link) when the
    // performance has no songSlug. Edge case for incomplete data — the title
    // still appears, just isn't clickable.
    test("Song column renders plain span when songSlug is missing", async () => {
      const performances = [makePerformance({ songTitle: "UnknownSong", songSlug: undefined })];
      await setup(<PerformanceTable performances={performances} showSongColumn />);

      // Title is not wrapped in a link (no songSlug → no href target)
      expect(screen.queryByRole("link", { name: "UnknownSong" })).not.toBeInTheDocument();
      // It IS still rendered as text — look for a <span> (not the stub props blob)
      // by scoping to the table body.
      const spans = screen.getAllByText("UnknownSong").filter((el) => el.tagName === "SPAN");
      expect(spans.length).toBeGreaterThanOrEqual(1);
    });
  });
});
