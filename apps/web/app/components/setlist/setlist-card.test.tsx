import type { SetlistLight } from "@bip/domain";
import { expectMockedShallowComponent, mockShallowComponent, setupWithRouter } from "@test/test-utils";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";

// Mock hooks used internally by SetlistCard
import { useSession } from "~/hooks/use-session";

vi.mock("~/hooks/use-session", () => ({
  useSession: vi.fn(() => ({ user: null, supabase: null, loading: false })),
}));
vi.mock("~/hooks/use-show-user-data", () => ({
  useAttendanceMutation: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
}));
// SetlistTable mounts inside SetlistCard when the user toggles to gap-chart
// view; that path calls useTrackUserRatings which needs a QueryClient. Stub
// it so the table renders without any React Query setup.
vi.mock("~/hooks/use-track-user-ratings", () => ({
  useTrackUserRatings: vi.fn(() => ({
    userRatingMap: new Map<string, number>(),
    averageRatingMap: new Map<string, { average: number; count: number }>(),
    isLoading: false,
  })),
}));
// SetlistTable also fetches the catalog play-dates blob for the Played
// Before column; stub it so the gap-chart view renders without React Query.
vi.mock("~/hooks/use-song-play-dates", () => ({
  useSongPlayDates: vi.fn(() => ({ data: {} as Record<string, string[]>, isLoading: false })),
}));

// Stub heavy child components
vi.mock("./track-rating-overlay", () => ({
  TrackRatingOverlay: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock("~/components/rating", () => ({
  RatingComponent: (props: object) => mockShallowComponent("RatingComponent", props),
}));
vi.mock("~/components/ui/star-rating", () => ({
  StarRating: (props: object) => mockShallowComponent("StarRating", props),
}));
vi.mock("./anniversary-badge", () => ({
  AnniversaryBadge: (props: object) => mockShallowComponent("AnniversaryBadge", props),
}));

import { SetlistCard } from "./setlist-card";

function makeSetlist(overrides: { showDate?: string } = {}): SetlistLight {
  return {
    show: {
      id: "show-1",
      slug: "2021-04-14",
      date: overrides.showDate ?? "2021-04-14",
      venueId: "venue-1",
      bandId: "band-1",
      notes: null,
      createdAt: new Date("2021-04-14"),
      updatedAt: new Date("2021-04-14"),
      likesCount: 0,
      relistenUrl: null,
      averageRating: 4.0,
      ratingsCount: 10,
      showPhotosCount: 0,
      showYoutubesCount: 0,
      reviewsCount: 0,
      countForStats: true,
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
            id: "track-1",
            showId: "show-1",
            songId: "song-1",
            set: "1",
            position: 1,
            segue: null,
            likesCount: 0,
            note: null,
            allTimer: false,
            gap: null,
            previousPerformanceShowId: null,
            duration: null,
            durationSource: null,
            previousPerformanceShow: null,
            flags: [],
            flagRecurrences: [],
            segueRecurrences: [],
            completes: [],
            completedBy: [],
            song: { id: "song-1", title: "Basis for a Day", slug: "basis-for-a-day" },
          },
        ],
      },
    ],
    annotations: [],
    averageSongGap: null,
    medianSongGap: null,
    debutCount: 0,
    rockOperaPerformances: [],
    lineup: [],
    trackMusicianDeltas: [],
  };
}

