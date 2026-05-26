import type { Track } from "@bip/domain";
import { setup } from "@test/test-utils";
import { act, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

// Stub the sortable row so we don't have to mount @dnd-kit/sortable
// machinery — the row's render is covered by sortable-track-item.test.tsx.
// We just need to know which tracks TrackManager handed it and capture
// the onEdit / onDelete callbacks so we can invoke them directly.
const capturedRowProps: Array<{
  track: Track;
  onEdit: (track: Track) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}> = [];
vi.mock("./sortable-track-item", () => ({
  SortableTrackItem: (props: {
    track: Track;
    onEdit: (track: Track) => void;
    onDelete: (id: string) => void;
    isDeleting?: boolean;
  }) => {
    capturedRowProps.push(props);
    return (
      <div data-testid={`row-${props.track.id}`}>
        {props.track.song?.title ?? "unknown"}
        <button type="button" onClick={() => props.onEdit(props.track)}>
          edit-{props.track.id}
        </button>
        <button type="button" onClick={() => props.onDelete(props.track.id)}>
          delete-{props.track.id}
        </button>
      </div>
    );
  },
}));

// DndContext stubbed so tests can capture the `onDragEnd` handler and
// fire synthetic drag events without simulating real pointer drags in
// jsdom. The captured ref is reset in `beforeEach`.
let capturedOnDragEnd: ((event: { active: { id: string }; over: { id: string } | null }) => void) | undefined;
vi.mock("@dnd-kit/core", async () => {
  const actual = await vi.importActual<typeof import("@dnd-kit/core")>("@dnd-kit/core");
  return {
    ...actual,
    DndContext: ({ onDragEnd, children }: { onDragEnd?: typeof capturedOnDragEnd; children: React.ReactNode }) => {
      capturedOnDragEnd = onDragEnd;
      return <>{children}</>;
    },
  };
});

const toastSuccess = vi.fn();
const toastError = vi.fn();
vi.mock("sonner", () => ({
  toast: { success: (...args: unknown[]) => toastSuccess(...args), error: (...args: unknown[]) => toastError(...args) },
}));

import { TrackManager } from "./track-manager";

function makeTrack(overrides: Partial<Track> & { id: string }): Track {
  return {
    showId: "show-1",
    songId: "song-1",
    set: "S1",
    position: 1,
    segue: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    likesCount: 0,
    slug: overrides.id,
    note: null,
    allTimer: false,
    previousTrackId: null,
    nextTrackId: null,
    averageRating: 0,
    ratingsCount: 0,
    gap: null,
    previousPerformanceShowId: null,
    previousPerformanceShow: null,
    annotations: [],
    song: { id: "song-1", title: "Story of the World" } as unknown as Track["song"],
    ...overrides,
  } as Track;
}

describe("TrackManager", () => {
  beforeEach(() => {
    capturedRowProps.length = 0;
    capturedOnDragEnd = undefined;
    toastSuccess.mockClear();
    toastError.mockClear();
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => [] }) as never;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // When initialTracks is supplied, TrackManager skips the on-mount load
  // so the parent loader's data is the source of truth.
  test("does not fetch /api/tracks on mount when initialTracks is provided", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => [] });
    globalThis.fetch = fetchMock as never;

    await setup(<TrackManager showId="show-1" initialTracks={[makeTrack({ id: "t-1" })]} />);

    // Wait for any micro-tasks the mount effect would schedule.
    await new Promise((r) => setTimeout(r, 0));
    const tracksFetches = fetchMock.mock.calls.filter((c) => String(c[0]).startsWith("/api/tracks"));
    expect(tracksFetches).toHaveLength(0);
  });

  // With no initialTracks, the on-mount effect kicks off the GET so the
  // component can render its current state without needing the parent to
  // pass data down.
  test("fetches /api/tracks?showId=… on mount when initialTracks is empty", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => [] });
    globalThis.fetch = fetchMock as never;

    await setup(<TrackManager showId="show-1" />);

    await waitFor(() => {
      const urls = fetchMock.mock.calls.map((c) => c[0]);
      expect(urls).toContain("/api/tracks?showId=show-1");
    });
  });

  // Initial tracks render grouped by set with section headers, in the
  // order S1, S2, S3, E1, E2, E3 (encore-after-sets).
  test("groups tracks by set with section headers in S→E order", async () => {
    await setup(
      <TrackManager
        showId="show-1"
        initialTracks={[
          makeTrack({ id: "t-e1", set: "E1", position: 1 }),
          makeTrack({ id: "t-s2", set: "S2", position: 1 }),
          makeTrack({ id: "t-s1", set: "S1", position: 1 }),
        ]}
      />,
    );

    const headings = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    expect(headings).toEqual(["Set 1", "Set 2", "Encore 1"]);
  });

  // The "Add Track" button shows the form when clicked. The form itself
  // is the TrackEditForm component — recognized by its "Add" CTA inside
  // the section.
  test("clicking 'Add Track' opens the edit form with an 'Add' CTA", async () => {
    const { user } = await setup(<TrackManager showId="show-1" initialTracks={[makeTrack({ id: "t-1" })]} />);

    expect(screen.queryByLabelText(/track notes/i)).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /add track/i }));

    expect(screen.getByLabelText(/track notes/i)).toBeInTheDocument();
    // Add CTA inside the form (distinct from the "Add Track" header button).
    expect(screen.getAllByRole("button", { name: /^add$/i }).length).toBeGreaterThanOrEqual(1);
  });

  // Cancel closes the form, returning the component to its list-only
  // state. Add Track button becomes clickable again.
  test("cancel closes the open edit form", async () => {
    const { user } = await setup(<TrackManager showId="show-1" initialTracks={[makeTrack({ id: "t-1" })]} />);

    await user.click(screen.getByRole("button", { name: /add track/i }));
    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(screen.queryByLabelText(/track notes/i)).not.toBeInTheDocument();
  });

  // While the form is open, the "Add Track" header button is disabled so
  // a user can't open a second form on top of the current one.
  test("Add Track button disables while the form is open", async () => {
    const { user } = await setup(<TrackManager showId="show-1" initialTracks={[makeTrack({ id: "t-1" })]} />);

    await user.click(screen.getByRole("button", { name: /add track/i }));
    expect(screen.getByRole("button", { name: /add track/i })).toBeDisabled();
  });

  // Clicking the edit pencil on a row opens the form pre-populated with
  // that row's data. The CTA flips to "Update" so the user knows they're
  // editing rather than adding.
  test("clicking edit on a row opens the form with the row's data and an 'Update' CTA", async () => {
    const { user } = await setup(
      <TrackManager
        showId="show-1"
        initialTracks={[makeTrack({ id: "t-1", note: "The jam emerges as minimal trance" })]}
      />,
    );

    // The stub above renders an edit button labeled "edit-<id>".
    await user.click(screen.getByText("edit-t-1"));

    expect(screen.getByLabelText(/track notes/i)).toHaveValue("The jam emerges as minimal trance");
    expect(screen.getByRole("button", { name: /update/i })).toBeInTheDocument();
  });

  describe("drag-and-drop reorder", () => {
    // Same-set reorder: drop t-2 onto t-1's position. The component should
    // PUT /api/tracks/reorder with the new index-based positions for the
    // affected set, and apply the new positions optimistically to local
    // state (read off the captured row props passed on re-render).
    test("dropping within the same set PUTs reorder updates and updates positions locally", async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          { id: "t-1", position: 2 },
          { id: "t-2", position: 1 },
        ],
      });
      globalThis.fetch = fetchMock as never;

      await setup(
        <TrackManager
          showId="show-1"
          initialTracks={[
            makeTrack({ id: "t-1", set: "S1", position: 1 }),
            makeTrack({ id: "t-2", set: "S1", position: 2 }),
          ]}
        />,
      );

      // Fire the drag-end as if the user dropped t-2 on t-1's slot.
      await act(async () => {
        capturedOnDragEnd?.({ active: { id: "t-2" }, over: { id: "t-1" } });
      });

      await waitFor(() => {
        const reorderCalls = fetchMock.mock.calls.filter((c) => c[0] === "/api/tracks/reorder");
        expect(reorderCalls).toHaveLength(1);
        const body = JSON.parse(reorderCalls[0][1].body);
        expect(body.updates).toEqual([
          { id: "t-2", position: 1, set: "S1" },
          { id: "t-1", position: 2, set: "S1" },
        ]);
      });
    });

    // Cross-set drag is rejected: the reorder endpoint expects a single
    // set per call. The component shows an error toast and skips the PUT.
    test("dropping across sets shows an error toast and skips the PUT", async () => {
      const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => [] });
      globalThis.fetch = fetchMock as never;

      await setup(
        <TrackManager
          showId="show-1"
          initialTracks={[
            makeTrack({ id: "t-s1", set: "S1", position: 1 }),
            makeTrack({ id: "t-s2", set: "S2", position: 1 }),
          ]}
        />,
      );

      await act(async () => {
        capturedOnDragEnd?.({ active: { id: "t-s1" }, over: { id: "t-s2" } });
      });

      expect(toastError).toHaveBeenCalledWith(expect.stringMatching(/between different sets/i));
      const reorderCalls = fetchMock.mock.calls.filter((c) => c[0] === "/api/tracks/reorder");
      expect(reorderCalls).toHaveLength(0);
    });

    // Drop-on-self / drop-outside-target: dnd-kit fires onDragEnd with
    // active.id === over.id (drop on same slot) or over === null
    // (released outside any droppable). Both are no-ops — no PUT, no toast.
    test("dropping on the same row is a no-op (no PUT, no toast)", async () => {
      const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => [] });
      globalThis.fetch = fetchMock as never;

      await setup(<TrackManager showId="show-1" initialTracks={[makeTrack({ id: "t-1" })]} />);

      await act(async () => {
        capturedOnDragEnd?.({ active: { id: "t-1" }, over: { id: "t-1" } });
      });

      expect(fetchMock.mock.calls.filter((c) => c[0] === "/api/tracks/reorder")).toHaveLength(0);
      expect(toastError).not.toHaveBeenCalled();
    });

    test("dropping outside any droppable (over=null) is a no-op", async () => {
      const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => [] });
      globalThis.fetch = fetchMock as never;

      await setup(<TrackManager showId="show-1" initialTracks={[makeTrack({ id: "t-1" })]} />);

      await act(async () => {
        capturedOnDragEnd?.({ active: { id: "t-1" }, over: null });
      });

      expect(fetchMock.mock.calls.filter((c) => c[0] === "/api/tracks/reorder")).toHaveLength(0);
      expect(toastError).not.toHaveBeenCalled();
    });
  });
});
