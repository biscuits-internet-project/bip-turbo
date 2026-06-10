import { describe, expect, type Mock, test, vi } from "vitest";
import type { CacheInvalidationService } from "../_shared/cache";
import { TrackService } from "./track-service";

const logger = { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() } as never;

function makeCacheInvalidationStub(): CacheInvalidationService & {
  invalidateShowComprehensive: Mock;
  invalidatePerformanceListings: Mock;
  invalidateSongCaches: Mock;
} {
  return {
    invalidateShowComprehensive: vi.fn().mockResolvedValue(undefined),
    invalidatePerformanceListings: vi.fn().mockResolvedValue(undefined),
    invalidateSongCaches: vi.fn().mockResolvedValue(undefined),
  } as unknown as CacheInvalidationService & {
    invalidateShowComprehensive: Mock;
    invalidatePerformanceListings: Mock;
    invalidateSongCaches: Mock;
  };
}

describe("TrackService — Cloudflare year-tag wiring", () => {
  // The user-reported bug: an admin toggling all-timer on a 2018 track
  // updated the show detail page immediately but left the /shows/year/2018
  // listing stale at the edge. The fix wires the show's actual year into
  // invalidateShowComprehensive. Pull the year from the show row the cache
  // path already looks up (not from the current calendar year).
  test("update() passes the show's year derived from show.date", async () => {
    const db = {
      track: {
        findUnique: vi.fn().mockResolvedValue({ showId: "show-id" }),
        update: vi.fn().mockResolvedValue({
          id: "track-id",
          slug: "track-slug",
          showId: "show-id",
          songId: "song-id",
          position: 1,
          set: "S1",
          allTimer: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      },
      show: {
        findUnique: vi.fn().mockResolvedValue({ slug: "2018-07-12-red-rocks", date: "2018-07-12" }),
      },
    };
    const cache = makeCacheInvalidationStub();
    const service = new TrackService(db as never, logger, cache);

    await service.update("track-id", { allTimer: true });

    expect(cache.invalidateShowComprehensive).toHaveBeenCalledWith("show-id", "2018-07-12-red-rocks", [2018]);
  });

  // Delete shares the same invalidation path (private invalidateShowCaches),
  // so verify it also threads the show year through.
  test("delete() passes the show's year derived from show.date", async () => {
    const db = {
      track: {
        findUnique: vi.fn().mockResolvedValue({ showId: "show-id" }),
        delete: vi.fn().mockResolvedValue(undefined),
      },
      show: {
        findUnique: vi.fn().mockResolvedValue({ slug: "2018-07-12-red-rocks", date: "2018-07-12" }),
      },
    };
    const cache = makeCacheInvalidationStub();
    const service = new TrackService(db as never, logger, cache);

    await service.delete("track-id");

    expect(cache.invalidateShowComprehensive).toHaveBeenCalledWith("show-id", "2018-07-12-red-rocks", [2018]);
  });
});

describe("TrackService — duration provenance", () => {
  // The edit form always re-sends the duration, so the service must decide
  // provenance from whether the value actually changed — not from its mere
  // presence. Otherwise editing a song/segue/note would silently convert a
  // nugs/archive time to `manual` and freeze it against future resolution.
  function makeDb(currentDuration: number | null) {
    const update = vi.fn().mockResolvedValue({
      id: "track-id",
      slug: "slug",
      showId: "show-id",
      songId: "song-id",
      position: 1,
      set: "S1",
      createdAt: new Date(),
      updatedAt: new Date(),
      duration: 700,
      durationSource: "manual",
    });
    const db = {
      track: {
        findUnique: vi.fn().mockResolvedValue({ showId: "show-id", duration: currentDuration }),
        update,
        aggregate: vi.fn().mockResolvedValue({ _sum: { duration: 700 } }),
      },
      show: {
        findUnique: vi.fn().mockResolvedValue({ slug: "2024-01-01-x", date: "2024-01-01" }),
        update: vi.fn().mockResolvedValue(undefined),
      },
    };
    return { db, update };
  }

  test("leaves duration + source untouched when the value is resent unchanged", async () => {
    const { db, update } = makeDb(690);
    const service = new TrackService(db as never, logger, makeCacheInvalidationStub());

    await service.update("track-id", { duration: 690, note: "fixed a typo" });

    const data = update.mock.calls[0][0].data;
    expect(data.duration).toBeUndefined();
    expect(data.durationSource).toBeUndefined();
    // No show-total recompute when the duration didn't move.
    expect(db.track.aggregate).not.toHaveBeenCalled();
  });

  test("stamps manual when the duration changes to a new value", async () => {
    const { db, update } = makeDb(690);
    const service = new TrackService(db as never, logger, makeCacheInvalidationStub());

    await service.update("track-id", { duration: 700 });

    const data = update.mock.calls[0][0].data;
    expect(data.duration).toBe(700);
    expect(data.durationSource).toBe("manual");
    expect(db.track.aggregate).toHaveBeenCalled();
  });

  // The Time column also renders on the All-Timers / Jam Charts / On-This-Day
  // listings, which key off their own caches — a manual duration edit must
  // wipe them or those pages keep the stale time.
  test("invalidates the performance listings on a duration edit", async () => {
    const { db } = makeDb(690);
    const cache = makeCacheInvalidationStub();
    const service = new TrackService(db as never, logger, cache);

    await service.update("track-id", { duration: 700 });

    expect(cache.invalidatePerformanceListings).toHaveBeenCalled();
  });

  test("resets source to null when the duration is cleared", async () => {
    const { db, update } = makeDb(690);
    const service = new TrackService(db as never, logger, makeCacheInvalidationStub());

    await service.update("track-id", { duration: null });

    const data = update.mock.calls[0][0].data;
    expect(data.duration).toBeNull();
    expect(data.durationSource).toBeNull();
  });
});

describe("TrackService.setTrackMusicianDeltas", () => {
  function makeDeltaDb(lineupMatches: Array<{ musicianId: string }> = []) {
    // biome-ignore lint/suspicious/noExplicitAny: test mock
    const db: any = {
      track: {
        findUnique: vi.fn().mockResolvedValue({ showId: "show-id" }),
      },
      showMusician: {
        findMany: vi.fn().mockResolvedValue(lineupMatches),
      },
      trackMusician: {
        deleteMany: vi.fn().mockResolvedValue({ count: 0 }),
        create: vi.fn().mockResolvedValue({}),
      },
      show: {
        findUnique: vi.fn().mockResolvedValue({ slug: "2018-07-12-red-rocks", date: "2018-07-12" }),
      },
    };
    db.$transaction = vi.fn((calls: Array<Promise<unknown>>) => Promise.all(calls));
    return db;
  }

  // Full-set replace: existing deltas are deleted, then the passed ones
  // inserted, and the show's caches invalidated.
  test("deletes existing deltas, inserts the new ones, and invalidates show caches", async () => {
    const db = makeDeltaDb();
    const cache = makeCacheInvalidationStub();
    const service = new TrackService(db as never, logger, cache);

    await service.setTrackMusicianDeltas("track-id", [
      { musicianId: "m-sam", present: true, instrumentIds: ["i-drums", "i-vocals"] },
    ]);

    expect(db.trackMusician.deleteMany).toHaveBeenCalledWith({ where: { trackId: "track-id" } });
    expect(db.trackMusician.create).toHaveBeenCalledTimes(1);
    // A sit-in on several instruments writes one TrackMusician row with a
    // nested instrument per instrumentId (no single instrumentId column).
    const created = db.trackMusician.create.mock.calls[0][0].data;
    expect(created.instruments.create.map((i: { instrumentId: string }) => i.instrumentId)).toEqual([
      "i-drums",
      "i-vocals",
    ]);
    expect(cache.invalidateShowComprehensive).toHaveBeenCalledWith("show-id", "2018-07-12-red-rocks", [2018]);
  });

  // A sit-in for a musician already in the show lineup is redundant and would
  // double-render — reject it without writing anything.
  test("rejects a sit-in delta for a musician already in the show lineup", async () => {
    const db = makeDeltaDb([{ musicianId: "m-marlon" }]);
    const service = new TrackService(db as never, logger, makeCacheInvalidationStub());

    await expect(
      service.setTrackMusicianDeltas("track-id", [{ musicianId: "m-marlon", present: true }]),
    ).rejects.toThrow(/already in the show lineup/);

    expect(db.trackMusician.deleteMany).not.toHaveBeenCalled();
    expect(db.trackMusician.create).not.toHaveBeenCalled();
  });

  // A sat-out (present=false) for a lineup member is the expected case and
  // must NOT trip the sit-in guard.
  test("allows a sat-out delta for a musician in the lineup", async () => {
    const db = makeDeltaDb();
    const service = new TrackService(db as never, logger, makeCacheInvalidationStub());

    await service.setTrackMusicianDeltas("track-id", [{ musicianId: "m-marlon", present: false }]);

    expect(db.showMusician.findMany).not.toHaveBeenCalled();
    expect(db.trackMusician.create).toHaveBeenCalledTimes(1);
  });
});

describe("TrackService.getTrackMusicianDeltas", () => {
  const created = new Date("2020-01-01");

  // Reads a single track's saved performer rows back as domain deltas (resolved
  // musician + instrument names), so the editor can refresh its footnotes after
  // a save without reloading the page.
  test("maps the track's performer rows to domain deltas", async () => {
    // biome-ignore lint/suspicious/noExplicitAny: test mock
    const db: any = {
      track: {
        findUnique: vi.fn().mockResolvedValue({
          trackMusicians: [
            {
              present: true,
              musician: {
                id: "m-mike",
                name: "Mike Gordon",
                slug: "mike-gordon",
                knownFrom: null,
                defaultInstrument: null,
              },
              instruments: [
                { instrument: { id: "i-bass", name: "Bass", slug: "bass", createdAt: created, updatedAt: created } },
              ],
            },
          ],
        }),
      },
    };
    const service = new TrackService(db as never, logger, makeCacheInvalidationStub());

    const deltas = await service.getTrackMusicianDeltas("track-id");

    expect(deltas).toEqual([
      {
        trackId: "track-id",
        present: true,
        musician: { id: "m-mike", name: "Mike Gordon", slug: "mike-gordon", knownFrom: null, defaultInstrument: null },
        instruments: [{ id: "i-bass", name: "Bass", slug: "bass", createdAt: created, updatedAt: created }],
      },
    ]);
  });

  // A track with no performer rows (or no track) yields an empty list, not a
  // throw, so the caller can blindly replace its local deltas.
  test("returns an empty list when the track has no performer rows", async () => {
    // biome-ignore lint/suspicious/noExplicitAny: test mock
    const db: any = { track: { findUnique: vi.fn().mockResolvedValue(null) } };
    const service = new TrackService(db as never, logger, makeCacheInvalidationStub());

    expect(await service.getTrackMusicianDeltas("missing")).toEqual([]);
  });
});

describe("TrackService.setTrackFlags", () => {
  function makeFlagDb() {
    // biome-ignore lint/suspicious/noExplicitAny: test mock
    const db: any = {
      track: { findUnique: vi.fn().mockResolvedValue({ showId: "show-id", songId: "song-id" }) },
      trackFlagAssignment: {
        deleteMany: vi.fn().mockResolvedValue({ count: 0 }),
        create: vi.fn().mockResolvedValue({}),
      },
      show: { findUnique: vi.fn().mockResolvedValue({ slug: "2018-07-12-red-rocks", date: "2018-07-12" }) },
    };
    db.$transaction = vi.fn((calls: Array<Promise<unknown>>) => Promise.all(calls));
    return db;
  }

  // Full-set replace + the load-bearing recompute: a flag edit changes derived
  // recurrence columns, so the edited song's recurrence must be recomputed.
  test("replaces flag rows, recomputes the song's recurrence, and invalidates caches", async () => {
    const db = makeFlagDb();
    const cache = makeCacheInvalidationStub();
    const stats = { recomputeSongRecurrence: vi.fn().mockResolvedValue(undefined) };
    const service = new TrackService(db as never, logger, cache, stats as never);

    await service.setTrackFlags("track-id", ["DYSLEXIC", "INVERTED"]);

    expect(db.trackFlagAssignment.deleteMany).toHaveBeenCalledWith({ where: { trackId: "track-id" } });
    expect(db.trackFlagAssignment.create).toHaveBeenCalledTimes(2);
    expect(stats.recomputeSongRecurrence).toHaveBeenCalledWith("song-id");
    expect(cache.invalidateShowComprehensive).toHaveBeenCalledWith("show-id", "2018-07-12-red-rocks", [2018]);
    expect(cache.invalidateSongCaches).toHaveBeenCalled();
  });

  // Clearing every flag still recomputes — otherwise the removed flag's stale
  // recurrence rows would linger.
  test("recomputes even when all flags are removed", async () => {
    const db = makeFlagDb();
    const stats = { recomputeSongRecurrence: vi.fn().mockResolvedValue(undefined) };
    const service = new TrackService(db as never, logger, makeCacheInvalidationStub(), stats as never);

    await service.setTrackFlags("track-id", []);

    expect(db.trackFlagAssignment.deleteMany).toHaveBeenCalled();
    expect(db.trackFlagAssignment.create).not.toHaveBeenCalled();
    expect(stats.recomputeSongRecurrence).toHaveBeenCalledWith("song-id");
  });

  // Without a StatsService the recurrence can't be recomputed; fail loudly
  // rather than silently leave stale footnotes.
  test("throws when constructed without a StatsService", async () => {
    const db = makeFlagDb();
    const service = new TrackService(db as never, logger, makeCacheInvalidationStub());

    await expect(service.setTrackFlags("track-id", ["DYSLEXIC"])).rejects.toThrow(/StatsService/);
  });
});

describe("TrackService.getTrackFlagData", () => {
  // A missing track yields empty arrays, not a throw, so the caller can blindly
  // replace its local flag state after a save.
  test("returns empty arrays when the track is missing", async () => {
    // biome-ignore lint/suspicious/noExplicitAny: test mock
    const db: any = { track: { findUnique: vi.fn().mockResolvedValue(null) } };
    const service = new TrackService(db as never, logger, makeCacheInvalidationStub());

    expect(await service.getTrackFlagData("missing")).toEqual({
      flags: [],
      flagRecurrences: [],
      segueRecurrences: [],
    });
  });
});

describe("TrackService.setTrackCompletions", () => {
  function makeCompletionDb(
    opts: {
      conflicting?: Array<{ earlierTrackId: string }>;
      laterShowId?: string;
      earlierShows?: Array<{ showId: string }>;
    } = {},
  ) {
    // biome-ignore lint/suspicious/noExplicitAny: test mock
    const db: any = {
      track: {
        findUnique: vi.fn().mockResolvedValue({ showId: opts.laterShowId ?? "later-show" }),
        findMany: vi.fn().mockResolvedValue(opts.earlierShows ?? []),
      },
      trackCompletion: {
        findMany: vi.fn().mockResolvedValue(opts.conflicting ?? []),
        deleteMany: vi.fn().mockResolvedValue({ count: 0 }),
        create: vi.fn().mockResolvedValue({}),
      },
      show: {
        // Each invalidated show resolves to a distinct slug so the test can
        // assert which shows were busted.
        findUnique: vi.fn(({ where }: { where: { id: string } }) =>
          Promise.resolve({ slug: where.id, date: "2018-07-12" }),
        ),
      },
    };
    db.$transaction = vi.fn((calls: Array<Promise<unknown>>) => Promise.all(calls));
    return db;
  }

  // Full-set replace + cache busting on BOTH sides: the completer's show and
  // each earlier (completed) track's show render the "completes …" footnote.
  test("replaces completion rows and busts the later show plus each earlier track's show", async () => {
    const db = makeCompletionDb({
      laterShowId: "later-show",
      earlierShows: [{ showId: "earlier-show-a" }, { showId: "earlier-show-b" }],
    });
    const cache = makeCacheInvalidationStub();
    const service = new TrackService(db as never, logger, cache);

    await service.setTrackCompletions("later-track", ["earlier-a", "earlier-b"]);

    expect(db.trackCompletion.deleteMany).toHaveBeenCalledWith({ where: { laterTrackId: "later-track" } });
    expect(db.trackCompletion.create).toHaveBeenCalledTimes(2);
    const invalidated = new Set(cache.invalidateShowComprehensive.mock.calls.map((c) => c[0]));
    expect(invalidated).toEqual(new Set(["later-show", "earlier-show-a", "earlier-show-b"]));
  });

  // earlier_track_id is UNIQUE — an earlier track has at most one completer.
  // Linking one another track already completes is rejected without writing.
  test("rejects linking an earlier track that another track already completes", async () => {
    const db = makeCompletionDb({ conflicting: [{ earlierTrackId: "earlier-a" }] });
    const service = new TrackService(db as never, logger, makeCacheInvalidationStub());

    await expect(service.setTrackCompletions("later-track", ["earlier-a"])).rejects.toThrow(/already completed/);
    expect(db.trackCompletion.deleteMany).not.toHaveBeenCalled();
  });
});

describe("TrackService.getCompletionEarlierTrackIds", () => {
  // The editor seeds its current selection from these so a full-set-replace save
  // preserves existing links.
  test("returns the earlier-track ids this track completes", async () => {
    // biome-ignore lint/suspicious/noExplicitAny: test mock
    const db: any = {
      trackCompletion: {
        findMany: vi.fn().mockResolvedValue([{ earlierTrackId: "earlier-a" }, { earlierTrackId: "earlier-b" }]),
      },
    };
    const service = new TrackService(db as never, logger, makeCacheInvalidationStub());

    expect(await service.getCompletionEarlierTrackIds("later-track")).toEqual(["earlier-a", "earlier-b"]);
    expect(db.trackCompletion.findMany).toHaveBeenCalledWith({
      where: { laterTrackId: "later-track" },
      select: { earlierTrackId: true },
    });
  });
});

describe("TrackService.findEarlierPerformances", () => {
  // Powers the completions picker: only same-song tracks from shows strictly
  // before the completer's date, shaped for chip display, capped at the 10 most
  // recent so a frequently-played song doesn't flood the picker.
  test("returns the recent earlier same-song performances as {trackId, showDate, showSlug}", async () => {
    // biome-ignore lint/suspicious/noExplicitAny: test mock
    const db: any = {
      track: {
        findMany: vi.fn().mockResolvedValue([
          { id: "t2", show: { date: "2012-05-05", slug: "2012-05-05-shimmy" } },
          { id: "t1", show: { date: "2010-01-01", slug: "2010-01-01-nellie-kane" } },
        ]),
      },
    };
    const service = new TrackService(db as never, logger, makeCacheInvalidationStub());

    const result = await service.findEarlierPerformances("song-id", "2015-01-01");

    expect(db.track.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { songId: "song-id", show: { date: { lt: "2015-01-01" } } }, take: 10 }),
    );
    expect(result).toEqual([
      { trackId: "t2", showDate: "2012-05-05", showSlug: "2012-05-05-shimmy" },
      { trackId: "t1", showDate: "2010-01-01", showSlug: "2010-01-01-nellie-kane" },
    ]);
  });
});

describe("TrackService.findPerformancesByTrackIds", () => {
  // Keeps an already-linked completion visible with its date even when it falls
  // outside the recent-performances cap.
  test("returns the performance shape for the given track ids", async () => {
    // biome-ignore lint/suspicious/noExplicitAny: test mock
    const db: any = {
      track: {
        findMany: vi.fn().mockResolvedValue([{ id: "t9", show: { date: "2001-09-09", slug: "2001-09-09-shimmy" } }]),
      },
    };
    const service = new TrackService(db as never, logger, makeCacheInvalidationStub());

    expect(await service.findPerformancesByTrackIds(["t9"])).toEqual([
      { trackId: "t9", showDate: "2001-09-09", showSlug: "2001-09-09-shimmy" },
    ]);
  });

  // No ids means no query (and an empty result).
  test("short-circuits on an empty id list", async () => {
    // biome-ignore lint/suspicious/noExplicitAny: test mock
    const db: any = { track: { findMany: vi.fn() } };
    const service = new TrackService(db as never, logger, makeCacheInvalidationStub());

    expect(await service.findPerformancesByTrackIds([])).toEqual([]);
    expect(db.track.findMany).not.toHaveBeenCalled();
  });
});
