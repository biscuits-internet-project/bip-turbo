import type { SetlistLight } from "@bip/domain";
import { expectMockedShallowComponent, mockShallowComponent, setupWithRouter } from "@test/test-utils";
import { screen } from "@testing-library/react";
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
      <SetlistCard setlist={makeSetlist({ showDate: "2016-04-14" })} userAttendance={null} userRating={null} showRating={null} />,
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
});