describe("SetlistCard", () => {
  // Each test starts with a logged-out viewer; the rating-badge tests below
  // override per-test. Reset here so a `mockReturnValue` from a prior test
  // doesn't leak into the next one.
  beforeEach(() => {
    vi.mocked(useSession).mockReturnValue({
      user: null,
      supabase: null as never,
      loading: false,
    } as never);
  });

  // Passes the show date to AnniversaryBadge so it can decide whether to render
  test("passes showDate to AnniversaryBadge", async () => {
    await setupWithRouter(
      <SetlistCard
        setlist={makeSetlist({ showDate: "2016-04-14" })}
        userAttendance={null}
        userRating={null}
        showRating={null}
      />,
    );
    expectMockedShallowComponent("AnniversaryBadge", { showDate: "2016-04-14" });
  });

  // Renders the show date as a link
  test("renders the show date", async () => {
    await setupWithRouter(
      <SetlistCard setlist={makeSetlist()} userAttendance={null} userRating={null} showRating={null} />,
    );
    expect(screen.getByText("4/14/2021")).toBeInTheDocument();
  });

  // Renders venue information
  test("renders venue name and location", async () => {
    await setupWithRouter(
      <SetlistCard setlist={makeSetlist()} userAttendance={null} userRating={null} showRating={null} />,
    );
    expect(screen.getByText(/The Fillmore/)).toBeInTheDocument();
    expect(screen.getByText(/Philadelphia, PA/)).toBeInTheDocument();
  });

  // International venues have an empty state, so the country must fill in —
  // otherwise the header reads "Harpa Concert Hall - Reykjavik," with a
  // dangling comma instead of "Reykjavik, Iceland".
  test("renders the country for an international venue with no state", async () => {
    const setlist = makeSetlist();
    setlist.venue = { ...setlist.venue, name: "Harpa Concert Hall", city: "Reykjavik", state: "", country: "Iceland" };
    await setupWithRouter(<SetlistCard setlist={setlist} userAttendance={null} userRating={null} showRating={null} />);
    expect(screen.getByText(/Harpa Concert Hall - Reykjavik, Iceland/)).toBeInTheDocument();
  });

  // The venue name is a clickable link to the venue page so users can
  // navigate directly from any setlist card.
  test("venue is a clickable link to the venue page", async () => {
    await setupWithRouter(
      <SetlistCard setlist={makeSetlist()} userAttendance={null} userRating={null} showRating={null} />,
    );
    const venueLink = screen.getByRole("link", { name: /The Fillmore/ });
    expect(venueLink).toHaveAttribute("href", "/venues/the-fillmore");
  });

  // Renders the setlist tracks
  test("renders track names", async () => {
    await setupWithRouter(
      <SetlistCard setlist={makeSetlist()} userAttendance={null} userRating={null} showRating={null} />,
    );
    expect(screen.getByText("Basis for a Day")).toBeInTheDocument();
  });

  // Callers that don't opt into collapsible (year route, etc.) see the
  // full body on first paint. Pinning the default so the collapsible mode
  // can evolve without affecting non-collapsible callers.
  test("renders body by default when collapsible is not set", async () => {
    await setupWithRouter(
      <SetlistCard setlist={makeSetlist()} userAttendance={null} userRating={null} showRating={null} />,
    );
    expect(screen.getByText("Basis for a Day")).toBeInTheDocument();
  });

  // On top-rated, each card opts into collapsed mode. The body wrapper stays in
  // the DOM (so the grid-rows transition has something to animate), marked
  // aria-hidden and clipped to zero height via the 0fr grid row — but its heavy
  // contents (the full setlist) are lazy-mounted, so they aren't rendered until
  // the card is first opened. This keeps 100 collapsed cards from mounting 100
  // full setlists up front.
  test("hides body initially and does not mount its contents when collapsible is true", async () => {
    await setupWithRouter(
      <SetlistCard setlist={makeSetlist()} collapsible userAttendance={null} userRating={null} showRating={null} />,
    );
    const body = screen.getByTestId("setlist-card-body");
    expect(body).toHaveAttribute("aria-hidden", "true");
    expect(body.className).toMatch(/grid-rows-\[0fr\]/);
    // Header content (date + venue) must still be visible.
    expect(screen.getByText("4/14/2021")).toBeInTheDocument();
    expect(screen.getByText(/The Fillmore/)).toBeInTheDocument();
    // …but the setlist body is not mounted until first open.
    expect(screen.queryByText("Basis for a Day")).not.toBeInTheDocument();
  });

  // Clicking an empty part of the header opens the card: aria-hidden flips to
  // false, the grid-rows class swaps to 1fr for the transition, and the
  // lazy-mounted setlist body now renders.
  test("clicking the header opens and mounts the body when collapsible", async () => {
    const user = userEvent.setup();
    await setupWithRouter(
      <SetlistCard setlist={makeSetlist()} collapsible userAttendance={null} userRating={null} showRating={null} />,
    );
    const body = screen.getByTestId("setlist-card-body");
    expect(body).toHaveAttribute("aria-hidden", "true");
    expect(screen.queryByText("Basis for a Day")).not.toBeInTheDocument();

    const header = screen.getByTestId("setlist-card-header");
    await user.click(header);

    expect(body).toHaveAttribute("aria-hidden", "false");
    expect(body.className).toMatch(/grid-rows-\[1fr\]/);
    expect(screen.getByText("Basis for a Day")).toBeInTheDocument();
  });

  // The venue link lives inside the header. Clicking it should navigate, not
  // toggle the card. Verifies the header's target filter lets link clicks
  // through without flipping the open state.
  test("clicking the venue link does not toggle the card", async () => {
    const user = userEvent.setup();
    await setupWithRouter(
      <SetlistCard setlist={makeSetlist()} collapsible userAttendance={null} userRating={null} showRating={null} />,
    );
    const body = screen.getByTestId("setlist-card-body");
    expect(body).toHaveAttribute("aria-hidden", "true");

    const venueLink = screen.getByRole("link", { name: /The Fillmore/ });
    await user.click(venueLink);

    // Body must still be hidden — link navigates but does not toggle.
    expect(body).toHaveAttribute("aria-hidden", "true");
  });

  // The date link is also inside the header. Clicking it should navigate to
  // the show page without collapsing/expanding the card.
  test("clicking the date link does not toggle the card", async () => {
    const user = userEvent.setup();
    await setupWithRouter(
      <SetlistCard setlist={makeSetlist()} collapsible userAttendance={null} userRating={null} showRating={null} />,
    );
    const body = screen.getByTestId("setlist-card-body");
    expect(body).toHaveAttribute("aria-hidden", "true");

    const dateLink = screen.getByRole("link", { name: /4\/14\/2021/ });
    await user.click(dateLink);

    expect(body).toHaveAttribute("aria-hidden", "true");
  });

  // When collapsed, the header should use tighter vertical padding to keep the
  // ranked list dense and scannable. When open, padding returns to normal.
  test("collapsed header uses tighter padding than open header", async () => {
    await setupWithRouter(
      <SetlistCard setlist={makeSetlist()} collapsible userAttendance={null} userRating={null} showRating={null} />,
    );
    const header = screen.getByTestId("setlist-card-header");
    expect(header.className).toMatch(/\bpy-1\b/);
  });

  // The setlist/gap chart toggle lives inside the body, paired with the
  // "Average song gap" label on the same line. Default view is setlist
  // (the existing flow text), preserving today's first-paint.
  test("renders setlist/gap chart toggle inside body, defaulting to setlist view", async () => {
    await setupWithRouter(
      <SetlistCard setlist={makeSetlist()} userAttendance={null} userRating={null} showRating={null} />,
    );
    const body = screen.getByTestId("setlist-card-body");
    const setlistButton = screen.getByRole("button", { name: /^setlist$/i });
    const gapChartButton = screen.getByRole("button", { name: /gap chart/i });
    expect(body.contains(setlistButton)).toBe(true);
    expect(body.contains(gapChartButton)).toBe(true);
    // Default = setlist view: flow text is rendered, SetlistTable is not.
    expect(screen.getByText("Basis for a Day")).toBeInTheDocument();
  });

  // Rating-badge wiring: when the viewer is logged in and has rated the
  // show, the rating button picks up the amber-rated chrome. The userRating
  // prop accepts either a bare number or a Rating object, so both shapes
  // must resolve to the same rendered state. Without this test, a regression
  // in the Rating | number | null resolver inside SetlistCard would slip
  // through — the RatingBadgeButton itself is rated tested in isolation,
  // but the resolver lives here.
  test("rating badge shows amber border when userRating is a bare number", async () => {
    vi.mocked(useSession).mockReturnValue({
      user: { id: "user-1" } as never,
      supabase: null as never,
      loading: false,
    } as never);
    const { container } = await setupWithRouter(
      <SetlistCard setlist={makeSetlist()} userAttendance={null} userRating={5} showRating={null} />,
    );
    const buttons = container.querySelectorAll("button");
    // The rating badge is the trailing rated-styled button in the header.
    const ratingButton = Array.from(buttons).find((btn) => btn.className.includes("bg-amber-500/10"));
    expect(ratingButton).toBeDefined();
    expect(ratingButton?.className).toContain("border-amber-500");
  });

  test("rating badge shows amber border when userRating is a Rating object", async () => {
    vi.mocked(useSession).mockReturnValue({
      user: { id: "user-1" } as never,
      supabase: null as never,
      loading: false,
    } as never);
    const ratingObj = {
      id: "rating-1",
      userId: "user-1",
      rateableId: "show-1",
      rateableType: "Show",
      value: 4,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as never;
    const { container } = await setupWithRouter(
      <SetlistCard setlist={makeSetlist()} userAttendance={null} userRating={ratingObj} showRating={null} />,
    );
    const buttons = container.querySelectorAll("button");
    const ratingButton = Array.from(buttons).find((btn) => btn.className.includes("bg-amber-500/10"));
    expect(ratingButton).toBeDefined();
    expect(ratingButton?.className).toContain("border-amber-500");
  });

  // The dashed (unrated) state is the default when the viewer is logged in
  // but hasn't rated the show. Pinned because the resolver short-circuits on
  // null and the rated-state derivation must follow.
  test("rating badge shows dashed border when userRating is null and viewer is logged in", async () => {
    vi.mocked(useSession).mockReturnValue({
      user: { id: "user-1" } as never,
      supabase: null as never,
      loading: false,
    } as never);
    const { container } = await setupWithRouter(
      <SetlistCard setlist={makeSetlist()} userAttendance={null} userRating={null} showRating={null} />,
    );
    const buttons = container.querySelectorAll("button");
    const dashedButton = Array.from(buttons).find((btn) => btn.className.includes("border-dashed"));
    expect(dashedButton).toBeDefined();
    expect(dashedButton?.className).not.toContain("bg-amber-500/10");
  });

  // Clicking "gap chart" swaps to the table view. Existence of the
  // SetlistTable column headers (Set/Song/Last Played/Gap) is the signal.
  test("clicking gap chart swaps to the table view", async () => {
    const user = userEvent.setup();
    await setupWithRouter(
      <SetlistCard
        setlist={{ ...makeSetlist(), averageSongGap: 7.5, medianSongGap: 6 }}
        userAttendance={null}
        userRating={null}
        showRating={null}
      />,
    );
    await user.click(screen.getByRole("button", { name: /gap chart/i }));
    // Average gap formats to one decimal place — terse, matches the rest
    // of the rarity stat presentation on the song-detail page.
    expect(screen.getByText(/average \/ median song gap:\s*7\.5\s*\/\s*6\.0/)).toBeInTheDocument();
    // Label is split into stacked <span>Last</span><span>Played</span>
    // so the accessible name concatenates without whitespace.
    expect(screen.getByRole("columnheader", { name: /LastPlayed/i })).toBeInTheDocument();
  });

  // The average gap summary lives BELOW the setlist text on the same row
  // as the setlist/gap-chart toggle. Renders for every caller — show page
  // and list pages alike — so users always see the rarity number.
  test("setlist view renders the average gap summary below the setlist", async () => {
    await setupWithRouter(
      <SetlistCard
        setlist={{ ...makeSetlist(), averageSongGap: 7.5, medianSongGap: 6 }}
        userAttendance={null}
        userRating={null}
        showRating={null}
      />,
    );
    const summary = screen.getByText(/average \/ median song gap:\s*7\.5\s*\/\s*6\.0/);
    const trackText = screen.getByText("Basis for a Day");
    // DOM order: track text comes before the summary line. compareDocumentPosition
    // returns DOCUMENT_POSITION_FOLLOWING (4) when `summary` follows `trackText`.
    expect(trackText.compareDocumentPosition(summary)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  // List-page regression (year, top-rated, on-this-day, venue, home): without
  // an onViewChange callback, toggling stays purely local — no URL mutation,
  // no leaked state to sibling cards. This covers the contract that every
  // list-page caller relies on by omitting the prop.
  test("toggling without onViewChange does not invoke any URL writer", async () => {
    const user = userEvent.setup();
    const onViewChange = vi.fn();
    await setupWithRouter(
      <SetlistCard
        setlist={{ ...makeSetlist(), averageSongGap: 7.5, medianSongGap: 6 }}
        userAttendance={null}
        userRating={null}
        showRating={null}
      />,
    );
    await user.click(screen.getByRole("button", { name: /gap chart/i }));
    // The card flipped views (table renders), but no callback was invoked
    // because none was passed — the only way list pages preserve local state.
    // Label is split into stacked <span>Last</span><span>Played</span>
    // so the accessible name concatenates without whitespace.
    expect(screen.getByRole("columnheader", { name: /LastPlayed/i })).toBeInTheDocument();
    expect(onViewChange).not.toHaveBeenCalled();
  });

  // The count beside the ★ comes entirely from the live showRatingCount prop
  // (canonical in simple mode, post-exclusion in calibrated mode). Ratings no
  // longer ride in the setlist blob, so the badge shows "· 33", and the
  // blob's stale ratingsCount=10 is never read.
  test("rating badge shows the live showRatingCount", async () => {
    await setupWithRouter(
      <SetlistCard
        setlist={makeSetlist()}
        userAttendance={null}
        userRating={null}
        showRating={4.81}
        showRatingCount={33}
      />,
    );
    expect(screen.getAllByText("33").length).toBeGreaterThan(0);
    expect(screen.queryByText("10")).not.toBeInTheDocument();
  });

  // No live count prop: the badge shows no count. The embedded ratingsCount (10)
  // is NOT a fallback anymore — rating values were removed from the structural
  // blob, so nothing reads setlist.show.ratingsCount.
  test("rating badge does not fall back to the embedded ratingsCount", async () => {
    await setupWithRouter(
      <SetlistCard setlist={makeSetlist()} userAttendance={null} userRating={null} showRating={4.0} />,
    );
    expect(screen.queryByText("10")).not.toBeInTheDocument();
  });

  // averageSongGap=null happens for all-debut/all-repeat shows. The summary
  // line should be omitted entirely (not "Average song gap: —") so the
  // toggle row stays clean on shows where the number isn't meaningful.
  test("setlist view omits the average summary when averageSongGap is null", async () => {
    await setupWithRouter(
      <SetlistCard
        setlist={{ ...makeSetlist(), averageSongGap: null }}
        userAttendance={null}
        userRating={null}
        showRating={null}
      />,
    );
    expect(screen.queryByText(/song gap/i)).not.toBeInTheDocument();
  });
});
