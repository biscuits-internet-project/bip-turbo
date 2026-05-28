import { describe, expect, test, vi } from "vitest";
import { RatingService } from "./rating-service";

// Minimal stub — service only invalidates caches at write paths; the read
// methods under test don't touch it.
const cacheInvalidation = {
  invalidateAttendanceCaches: vi.fn(),
  invalidateShow: vi.fn(),
  invalidateShowComprehensive: vi.fn(),
} as never;

// Flattens a $queryRaw mock call (TemplateStringsArray + Prisma.Sql
// interpolations) into a single SQL string so tests can assert on the
// composed ORDER BY clause. Prisma.Sql exposes its template parts under
// `.strings`; nested Prisma.sql fragments are spliced in. Cribs the same
// pattern used by song-page-composer.test.ts.
function flattenSqlFromMockCall(call: unknown[]): string {
  const [templateStrings, ...interpolations] = call as [readonly string[], ...unknown[]];
  const parts: string[] = [];
  for (let i = 0; i < templateStrings.length; i++) {
    parts.push(templateStrings[i]);
    if (i < interpolations.length) {
      const v = interpolations[i];
      if (v && typeof v === "object" && Array.isArray((v as { strings?: unknown[] }).strings)) {
        parts.push((v as { strings: string[] }).strings.join(" ? "));
      } else {
        parts.push("?");
      }
    }
  }
  return parts.join("");
}

type ShowRatingRow = {
  id: string;
  value: number;
  created_at: Date;
  show_slug: string;
  show_date: string;
  venue_name: string | null;
  venue_city: string | null;
  venue_state: string | null;
};

function showRatingRow(overrides: Partial<ShowRatingRow> = {}): ShowRatingRow {
  return {
    id: "r1",
    value: 5,
    created_at: new Date("2024-01-01T00:00:00Z"),
    show_slug: "2024-08-12-cap-theatre",
    show_date: "2024-08-12",
    venue_name: "The Capitol Theatre",
    venue_city: "Port Chester",
    venue_state: "NY",
    ...overrides,
  };
}

