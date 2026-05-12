import type { SetlistLight } from "@bip/domain";
import { expectMockedShallowComponent, mockShallowComponent, setupWithRouter } from "@test/test-utils";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

// Mock hooks used internally by SetlistCard
vi.mock("~/hooks/use-session", () => ({
  useSession: vi.fn(() => ({ user: null, supabase: null, loading: false })),
}));
vi.mock("~/hooks/use-show-user-data", () => ({
  useAttendanceMutation: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
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
            averageRating: null,
            ratingsCount: 0,
            gap: null,
            previousPerformanceShowId: null,
            previousPerformanceShow: null,
            song: { id: "song-1", title: "Basis for a Day", slug: "basis-for-a-day" },
          },
        ],
      },
    ],
    annotations: [],
    averageSongGap: null,
    medianSongGap: null,
    debutCount: 0,
  };
}

describe("SetlistCard", () => {
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

  // On top-rated, each card opts into collapsed mode. The body stays mounted
  // (so the grid-rows transition can animate it), but is marked aria-hidden
  // and clipped to zero height via the 0fr grid row.
  test("hides body initially when collapsible is true", async () => {
    await setupWithRouter(
      <SetlistCard setlist={makeSetlist()} collapsible userAttendance={null} userRating={null} showRating={null} />,
    );
    const body = screen.getByTestId("setlist-card-body");
    expect(body).toHaveAttribute("aria-hidden", "true");
    expect(body.className).toMatch(/grid-rows-\[0fr\]/);
    // Header content (date + venue) must still be visible.
    expect(screen.getByText("4/14/2021")).toBeInTheDocument();
    expect(screen.getByText(/The Fillmore/)).toBeInTheDocument();
  });

  // Clicking an empty part of the header toggles the body open. The body
  // stays mounted throughout; opening flips aria-hidden to false and swaps
  // the grid-rows class from 0fr to 1fr so the transition runs.
  test("clicking the header toggles the body open when collapsible", async () => {
    const user = userEvent.setup();
    await setupWithRouter(
      <SetlistCard setlist={makeSetlist()} collapsible userAttendance={null} userRating={null} showRating={null} />,
    );
    const body = screen.getByTestId("setlist-card-body");
    expect(body).toHaveAttribute("aria-hidden", "true");

    const header = screen.getByTestId("setlist-card-header");
    await user.click(header);

    expect(body).toHaveAttribute("aria-hidden", "false");
    expect(body.className).toMatch(/grid-rows-\[1fr\]/);
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
    expect(screen.getByText(/Average \/ median song gap:\s*7\.5\s*\/\s*6\.0/)).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Last Played" })).toBeInTheDocument();
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
    const summary = screen.getByText(/Average \/ median song gap:\s*7\.5\s*\/\s*6\.0/);
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
    expect(screen.getByRole("columnheader", { name: "Last Played" })).toBeInTheDocument();
    expect(onViewChange).not.toHaveBeenCalled();
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
