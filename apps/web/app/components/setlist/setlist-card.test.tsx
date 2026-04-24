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
            song: { id: "song-1", title: "Basis for a Day", slug: "basis-for-a-day" },
          },
        ],
      },
    ],
    annotations: [],
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

  // Regression guard: callers that don't opt into collapsible (year route, etc.)
  // still see the full body on first paint — the new mode must not change the
  // default.
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

    const dateLink = screen.getByRole("link", { name: "4/14/2021" });
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
});
