import { describe, expect, test, vi } from "vitest";
import { RatingService } from "./rating-service";

// Minimal stub — service only invalidates caches at write paths; the read
// methods under test don't touch it.
const cacheInvalidation = {
  invalidateAttendanceCaches: vi.fn(),
  invalidateShowComprehensive: vi.fn(),
} as never;

type MockRating = {
  id: string;
  userId: string;
  rateableId: string;
  rateableType: string;
  value: number;
  createdAt: Date;
  updatedAt: Date;
};

function rating(overrides: Partial<MockRating>): MockRating {
  return {
    id: "r1",
    userId: "u1",
    rateableId: "x1",
    rateableType: "Show",
    value: 5,
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-01T00:00:00Z"),
    ...overrides,
  };
}

describe("RatingService.findShowRatingsByUserId", () => {
  // The user-profile show-ratings list only displays id/value/createdAt +
  // nested slug/date/venue trio. Returning a Rating-extending shape with
  // userId/rateableId/etc. forces ~1.7 MB of unused JSON onto heavy users
  // (the heaviest user has ~1,700 show ratings). The slim shape strips those.
  test("returns slim shape without userId, rateableId, rateableType, or updatedAt", async () => {
    const db = {
      rating: {
        findMany: vi.fn().mockResolvedValue([rating({ id: "r1", rateableId: "show-1" })]),
      },
      show: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: "show-1",
            slug: "2024-08-12-cap-theatre",
            date: "2024-08-12",
            venue: { name: "The Capitol Theatre", city: "Port Chester", state: "NY" },
          },
        ]),
      },
    } as never;

    const service = new RatingService(db, cacheInvalidation);
    const result = await service.findShowRatingsByUserId("u1");

    expect(result).toHaveLength(1);
    const row = result[0];
    expect(row).toEqual({
      id: "r1",
      value: 5,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      show: {
        slug: "2024-08-12-cap-theatre",
        date: "2024-08-12",
        venue: { name: "The Capitol Theatre", city: "Port Chester", state: "NY" },
      },
    });
    // Explicit negative assertions — these fields drove the bloat.
    expect(row).not.toHaveProperty("userId");
    expect(row).not.toHaveProperty("rateableId");
    expect(row).not.toHaveProperty("rateableType");
    expect(row).not.toHaveProperty("updatedAt");
  });

  // If the underlying show was deleted while the rating remained (data
  // drift), we drop the orphan rather than crash. Mirrors the original
  // .filter() behavior; protects the user profile from white-screening on
  // dangling ratings.
  test("skips ratings whose related show is missing", async () => {
    const db = {
      rating: {
        findMany: vi
          .fn()
          .mockResolvedValue([rating({ id: "r1", rateableId: "missing" }), rating({ id: "r2", rateableId: "show-1" })]),
      },
      show: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: "show-1",
            slug: "show-slug",
            date: "2024-08-12",
            venue: null,
          },
        ]),
      },
    } as never;

    const service = new RatingService(db, cacheInvalidation);
    const result = await service.findShowRatingsByUserId("u1");

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("r2");
    expect(result[0].show.venue).toBeNull();
  });

  // Heavy users (~1,700 show ratings) need server-side pagination —
  // shipping all rows on every load costs hundreds of KB. The service
  // accepts skip/take and the caller is expected to combine with
  // getUserTabCounts() for the total. Verifies the slice is applied at the
  // DB level, not in JS.
  test("supports skip/take pagination at the DB layer", async () => {
    const ratingFindMany = vi.fn().mockResolvedValue([rating({ id: "r-page-3", rateableId: "show-page-3" })]);
    const db = {
      rating: { findMany: ratingFindMany },
      show: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: "show-page-3",
            slug: "s",
            date: "2024-01-01",
            venue: null,
          },
        ]),
      },
    } as never;

    const service = new RatingService(db, cacheInvalidation);
    const result = await service.findShowRatingsByUserId("u1", { skip: 200, take: 100 });

    expect(ratingFindMany.mock.calls[0][0]).toMatchObject({ skip: 200, take: 100 });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("r-page-3");
  });

  // Narrowed Prisma projection: only select the columns the slim shape
  // surfaces. Regression guard — accidentally going back to `include` re-bloats
  // every load.
  test("queries the DB with a narrow `select` (no full row projection)", async () => {
    const showFindMany = vi.fn().mockResolvedValue([]);
    const db = {
      rating: { findMany: vi.fn().mockResolvedValue([rating({ rateableId: "show-1" })]) },
      show: { findMany: showFindMany },
    } as never;

    const service = new RatingService(db, cacheInvalidation);
    await service.findShowRatingsByUserId("u1");

    const args = showFindMany.mock.calls[0][0];
    expect(args).toHaveProperty("select");
    expect(args).not.toHaveProperty("include");
    expect(args.select).toMatchObject({
      id: true,
      slug: true,
      date: true,
      venue: { select: { name: true, city: true, state: true } },
    });
  });
});

