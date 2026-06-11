import { Prisma } from "@prisma/client";
import { describe, expect, type Mock, test, vi } from "vitest";
import type { CacheInvalidationService } from "../_shared/cache";
import type { StatsService } from "../stats/stats-service";
import { ShowService } from "./show-service";

// Minimal logger stub — show-service only calls `.info`
const logger = { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() } as never;

// Cache invalidation stub — write-path tests don't reach into it but the
// constructor requires a real-shaped service. Cast at the boundary so we
// don't have to enumerate every method.
function makeCacheInvalidationStub(): CacheInvalidationService & {
  invalidateRockOperaAssignment: Mock;
} {
  return {
    invalidateShow: vi.fn(),
    invalidateShowListings: vi.fn(),
    invalidateShowComprehensive: vi.fn(),
    invalidateSongCaches: vi.fn(),
    invalidatePerformanceListings: vi.fn(),
    invalidateRockOperaAssignment: vi.fn(),
  } as unknown as CacheInvalidationService & { invalidateRockOperaAssignment: Mock };
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
  // Bound to a single object so $transaction(callback) passes the same
  // mock through, letting tests assert on `db.rockOperaPerformance.*.mock.calls`
  // for calls made inside the transaction.
  // biome-ignore lint/suspicious/noExplicitAny: test mock
  const db: any = {
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
    rockOpera: {
      findMany: vi.fn().mockResolvedValue([]),
    },
    rockOperaPerformance: {
      findMany: vi.fn().mockResolvedValue([]),
      deleteMany: vi.fn().mockResolvedValue({ count: 0 }),
      createMany: vi.fn().mockResolvedValue({ count: 0 }),
    },
    // Default: no seeded musicians, so create() applies an empty lineup. The
    // lineup-specific tests below override musician.findMany to seed the four.
    musician: {
      findMany: vi.fn().mockResolvedValue([]),
    },
    showMusician: {
      findMany: vi.fn().mockResolvedValue([]),
      deleteMany: vi.fn().mockResolvedValue({ count: 0 }),
      create: vi.fn().mockResolvedValue({}),
    },
  };
  db.$transaction = vi.fn(async (input: unknown) => {
    // Two forms: an array of pre-built calls, or a callback that receives
    // the tx client. Mirror both — the rock-opera diff uses the callback
    // form so it can sequence findMany → deleteMany → createMany against
    // the same tx handle.
    if (typeof input === "function") {
      return (input as (tx: unknown) => Promise<unknown>)(db);
    }
    return Promise.all(input as Array<Promise<unknown>>);
  });
  return db;
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

describe("ShowService.findAdjacentShows", () => {
  // Prod has orphan placeholder shows (bare YYYY-MM-DD slug, no venue) sitting
  // beside the real show on the same date — e.g. `2025-10-31` next to
  // `2025-10-31-suwannee-music-park-live-oak-fl`. If adjacency links to one,
  // clicking the prev/next button 404s because findByShowSlug returns null for
  // a venueless show. Both adjacency queries must exclude these.
  test("excludes venueless stub shows from both prev and next queries", async () => {
    const db = makeMockDb();
    db.show.findUnique.mockResolvedValue({ id: "current-id", dayOrder: null });
    const captured: Array<{ strings: ReadonlyArray<string>; values: unknown[] }> = [];
    db.$queryRaw = vi.fn((strings: ReadonlyArray<string>, ...values: unknown[]) => {
      captured.push({ strings, values });
      return Promise.resolve([]);
    });
    const service = new ShowService(db as never, logger, makeCacheInvalidationStub(), makeStatsStub());

    await service.findAdjacentShows("2025-10-31", "2025-10-31-suwannee-music-park-live-oak-fl");

    expect(captured).toHaveLength(2);
    for (const { strings, values } of captured) {
      const composed = Prisma.sql(strings, ...values);
      expect(composed.sql).toContain("venue_id IS NOT NULL");
    }
  });
});

describe("ShowService.search", () => {
  // Full-text search fetches shows by the ids returned from pg_search_documents.
  // Guard the fetch with the stub filter so an indexed venueless placeholder can
  // never surface as a clickable search hit that 404s.
  test("excludes venueless stub shows from the id fetch", async () => {
    const db = makeMockDb();
    db.$queryRaw = vi.fn().mockResolvedValue([]);
    const service = new ShowService(db as never, logger, makeCacheInvalidationStub(), makeStatsStub());

    await service.search("suwannee");

    const call = db.show.findMany.mock.calls[0][0];
    expect(call.where.venueId).toEqual({ not: null });
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

describe("ShowService.update — rock opera assignments", () => {
  // Helper: stock a show.update mock that returns a valid show row so the
  // outer update flow completes. The rock opera diff runs after this.
  function setupShowUpdate(db: ReturnType<typeof makeMockDb>) {
    db.show.findUnique.mockResolvedValueOnce({ id: "show-id", date: "2024-03-29", venueId: "venue-1" });
    db.show.update.mockResolvedValue({
      id: "show-id",
      slug: "2024-03-29-test",
      date: "2024-03-29",
      venueId: "venue-1",
      bandId: "band-1",
      notes: null,
      relistenUrl: null,
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
  }

  // Admin toggles rock opera tags from {A, B} to {B, C}. Expect a transactional
  // diff: A is deleted, C is inserted, B is untouched. Drives the admin form
  // "set me to exactly this list" semantics.
  test("diffs {A,B} -> {B,C} as delete A + insert C, leaves B untouched", async () => {
    const db = makeMockDb();
    setupShowUpdate(db);
    // Current rock opera tags for the show
    db.rockOperaPerformance.findMany.mockResolvedValueOnce([
      { rockOperaId: "ro-A", rockOpera: { slug: "opera-A" } },
      { rockOperaId: "ro-B", rockOpera: { slug: "opera-B" } },
    ]);
    const service = new ShowService(db as never, logger, makeCacheInvalidationStub(), makeStatsStub());

    await service.update("2024-03-29-test", {
      date: "2024-03-29",
      rockOperaIds: ["ro-B", "ro-C"],
    });

    expect(db.rockOperaPerformance.deleteMany).toHaveBeenCalledWith({
      where: { showId: "show-id", rockOperaId: { in: ["ro-A"] } },
    });
    expect(db.rockOperaPerformance.createMany).toHaveBeenCalledWith({
      data: [{ showId: "show-id", rockOperaId: "ro-C" }],
    });
  });

  // No rock opera change → no diff queries fired. Untouched edits (notes
  // only, etc.) shouldn't read or write the join table.
  test("does not touch rock opera tables when rockOperaIds is omitted", async () => {
    const db = makeMockDb();
    setupShowUpdate(db);
    const service = new ShowService(db as never, logger, makeCacheInvalidationStub(), makeStatsStub());

    await service.update("2024-03-29-test", { date: "2024-03-29", notes: "edited" });

    expect(db.rockOperaPerformance.findMany).not.toHaveBeenCalled();
    expect(db.rockOperaPerformance.deleteMany).not.toHaveBeenCalled();
    expect(db.rockOperaPerformance.createMany).not.toHaveBeenCalled();
  });

  // Empty array semantics: caller is saying "this show has no rock opera
  // tags". Delete every existing row for the show, insert nothing.
  test("clears all tags when rockOperaIds is an empty array", async () => {
    const db = makeMockDb();
    setupShowUpdate(db);
    db.rockOperaPerformance.findMany.mockResolvedValueOnce([
      { rockOperaId: "ro-A", rockOpera: { slug: "opera-A" } },
      { rockOperaId: "ro-B", rockOpera: { slug: "opera-B" } },
    ]);
    const service = new ShowService(db as never, logger, makeCacheInvalidationStub(), makeStatsStub());

    await service.update("2024-03-29-test", { date: "2024-03-29", rockOperaIds: [] });

    expect(db.rockOperaPerformance.deleteMany).toHaveBeenCalledWith({
      where: { showId: "show-id", rockOperaId: { in: ["ro-A", "ro-B"] } },
    });
    expect(db.rockOperaPerformance.createMany).not.toHaveBeenCalled();
  });

  // No-op diff (current set === new set): no writes, no cache invalidation
  // for rock operas. The outer show comprehensive invalidation still fires.
  test("no DB writes or rock opera cache invalidation when tags are unchanged", async () => {
    const db = makeMockDb();
    setupShowUpdate(db);
    db.rockOperaPerformance.findMany.mockResolvedValueOnce([
      { rockOperaId: "ro-A", rockOpera: { slug: "opera-A" } },
      { rockOperaId: "ro-B", rockOpera: { slug: "opera-B" } },
    ]);
    const cacheStub = makeCacheInvalidationStub();
    const service = new ShowService(db as never, logger, cacheStub, makeStatsStub());

    await service.update("2024-03-29-test", { date: "2024-03-29", rockOperaIds: ["ro-A", "ro-B"] });

    expect(db.rockOperaPerformance.deleteMany).not.toHaveBeenCalled();
    expect(db.rockOperaPerformance.createMany).not.toHaveBeenCalled();
    expect(cacheStub.invalidateRockOperaAssignment).not.toHaveBeenCalled();
  });

  // Cache invalidation fires for the union of removed + added slugs (so
  // both opera-A's resource page list and opera-C's are refreshed).
  // Neighbor-show invalidation (every other tagged show's annotation
  // rank shifting) is handled at the broader invalidateShowListings
  // layer via the show.data:* pattern delete — see
  // cache-invalidation-service.test.ts.
  test("invalidates rock opera caches for the union of removed + added slugs", async () => {
    const db = makeMockDb();
    setupShowUpdate(db);
    db.rockOperaPerformance.findMany.mockResolvedValueOnce([
      { rockOperaId: "ro-A", rockOpera: { slug: "opera-A" } },
      { rockOperaId: "ro-B", rockOpera: { slug: "opera-B" } },
    ]);
    // Resolve newly-added opera-C's slug for cache invalidation
    db.rockOpera.findMany.mockResolvedValueOnce([{ id: "ro-C", slug: "opera-C" }]);
    const cacheStub = makeCacheInvalidationStub();
    const service = new ShowService(db as never, logger, cacheStub, makeStatsStub());

    await service.update("2024-03-29-test", { date: "2024-03-29", rockOperaIds: ["ro-B", "ro-C"] });

    expect(cacheStub.invalidateRockOperaAssignment).toHaveBeenCalledWith(
      expect.arrayContaining(["opera-A", "opera-C"]),
    );
    // opera-B is untouched (in both sets) — should not appear in invalidation list.
    const invalidatedSlugs = (cacheStub.invalidateRockOperaAssignment as Mock).mock.calls[0][0] as string[];
    expect(invalidatedSlugs).not.toContain("opera-B");
  });
});

describe("ShowService — Cloudflare year-tag wiring", () => {
  // create() lacks a "current year" to fall back on, so the new show's date
  // is the only source of the year tag. Admin-creating a past-year show
  // (e.g. a missing late-90s show) must purge that year's listing tag, not
  // the current calendar year.
  test("create() passes the new show's year to invalidateShowListings", async () => {
    const db = makeMockDb();
    const cacheStub = makeCacheInvalidationStub();
    const service = new ShowService(db as never, logger, cacheStub, makeStatsStub());

    await service.create({ date: "1999-12-31" });

    expect(cacheStub.invalidateShowListings).toHaveBeenCalledWith([1999]);
  });

  // delete() reads the show's date before removing the row (also used by
  // the stats rebuild). The Cloudflare purge for the deleted show's year
  // must use that captured date, not the current year — otherwise
  // /shows/year/2018 keeps showing the deleted row at the edge.
  test("delete() passes the deleted show's year to invalidateShowComprehensive", async () => {
    const db = makeMockDb();
    db.show.findUnique.mockResolvedValueOnce({ slug: "2018-07-12-red-rocks", date: "2018-07-12" });
    const cacheStub = makeCacheInvalidationStub();
    const service = new ShowService(db as never, logger, cacheStub, makeStatsStub());

    await service.delete("show-id");

    expect(cacheStub.invalidateShowComprehensive).toHaveBeenCalledWith("show-id", "2018-07-12-red-rocks", [2018]);
  });

  // The show's actual year (not the current calendar year) must reach
  // invalidateShowComprehensive so the `year-YYYY` Cloudflare tag for
  // `/shows/year/YYYY` gets purged. Without this wiring, a past-year edit
  // would clear Redis but leave the edge entry stale until s-maxage
  // (24h for past years).
  test("update() without a date change passes the show's year to invalidateShowComprehensive", async () => {
    const db = makeMockDb();
    db.show.findUnique.mockResolvedValueOnce({ id: "show-id", date: "2018-07-12", venueId: "venue-1" });
    db.show.update.mockResolvedValue({
      id: "show-id",
      slug: "2018-07-12-red-rocks",
      date: "2018-07-12",
      venueId: "venue-1",
      bandId: null,
      notes: "edited",
      relistenUrl: null,
      countForStats: true,
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
    const cacheStub = makeCacheInvalidationStub();
    const service = new ShowService(db as never, logger, cacheStub, makeStatsStub());

    await service.update("2018-07-12-red-rocks", { date: "", notes: "edited" });

    expect(cacheStub.invalidateShowComprehensive).toHaveBeenCalledWith("show-id", "2018-07-12-red-rocks", [2018]);
  });

  // A date-move across calendar years (2018 -> 2019) has to purge BOTH year
  // tags: the old year so its listing evicts the now-misplaced row, the new
  // year so its listing picks up the row. The slug also changes in this
  // case so the call path goes through invalidateShowListings, not
  // invalidateShowComprehensive.
  test("update() with cross-year date move passes both old and new years", async () => {
    const db = makeMockDb();
    db.show.findUnique
      .mockResolvedValueOnce({ id: "show-id", date: "2018-07-12", venueId: "venue-1" })
      // generateShowSlug looks for slug collisions
      .mockResolvedValueOnce(null);
    db.show.update.mockResolvedValue({
      id: "show-id",
      slug: "2019-07-12-red-rocks",
      date: "2019-07-12",
      venueId: "venue-1",
      bandId: null,
      notes: null,
      relistenUrl: null,
      countForStats: true,
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
    db.venue.findUnique.mockResolvedValue({ name: "Red Rocks", city: "Morrison", state: "CO" });
    const cacheStub = makeCacheInvalidationStub();
    const service = new ShowService(db as never, logger, cacheStub, makeStatsStub());

    await service.update("2018-07-12-red-rocks", { date: "2019-07-12" });

    const listingsCall = (cacheStub.invalidateShowListings as Mock).mock.calls[0][0] as number[];
    expect(listingsCall).toEqual(expect.arrayContaining([2018, 2019]));
    expect(listingsCall).toHaveLength(2);
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

describe("ShowService — default lineup on create", () => {
  // A new show inherits the current band makeup. With the four Marlon-era
  // members seeded, create() writes a ShowMusician row per member using each
  // musician's default instrument.
  test("applies the four seeded members as the new show's lineup", async () => {
    const db = makeMockDb();
    db.musician.findMany.mockResolvedValue([
      { id: "m-jon", slug: "jon-gutwillig", defaultInstrumentId: "i-guitar" },
      { id: "m-marc", slug: "marc-brownstein", defaultInstrumentId: "i-bass" },
      { id: "m-aron", slug: "aron-magner", defaultInstrumentId: "i-keys" },
      { id: "m-marlon", slug: "marlon-lewis", defaultInstrumentId: "i-drums" },
    ]);
    const service = new ShowService(db as never, logger, makeCacheInvalidationStub(), makeStatsStub());

    await service.create({ date: "1999-12-31" });

    expect(db.showMusician.create).toHaveBeenCalledTimes(4);
    const written = db.showMusician.create.mock.calls.map(
      (c: [{ data: { musicianId: string; instruments?: { create: { instrumentId: string }[] } } }]) => ({
        musicianId: c[0].data.musicianId,
        instrumentIds: (c[0].data.instruments?.create ?? []).map((i) => i.instrumentId),
      }),
    );
    expect(written).toContainEqual({ musicianId: "m-marlon", instrumentIds: ["i-drums"] });
    expect(written).toContainEqual({ musicianId: "m-jon", instrumentIds: ["i-guitar"] });
  });

  // Missing seeds (fresh DB, or a sync that ran before seeding) must not break
  // show creation — the lineup is left empty and a warning is logged.
  test("creates with an empty lineup and warns when seeds are missing", async () => {
    const db = makeMockDb();
    db.musician.findMany.mockResolvedValue([]);
    const warn = vi.fn();
    const partialLogger = { info: vi.fn(), warn, error: vi.fn(), debug: vi.fn() } as never;
    const service = new ShowService(db as never, partialLogger, makeCacheInvalidationStub(), makeStatsStub());

    await expect(service.create({ date: "1999-12-31" })).resolves.toBeTruthy();

    expect(db.showMusician.create).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalled();
  });

  // The edit page renders the lineup with the same ShowLineupSection component
  // as the public show page, so getLineup resolves musician + instrument names
  // (ShowLineupMember[]), not just ids.
  test("getLineup returns resolved ShowLineupMember entries", async () => {
    const db = makeMockDb();
    const now = new Date();
    db.showMusician.findMany.mockResolvedValue([
      {
        musician: {
          id: "m-marc",
          name: "Marc Brownstein",
          slug: "marc-brownstein",
          knownFrom: null,
          defaultInstrument: null,
        },
        instruments: [
          { instrument: { id: "i-bass", name: "Bass", slug: "bass", createdAt: now, updatedAt: now } },
          { instrument: { id: "i-vocals", name: "Vocals", slug: "vocals", createdAt: now, updatedAt: now } },
        ],
      },
    ]);
    const service = new ShowService(db as never, logger, makeCacheInvalidationStub(), makeStatsStub());

    const lineup = await service.getLineup("show-id");

    expect(db.showMusician.findMany.mock.calls[0][0]).toMatchObject({ where: { showId: "show-id" } });
    expect(lineup).toEqual([
      {
        musician: {
          id: "m-marc",
          name: "Marc Brownstein",
          slug: "marc-brownstein",
          knownFrom: null,
          defaultInstrument: null,
        },
        instruments: [
          { id: "i-bass", name: "Bass", slug: "bass", createdAt: now, updatedAt: now },
          { id: "i-vocals", name: "Vocals", slug: "vocals", createdAt: now, updatedAt: now },
        ],
      },
    ]);
  });

  // A show with no lineup rows yields an empty list (not null), so the editor
  // renders an empty form rather than crashing.
  test("getLineup returns an empty array when the show has no lineup", async () => {
    const db = makeMockDb();
    db.showMusician.findMany.mockResolvedValue([]);
    const service = new ShowService(db as never, logger, makeCacheInvalidationStub(), makeStatsStub());

    expect(await service.getLineup("show-id")).toEqual([]);
  });

  // setLineup is a full-set replace: existing rows are deleted, then the new
  // entries inserted, and the show's caches invalidated.
  test("setLineup deletes existing rows, inserts the new entries, and invalidates", async () => {
    const db = makeMockDb();
    db.show.findUnique.mockResolvedValue({ slug: "1999-12-31-test", date: "1999-12-31" });
    const cache = makeCacheInvalidationStub();
    const service = new ShowService(db as never, logger, cache, makeStatsStub());

    await service.setLineup("show-id", [{ musicianId: "m-1", instrumentIds: ["i-1"] }]);

    expect(db.showMusician.deleteMany).toHaveBeenCalledWith({ where: { showId: "show-id" } });
    expect(db.showMusician.create).toHaveBeenCalledTimes(1);
    expect(cache.invalidateShowComprehensive).toHaveBeenCalledWith("show-id", "1999-12-31-test", [1999]);
  });
});
