import { describe, expect, type Mock, test, vi } from "vitest";
import type { CacheInvalidationService } from "../_shared/cache";
import { TrackService } from "./track-service";

const logger = { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() } as never;

function makeCacheInvalidationStub(): CacheInvalidationService & {
  invalidateShowComprehensive: Mock;
  invalidatePerformanceListings: Mock;
} {
  return {
    invalidateShowComprehensive: vi.fn().mockResolvedValue(undefined),
    invalidatePerformanceListings: vi.fn().mockResolvedValue(undefined),
  } as unknown as CacheInvalidationService & {
    invalidateShowComprehensive: Mock;
    invalidatePerformanceListings: Mock;
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
