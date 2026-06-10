import type { Track } from "@bip/domain";
import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

const toastSuccess = vi.fn();
const toastError = vi.fn();
vi.mock("sonner", () => ({
  toast: { success: (...args: unknown[]) => toastSuccess(...args), error: (...args: unknown[]) => toastError(...args) },
}));

import { useTrackApi } from "./use-track-api";

// Track factory — the hook only cares about a few fields, the rest are
// stubbed to keep the tests readable.
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
    ...overrides,
  } as Track;
}

const BASE_FORM = {
  songId: "song-1",
  set: "S1" as const,
  position: 1,
  segue: "none" as const,
  note: null,
  annotationDesc: null,
  allTimer: false,
  duration: "",
  durationSource: null,
};

function setupHook(initialTracks: Track[] = []) {
  // The hook is driven by an external `tracks` array. We mimic that with
  // a local closure so the test can assert post-hook state.
  let tracks = [...initialTracks];
  const setTracks = vi.fn((updater: (prev: Track[]) => Track[]) => {
    tracks = updater(tracks);
  });
  const hook = renderHook(() => useTrackApi("show-1", setTracks as never));
  return { hook, getTracks: () => tracks, setTracks };
}

describe("useTrackApi", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    toastSuccess.mockClear();
    toastError.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("createTrack", () => {
    // The POST body translates the "none" form sentinel to undefined for
    // songId (so it's omitted) and null for segue (the API treats null
    // and missing differently). showId is injected from the hook arg.
    test("POSTs to /api/tracks with translated form sentinels and the showId", async () => {
      // Include a `song` in the mock so the hook doesn't trigger its
      // hydration fallback — that's covered by the dedicated test below.
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          ...makeTrack({ id: "new-1", songId: "song-1", set: "S2", position: 3 }),
          song: { id: "song-1", title: "Floes" },
        }),
      });
      const { hook } = setupHook();

      await act(async () => {
        await hook.result.current.createTrack({
          ...BASE_FORM,
          songId: "none",
          set: "S2",
          position: 3,
          segue: "none",
        });
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, options] = fetchMock.mock.calls[0];
      expect(url).toBe("/api/tracks");
      expect(options.method).toBe("POST");
      const body = JSON.parse(options.body);
      expect(body.showId).toBe("show-1");
      expect(body.songId).toBeUndefined();
      expect(body.segue).toBeNull();
      expect(body.set).toBe("S2");
    });

    // The newly-created track is appended to the local list and re-sorted
    // so it lands in its set's correct position.
    test("appends the created track and keeps tracks sorted by set + position", async () => {
      const existing = [
        makeTrack({ id: "t-s1-1", set: "S1", position: 1 }),
        makeTrack({ id: "t-s2-1", set: "S2", position: 1 }),
      ];
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => makeTrack({ id: "t-s1-2", set: "S1", position: 2 }),
      });
      const { hook, getTracks } = setupHook(existing);

      await act(async () => {
        await hook.result.current.createTrack({ ...BASE_FORM, set: "S1", position: 2 });
      });

      const ids = getTracks().map((t) => t.id);
      expect(ids).toEqual(["t-s1-1", "t-s1-2", "t-s2-1"]);
    });

    // When the server omits the song relation, the hook hydrates it via
    // /api/songs/:id so the row label renders without a follow-up reload.
    test("hydrates song data via /api/songs/:id when missing from the response", async () => {
      fetchMock
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ ...makeTrack({ id: "new-1" }), songId: "song-99", song: null }),
        })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ id: "song-99", title: "Floes" }) });
      const { hook, getTracks } = setupHook();

      await act(async () => {
        await hook.result.current.createTrack({ ...BASE_FORM, songId: "song-99" });
      });

      expect(fetchMock.mock.calls[1][0]).toBe("/api/songs/song-99");
      const created = getTracks().find((t) => t.id === "new-1");
      expect(created?.song).toEqual({ id: "song-99", title: "Floes" });
    });

    // POST failures surface a toast and don't touch local state.
    test("fires an error toast and leaves state unchanged on non-ok response", async () => {
      fetchMock.mockResolvedValueOnce({ ok: false, status: 500 });
      const existing = [makeTrack({ id: "t-1" })];
      const { hook, getTracks } = setupHook(existing);

      await act(async () => {
        await hook.result.current.createTrack(BASE_FORM);
      });

      expect(toastError).toHaveBeenCalled();
      expect(getTracks().map((t) => t.id)).toEqual(["t-1"]);
    });

    // isCreating flips true during the request and back to false when the
    // request completes — used by the form to disable the submit button.
    test("toggles isCreating during the request lifecycle", async () => {
      let resolveCreate: ((value: unknown) => void) | undefined;
      const pendingResponse = new Promise((resolve) => {
        resolveCreate = resolve;
      });
      fetchMock.mockReturnValueOnce(pendingResponse);
      const { hook } = setupHook();

      expect(hook.result.current.isCreating).toBe(false);
      let createPromise: Promise<unknown>;
      act(() => {
        createPromise = hook.result.current.createTrack(BASE_FORM);
      });
      await waitFor(() => expect(hook.result.current.isCreating).toBe(true));

      await act(async () => {
        resolveCreate?.({ ok: true, json: async () => makeTrack({ id: "new-1" }) });
        await createPromise;
      });
      expect(hook.result.current.isCreating).toBe(false);
    });
  });

  describe("updateTrack", () => {
    // PUT /api/tracks/:id with the same form-sentinel translation as POST.
    test("PUTs to /api/tracks/:id with translated form sentinels", async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => makeTrack({ id: "t-1", segue: ">" }),
      });
      const { hook } = setupHook([makeTrack({ id: "t-1" })]);

      await act(async () => {
        await hook.result.current.updateTrack({ ...BASE_FORM, id: "t-1", segue: ">" });
      });

      const [url, options] = fetchMock.mock.calls[0];
      expect(url).toBe("/api/tracks/t-1");
      expect(options.method).toBe("PUT");
      const body = JSON.parse(options.body);
      expect(body.segue).toBe(">");
    });

    // The returned track replaces the existing entry in the local list,
    // and the list is re-sorted so a set/position change moves the row.
    test("replaces the matching track and re-sorts the list", async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => makeTrack({ id: "t-1", set: "S2", position: 5 }),
      });
      const { hook, getTracks } = setupHook([
        makeTrack({ id: "t-1", set: "S1", position: 1 }),
        makeTrack({ id: "t-2", set: "S2", position: 4 }),
      ]);

      await act(async () => {
        await hook.result.current.updateTrack({ ...BASE_FORM, id: "t-1", set: "S2", position: 5 });
      });

      expect(getTracks().map((t) => t.id)).toEqual(["t-2", "t-1"]);
    });

    // The admin types a human duration ("8:42"); it must reach the API as
    // whole seconds, and an empty field must clear it (null), not send "".
    test("parses the duration field to seconds on save, and clears it when blank", async () => {
      const { hook } = setupHook([makeTrack({ id: "t-1" })]);

      fetchMock.mockResolvedValueOnce({ ok: true, json: async () => makeTrack({ id: "t-1" }) });
      await act(async () => {
        await hook.result.current.updateTrack({ ...BASE_FORM, id: "t-1", duration: "8:42" });
      });
      expect(JSON.parse(fetchMock.mock.calls[0][1].body).duration).toBe(522);

      fetchMock.mockResolvedValueOnce({ ok: true, json: async () => makeTrack({ id: "t-1" }) });
      await act(async () => {
        await hook.result.current.updateTrack({ ...BASE_FORM, id: "t-1", duration: "" });
      });
      expect(JSON.parse(fetchMock.mock.calls[1][1].body).duration).toBeNull();
    });
  });

  describe("deleteTrack", () => {
    // DELETE removes the row from local state on success and fires a toast.
    test("DELETEs /api/tracks/:id and removes the row from state", async () => {
      fetchMock.mockResolvedValueOnce({ ok: true });
      const { hook, getTracks } = setupHook([makeTrack({ id: "t-1" }), makeTrack({ id: "t-2" })]);

      await act(async () => {
        await hook.result.current.deleteTrack("t-1");
      });

      expect(fetchMock.mock.calls[0][0]).toBe("/api/tracks/t-1");
      expect(fetchMock.mock.calls[0][1].method).toBe("DELETE");
      expect(getTracks().map((t) => t.id)).toEqual(["t-2"]);
    });
  });

  describe("reorderTracks", () => {
    // The reorder endpoint takes a list of {id, position, set} updates.
    // The hook merges the server's response (full track records) into
    // local state, preserving any client-only fields like `song`.
    test("PUTs reorder updates and merges the response into local state", async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { id: "t-1", position: 2 },
          { id: "t-2", position: 1 },
        ],
      });
      const { hook, getTracks } = setupHook([
        makeTrack({ id: "t-1", position: 1, song: { title: "Floes" } as never }),
        makeTrack({ id: "t-2", position: 2, song: { title: "Waves" } as never }),
      ]);

      await act(async () => {
        await hook.result.current.reorderTracks([
          { id: "t-1", position: 2, set: "S1" },
          { id: "t-2", position: 1, set: "S1" },
        ]);
      });

      const tracks = getTracks();
      expect(tracks.find((t) => t.id === "t-1")?.position).toBe(2);
      // Original song data preserved — the server response only includes
      // position/set, not the full nested relation.
      expect((tracks.find((t) => t.id === "t-1")?.song as { title: string } | undefined)?.title).toBe("Floes");
    });
  });

  describe("setPerformers", () => {
    // Saves a track's performer deltas through the dedicated endpoint, separate
    // from the track PUT so the cheap note save never touches performers.
    test("PUTs /api/tracks/:id/performers with the deltas and returns the fresh deltas", async () => {
      const fresh = [{ trackId: "t-1", musician: { id: "m-mike" }, present: true, instruments: [{ id: "i-guitar" }] }];
      fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({ ok: true, deltas: fresh }) });
      const { hook } = setupHook();
      const deltas = [
        { musicianId: "m-mike", present: true, instrumentIds: ["i-guitar"] },
        { musicianId: "m-marc", present: false, instrumentIds: [] },
      ];

      let result: unknown;
      await act(async () => {
        result = await hook.result.current.setPerformers("t-1", deltas);
      });

      const [url, options] = fetchMock.mock.calls[0];
      expect(url).toBe("/api/tracks/t-1/performers");
      expect(options.method).toBe("PUT");
      expect(JSON.parse(options.body)).toEqual({ deltas });
      expect(result).toEqual(fresh);
    });

    // The service rejects a sit-in for a lineup member with a 400 + message;
    // that message surfaces to the admin as a toast and the call returns null.
    test("surfaces the server error message and returns null on failure", async () => {
      fetchMock.mockResolvedValueOnce({ ok: false, text: async () => "already in lineup" });
      const { hook } = setupHook();

      let result: unknown;
      await act(async () => {
        result = await hook.result.current.setPerformers("t-1", [
          { musicianId: "m-1", present: true, instrumentIds: [] },
        ]);
      });

      expect(toastError).toHaveBeenCalledWith("already in lineup");
      expect(result).toBeNull();
    });
  });

  describe("setFlags", () => {
    // Saves a track's flags through the dedicated endpoint and returns the
    // recomputed footnote slice so the caller can refresh recurrence footnotes.
    test("PUTs /api/tracks/:id/flags with the flags and returns the recomputed slice", async () => {
      const fresh = { flags: ["DYSLEXIC"], flagRecurrences: [{ flag: "DYSLEXIC" }], segueRecurrences: [] };
      fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({ ok: true, ...fresh }) });
      const { hook } = setupHook();

      let result: unknown;
      await act(async () => {
        result = await hook.result.current.setFlags("t-1", ["DYSLEXIC", "INVERTED"]);
      });

      const [url, options] = fetchMock.mock.calls[0];
      expect(url).toBe("/api/tracks/t-1/flags");
      expect(options.method).toBe("PUT");
      expect(JSON.parse(options.body)).toEqual({ flags: ["DYSLEXIC", "INVERTED"] });
      expect(result).toEqual(fresh);
    });

    test("surfaces the server error message and returns null on failure", async () => {
      fetchMock.mockResolvedValueOnce({ ok: false, text: async () => "not found" });
      const { hook } = setupHook();

      let result: unknown;
      await act(async () => {
        result = await hook.result.current.setFlags("t-1", ["DYSLEXIC"]);
      });

      expect(toastError).toHaveBeenCalledWith("not found");
      expect(result).toBeNull();
    });
  });

  describe("setCompletions", () => {
    // Saves the earlier versions a track completes and returns the resolved
    // links for live footnote refresh.
    test("PUTs /api/tracks/:id/completions with the earlierTrackIds and returns the links", async () => {
      const completes = [{ date: "2010-01-01", slug: "2010-01-01-shimmy" }];
      fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({ ok: true, completes }) });
      const { hook } = setupHook();

      let result: unknown;
      await act(async () => {
        result = await hook.result.current.setCompletions("t-1", ["earlier-a", "earlier-b"]);
      });

      const [url, options] = fetchMock.mock.calls[0];
      expect(url).toBe("/api/tracks/t-1/completions");
      expect(options.method).toBe("PUT");
      expect(JSON.parse(options.body)).toEqual({ earlierTrackIds: ["earlier-a", "earlier-b"] });
      expect(result).toEqual(completes);
    });

    test("surfaces the server error message and returns null on failure", async () => {
      fetchMock.mockResolvedValueOnce({ ok: false, text: async () => "already completed" });
      const { hook } = setupHook();

      let result: unknown;
      await act(async () => {
        result = await hook.result.current.setCompletions("t-1", ["earlier-a"]);
      });

      expect(toastError).toHaveBeenCalledWith("already completed");
      expect(result).toBeNull();
    });
  });

  describe("loadEarlierPerformances", () => {
    // Fetches the picker options + seeded selection for the completions editor,
    // scoped by song + before-date + the completer track id.
    test("GETs /api/tracks/earlier-performances with songId, before, trackId and returns the result", async () => {
      const performances = [{ trackId: "t-9", showDate: "2010-01-01", showSlug: "2010-01-01-shimmy" }];
      fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({ performances, selected: ["t-9"] }) });
      const { hook } = setupHook();

      let result: unknown;
      await act(async () => {
        result = await hook.result.current.loadEarlierPerformances("song-1", "2015-01-01", "later-1");
      });

      const [url] = fetchMock.mock.calls[0];
      expect(url).toBe("/api/tracks/earlier-performances?songId=song-1&before=2015-01-01&trackId=later-1");
      expect(result).toEqual({ performances, selected: ["t-9"] });
    });

    // Without a completer trackId (a track still being added) the request omits
    // it and the selection comes back empty.
    test("omits trackId when none is given", async () => {
      fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({ performances: [], selected: [] }) });
      const { hook } = setupHook();

      await act(async () => {
        await hook.result.current.loadEarlierPerformances("song-1", "2015-01-01");
      });

      expect(fetchMock.mock.calls[0][0]).toBe("/api/tracks/earlier-performances?songId=song-1&before=2015-01-01");
    });
  });

  describe("loadTracks", () => {
    // Initial-load helper: hits /api/tracks?showId=…, fills local state,
    // and swallows errors with a toast so the form doesn't blow up if the
    // load fails on mount.
    test("fetches /api/tracks?showId=… and replaces local state with the response", async () => {
      const tracks = [makeTrack({ id: "t-loaded-1" }), makeTrack({ id: "t-loaded-2" })];
      fetchMock.mockResolvedValueOnce({ ok: true, json: async () => tracks });
      const { hook, getTracks } = setupHook();

      await act(async () => {
        await hook.result.current.loadTracks();
      });

      expect(fetchMock.mock.calls[0][0]).toBe("/api/tracks?showId=show-1");
      expect(getTracks().map((t) => t.id)).toEqual(["t-loaded-1", "t-loaded-2"]);
    });
  });
});