describe("RatingService.findShowRatingsByUserId", () => {
  // Default ordering is `date` desc, and same-day rows must break ties on
  // `day_order` (NULLS FIRST under DESC) then `id` — the standard show
  // ordering. Asserting `showOrderBySql` is wired in (not a hand-rolled
  // `s.date DESC`) keeps same-day rated shows in canonical order across
  // pages.
  test("default sort=date desc orders via showOrderBySql with createdAt tiebreaker", async () => {
    const queryRaw = vi.fn().mockResolvedValue([]);
    const db = { $queryRaw: queryRaw } as never;
    const service = new RatingService(db, cacheInvalidation);

    await service.findShowRatingsByUserId("u1");

    expect(queryRaw).toHaveBeenCalledTimes(1);
    const sql = flattenSqlFromMockCall(queryRaw.mock.calls[0]);
    expect(sql).toMatch(/s\.date\s+DESC/);
    expect(sql).toMatch(/COALESCE\(s\.day_order/);
    expect(sql).toMatch(/r\.created_at\s+DESC/);
  });

  // The slim shape — id/value/createdAt + nested slug/date/venue trio —
  // is what the user-profile route renders. Anything wider re-bloats the
  // heaviest users' page payload.
  test("maps rows into the slim shape (no userId/rateableId/updatedAt)", async () => {
    const queryRaw = vi.fn().mockResolvedValue([showRatingRow()]);
    const db = { $queryRaw: queryRaw } as never;
    const service = new RatingService(db, cacheInvalidation);

    const result = await service.findShowRatingsByUserId("u1");

    expect(result).toEqual([
      {
        id: "r1",
        value: 5,
        createdAt: new Date("2024-01-01T00:00:00Z"),
        show: {
          slug: "2024-08-12-cap-theatre",
          date: "2024-08-12",
          venue: { name: "The Capitol Theatre", city: "Port Chester", state: "NY" },
        },
      },
    ]);
    expect(result[0]).not.toHaveProperty("userId");
    expect(result[0]).not.toHaveProperty("rateableId");
    expect(result[0]).not.toHaveProperty("rateableType");
    expect(result[0]).not.toHaveProperty("updatedAt");
  });

  // A null venue (rating against a show that's been venue-scrubbed)
  // surfaces as `show.venue: null`, mirroring the previous two-query
  // implementation. The route renders "Unknown Venue" against null.
  test("returns show.venue = null when venue_name is null", async () => {
    const queryRaw = vi
      .fn()
      .mockResolvedValue([showRatingRow({ venue_name: null, venue_city: null, venue_state: null })]);
    const db = { $queryRaw: queryRaw } as never;
    const service = new RatingService(db, cacheInvalidation);

    const result = await service.findShowRatingsByUserId("u1");

    expect(result[0].show.venue).toBeNull();
  });

  // Heavy users (~1,700 show ratings) need server-side pagination —
  // shipping all rows on every load costs hundreds of KB. The service
  // accepts skip/take and inlines them into LIMIT/OFFSET so the slice is
  // applied at the DB level, not in JS.
  test("supports skip/take pagination via LIMIT/OFFSET", async () => {
    const queryRaw = vi.fn().mockResolvedValue([]);
    const db = { $queryRaw: queryRaw } as never;
    const service = new RatingService(db, cacheInvalidation);

    await service.findShowRatingsByUserId("u1", { skip: 200, take: 100 });

    const call = queryRaw.mock.calls[0];
    const sql = flattenSqlFromMockCall(call);
    expect(sql).toMatch(/LIMIT\s+\$?\?/);
    expect(sql).toMatch(/OFFSET\s+\$?\?/);
    // 200 (skip) and 100 (take) bound as parameters; the user id is
    // also bound, so we don't pin a specific index.
    const interpolations = call.slice(1);
    expect(interpolations).toContain(200);
    expect(interpolations).toContain(100);
  });

  // INNER JOIN against shows means orphaned ratings (show deleted but
  // rating row remains) silently drop at the SQL layer rather than
  // crashing the user profile.
  test("uses INNER JOIN against shows so orphaned ratings drop", async () => {
    const queryRaw = vi.fn().mockResolvedValue([]);
    const db = { $queryRaw: queryRaw } as never;
    const service = new RatingService(db, cacheInvalidation);

    await service.findShowRatingsByUserId("u1");

    const sql = flattenSqlFromMockCall(queryRaw.mock.calls[0]);
    expect(sql).toMatch(/INNER\s+JOIN\s+shows\s+s\b/i);
  });

  // sort=rating desc: rating.value primary, show order DESC tiebreaker,
  // rating.createdAt DESC as the final stability key. Spec lives in the
  // plan file.
  test("sort=rating desc orders by r.value then showOrderBySql DESC then createdAt", async () => {
    const queryRaw = vi.fn().mockResolvedValue([]);
    const db = { $queryRaw: queryRaw } as never;
    const service = new RatingService(db, cacheInvalidation);

    await service.findShowRatingsByUserId("u1", { sort: "rating", direction: "desc" });

    const sql = flattenSqlFromMockCall(queryRaw.mock.calls[0]);
    expect(sql).toMatch(/ORDER\s+BY[\s\S]*r\.value\s+DESC[\s\S]*s\.date\s+DESC[\s\S]*r\.created_at\s+DESC/i);
  });

  // Tiebreakers follow the primary direction — sort=modified asc means the
  // showOrderBySql tiebreaker is ASC as well, so a "reverse sort" reverses
  // the whole ordering top-to-bottom rather than mixing directions.
  test("sort=modified asc orders by r.created_at then showOrderBySql ASC", async () => {
    const queryRaw = vi.fn().mockResolvedValue([]);
    const db = { $queryRaw: queryRaw } as never;
    const service = new RatingService(db, cacheInvalidation);

    await service.findShowRatingsByUserId("u1", { sort: "modified", direction: "asc" });

    const sql = flattenSqlFromMockCall(queryRaw.mock.calls[0]);
    expect(sql).toMatch(/ORDER\s+BY[\s\S]*r\.created_at\s+ASC[\s\S]*s\.date\s+ASC/i);
  });
});

type TrackRatingRow = {
  id: string;
  value: number;
  created_at: Date;
  track_slug: string | null;
  track_position: number;
  track_set: string;
  encores_in_set: number | bigint;
  show_slug: string | null;
  show_date: string;
  venue_name: string | null;
  song_slug: string;
  song_title: string;
};

function trackRatingRow(overrides: Partial<TrackRatingRow> = {}): TrackRatingRow {
  return {
    id: "r1",
    value: 5,
    created_at: new Date("2024-01-01T00:00:00Z"),
    track_slug: "basis-for-a-day-2024-08-12",
    track_position: 3,
    track_set: "S1",
    encores_in_set: 1,
    show_slug: "2024-08-12-cap-theatre",
    show_date: "2024-08-12",
    venue_name: "The Capitol Theatre",
    song_slug: "basis-for-a-day",
    song_title: "Basis for a Day",
    ...overrides,
  };
}

describe("RatingService.findTrackRatingsByUserId", () => {
  // Default sort=date desc: show date primary via showOrderBySql, then
  // set ordinal + track position as tiebreakers — and tiebreakers share
  // the primary direction (DESC), so within a show the row order is
  // encore-first / late-set-first when reading top-down.
  test("default sort=date desc orders by showOrderBySql DESC then set + position DESC", async () => {
    const queryRaw = vi.fn().mockResolvedValue([]);
    const db = { $queryRaw: queryRaw } as never;
    const service = new RatingService(db, cacheInvalidation);

    await service.findTrackRatingsByUserId("u1");

    expect(queryRaw).toHaveBeenCalledTimes(1);
    const sql = flattenSqlFromMockCall(queryRaw.mock.calls[0]);
    expect(sql).toMatch(/s\.date\s+DESC/);
    expect(sql).toMatch(/COALESCE\(s\.day_order/);
    expect(sql).toMatch(/CASE\s+LOWER\(t\.set\)[\s\S]*DESC/);
    expect(sql).toMatch(/t\.position\s+DESC/);
  });

  // Slim shape: id/value/createdAt + nested track {slug, position, set,
  // show {slug, date, venue {name}}, song {slug, title}}. Anything wider
  // re-bloats the heaviest users' payload (~7,800 rows).
  test("maps rows into the slim shape", async () => {
    const queryRaw = vi.fn().mockResolvedValue([trackRatingRow()]);
    const db = { $queryRaw: queryRaw } as never;
    const service = new RatingService(db, cacheInvalidation);

    const result = await service.findTrackRatingsByUserId("u1");

    expect(result).toEqual([
      {
        id: "r1",
        value: 5,
        createdAt: new Date("2024-01-01T00:00:00Z"),
        track: {
          slug: "basis-for-a-day-2024-08-12",
          position: 3,
          set: "S1",
          encoresInSet: 1,
          show: {
            slug: "2024-08-12-cap-theatre",
            date: "2024-08-12",
            venue: { name: "The Capitol Theatre" },
          },
          song: { slug: "basis-for-a-day", title: "Basis for a Day" },
        },
      },
    ]);
    expect(result[0]).not.toHaveProperty("userId");
    expect(result[0].track).not.toHaveProperty("id");
    expect(result[0].track.show.venue).not.toHaveProperty("city");
    expect(result[0].track.show.venue).not.toHaveProperty("state");
  });

  test("returns track.show.venue = null when venue_name is null", async () => {
    const queryRaw = vi.fn().mockResolvedValue([trackRatingRow({ venue_name: null })]);
    const db = { $queryRaw: queryRaw } as never;
    const service = new RatingService(db, cacheInvalidation);

    const result = await service.findTrackRatingsByUserId("u1");

    expect(result[0].track.show.venue).toBeNull();
  });

  test("supports skip/take pagination via LIMIT/OFFSET", async () => {
    const queryRaw = vi.fn().mockResolvedValue([]);
    const db = { $queryRaw: queryRaw } as never;
    const service = new RatingService(db, cacheInvalidation);

    await service.findTrackRatingsByUserId("u1", { skip: 100, take: 100 });

    const interpolations = queryRaw.mock.calls[0].slice(1);
    expect(interpolations).toContain(100);
  });

  // sort=set asc: set ordinal primary, position next, show order last —
  // all share ASC so reversing the sort reverses the entire reading.
  test("sort=set asc orders by setSortKeySql ASC then position ASC then showOrderBySql ASC", async () => {
    const queryRaw = vi.fn().mockResolvedValue([]);
    const db = { $queryRaw: queryRaw } as never;
    const service = new RatingService(db, cacheInvalidation);

    await service.findTrackRatingsByUserId("u1", { sort: "set", direction: "asc" });

    const sql = flattenSqlFromMockCall(queryRaw.mock.calls[0]);
    expect(sql).toMatch(
      /ORDER\s+BY[\s\S]*CASE\s+LOWER\(t\.set\)[\s\S]*ASC[\s\S]*t\.position\s+ASC[\s\S]*s\.date\s+ASC/i,
    );
  });

  // sort=track asc: position primary, set ordinal next, all ASC.
  test("sort=track asc orders by position ASC then setSortKeySql ASC then showOrderBySql ASC", async () => {
    const queryRaw = vi.fn().mockResolvedValue([]);
    const db = { $queryRaw: queryRaw } as never;
    const service = new RatingService(db, cacheInvalidation);

    await service.findTrackRatingsByUserId("u1", { sort: "track", direction: "asc" });

    const sql = flattenSqlFromMockCall(queryRaw.mock.calls[0]);
    expect(sql).toMatch(
      /ORDER\s+BY[\s\S]*t\.position\s+ASC[\s\S]*CASE\s+LOWER\(t\.set\)[\s\S]*ASC[\s\S]*s\.date\s+ASC/i,
    );
  });

  // sort=song asc: case-insensitive title alphabetic.
  test("sort=song asc orders by LOWER(song.title)", async () => {
    const queryRaw = vi.fn().mockResolvedValue([]);
    const db = { $queryRaw: queryRaw } as never;
    const service = new RatingService(db, cacheInvalidation);

    await service.findTrackRatingsByUserId("u1", { sort: "song", direction: "asc" });

    const sql = flattenSqlFromMockCall(queryRaw.mock.calls[0]);
    expect(sql).toMatch(/ORDER\s+BY[\s\S]*LOWER\(sg\.title\)\s+ASC/i);
  });

  // sort=rating desc: value primary, show order DESC, set/position tiebreakers.
  test("sort=rating desc orders by r.value then showOrderBySql then set/position", async () => {
    const queryRaw = vi.fn().mockResolvedValue([]);
    const db = { $queryRaw: queryRaw } as never;
    const service = new RatingService(db, cacheInvalidation);

    await service.findTrackRatingsByUserId("u1", { sort: "rating", direction: "desc" });

    const sql = flattenSqlFromMockCall(queryRaw.mock.calls[0]);
    expect(sql).toMatch(
      /ORDER\s+BY[\s\S]*r\.value\s+DESC[\s\S]*s\.date\s+DESC[\s\S]*CASE\s+LOWER\(t\.set\)[\s\S]*t\.position/i,
    );
  });

  test("sort=modified asc orders by r.created_at then showOrderBySql ASC", async () => {
    const queryRaw = vi.fn().mockResolvedValue([]);
    const db = { $queryRaw: queryRaw } as never;
    const service = new RatingService(db, cacheInvalidation);

    await service.findTrackRatingsByUserId("u1", { sort: "modified", direction: "asc" });

    const sql = flattenSqlFromMockCall(queryRaw.mock.calls[0]);
    expect(sql).toMatch(/ORDER\s+BY[\s\S]*r\.created_at\s+ASC[\s\S]*s\.date\s+ASC/i);
  });

  // The cell renderer needs to know how many distinct encores the show
  // has so it can collapse "E1" → "E" on single-encore shows. The query
  // computes that via a per-row scalar subquery counting distinct
  // /^E\d+$/ set labels on the row's show.
  test("projects encores_in_set via a per-row tracks subquery", async () => {
    const queryRaw = vi.fn().mockResolvedValue([]);
    const db = { $queryRaw: queryRaw } as never;
    const service = new RatingService(db, cacheInvalidation);

    await service.findTrackRatingsByUserId("u1");

    const sql = flattenSqlFromMockCall(queryRaw.mock.calls[0]);
    expect(sql).toMatch(/COUNT\(DISTINCT\s+t2\.set\)/i);
    expect(sql).toMatch(/t2\.show_id\s*=\s*t\.show_id/i);
    expect(sql).toMatch(/'\^E\[0-9\]\+\$'/);
    expect(sql).toMatch(/AS\s+encores_in_set/i);
  });

  // Verify the projected count actually threads through to track.encoresInSet
  // on the returned row shape, so the cell can pass it to formatSetLabel.
  test("exposes encoresInSet on the returned track shape", async () => {
    const queryRaw = vi.fn().mockResolvedValue([trackRatingRow({ track_set: "E1", encores_in_set: 1 })]);
    const db = { $queryRaw: queryRaw } as never;
    const service = new RatingService(db, cacheInvalidation);

    const result = await service.findTrackRatingsByUserId("u1");

    expect(result[0].track.encoresInSet).toBe(1);
  });

  test("INNER JOINs tracks/shows/songs so orphan ratings drop", async () => {
    const queryRaw = vi.fn().mockResolvedValue([]);
    const db = { $queryRaw: queryRaw } as never;
    const service = new RatingService(db, cacheInvalidation);

    await service.findTrackRatingsByUserId("u1");

    const sql = flattenSqlFromMockCall(queryRaw.mock.calls[0]);
    expect(sql).toMatch(/INNER\s+JOIN\s+tracks\s+t\b/i);
    expect(sql).toMatch(/INNER\s+JOIN\s+shows\s+s\b/i);
    expect(sql).toMatch(/INNER\s+JOIN\s+songs\s+sg\b/i);
  });
});

describe("RatingService.clearForUser", () => {
  // Clearing deletes the user's row for the rateable and returns the
  // recomputed average/count. The denormalized averageRating + ratingsCount
  // on the show/track row stays consistent because the same recompute path
  // runs as on upsert.
  test("deletes the user's rating row and recomputes the rateable's denormalized average", async () => {
    const deleteMany = vi.fn().mockResolvedValue({ count: 1 });
    const aggregate = vi.fn().mockResolvedValue({
      _avg: { value: 4.2 },
      _count: { id: 5 },
    });
    const showUpdate = vi.fn().mockResolvedValue(undefined);
    const db = {
      rating: { deleteMany, aggregate },
      show: { update: showUpdate },
      track: { update: vi.fn() },
    } as never;

    const service = new RatingService(db, cacheInvalidation);
    const result = await service.clearForUser({ rateableId: "show-1", rateableType: "Show", userId: "u1" });

    expect(result).toEqual({ averageRating: 4.2, ratingsCount: 5 });
    // The right row is targeted: user + rateable + type triple.
    expect(deleteMany).toHaveBeenCalledWith({
      where: { userId: "u1", rateableId: "show-1", rateableType: "Show" },
    });
    // Recompute path ran against the same rateable.
    expect(aggregate).toHaveBeenCalledWith(
      expect.objectContaining({ where: { rateableId: "show-1", rateableType: "Show" } }),
    );
    // Denormalized fields on the Show row got the recomputed values.
    expect(showUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "show-1" },
        data: expect.objectContaining({ averageRating: 4.2, ratingsCount: 5 }),
      }),
    );
  });

  // When the cleared rating was the only one, the average drops to 0 and
  // count to 0 (Prisma aggregate returns null for _avg.value on empty sets;
  // the service coerces to 0 to match the upsert path).
  test("returns 0/0 when the cleared rating was the only one for the rateable", async () => {
    const db = {
      rating: {
        deleteMany: vi.fn().mockResolvedValue({ count: 1 }),
        aggregate: vi.fn().mockResolvedValue({ _avg: { value: null }, _count: { id: 0 } }),
      },
      show: { update: vi.fn() },
      track: { update: vi.fn() },
    } as never;

    const service = new RatingService(db, cacheInvalidation);
    const result = await service.clearForUser({ rateableId: "show-1", rateableType: "Show", userId: "u1" });

    expect(result).toEqual({ averageRating: 0, ratingsCount: 0 });
  });

  // Track ratings hit the Track table for the denormalized recompute; the
  // Show table stays untouched.
  test("recomputes the track row when rateableType is Track", async () => {
    const showUpdate = vi.fn();
    const trackUpdate = vi.fn();
    const db = {
      rating: {
        deleteMany: vi.fn().mockResolvedValue({ count: 1 }),
        aggregate: vi.fn().mockResolvedValue({ _avg: { value: 3.5 }, _count: { id: 2 } }),
      },
      show: { update: showUpdate },
      track: { update: trackUpdate },
    } as never;

    const service = new RatingService(db, cacheInvalidation);
    await service.clearForUser({ rateableId: "track-1", rateableType: "Track", userId: "u1" });

    expect(trackUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "track-1" },
        data: expect.objectContaining({ averageRating: 3.5, ratingsCount: 2 }),
      }),
    );
    expect(showUpdate).not.toHaveBeenCalled();
  });

  // Show-type clears invalidate the show's comprehensive cache the same
  // way upsert does, so the next read of the show payload sees the new
  // averageRating + ratingsCount.
  test("invalidates the show cache when clearing a Show rating with a showSlug", async () => {
    const invalidate = vi.fn();
    const db = {
      rating: {
        deleteMany: vi.fn().mockResolvedValue({ count: 1 }),
        aggregate: vi.fn().mockResolvedValue({ _avg: { value: 4.0 }, _count: { id: 1 } }),
      },
      show: { update: vi.fn() },
      track: { update: vi.fn() },
    } as never;

    const service = new RatingService(db, {
      invalidateAttendanceCaches: vi.fn(),
      invalidateShow: vi.fn(),
      invalidateShowComprehensive: invalidate,
    } as never);
    await service.clearForUser({
      rateableId: "show-1",
      rateableType: "Show",
      userId: "u1",
      showSlug: "2024-08-12-cap-theatre",
    });

    expect(invalidate).toHaveBeenCalledWith(undefined, "2024-08-12-cap-theatre", [2024]);
  });

  // Track-type clears must invalidate the show's setlist cache. The cached
  // setlist payload at CacheKeys.show.data(slug) embeds each track's
  // averageRating/ratingsCount, so the recompute on Track.update would be
  // shadowed by the stale Redis payload on the next read.
  test("invalidates the show cache when clearing a Track rating with a showSlug", async () => {
    const invalidateShow = vi.fn();
    const db = {
      rating: {
        deleteMany: vi.fn().mockResolvedValue({ count: 1 }),
        aggregate: vi.fn().mockResolvedValue({ _avg: { value: 3.5 }, _count: { id: 2 } }),
      },
      show: { update: vi.fn() },
      track: { update: vi.fn() },
    } as never;

    const service = new RatingService(db, {
      invalidateAttendanceCaches: vi.fn(),
      invalidateShow,
      invalidateShowComprehensive: vi.fn(),
    } as never);
    await service.clearForUser({
      rateableId: "track-1",
      rateableType: "Track",
      userId: "u1",
      showSlug: "2024-08-12-cap-theatre",
    });

    expect(invalidateShow).toHaveBeenCalledWith("2024-08-12-cap-theatre");
  });
});

