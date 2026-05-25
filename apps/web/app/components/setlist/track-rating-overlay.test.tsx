import { setup } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

// Stub the session hook so the overlay can render without a data router.
vi.mock("~/hooks/use-session", () => ({
  useSession: () => ({ user: null, supabase: null }),
}));

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
