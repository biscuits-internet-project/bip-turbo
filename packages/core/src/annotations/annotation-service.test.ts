import { describe, expect, type Mock, test, vi } from "vitest";
import type { CacheInvalidationService } from "../_shared/cache";
import { AnnotationService } from "./annotation-service";

const logger = { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() } as never;

function makeCacheInvalidationStub(): CacheInvalidationService & { invalidateShowComprehensive: Mock } {
  return {
    invalidateShowComprehensive: vi.fn().mockResolvedValue(undefined),
  } as unknown as CacheInvalidationService & { invalidateShowComprehensive: Mock };
}

describe("AnnotationService — Cloudflare year-tag wiring", () => {
  // Adding/editing notes on a past-year show has the same edge-cache shape
  // as the track all-timer bug: per-show Redis clears but `/shows/year/YYYY`
  // stays stale unless the year is purged. The cache path looks the show up
  // via the track relation — pull date alongside slug and pass the year.
  test("update() passes the show's year derived from the track's show.date", async () => {
    const db = {
      track: {
        findUnique: vi.fn().mockResolvedValue({
          showId: "show-id",
          show: { slug: "2018-07-12-red-rocks", date: "2018-07-12" },
        }),
      },
      annotation: {
        findUnique: vi.fn().mockResolvedValue({ trackId: "track-id" }),
        update: vi.fn().mockResolvedValue({
          id: "annotation-id",
          trackId: "track-id",
          desc: "Big jam",
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      },
    };
    const cache = makeCacheInvalidationStub();
    const service = new AnnotationService(db as never, logger, cache);

    await service.update("annotation-id", { desc: "Big jam" });

    expect(cache.invalidateShowComprehensive).toHaveBeenCalledWith("show-id", "2018-07-12-red-rocks", [2018]);
  });
});