describe("RatingService.findTrackRatingsByUserId", () => {
  // The user-profile track-ratings list is the worst offender — 7,784 rows
  // for the heaviest user. The slim shape drops every unused field, including venue
  // city/state (which the track-rating row doesn't display, unlike the
  // show-rating row above).
  test("returns slim shape with no venue.city/state and no UUIDs", async () => {
    const db = {
      rating: {
        findMany: vi.fn().mockResolvedValue([rating({ id: "r1", rateableId: "track-1", rateableType: "Track" })]),
      },
      track: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: "track-1",
            slug: "basis-for-a-day-2024-08-12",
            position: 3,
            set: "S1",
            show: {
              slug: "2024-08-12-cap-theatre",
              date: "2024-08-12",
              venue: { name: "The Capitol Theatre" },
            },
            song: { slug: "basis-for-a-day", title: "Basis for a Day" },
          },
        ]),
      },
    } as never;

    const service = new RatingService(db, cacheInvalidation);
    const result = await service.findTrackRatingsByUserId("u1");

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: "r1",
      value: 5,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      track: {
        slug: "basis-for-a-day-2024-08-12",
        position: 3,
        set: "S1",
        show: {
          slug: "2024-08-12-cap-theatre",
          date: "2024-08-12",
          venue: { name: "The Capitol Theatre" },
        },
        song: { slug: "basis-for-a-day", title: "Basis for a Day" },
      },
    });
    expect(result[0]).not.toHaveProperty("userId");
    expect(result[0]).not.toHaveProperty("rateableType");
    expect(result[0].track).not.toHaveProperty("id");
    expect(result[0].track.show).not.toHaveProperty("id");
    expect(result[0].track.show.venue).not.toHaveProperty("city");
    expect(result[0].track.show.venue).not.toHaveProperty("state");
    expect(result[0].track.song).not.toHaveProperty("id");
  });

  // Same orphan-protection as show ratings — if the joined track is gone we
  // drop the row instead of crashing the user profile.
  test("skips ratings whose related track is missing", async () => {
    const db = {
      rating: {
        findMany: vi
          .fn()
          .mockResolvedValue([
            rating({ id: "r1", rateableId: "missing-track", rateableType: "Track" }),
            rating({ id: "r2", rateableId: "track-1", rateableType: "Track" }),
          ]),
      },
      track: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: "track-1",
            slug: "above-the-waves",
            position: 1,
            set: "S2",
            show: { slug: "show-slug", date: "2024-01-01", venue: { name: "Some Venue" } },
            song: { slug: "above-the-waves", title: "Above The Waves" },
          },
        ]),
      },
    } as never;

    const service = new RatingService(db, cacheInvalidation);
    const result = await service.findTrackRatingsByUserId("u1");

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("r2");
  });

  // Same pagination requirement as show ratings — the heaviest user has ~7,800 track
  // ratings and a single full payload is ~4 MB. skip/take must reach the
  // DB so we never marshal rows we don't render.
  test("supports skip/take pagination at the DB layer", async () => {
    const ratingFindMany = vi
      .fn()
      .mockResolvedValue([rating({ id: "r-tracks-page-2", rateableId: "track-page-2", rateableType: "Track" })]);
    const db = {
      rating: { findMany: ratingFindMany },
      track: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: "track-page-2",
            slug: "basis-for-a-day",
            position: 1,
            set: "S1",
            show: { slug: "s", date: "2024-01-01", venue: { name: "v" } },
            song: { slug: "basis-for-a-day", title: "Basis for a Day" },
          },
        ]),
      },
    } as never;

    const service = new RatingService(db, cacheInvalidation);
    const result = await service.findTrackRatingsByUserId("u1", { skip: 100, take: 100 });

    expect(ratingFindMany.mock.calls[0][0]).toMatchObject({ skip: 100, take: 100 });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("r-tracks-page-2");
  });

  // Same Prisma narrowing regression guard as show ratings — the track
  // method must use `select` (not `include`) and limit nested venue/song.
  test("queries the DB with a narrow `select`", async () => {
    const trackFindMany = vi.fn().mockResolvedValue([]);
    const db = {
      rating: { findMany: vi.fn().mockResolvedValue([rating({ rateableType: "Track", rateableId: "track-1" })]) },
      track: { findMany: trackFindMany },
    } as never;

    const service = new RatingService(db, cacheInvalidation);
    await service.findTrackRatingsByUserId("u1");

    const args = trackFindMany.mock.calls[0][0];
    expect(args).toHaveProperty("select");
    expect(args).not.toHaveProperty("include");
    // Venue should expose only `name` — city/state would re-introduce bloat.
    expect(args.select.show.select.venue.select).toEqual({ name: true });
    // Song should expose only slug/title — no UUID.
    expect(args.select.song.select).toEqual({ slug: true, title: true });
  });
});
