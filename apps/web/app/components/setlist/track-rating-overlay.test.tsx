import { setup } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";

// Stub the session hook so the overlay can render without a data router.
vi.mock("~/hooks/use-session", () => ({
  useSession: () => ({ user: null, supabase: null }),
}));

// Recharts ResponsiveContainer needs ResizeObserver (absent in jsdom); stub
// it so the histogram mounts when the overlay renders it.
vi.mock("recharts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("recharts")>();
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div style={{ width: 600, height: 240 }}>{children}</div>
    ),
  };
});

import { TrackRatingOverlay, type TrackRatingOverlayTrack } from "./track-rating-overlay";

function makeTrack(overrides: Partial<TrackRatingOverlayTrack> = {}): TrackRatingOverlayTrack {
  return {
    id: "track-1",
    allTimer: false,
    note: null,
    song: { title: "Aceetobee" },
    averageRating: 4.5,
    ratingsCount: 10,
    likesCount: 0,
    ...overrides,
  };
}

describe('TrackRatingOverlay trigger="click"', () => {
  // The click variant uses Radix Popover so taps on touch devices
  // surface the overlay — the hover-only variant is invisible on
  // mobile. Verifies the trigger primitive is wired up to clicks.
  test("opens the overlay on click and shows the note text", async () => {
    const NOTE = "Type II Spaga, near 20 minutes.";
    const { user } = await setup(
      <TrackRatingOverlay track={makeTrack({ note: NOTE })} showRating={false} trigger="click">
        <button type="button">flame</button>
      </TrackRatingOverlay>,
    );

    expect(screen.queryByText(NOTE)).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "flame" }));
    expect(await screen.findByText(NOTE)).toBeInTheDocument();
  });

  // `showRating={false}` is the variant used wherever the surrounding
  // table already has a Rating column. The overlay should hide the
  // rating UI even though the track carries averageRating data.
  test("suppresses the rating display when showRating is false", async () => {
    const { user } = await setup(
      <TrackRatingOverlay
        track={makeTrack({ note: "Big jam.", averageRating: 4.75, ratingsCount: 12 })}
        showRating={false}
        trigger="click"
      >
        <button type="button">flame</button>
      </TrackRatingOverlay>,
    );
    await user.click(screen.getByRole("button", { name: "flame" }));
    // Note still surfaces…
    expect(await screen.findByText("Big jam.")).toBeInTheDocument();
    // …but the rating number does not.
    expect(screen.queryByText("4.75")).not.toBeInTheDocument();
  });
});

describe("TrackRatingOverlay histogram", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  // Opening the overlay fetches fresh track data; when that response carries
  // a rating distribution, the mini histogram renders in the panel.
  test("renders the histogram from the fetched distribution", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          track: {
            id: "track-1",
            songTitle: "Aceetobee",
            averageRating: 4.5,
            ratingsCount: 4,
            likesCount: 0,
            note: null,
          },
          userRating: null,
          distribution: [
            { value: 5, count: 3 },
            { value: 4, count: 1 },
          ],
        }),
      }),
    );

    const { user } = await setup(
      <TrackRatingOverlay track={makeTrack({ ratingsCount: 4 })} trigger="click">
        <button type="button">title</button>
      </TrackRatingOverlay>,
    );

    await user.click(screen.getByRole("button", { name: "title" }));
    expect(await screen.findByText("Rating distribution")).toBeInTheDocument();
    expect(screen.getByText("4 ratings")).toBeInTheDocument();
  });
});

describe("TrackRatingOverlay trigger default", () => {
  // The default trigger is hover (Radix HoverCard). A click on the
  // trigger should NOT open it — only hover does. Locks in the
  // distinction so a regression won't silently turn every call site
  // into click-only behavior on mobile.
  test("does not open on click in hover mode", async () => {
    const NOTE = "Should not appear on click.";
    const { user } = await setup(
      <TrackRatingOverlay track={makeTrack({ note: NOTE })}>
        <button type="button">row</button>
      </TrackRatingOverlay>,
    );
    await user.click(screen.getByRole("button", { name: "row" }));
    expect(screen.queryByText(NOTE)).not.toBeInTheDocument();
  });
});
