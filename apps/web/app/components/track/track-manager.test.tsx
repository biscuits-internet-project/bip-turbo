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
  footnotes?: React.ReactNode[];
}> = [];
vi.mock("./sortable-track-item", () => ({
  SortableTrackItem: (props: {
    track: Track;
    onEdit: (track: Track) => void;
    onDelete: (id: string) => void;
    isDeleting?: boolean;
    footnotes?: React.ReactNode[];
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

  // The footnoteSetlist runs through the same engine as the public setlist and
  // is sliced per track: a flagged track gets its footnote content, an
  // unrelated track gets none.
  test("derives per-track footnotes from footnoteSetlist and hands them to each row", async () => {
    const footnoteSetlist = {
      show: { id: "show-1", date: "2025-11-15" },
      sets: [
        {
          label: "S1",
          sort: 1,
          tracks: [
            { id: "t-1", songId: "song-1", gap: 5, previousPerformanceShow: null, flags: ["DYSLEXIC"] },
            { id: "t-2", songId: "song-2", gap: 5, previousPerformanceShow: null, flags: [] },
          ],
        },
      ],
      annotations: [],
      lineup: [],
      trackMusicianDeltas: [],
    };

    await setup(
      <TrackManager
        showId="show-1"
        initialTracks={[makeTrack({ id: "t-1" }), makeTrack({ id: "t-2", position: 2 })]}
        footnoteSetlist={footnoteSetlist as never}
      />,
    );

    const flaggedRow = capturedRowProps.find((p) => p.track.id === "t-1");
    const plainRow = capturedRowProps.find((p) => p.track.id === "t-2");
    expect(flaggedRow?.footnotes).toHaveLength(1);
    expect(plainRow?.footnotes ?? []).toHaveLength(0);
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

    expect(screen.queryByLabelText(/jam charts/i)).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /add track/i }));

    expect(screen.getByLabelText(/jam charts/i)).toBeInTheDocument();
    // Add CTA inside the form (distinct from the "Add Track" header button).
    expect(screen.getAllByRole("button", { name: /^add$/i }).length).toBeGreaterThanOrEqual(1);
  });

  // Cancel closes the form, returning the component to its list-only
  // state. Add Track button becomes clickable again.
  test("cancel closes the open edit form", async () => {
    const { user } = await setup(<TrackManager showId="show-1" initialTracks={[makeTrack({ id: "t-1" })]} />);

    await user.click(screen.getByRole("button", { name: /add track/i }));
    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(screen.queryByLabelText(/jam charts/i)).not.toBeInTheDocument();
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

    expect(screen.getByLabelText(/jam charts/i)).toHaveValue("The jam emerges as minimal trance");
    expect(screen.getByRole("button", { name: /update/i })).toBeInTheDocument();
  });

  describe("performer deltas", () => {
    const mike = {
      id: "m-mike",
      name: "Mike Gordon",
      slug: "mike-gordon",
      knownFrom: null,
      defaultInstrument: null,
    };
    const bass = { id: "i-bass", name: "Bass", slug: "bass", createdAt: new Date(), updatedAt: new Date() };

    // Two tracks so a sit-in on one is a genuine per-track footnote — a guest
    // who covers 100% of the show is elevated into the show-level lineup note
    // instead, which would suppress the per-track footnote we assert on.
    function footnoteSetlistWith(trackMusicianDeltas: unknown[]) {
      return {
        show: { id: "show-1", date: "2025-11-15" },
        sets: [
          {
            label: "S1",
            sort: 1,
            tracks: [
              { id: "t-1", songId: "song-1", gap: 5, previousPerformanceShow: null, flags: [] },
              { id: "t-2", songId: "song-2", gap: 5, previousPerformanceShow: null, flags: [] },
            ],
          },
        ],
        annotations: [],
        lineup: [],
        trackMusicianDeltas,
      } as never;
    }
    const oneDelta = [{ trackId: "t-1", musician: mike, present: true, instruments: [bass] }];

    // Editing a track seeds the performer editor from the show's saved deltas;
    // saving the track PUTs those deltas to the performers endpoint, keyed by
    // the edited track's id and converted to the id-only service shape.
    test("seeds the editor from footnoteSetlist and PUTs the deltas on save", async () => {
      const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => makeTrack({ id: "t-1" }) });
      globalThis.fetch = fetchMock as never;

      const { user } = await setup(
        <TrackManager
          showId="show-1"
          initialTracks={[makeTrack({ id: "t-1" })]}
          footnoteSetlist={footnoteSetlistWith(oneDelta)}
        />,
      );

      await user.click(screen.getByText("edit-t-1"));
      await user.click(screen.getByRole("button", { name: /update/i }));

      await waitFor(() => {
        const call = fetchMock.mock.calls.find((c) => String(c[0]) === "/api/tracks/t-1/performers");
        expect(call).toBeTruthy();
        expect(JSON.parse(call?.[1].body)).toEqual({
          deltas: [{ musicianId: "m-mike", present: true, instrumentIds: ["i-bass"] }],
        });
      });
    });

    // The read-only footnotes derive from the show's deltas; after removing a
    // performer and saving, the track's footnote must disappear without a page
    // reload (the editor re-derives from the server's fresh deltas).
    test("clears a track's footnote after its only performer is removed and saved", async () => {
      const fetchMock = vi.fn((url: string) => {
        const u = String(url);
        if (u === "/api/tracks/t-1/performers") {
          return Promise.resolve({ ok: true, json: async () => ({ ok: true, deltas: [] }) });
        }
        if (u.startsWith("/api/musicians/")) return Promise.resolve({ ok: true, json: async () => mike });
        if (u.startsWith("/api/musicians")) return Promise.resolve({ ok: true, json: async () => [mike] });
        if (u.startsWith("/api/instruments")) return Promise.resolve({ ok: true, json: async () => [bass] });
        return Promise.resolve({ ok: true, json: async () => makeTrack({ id: "t-1" }) });
      });
      globalThis.fetch = fetchMock as never;

      const { user } = await setup(
        <TrackManager
          showId="show-1"
          initialTracks={[makeTrack({ id: "t-1" })]}
          footnoteSetlist={footnoteSetlistWith(oneDelta)}
        />,
      );

      expect(capturedRowProps.find((p) => p.track.id === "t-1")?.footnotes).toHaveLength(1);

      await user.click(screen.getByText("edit-t-1"));
      await user.click(screen.getByRole("button", { name: /remove performer/i }));
      await user.click(screen.getByRole("button", { name: /update/i }));

      await waitFor(() => {
        const latest = capturedRowProps.filter((p) => p.track.id === "t-1").at(-1);
        expect(latest?.footnotes ?? []).toHaveLength(0);
      });
    });

    // Symmetric to the removal case: adding a performer to a track with none and
    // saving makes its footnote appear immediately.
    test("renders a track's footnote after a performer is added and saved", async () => {
      const fresh = [{ trackId: "t-1", musician: mike, present: true, instruments: [bass] }];
      const fetchMock = vi.fn((url: string) => {
        const u = String(url);
        if (u === "/api/tracks/t-1/performers") {
          return Promise.resolve({ ok: true, json: async () => ({ ok: true, deltas: fresh }) });
        }
        if (u.startsWith("/api/musicians/")) return Promise.resolve({ ok: true, json: async () => mike });
        if (u.startsWith("/api/musicians")) return Promise.resolve({ ok: true, json: async () => [mike] });
        if (u.startsWith("/api/instruments")) return Promise.resolve({ ok: true, json: async () => [bass] });
        return Promise.resolve({ ok: true, json: async () => makeTrack({ id: "t-1" }) });
      });
      globalThis.fetch = fetchMock as never;

      const footnoteSetlist = footnoteSetlistWith([]);

      const { user } = await setup(
        <TrackManager showId="show-1" initialTracks={[makeTrack({ id: "t-1" })]} footnoteSetlist={footnoteSetlist} />,
      );

      expect(capturedRowProps.find((p) => p.track.id === "t-1")?.footnotes ?? []).toHaveLength(0);

      await user.click(screen.getByText("edit-t-1"));
      await user.click(screen.getByRole("button", { name: /add performer/i }));
      await user.type(await screen.findByPlaceholderText("Search musicians..."), "Mike");
      await user.click(await screen.findByText("Mike Gordon", undefined, { timeout: 1500 }));
      await user.click(screen.getByRole("button", { name: /update/i }));

      await waitFor(() => {
        const latest = capturedRowProps.filter((p) => p.track.id === "t-1").at(-1);
        expect(latest?.footnotes ?? []).toHaveLength(1);
      });
    });

    // A note-only edit on a track that had no performers must not pay for the
    // performer write — the track PUT goes out, the performers PUT does not.
    test("does not PUT performers when the track had none and none were added", async () => {
      const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => makeTrack({ id: "t-1" }) });
      globalThis.fetch = fetchMock as never;

      const { user } = await setup(<TrackManager showId="show-1" initialTracks={[makeTrack({ id: "t-1" })]} />);

      await user.click(screen.getByText("edit-t-1"));
      await user.click(screen.getByRole("button", { name: /update/i }));

      await waitFor(() => expect(fetchMock.mock.calls.some((c) => String(c[0]) === "/api/tracks/t-1")).toBe(true));
      expect(fetchMock.mock.calls.some((c) => String(c[0]).endsWith("/performers"))).toBe(false);
    });
  });

  describe("track flags", () => {
    function footnoteSetlistWith(flags: string[]) {
      return {
        show: { id: "show-1", date: "2025-11-15" },
        sets: [
          {
            label: "S1",
            sort: 1,
            tracks: [{ id: "t-1", songId: "song-1", gap: 5, previousPerformanceShow: null, flags }],
          },
        ],
        annotations: [],
        lineup: [],
        trackMusicianDeltas: [],
      } as never;
    }

    function routeFetch(handlers: Record<string, unknown>) {
      return vi.fn((url: string, _init?: { body?: string }) => {
        const u = String(url);
        if (u.startsWith("/api/tracks/earlier-performances")) {
          return Promise.resolve({ ok: true, json: async () => ({ performances: [], selected: [] }) });
        }
        for (const [path, body] of Object.entries(handlers)) {
          if (u === path) return Promise.resolve({ ok: true, json: async () => body });
        }
        return Promise.resolve({ ok: true, json: async () => makeTrack({ id: "t-1" }) });
      });
    }

    // Editing a track seeds the flag checkboxes from the setlist; saving the
    // track PUTs them to the flags endpoint keyed by the edited track's id.
    test("seeds the flag editor from the setlist and PUTs flags on save", async () => {
      const fetchMock = routeFetch({
        "/api/tracks/t-1/flags": { ok: true, flags: ["DYSLEXIC"], flagRecurrences: [], segueRecurrences: [] },
      });
      globalThis.fetch = fetchMock as never;

      const { user } = await setup(
        <TrackManager
          showId="show-1"
          initialTracks={[makeTrack({ id: "t-1" })]}
          footnoteSetlist={footnoteSetlistWith(["DYSLEXIC"])}
        />,
      );

      await user.click(screen.getByText("edit-t-1"));
      expect(screen.getByRole("checkbox", { name: /dyslexic/i })).toBeChecked();
      await user.click(screen.getByRole("button", { name: /update/i }));

      await waitFor(() => {
        const call = fetchMock.mock.calls.find((c) => String(c[0]) === "/api/tracks/t-1/flags");
        expect(call).toBeTruthy();
        expect(JSON.parse(call?.[1]?.body ?? "null")).toEqual({ flags: ["DYSLEXIC"] });
      });
    });

    // Adding a flag to a track with none and saving makes its footnote appear
    // immediately (the live override re-derives without a reload).
    test("renders a flag footnote after a flag is added and saved", async () => {
      const fetchMock = routeFetch({
        "/api/tracks/t-1/flags": { ok: true, flags: ["INVERTED"], flagRecurrences: [], segueRecurrences: [] },
      });
      globalThis.fetch = fetchMock as never;

      const { user } = await setup(
        <TrackManager
          showId="show-1"
          initialTracks={[makeTrack({ id: "t-1" })]}
          footnoteSetlist={footnoteSetlistWith([])}
        />,
      );

      expect(capturedRowProps.find((p) => p.track.id === "t-1")?.footnotes ?? []).toHaveLength(0);

      await user.click(screen.getByText("edit-t-1"));
      await user.click(screen.getByRole("checkbox", { name: /inverted/i }));
      await user.click(screen.getByRole("button", { name: /update/i }));

      await waitFor(() => {
        const latest = capturedRowProps.filter((p) => p.track.id === "t-1").at(-1);
        expect(latest?.footnotes ?? []).toHaveLength(1);
      });
    });

    // A note-only edit on a track with no flags must not PUT flags.
    test("does not PUT flags when the track had none and none were added", async () => {
      const fetchMock = routeFetch({});
      globalThis.fetch = fetchMock as never;

      const { user } = await setup(
        <TrackManager
          showId="show-1"
          initialTracks={[makeTrack({ id: "t-1" })]}
          footnoteSetlist={footnoteSetlistWith([])}
        />,
      );

      await user.click(screen.getByText("edit-t-1"));
      await user.click(screen.getByRole("button", { name: /update/i }));

      await waitFor(() => expect(fetchMock.mock.calls.some((c) => String(c[0]) === "/api/tracks/t-1")).toBe(true));
      expect(fetchMock.mock.calls.some((c) => String(c[0]).endsWith("/flags"))).toBe(false);
    });
  });

  describe("track completions", () => {
    const footnoteSetlist = {
      show: { id: "show-1", date: "2025-11-15" },
      sets: [
        {
          label: "S1",
          sort: 1,
          tracks: [{ id: "t-1", songId: "song-1", gap: 5, previousPerformanceShow: null, flags: [] }],
        },
      ],
      annotations: [],
      lineup: [],
      trackMusicianDeltas: [],
    } as never;

    function routeFetch(selected: string[], completionsBody: unknown) {
      return vi.fn((url: string, _init?: { body?: string }) => {
        const u = String(url);
        if (u.startsWith("/api/tracks/earlier-performances")) {
          return Promise.resolve({
            ok: true,
            json: async () => ({
              performances: [{ trackId: "e1", showDate: "2010-01-01", showSlug: "2010-01-01-shimmy" }],
              selected,
            }),
          });
        }
        if (u === "/api/tracks/t-1/completions") {
          return Promise.resolve({ ok: true, json: async () => completionsBody });
        }
        return Promise.resolve({ ok: true, json: async () => makeTrack({ id: "t-1" }) });
      });
    }

    // The editor seeds its selection from the server (the completes shape lacks
    // the earlier-track id); saving PUTs those earlier-track ids so a full-set
    // replace preserves the existing links.
    test("seeds the selection from the server and PUTs earlierTrackIds on save", async () => {
      const fetchMock = routeFetch(["e1"], {
        ok: true,
        completes: [{ date: "2010-01-01", slug: "2010-01-01-shimmy" }],
      });
      globalThis.fetch = fetchMock as never;

      const { user } = await setup(
        <TrackManager showId="show-1" initialTracks={[makeTrack({ id: "t-1" })]} footnoteSetlist={footnoteSetlist} />,
      );

      await user.click(screen.getByText("edit-t-1"));
      // The seeded chip proves the selection loaded before we save.
      await screen.findByText("Jan 1, 2010");
      await user.click(screen.getByRole("button", { name: /update/i }));

      await waitFor(() => {
        const call = fetchMock.mock.calls.find((c) => String(c[0]) === "/api/tracks/t-1/completions");
        expect(call).toBeTruthy();
        expect(JSON.parse(call?.[1]?.body ?? "null")).toEqual({ earlierTrackIds: ["e1"] });
      });
    });

    // A track with no completions and none added must not PUT completions.
    test("does not PUT completions when the track had none and none were added", async () => {
      const fetchMock = routeFetch([], { ok: true, completes: [] });
      globalThis.fetch = fetchMock as never;

      const { user } = await setup(
        <TrackManager showId="show-1" initialTracks={[makeTrack({ id: "t-1" })]} footnoteSetlist={footnoteSetlist} />,
      );

      await user.click(screen.getByText("edit-t-1"));
      await user.click(screen.getByRole("button", { name: /update/i }));

      await waitFor(() => expect(fetchMock.mock.calls.some((c) => String(c[0]) === "/api/tracks/t-1")).toBe(true));
      expect(fetchMock.mock.calls.some((c) => String(c[0]).endsWith("/completions"))).toBe(false);
    });
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