describe("RatingService.rebuildAggregatesFor", () => {
  // Bulk version of updateRateableAverageRating used by the sync script after
  // importing many ratings at once. Single groupBy per rateableType collapses
  // N rateables to one query each; per-rateable .update writes the resulting
  // averageRating / ratingsCount onto Show or Track.
  test("recomputes Show.averageRating + ratingsCount in one groupBy per type", async () => {
    const showGroupBy = vi.fn().mockResolvedValue([
      { rateableId: "show-1", _avg: { value: 4.5 }, _count: { id: 2 } },
      { rateableId: "show-2", _avg: { value: 3.0 }, _count: { id: 1 } },
    ]);
    const showUpdate = vi.fn().mockResolvedValue(undefined);
    const trackUpdate = vi.fn();
    const trackGroupBy = vi.fn();
    const db = {
      rating: {
        groupBy: vi
          .fn()
          .mockImplementation((args: { where: { rateableType: string } }) =>
            args.where.rateableType === "Show" ? showGroupBy(args) : trackGroupBy(args),
          ),
      },
      show: { update: showUpdate },
      track: { update: trackUpdate },
    } as never;

    const service = new RatingService(db, cacheInvalidation);
    await service.rebuildAggregatesFor([
      { rateableId: "show-1", rateableType: "Show" },
      { rateableId: "show-2", rateableType: "Show" },
    ]);

    expect(showUpdate).toHaveBeenCalledTimes(2);
    expect(showUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "show-1" },
        data: expect.objectContaining({ averageRating: 4.5, ratingsCount: 2 }),
      }),
    );
    expect(showUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "show-2" },
        data: expect.objectContaining({ averageRating: 3.0, ratingsCount: 1 }),
      }),
    );
    expect(trackUpdate).not.toHaveBeenCalled();
    expect(trackGroupBy).not.toHaveBeenCalled();
  });

  // Rateables whose ratings dropped to zero (deleted last rating in full
  // mode) don't appear in the groupBy result. The bulk method must zero
  // them out anyway, matching what updateRateableAverageRating does for the
  // single-row delete path.
  test("zeroes out rateables that no longer have any ratings", async () => {
    const showUpdate = vi.fn();
    const db = {
      rating: {
        groupBy: vi.fn().mockResolvedValue([]),
      },
      show: { update: showUpdate },
      track: { update: vi.fn() },
    } as never;

    const service = new RatingService(db, cacheInvalidation);
    await service.rebuildAggregatesFor([{ rateableId: "show-abandoned", rateableType: "Show" }]);

    expect(showUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "show-abandoned" },
        data: expect.objectContaining({ averageRating: 0, ratingsCount: 0 }),
      }),
    );
  });

  // Mixed types in one call: one groupBy hits the Show table, one hits the
  // Track table. Per-rateable updates land on the matching denormalized row.
  test("dispatches Show + Track rateables to the right tables", async () => {
    const showUpdate = vi.fn();
    const trackUpdate = vi.fn();
    const db = {
      rating: {
        groupBy: vi
          .fn()
          .mockImplementation(async (args: { where: { rateableType: string } }) =>
            args.where.rateableType === "Show"
              ? [{ rateableId: "show-1", _avg: { value: 5.0 }, _count: { id: 3 } }]
              : [{ rateableId: "track-1", _avg: { value: 3.5 }, _count: { id: 2 } }],
          ),
      },
      show: { update: showUpdate },
      track: { update: trackUpdate },
    } as never;

    const service = new RatingService(db, cacheInvalidation);
    await service.rebuildAggregatesFor([
      { rateableId: "show-1", rateableType: "Show" },
      { rateableId: "track-1", rateableType: "Track" },
    ]);

    expect(showUpdate).toHaveBeenCalledWith(expect.objectContaining({ where: { id: "show-1" } }));
    expect(trackUpdate).toHaveBeenCalledWith(expect.objectContaining({ where: { id: "track-1" } }));
  });

  test("no-ops on an empty pair list", async () => {
    const groupBy = vi.fn();
    const db = {
      rating: { groupBy },
      show: { update: vi.fn() },
      track: { update: vi.fn() },
    } as never;

    const service = new RatingService(db, cacheInvalidation);
    await service.rebuildAggregatesFor([]);

    expect(groupBy).not.toHaveBeenCalled();
  });
});

