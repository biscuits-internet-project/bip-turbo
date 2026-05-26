import { describe, expect, type Mock, test, vi } from "vitest";
import type { CacheInvalidationService } from "../_shared/cache";
import type { StatsService } from "../stats/stats-service";
import { ShowService } from "./show-service";

// Minimal logger stub — show-service only calls `.info`
const logger = { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() } as never;

// Cache invalidation stub — write-path tests don't reach into it but the
// constructor requires a real-shaped service. Cast at the boundary so we
// don't have to enumerate every method.
function makeCacheInvalidationStub(): CacheInvalidationService {
  return {
    invalidateShow: vi.fn(),
    invalidateShowListings: vi.fn(),
    invalidateShowComprehensive: vi.fn(),
    invalidateSongCaches: vi.fn(),
    invalidateAllTimers: vi.fn(),
  } as unknown as CacheInvalidationService;
}

// Stats stub — preserves the Mock type on `rebuildGapsAndSongStatsSince`
// so test assertions like `expect(stats.rebuildGapsAndSongStatsSince).toHaveBeenCalledWith(...)`
// stay typed, while still accepted as a StatsService at the constructor.
function makeStatsStub(): StatsService & { rebuildGapsAndSongStatsSince: Mock } {
  return {
    rebuildGapsAndSongStatsSince: vi.fn().mockResolvedValue(undefined),
  } as unknown as StatsService & { rebuildGapsAndSongStatsSince: Mock };
}

