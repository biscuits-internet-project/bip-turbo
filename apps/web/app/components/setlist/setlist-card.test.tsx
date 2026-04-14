import type { Annotation, Attendance, Rating, SetlistLight, Show, TrackLight, Venue } from "@bip/domain";
import { mockShallowComponent, setupWithRouter } from "@test/test-utils";
import { screen, within } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { useSession } from "~/hooks/use-session";
import { SetlistCard } from "./setlist-card";

// Mock hooks used internally by SetlistCard.
vi.mock("~/hooks/use-session", () => ({
  useSession: vi.fn(() => ({ user: null, supabase: null, loading: false })),
}));
vi.mock("~/hooks/use-show-user-data", () => ({
  useAttendanceMutation: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
}));

// Stub heavy child components to keep the test focused on the card's own rendering.
vi.mock("~/components/rating", () => ({
  RatingComponent: (props: object) => mockShallowComponent("RatingComponent", props),
}));
vi.mock("~/components/ui/star-rating", () => ({
  StarRating: (props: object) => mockShallowComponent("StarRating", props),
}));
vi.mock("~/components/ui/login-prompt-popover", () => ({
  LoginPromptPopover: ({ children }: { children: React.ReactNode }) => <div data-testid="login-prompt">{children}</div>,
}));
vi.mock("./track-rating-overlay", () => ({
  TrackRatingOverlay: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

function makeVenue(overrides: Partial<Venue> = {}): Venue {
  return {
    id: "venue-1",
    name: "Ogden Theater",
    slug: "ogden-theater",
    city: "Denver",
    state: "CO",
    country: "US",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    timesPlayed: 5,
    ...overrides,
  };
}

function makeShow(overrides: Partial<Show> = {}): Show {
  return {
    id: "show-1",
    slug: "2019-05-24-ogden-theater-denver-co",
    date: "2019-05-24",
    venueId: "venue-1",
    bandId: "band-1",
    notes: null,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    likesCount: 0,
    relistenUrl: null,
    averageRating: 0,
    ratingsCount: 0,
    userRating: null,
    showPhotosCount: 0,
    showYoutubesCount: 0,
    reviewsCount: 0,
    tracks: null,
    venue: undefined,
    ...overrides,
  };
}

function makeTrack(overrides: Partial<TrackLight> = {}): TrackLight {
  return {
    id: "track-1",
    showId: "show-1",
    songId: "song-1",
    set: "Set 1",
    position: 1,
    segue: null,
    likesCount: 0,
    note: null,
    allTimer: false,
    averageRating: 0,
    ratingsCount: 0,
    song: { id: "song-1", title: "Basis For A Day", slug: "basis-for-a-day" },
    ...overrides,
  };
}

function makeAttendance(overrides: Partial<Attendance> = {}): Attendance {
  return {
    id: "att-1",
    userId: "user-1",
    showId: "show-1",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    ...overrides,
  };
}

function makeSetlistLight(overrides: Partial<SetlistLight> = {}): SetlistLight {
  return {
    show: makeShow(),
    venue: makeVenue(),
    sets: [],
    annotations: [] as Annotation[],
    ...overrides,
  };
}

function renderCard(
  overrides: {
    setlist?: Partial<SetlistLight>;
    userAttendance?: Attendance | null;
    userRating?: Rating | number | null;
    showRating?: number | null;
  } = {},
) {
  const setlist = makeSetlistLight(overrides.setlist);
  return setupWithRouter(
    <SetlistCard
      setlist={setlist}
      userAttendance={overrides.userAttendance ?? null}
      userRating={overrides.userRating ?? null}
      showRating={overrides.showRating ?? null}
    />,
  );
}

function setLoggedIn() {
  vi.mocked(useSession).mockReturnValue({
    user: { id: "user-1", email: "test@test.com" },
    supabase: null,
    loading: false,
  } as ReturnType<typeof useSession>);
}

function setLoggedOut() {
  vi.mocked(useSession).mockReturnValue({
    user: null,
    supabase: null,
    loading: false,
  } as ReturnType<typeof useSession>);
}

describe("SetlistCard", () => {
  describe("header links", () => {
    // Show date is formatted as M/D/YYYY and links to /shows/{show.slug}
    test("show date links to /shows/{show.slug}", async () => {
      await renderCard({
        setlist: { show: makeShow({ slug: "2019-05-24-ogden-theater-denver-co", date: "2019-05-24" }) },
      });

      const link = screen.getByRole("link", { name: "5/24/2019" });
      expect(link).toHaveAttribute("href", "/shows/2019-05-24-ogden-theater-denver-co");
    });

    // Venue text links to /venues/{venue.slug}
    test("venue name links to /venues/{venue.slug}", async () => {
      await renderCard({
        setlist: {
          venue: makeVenue({ slug: "ogden-theater", name: "Ogden Theater", city: "Denver", state: "CO" }),
        },
      });

      const link = screen.getByRole("link", { name: /Ogden Theater - Denver, CO/ });
      expect(link).toHaveAttribute("href", "/venues/ogden-theater");
    });
  });

  describe("show notes", () => {
    // Show notes render as HTML when present
    test("renders show notes when present", async () => {
      await renderCard({
        setlist: { show: makeShow({ notes: "<em>Debut performance</em>" }) },
      });

      const notesElement = screen.getByText("Debut performance");
      expect(notesElement.closest("em")).toBeInTheDocument();
    });

    // No notes section when notes is null
    test("does not render notes section when notes is null", async () => {
      await renderCard({
        setlist: { show: makeShow({ notes: null }) },
      });

      expect(screen.queryByText("Debut performance")).not.toBeInTheDocument();
    });
  });

  describe("sets and tracks", () => {
    // Set labels and song titles render with links to /songs/{song.slug}
    test("renders set labels and song title links", async () => {
      await renderCard({
        setlist: {
          sets: [
            {
              label: "Set 1",
              sort: 1,
              tracks: [
                makeTrack({ id: "t1", song: { id: "s1", title: "Basis For A Day", slug: "basis-for-a-day" } }),
                makeTrack({ id: "t2", song: { id: "s2", title: "Helicopters", slug: "helicopters" } }),
              ],
            },
          ],
        },
      });

      expect(screen.getByText("Set 1")).toBeInTheDocument();

      const basisLink = screen.getByRole("link", { name: "Basis For A Day" });
      expect(basisLink).toHaveAttribute("href", "/songs/basis-for-a-day");

      const helicoptersLink = screen.getByRole("link", { name: "Helicopters" });
      expect(helicoptersLink).toHaveAttribute("href", "/songs/helicopters");
    });

    // Tracks separated by segue show " > " instead of ", "
    test("shows segue arrow between tracks when segue is set", async () => {
      await renderCard({
        setlist: {
          sets: [
            {
              label: "Set 1",
              sort: 1,
              tracks: [
                makeTrack({
                  id: "t1",
                  segue: ">",
                  song: { id: "s1", title: "Above The Waves", slug: "above-the-waves" },
                }),
                makeTrack({
                  id: "t2",
                  song: { id: "s2", title: "Shelby Rose", slug: "shelby-rose" },
                }),
              ],
            },
          ],
        },
      });

      expect(screen.getByText(">")).toBeInTheDocument();
    });

    // Non-segue tracks are separated by commas
    test("shows comma between tracks when no segue", async () => {
      await renderCard({
        setlist: {
          sets: [
            {
              label: "Set 1",
              sort: 1,
              tracks: [
                makeTrack({ id: "t1", segue: null, song: { id: "s1", title: "Basis For A Day", slug: "basis-for-a-day" } }),
                makeTrack({ id: "t2", song: { id: "s2", title: "Helicopters", slug: "helicopters" } }),
              ],
            },
          ],
        },
      });

      expect(screen.getByText(",")).toBeInTheDocument();
    });

    // All-timer tracks get a flame icon
    test("renders flame icon for all-timer tracks", async () => {
      const { container } = await renderCard({
        setlist: {
          sets: [
            {
              label: "Set 1",
              sort: 1,
              tracks: [makeTrack({ allTimer: true, song: { id: "s1", title: "Abraxas", slug: "abraxas" } })],
            },
          ],
        },
      });

      // Flame icon is rendered as an SVG by lucide-react
      const flameSvg = container.querySelector("svg.lucide-flame");
      expect(flameSvg).toBeInTheDocument();
    });
  });

  describe("annotations", () => {
    // Annotations render with superscript indices in the footer
    test("renders unique annotations with superscript indices", async () => {
      const track1 = makeTrack({ id: "t1", song: { id: "s1", title: "Basis For A Day", slug: "basis-for-a-day" } });
      const track2 = makeTrack({ id: "t2", song: { id: "s2", title: "Helicopters", slug: "helicopters" } });

      await renderCard({
        setlist: {
          sets: [{ label: "Set 1", sort: 1, tracks: [track1, track2] }],
          annotations: [
            { id: "a1", trackId: "t1", desc: "With horns", createdAt: new Date(), updatedAt: new Date() },
            { id: "a2", trackId: "t2", desc: "Acoustic", createdAt: new Date(), updatedAt: new Date() },
          ],
        },
      });

      expect(screen.getByText("With horns")).toBeInTheDocument();
      expect(screen.getByText("Acoustic")).toBeInTheDocument();
    });

    // Duplicate annotation descriptions share the same superscript index
    test("deduplicates annotations with the same description", async () => {
      const track1 = makeTrack({ id: "t1", song: { id: "s1", title: "Basis For A Day", slug: "basis-for-a-day" } });
      const track2 = makeTrack({ id: "t2", song: { id: "s2", title: "Helicopters", slug: "helicopters" } });

      await renderCard({
        setlist: {
          sets: [{ label: "Set 1", sort: 1, tracks: [track1, track2] }],
          annotations: [
            { id: "a1", trackId: "t1", desc: "With horns", createdAt: new Date(), updatedAt: new Date() },
            { id: "a2", trackId: "t2", desc: "With horns", createdAt: new Date(), updatedAt: new Date() },
          ],
        },
      });

      // "With horns" should appear exactly once in the footer (deduplicated)
      const footerAnnotations = screen.getAllByText("With horns");
      expect(footerAnnotations).toHaveLength(1);
    });
  });

  describe("photos link", () => {
    // Camera icon and count link to the show's photos section when photos exist
    test("renders photos link when showPhotosCount > 0", async () => {
      await renderCard({
        setlist: { show: makeShow({ showPhotosCount: 7, slug: "2019-05-24-ogden-theater-denver-co" }) },
      });

      const photosLink = screen.getByRole("link", { name: "7" });
      expect(photosLink).toHaveAttribute("href", "/shows/2019-05-24-ogden-theater-denver-co#photos");
    });

    // No photos link when count is 0
    test("does not render photos link when showPhotosCount is 0", async () => {
      await renderCard({
        setlist: { show: makeShow({ showPhotosCount: 0 }) },
      });

      // No link with a number should be rendered for photos
      expect(screen.queryByRole("link", { name: "7" })).not.toBeInTheDocument();
    });
  });

  describe("authenticated user controls", () => {
    // Logged-in users see attendance ("Saw it?") and rating buttons
    test("shows attendance and rating buttons when logged in", async () => {
      setLoggedIn();

      await renderCard();

      expect(screen.getByText("Saw it?")).toBeInTheDocument();
    });

    // Attendance button shows "Saw it" when user has attendance record
    test("shows 'Saw it' when user has attendance", async () => {
      setLoggedIn();

      await renderCard({ userAttendance: makeAttendance() });

      expect(screen.getByText("Saw it")).toBeInTheDocument();
      expect(screen.queryByText("Saw it?")).not.toBeInTheDocument();
    });

    // Rating component receives the show's average rating and count
    test("passes rating data to RatingComponent", async () => {
      setLoggedIn();

      await renderCard({
        setlist: { show: makeShow({ averageRating: 4.2, ratingsCount: 15 }) },
        showRating: 4.2,
      });

      const ratingStub = screen.getAllByTestId("RatingComponent")[0];
      expect(within(ratingStub).getByText(/"rating":4.2/)).toBeInTheDocument();
      expect(within(ratingStub).getByText(/"ratingsCount":15/)).toBeInTheDocument();
    });
  });

  describe("unauthenticated user", () => {
    // Logged-out users see the rating inside a login prompt wrapper, not the attendance button
    test("does not show attendance button when logged out", async () => {
      setLoggedOut();

      await renderCard();

      expect(screen.queryByText("Saw it?")).not.toBeInTheDocument();
      expect(screen.queryByText("Saw it")).not.toBeInTheDocument();
    });

    // Rating is still visible but wrapped in a login prompt
    test("shows rating inside login prompt popover", async () => {
      setLoggedOut();

      await renderCard({
        setlist: { show: makeShow({ averageRating: 3.5, ratingsCount: 10 }) },
        showRating: 3.5,
      });

      const loginPrompt = screen.getByTestId("login-prompt");
      expect(loginPrompt).toBeInTheDocument();
      const ratingStub = within(loginPrompt).getByTestId("RatingComponent");
      expect(ratingStub).toBeInTheDocument();
    });
  });
});