describe("RatingService.listForSync", () => {
  // Stable cursor over (updatedAt, id). First page uses since-only; subsequent
  // pages use the (updatedAt, id) tuple so rows landing at the same timestamp
  // don't get re-fetched or skipped.
  test("first page filters by updatedAt > since", async () => {
    const findMany = vi.fn().mockResolvedValue([]);
    const db = { rating: { findMany } } as never;

    const service = new RatingService(db, cacheInvalidation);
    const since = new Date("2024-01-01T00:00:00Z");
    await service.listForSync({ since, limit: 100 });

    expect(findMany.mock.calls[0][0]).toMatchObject({
      where: { updatedAt: { gt: since } },
      orderBy: [{ updatedAt: "asc" }, { id: "asc" }],
      take: 100,
    });
  });

  test("subsequent page uses (updatedAt, id) tuple as exclusive cursor", async () => {
    const findMany = vi.fn().mockResolvedValue([]);
    const db = { rating: { findMany } } as never;

    const service = new RatingService(db, cacheInvalidation);
    const cursorUpdatedAt = new Date("2024-05-01T00:00:00Z");
    await service.listForSync({
      since: new Date(0),
      cursorUpdatedAt,
      cursorId: "rating-uuid",
      limit: 100,
    });

    expect(findMany.mock.calls[0][0].where).toEqual({
      OR: [
        { updatedAt: { gt: cursorUpdatedAt } },
        { AND: [{ updatedAt: cursorUpdatedAt }, { id: { gt: "rating-uuid" } }] },
      ],
    });
  });

  // Narrow projection — no rating field is PII, but the select-narrow guards
  // against accidentally widening the shape in future refactors.
  test("selects only the wire-safe columns", async () => {
    const findMany = vi.fn().mockResolvedValue([]);
    const db = { rating: { findMany } } as never;

    const service = new RatingService(db, cacheInvalidation);
    await service.listForSync({ since: new Date(0), limit: 100 });

    expect(findMany.mock.calls[0][0].select).toEqual({
      id: true,
      userId: true,
      value: true,
      rateableType: true,
      rateableId: true,
      createdAt: true,
      updatedAt: true,
    });
  });
});