function makeMockDb() {
  return {
    show: {
      findMany: vi.fn().mockResolvedValue([]),
      findUnique: vi.fn(),
      create: vi.fn().mockResolvedValue({
        id: "show-id",
        slug: "1999-12-31-test",
        date: "1999-12-31",
        venueId: null,
        bandId: null,
        notes: null,
        relistenUrl: null,
        legacyId: null,
        likesCount: 0,
        averageRating: 0,
        ratingsCount: 0,
        showPhotosCount: 0,
        showYoutubesCount: 0,
        reviewsCount: 0,
        countForStats: true,
        dayOrder: null,
        searchText: null,
        searchVector: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      update: vi.fn(),
      delete: vi.fn().mockResolvedValue({}),
    },
    venue: {
      findUnique: vi.fn().mockResolvedValue(null),
    },
    $transaction: vi.fn(async (ops: unknown[]) => {
      // Mirror Prisma's array-form $transaction: resolve each pre-built call.
      return Promise.all(ops as Array<Promise<unknown>>);
    }),
  };
}

describe("ShowService.getShowDatesWithFlags", () => {
  // The year page needs, for every show, whether it has photos and whether it
  // has YouTube, so counts can be bucketed by year in the loader after external
  // catalogs (nugs/archive) are joined in. This is the single DB query that
  // feeds that computation.
  test("returns date + flags for every show, derived from denormalized counts", async () => {
    const db = makeMockDb();
    db.show.findMany.mockResolvedValue([
      { date: "2004-12-31", showPhotosCount: 4, showYoutubesCount: 0 },
      { date: "2019-08-10", showPhotosCount: 0, showYoutubesCount: 2 },
      { date: "2023-06-15", showPhotosCount: 7, showYoutubesCount: 3 },
    ]);
    const service = new ShowService(db as never, logger, makeCacheInvalidationStub(), makeStatsStub());

    const result = await service.getShowDatesWithFlags();

    expect(result).toEqual([
      { date: "2004-12-31", hasPhotos: true, hasYoutube: false },
      { date: "2019-08-10", hasPhotos: false, hasYoutube: true },
      { date: "2023-06-15", hasPhotos: true, hasYoutube: true },
    ]);
  });

  // Only the date + two counts are selected — this query runs for every filter
  // toggle change on the year page, so keep it narrow.
  test("selects only the fields needed for bucketing", async () => {
    const db = makeMockDb();
    const service = new ShowService(db as never, logger, makeCacheInvalidationStub(), makeStatsStub());

    await service.getShowDatesWithFlags();

    const call = db.show.findMany.mock.calls[0][0];
    expect(call.select).toEqual({
      date: true,
      showPhotosCount: true,
      showYoutubesCount: true,
    });
  });

  // Prod has orphan placeholder shows (bare YYYY-MM-DD slug, no venue) that
  // coexist with the real show on the same date — e.g. `2025-10-31` sitting
  // beside `2025-10-31-suwannee-music-park-live-oak-fl`. Including them in the
  // per-year count over-reports by one for each date that has a stub. Filter
  // them at the SQL boundary so every caller of getShowDatesWithFlags inherits
  // the fix (the year page is the only one today; others may join later).
  test("excludes orphan stub shows that have no venue assigned", async () => {
    const db = makeMockDb();
    const service = new ShowService(db as never, logger, makeCacheInvalidationStub(), makeStatsStub());

    await service.getShowDatesWithFlags();

    const call = db.show.findMany.mock.calls[0][0];
    expect(call.where).toEqual({ venueId: { not: null } });
  });
});

describe("ShowService.reorderByDate", () => {
  // Admin reorders the same-date shows for 2017-07-22: every show in the
  // supplied id list must have its dayOrder rewritten to its new position
  // (1-indexed) inside a single transaction so listings/adjacency stay
  // consistent.
  test("rewrites dayOrder to 1..N for the supplied id sequence", async () => {
    const db = makeMockDb();
    db.show.findMany.mockImplementation(
      async ({ where, select }: { where: { id?: { in: string[] } }; select?: Record<string, true> }) => {
        // First call: validation lookup (id+date). Second call: returning rows.
        const ids = where.id?.in ?? [];
        const rows = ids.map((id) => ({
          id,
          date: "2017-07-22",
          slug: `2017-07-22-${id}`,
          dayOrder: null,
          venueId: "venue-1",
        }));
        if (select?.date && !select?.slug) {
          return rows.map(({ id, date }) => ({ id, date }));
        }
        return rows;
      },
    );
    db.show.update.mockImplementation(async (args: { where: { id: string }; data: { dayOrder: number } }) => ({
      id: args.where.id,
      dayOrder: args.data.dayOrder,
    }));
    const service = new ShowService(db as never, logger, makeCacheInvalidationStub(), makeStatsStub());

    await service.reorderByDate("2017-07-22", ["show-a", "show-b", "show-c"]);

    const updateCalls = (
      db.show.update.mock.calls as Array<[{ where: { id: string }; data: { dayOrder: number } }]>
    ).map((call) => call[0]);
    expect(updateCalls).toEqual([
      { where: { id: "show-a" }, data: expect.objectContaining({ dayOrder: 1 }) },
      { where: { id: "show-b" }, data: expect.objectContaining({ dayOrder: 2 }) },
      { where: { id: "show-c" }, data: expect.objectContaining({ dayOrder: 3 }) },
    ]);
    expect(db.$transaction).toHaveBeenCalledTimes(1);
  });

  // Guard: if the caller passes an id whose date doesn't match, refuse the
  // whole operation. Otherwise an admin could accidentally reorder a show off
  // its actual date.
  test("throws when any supplied id is not on the requested date", async () => {
    const db = makeMockDb();
    db.show.findMany.mockResolvedValue([
      { id: "good-id", date: "2017-07-22" },
      { id: "wrong-date-id", date: "2018-12-31" },
    ]);
    const service = new ShowService(db as never, logger, makeCacheInvalidationStub(), makeStatsStub());

    await expect(service.reorderByDate("2017-07-22", ["good-id", "wrong-date-id"])).rejects.toThrow(
      /not on date 2017-07-22/,
    );
    expect(db.$transaction).not.toHaveBeenCalled();
  });

  // Guard: if an id is unknown to the DB, fail closed (don't silently skip).
  test("throws when any supplied id is not found", async () => {
    const db = makeMockDb();
    db.show.findMany.mockResolvedValue([{ id: "found-id", date: "2017-07-22" }]);
    const service = new ShowService(db as never, logger, makeCacheInvalidationStub(), makeStatsStub());

    await expect(service.reorderByDate("2017-07-22", ["found-id", "missing-id"])).rejects.toThrow();
    expect(db.$transaction).not.toHaveBeenCalled();
  });
});

describe("ShowService.update countForStats", () => {
  // Admin marks a soundcheck/radio session as non-stats. The boolean must reach
  // the Prisma update payload so STATS_SHOWS_WHERE excludes it from aggregates.
  test("passes countForStats: false through to the Prisma update", async () => {
    const db = makeMockDb();
    db.show.findUnique.mockResolvedValue({
      id: "show-id",
      date: "2017-07-22",
      venueId: "venue-1",
    });
    db.show.update.mockResolvedValue({
      id: "show-id",
      slug: "2017-07-22-soundcheck",
      date: "2017-07-22",
      venueId: "venue-1",
      bandId: "band-1",
      notes: null,
      relistenUrl: null,
      countForStats: false,
      dayOrder: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      likesCount: 0,
      averageRating: 0,
      ratingsCount: 0,
      showPhotosCount: 0,
      showYoutubesCount: 0,
      reviewsCount: 0,
    });
    const service = new ShowService(db as never, logger, makeCacheInvalidationStub(), makeStatsStub());

    await service.update("2017-07-22-soundcheck", { date: "2017-07-22", countForStats: false });

    const updateArgs = db.show.update.mock.calls[0][0];
    expect(updateArgs.data.countForStats).toBe(false);
  });
});

describe("ShowService — gap rebuild on mutation", () => {
  // Adding a new show changes the universe of count_for_stats=true shows,
  // which ripples to gap chains for songs whose performances span the new
  // show's date — even songs that weren't played at the new show. The
  // rebuild is scoped to tracks at or after the new show's date so the
  // common "today's show" case stays cheap (no pre-existing tracks at
  // that date).
  test("create() rebuilds gaps from the new show's date forward", async () => {
    const db = makeMockDb();
    const stats = makeStatsStub();
    const service = new ShowService(db as never, logger, makeCacheInvalidationStub(), stats);
    const rebuild = stats.rebuildGapsAndSongStatsSince;

    await service.create({ date: "1999-12-31" });

    expect(rebuild).toHaveBeenCalledWith("1999-12-31");
  });

  // Updating a show's date moves it in the timeline. Rebuild from the
  // earlier of the old and new dates so chains spanning either side are
  // recomputed.
  test("update() with later date uses the original (earlier) date as sinceDate", async () => {
    const db = makeMockDb();
    db.show.findUnique.mockResolvedValueOnce({ id: "show-id", date: "1999-12-31", venueId: null });
    db.show.update.mockResolvedValue({
      id: "show-id",
      slug: "1999-12-31-test",
      date: "2000-01-15",
      venueId: null,
      bandId: null,
      notes: null,
      relistenUrl: null,
      legacyId: null,
      likesCount: 0,
      averageRating: 0,
      ratingsCount: 0,
      showPhotosCount: 0,
      showYoutubesCount: 0,
      reviewsCount: 0,
      countForStats: true,
      dayOrder: null,
      searchText: null,
      searchVector: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const stats = makeStatsStub();
    const service = new ShowService(db as never, logger, makeCacheInvalidationStub(), stats);
    const rebuild = stats.rebuildGapsAndSongStatsSince;

    await service.update("1999-12-31-test", { date: "2000-01-15" });

    expect(rebuild).toHaveBeenCalledWith("1999-12-31");
  });

  // Editing a show without changing its date doesn't affect any gap chain
  // (notes / relistenUrl don't enter the gap algorithm). Skip the rebuild.
  test("update() without a date change does not invoke rebuild", async () => {
    const db = makeMockDb();
    db.show.findUnique.mockResolvedValueOnce({ id: "show-id", date: "1999-12-31", venueId: null });
    db.show.update.mockResolvedValue({
      id: "show-id",
      slug: "1999-12-31-test",
      date: "1999-12-31",
      venueId: null,
      bandId: null,
      notes: "edited",
      relistenUrl: null,
      legacyId: null,
      likesCount: 0,
      averageRating: 0,
      ratingsCount: 0,
      showPhotosCount: 0,
      showYoutubesCount: 0,
      reviewsCount: 0,
      countForStats: true,
      dayOrder: null,
      searchText: null,
      searchVector: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const stats = makeStatsStub();
    const service = new ShowService(db as never, logger, makeCacheInvalidationStub(), stats);
    const rebuild = stats.rebuildGapsAndSongStatsSince;

    await service.update("1999-12-31-test", { date: "1999-12-31", notes: "edited" });

    expect(rebuild).not.toHaveBeenCalled();
  });

  // Deleting a count_for_stats=true show shrinks the denominator for
  // chains that span its date — rebuild from that date forward.
  test("delete() rebuilds gaps from the deleted show's date forward", async () => {
    const db = makeMockDb();
    db.show.findUnique.mockResolvedValueOnce({ slug: "1999-12-31-test", date: "1999-12-31" });
    const stats = makeStatsStub();
    const service = new ShowService(db as never, logger, makeCacheInvalidationStub(), stats);
    const rebuild = stats.rebuildGapsAndSongStatsSince;

    await service.delete("show-id");

    expect(rebuild).toHaveBeenCalledWith("1999-12-31");
  });
});
