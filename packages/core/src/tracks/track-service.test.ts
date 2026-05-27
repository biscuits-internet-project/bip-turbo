import { describe, expect, type Mock, test, vi } from "vitest";
import type { CacheInvalidationService } from "../_shared/cache";
import { TrackService } from "./track-service";

const logger = { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() } as never;

function makeCacheInvalidationStub(): CacheInvalidationService & {
  invalidateShowComprehensive: Mock;
  invalidateAllTimers: Mock;
} {
  return {
    invalidateShowComprehensive: vi.fn().mockResolvedValue(undefined),
    invalidateAllTimers: vi.fn().mockResolvedValue(undefined),
  } as unknown as CacheInvalidationService & {
    invalidateShowComprehensive: Mock;
    invalidateAllTimers: Mock;
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