describe("RatingService.upsert", () => {
  // Same motivation as the Track-clear case in clearForUser: the show's
  // cached setlist embeds Track.averageRating/ratingsCount, so the upsert
  // path has to bust the show cache for the rating mutation to surface.
  test("invalidates the show cache when upserting a Track rating with a showSlug", async () => {
    const invalidateShow = vi.fn();
    const now = new Date("2024-08-12T00:00:00Z");
    const db = {
      rating: {
        upsert: vi.fn().mockResolvedValue({
          id: "r1",
          userId: "u1",
          rateableId: "track-1",
          rateableType: "Track",
          value: 4,
          createdAt: now,
          updatedAt: now,
        }),
        aggregate: vi.fn().mockResolvedValue({ _avg: { value: 4.0 }, _count: { id: 1 } }),
      },
      show: { update: vi.fn() },
      track: { update: vi.fn() },
    } as never;

    const service = new RatingService(db, {
      invalidateAttendanceCaches: vi.fn(),
      invalidateShow,
      invalidateShowComprehensive: vi.fn(),
    } as never);
    await service.upsert({
      rateableId: "track-1",
      rateableType: "Track",
      userId: "u1",
      value: 4,
      showSlug: "2024-08-12-cap-theatre",
    });

    expect(invalidateShow).toHaveBeenCalledWith("2024-08-12-cap-theatre");
  });

  // Show ratings go through invalidateShowComprehensive — the year is parsed
  // from the slug's leading `YYYY-MM-DD-` so the past-year edge entry on
  // `/shows/year/YYYY` gets purged. Without the right year, a 2018 rating
  // would clear Redis but leave the 24h-cached year listing stale.
  test("passes the slug's year to invalidateShowComprehensive on a Show rating", async () => {
    const invalidateShowComprehensive = vi.fn();
    const now = new Date("2018-07-12T00:00:00Z");
    const db = {
      rating: {
        upsert: vi.fn().mockResolvedValue({
          id: "r1",
          userId: "u1",
          rateableId: "show-1",
          rateableType: "Show",
          value: 5,
          createdAt: now,
          updatedAt: now,
        }),
        aggregate: vi.fn().mockResolvedValue({ _avg: { value: 5.0 }, _count: { id: 1 } }),
      },
      show: { update: vi.fn() },
      track: { update: vi.fn() },
    } as never;

    const service = new RatingService(db, {
      invalidateAttendanceCaches: vi.fn(),
      invalidateShow: vi.fn(),
      invalidateShowComprehensive,
    } as never);
    await service.upsert({
      rateableId: "show-1",
      rateableType: "Show",
      userId: "u1",
      value: 5,
      showSlug: "2018-07-12-red-rocks",
    });

    expect(invalidateShowComprehensive).toHaveBeenCalledWith(undefined, "2018-07-12-red-rocks", [2018]);
  });
});
