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
