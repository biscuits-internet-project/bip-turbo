import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CacheInvalidationService } from "../_shared/cache";
import type { DbClient } from "../_shared/database/models";
import { runPendingRecompute } from "./recompute-pending";
import type { StatsService } from "./stats-service";

/**
 * The deploy-time consumer turns a queued stats_recompute_requests row into a
 * single rebuild from the earliest date and clears the queue. These pin the two
 * branches the typechecker can't see: pending -> rebuild + clear, empty -> no-op.
 */
describe("runPendingRecompute", () => {
  let db: { statsRecomputeRequest: { aggregate: ReturnType<typeof vi.fn>; deleteMany: ReturnType<typeof vi.fn> } };
  let stats: { rebuildGapsAndSongStatsSince: ReturnType<typeof vi.fn> };
  let cacheInvalidation: {
    invalidateShowListings: ReturnType<typeof vi.fn>;
    invalidateSongCaches: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    db = {
      statsRecomputeRequest: {
        aggregate: vi.fn(),
        deleteMany: vi.fn().mockResolvedValue({ count: 0 }),
      },
    };
    stats = { rebuildGapsAndSongStatsSince: vi.fn().mockResolvedValue(undefined) };
    cacheInvalidation = {
      invalidateShowListings: vi.fn().mockResolvedValue(undefined),
      invalidateSongCaches: vi.fn().mockResolvedValue(undefined),
    };
  });

  function deps() {
    return {
      db: db as unknown as DbClient,
      stats: stats as unknown as StatsService,
      cacheInvalidation: cacheInvalidation as unknown as CacheInvalidationService,
    };
  }

  it("recomputes from the earliest pending date and clears the queue", async () => {
    db.statsRecomputeRequest.aggregate.mockResolvedValue({ _min: { sinceDate: new Date("2024-01-01T00:00:00Z") } });

    await runPendingRecompute(deps());

    expect(stats.rebuildGapsAndSongStatsSince).toHaveBeenCalledWith("2024-01-01");
    expect(cacheInvalidation.invalidateSongCaches).toHaveBeenCalled();
    expect(db.statsRecomputeRequest.deleteMany).toHaveBeenCalled();
  });

  it("is a no-op when there are no pending requests", async () => {
    db.statsRecomputeRequest.aggregate.mockResolvedValue({ _min: { sinceDate: null } });

    await runPendingRecompute(deps());

    expect(stats.rebuildGapsAndSongStatsSince).not.toHaveBeenCalled();
    expect(db.statsRecomputeRequest.deleteMany).not.toHaveBeenCalled();
  });
});
