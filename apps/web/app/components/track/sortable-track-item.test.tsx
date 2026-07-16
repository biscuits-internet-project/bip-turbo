import type { Track } from "@bip/domain";
import { setup } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

// useSortable from @dnd-kit/sortable expects a SortableContext provider in
// the tree. The tests don't exercise drag-and-drop behavior (that belongs
// to TrackManager-level tests), so we stub the hook to return inert values
// and let SortableTrackItem mount in isolation.
vi.mock("@dnd-kit/sortable", () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: () => undefined,
    transform: null,
    transition: undefined,
    isDragging: false,
  }),
}));

import { SortableTrackItem } from "./sortable-track-item";

// Minimal Track factory — the row only reads a handful of fields, so the
// rest are stubbed with sensible defaults. Tests override what they care
// about.
function makeTrack(overrides: Partial<Track> = {}): Track {
  return {
    id: "track-1",
    showId: "show-1",
    songId: "song-1",
    set: "S1",
    position: 1,
    segue: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    likesCount: 0,
    slug: "story-of-the-world",
    note: null,
    allTimer: false,
    previousTrackId: null,
    nextTrackId: null,
    averageRating: 0,
    ratingsCount: 0,
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
    // Component only reads `song.title`; the rest of the Song shape is
    // irrelevant for these tests, so cast through `unknown` to avoid
    // tracking every field on the domain model.
    song: { id: "song-1", title: "Story of the World" } as unknown as Track["song"],
    annotations: [],
    ...overrides,
  };
}

describe("SortableTrackItem", () => {
  // Baseline render: a minimal track shows position number + song title and
  // none of the optional chrome (no flame, no segue, no note, no annotations).
  test("renders position and song title for a minimal track", async () => {
    await setup(<SortableTrackItem track={makeTrack()} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText("Story of the World")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  // Notes appear on their OWN line below the title (no parens). Earlier
  // versions wrapped notes in `(...)` and put them inline with the title;
  // the redesign moved them below to give long notes the full row width.
  // This test guards against either regression.
  test("renders the note on its own line below the title without parens", async () => {
    await setup(
      <SortableTrackItem
        track={makeTrack({ note: "The jam emerges as minimal trance" })}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    const noteEl = screen.getByText("The jam emerges as minimal trance");
    expect(noteEl).toBeInTheDocument();
    expect(noteEl.tagName).toBe("P"); // own paragraph element, not inline span in title row
    // No parens anywhere in the note text. Catches a future "wrap in (…)"
    // change that would silently regress the display.
    expect(screen.queryByText(/^\(.+\)$/)).not.toBeInTheDocument();
  });

  // When the track has no note, the note row is omitted entirely (not
  // rendered as an empty <p>). Keeps the row compact for tracks without
  // commentary.
  test("does not render the note row when note is null", async () => {
    const { container } = await setup(
      <SortableTrackItem track={makeTrack({ note: null })} onEdit={vi.fn()} onDelete={vi.fn()} />,
    );

    // The note paragraph would have italic styling. No <p> with italic class.
    expect(container.querySelector("p.italic")).toBeNull();
  });

  // All-timer flame icon renders inline next to the song title (not in a
  // dedicated leading column). This was the mobile-fit change — the
  // reserved column ate horizontal space and forced song titles to wrap.
  test("renders the all-timer flame icon inline when allTimer is true", async () => {
    const { container } = await setup(
      <SortableTrackItem track={makeTrack({ allTimer: true })} onEdit={vi.fn()} onDelete={vi.fn()} />,
    );

    const flames = container.querySelectorAll("svg.text-flame-all-timer");
    expect(flames.length).toBeGreaterThanOrEqual(1);
  });

  test("does not render the flame icon when allTimer is false", async () => {
    const { container } = await setup(
      <SortableTrackItem track={makeTrack({ allTimer: false })} onEdit={vi.fn()} onDelete={vi.fn()} />,
    );

    expect(container.querySelector("svg.text-flame-all-timer")).toBeNull();
  });

  // Segue marker (">") renders inline next to the title when present.
  test("renders the segue marker when track.segue is set", async () => {
    await setup(<SortableTrackItem track={makeTrack({ segue: ">" })} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText(">")).toBeInTheDocument();
  });

  // Read-only footnotes (annotations, flags, performers, completions) come
  // pre-derived from the show-level engine and render below the note, each on
  // its own row so multi-line footnotes don't collapse together.
  test("renders each footnote as its own row when footnotes are passed", async () => {
    const { container } = await setup(
      <SortableTrackItem
        track={makeTrack()}
        footnotes={["inverted", "with Mike Greenfield on guitar"]}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText("inverted")).toBeInTheDocument();
    expect(screen.getByText("with Mike Greenfield on guitar")).toBeInTheDocument();
    expect(container.querySelectorAll("div.border-l-2").length).toBe(2);
  });

  // No footnotes (empty or omitted) renders no footnote rows — keeps rows for
  // tracks with no structured data compact.
  test("renders no footnote rows when footnotes is empty or omitted", async () => {
    const { container } = await setup(
      <SortableTrackItem track={makeTrack()} footnotes={[]} onEdit={vi.fn()} onDelete={vi.fn()} />,
    );

    expect(container.querySelector("div.border-l-2")).toBeNull();
  });

  // Edit button fires onEdit with the full track so the parent can hydrate
  // an edit form without a re-fetch.
  test("clicking the edit button fires onEdit with the track", async () => {
    const onEdit = vi.fn();
    const track = makeTrack();
    const { user, container } = await setup(<SortableTrackItem track={track} onEdit={onEdit} onDelete={vi.fn()} />);

    const editButton = container.querySelector('button[class*="border-gray-600"]');
    if (!editButton) throw new Error("edit button not found");
    await user.click(editButton);

    expect(onEdit).toHaveBeenCalledWith(track);
  });

  // Delete button fires onDelete with the track id (not the full track) so
  // the parent only needs the id for its DELETE request.
  test("clicking the delete button fires onDelete with the track id", async () => {
    const onDelete = vi.fn();
    const { user, container } = await setup(
      <SortableTrackItem track={makeTrack({ id: "track-xyz" })} onEdit={vi.fn()} onDelete={onDelete} />,
    );

    const deleteButton = container.querySelector('button[class*="border-red-600"]');
    if (!deleteButton) throw new Error("delete button not found");
    await user.click(deleteButton);

    expect(onDelete).toHaveBeenCalledWith("track-xyz");
  });

  // Delete button disables while isDeleting=true so a slow API can't be
  // triggered twice by a frustrated double-click.
  test("delete button is disabled when isDeleting is true", async () => {
    const { container } = await setup(
      <SortableTrackItem track={makeTrack()} onEdit={vi.fn()} onDelete={vi.fn()} isDeleting />,
    );

    const deleteButton = container.querySelector('button[class*="border-red-600"]');
    expect(deleteButton).toBeDisabled();
  });
});
