import { setup } from "@test/test-utils";
import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

// TrackRatingOverlay (used internally when a note exists) calls
// useSession → useRouteLoaderData("root"); the test harness doesn't
// run inside a data router, so stub the hook to return a logged-out
// session.
vi.mock("~/hooks/use-session", () => ({
  useSession: () => ({ user: null, supabase: null }),
}));

import { isNoteworthy, NoteworthyMarker } from "./noteworthy-marker";

describe("isNoteworthy", () => {
  // A track with neither an all-timer flag nor a note has nothing to
  // surface — every UI surface should treat it as a plain track.
  test("returns false when both flags are absent", () => {
    expect(isNoteworthy({ allTimer: false, note: null })).toBe(false);
    expect(isNoteworthy({})).toBe(false);
  });

  // The all-timer flag alone qualifies a track as noteworthy — the
  // orange flame stands on its own without a note.
  test("returns true for all-timer-only tracks", () => {
    expect(isNoteworthy({ allTimer: true })).toBe(true);
    expect(isNoteworthy({ allTimer: true, note: null })).toBe(true);
  });

  // Empty-string and whitespace-only notes are how the data layer
  // historically records "no note", so they must not pass the gate —
  // matches the server's `tracks.note <> ''` SQL filter.
  test("treats blank-string notes as absent", () => {
    expect(isNoteworthy({ allTimer: false, note: "" })).toBe(false);
    expect(isNoteworthy({ allTimer: false, note: "   " })).toBe(false);
  });

  // A non-empty curated note qualifies a track as noteworthy even
  // when it's not an all-timer — drives the off-white "Jam Chart"
  // flame variant.
  test("returns true when note is present", () => {
    expect(isNoteworthy({ allTimer: false, note: "Massive Spaga jam." })).toBe(true);
  });

  // SongPagePerformance carries the same data under `notes` (plural).
  // The predicate accepts both shapes so cross-song surfaces don't have
  // to adapt before calling.
  test("accepts the SongPagePerformance shape with `notes` (plural)", () => {
    expect(isNoteworthy({ allTimer: false, notes: "Type II exploration." })).toBe(true);
    expect(isNoteworthy({ allTimer: false, notes: "" })).toBe(false);
    expect(isNoteworthy({ allTimer: true, notes: null })).toBe(true);
  });
});

describe("NoteworthyMarker", () => {
  // Non-noteworthy tracks render nothing — callers don't need to gate
  // on the flag pair before dropping the marker into a row.
  test("renders nothing when track is neither all-timer nor noted", () => {
    const { container } = render(<NoteworthyMarker track={{ id: "t1", allTimer: false, note: null }} />);
    expect(container).toBeEmptyDOMElement();
  });

  // All-timer without a note: bare flame (no click target). There's
  // no popover-worthy content for this case.
  test("renders the bare flame for all-timer without a note", async () => {
    const { user } = await setup(<NoteworthyMarker track={{ id: "t1", allTimer: true, note: null }} />);
    const flame = screen.getByLabelText("All-timer");
    expect(flame).toBeInTheDocument();
    // Clicking does not open a popover: there's no dialog/popover element
    // because there's nothing to surface.
    await user.click(flame);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  // When the track carries a note, clicking the flame opens the
  // shared TrackRatingOverlay (rating-suppressed variant) so the note
  // is reachable on touch devices too.
  test("clicking the flame on a noted track opens a popover with the note text", async () => {
    const NOTE = "Bombshell into Crickets is the rare full-band reprise.";
    const { user } = await setup(
      <NoteworthyMarker track={{ id: "t1", allTimer: false, note: NOTE, song: { title: "Bombshell" } }} />,
    );
    expect(screen.queryByText(NOTE)).not.toBeInTheDocument();
    await user.click(screen.getByLabelText("Jam chart"));
    expect(await screen.findByText(NOTE)).toBeInTheDocument();
  });
});
