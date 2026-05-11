import { describe, expect, test, vi } from "vitest";
import { computeAverageSongGap, computeMedianSongGap, SetlistService } from "./setlist-service";

// Minimal mock DbClient — only the paths used by tests
function makeMockDb() {
  return {
    show: {
      findMany: vi.fn().mockResolvedValue([]),
      findUnique: vi.fn().mockResolvedValue(null),
      count: vi.fn().mockResolvedValue(0),
    },
  };
}

describe("SetlistService.findManyLight", () => {
  // monthDay filter passes endsWith to Prisma's date where clause
  test("applies endsWith date filter when monthDay is provided", async () => {
    const db = makeMockDb();
    const service = new SetlistService(db as never);

    await service.findManyLight({
      filters: { monthDay: "04-04" },
      sort: [{ field: "date", direction: "desc" }],
    });

    const call = db.show.findMany.mock.calls[0][0];
    expect(call.where.date).toEqual({ endsWith: "-04-04" });
  });

  // Year filter expands to a half-open date range (gte first day, lt next
  // year's first day) so it works with the string-shaped date column.
  test("applies gte/lt date filter when year is provided", async () => {
    const db = makeMockDb();
    const service = new SetlistService(db as never);

    await service.findManyLight({
      filters: { year: 2024 },
    });

    const call = db.show.findMany.mock.calls[0][0];
    expect(call.where.date).toEqual({ gte: "2024-01-01", lt: "2025-01-01" });
  });

  // No date filter when neither year nor monthDay is provided
  test("omits date filter when no year or monthDay provided", async () => {
    const db = makeMockDb();
    const service = new SetlistService(db as never);

    await service.findManyLight({ filters: {} });

    const call = db.show.findMany.mock.calls[0][0];
    expect(call.where.date).toBeUndefined();
  });

  // hasYoutube=true maps to showYoutubesCount > 0 — same pattern as hasPhotos
  // but targets the denormalized YouTube count on the Show model.
  test("applies showYoutubesCount > 0 when hasYoutube is true", async () => {
    const db = makeMockDb();
    const service = new SetlistService(db as never);

    await service.findManyLight({
      filters: { year: 2024, hasYoutube: true },
    });

    const call = db.show.findMany.mock.calls[0][0];
    expect(call.where.showYoutubesCount).toEqual({ gt: 0 });
  });

  // hasYoutube=false is the negative tri-state branch — caller is asking for
  // shows that explicitly DO NOT have a YouTube video. Maps to showYoutubesCount = 0
  // rather than skipping the filter (which is the `undefined` case).
  test("applies showYoutubesCount = 0 when hasYoutube is false", async () => {
    const db = makeMockDb();
    const service = new SetlistService(db as never);

    await service.findManyLight({
      filters: { year: 2024, hasYoutube: false },
    });

    const call = db.show.findMany.mock.calls[0][0];
    expect(call.where.showYoutubesCount).toEqual({ equals: 0 });
  });

  // hasPhotos=false — same negative branch on the photos column. Drives the
  // "shows without photos" filter from the year-page UI.
  test("applies showPhotosCount = 0 when hasPhotos is false", async () => {
    const db = makeMockDb();
    const service = new SetlistService(db as never);

    await service.findManyLight({
      filters: { year: 2024, hasPhotos: false },
    });

    const call = db.show.findMany.mock.calls[0][0];
    expect(call.where.showPhotosCount).toEqual({ equals: 0 });
  });

  // Without the flag set (undefined), the where-clause must not constrain
  // either count column so all shows remain in the results.
  test("omits photos/youtube filters when hasPhotos and hasYoutube are undefined", async () => {
    const db = makeMockDb();
    const service = new SetlistService(db as never);

    await service.findManyLight({ filters: { year: 2024 } });

    const call = db.show.findMany.mock.calls[0][0];
    expect(call.where.showYoutubesCount).toBeUndefined();
    expect(call.where.showPhotosCount).toBeUndefined();
  });

  // hasPhotos and hasYoutube combine as AND when both are active — lets the
  // filter bar stack Photos+YouTube on the year route. Includes a positive
  // and negative mix to cover the cross-product.
  test("stacks hasPhotos=true with hasYoutube=false", async () => {
    const db = makeMockDb();
    const service = new SetlistService(db as never);

    await service.findManyLight({
      filters: { year: 2024, hasPhotos: true, hasYoutube: false },
    });

    const call = db.show.findMany.mock.calls[0][0];
    expect(call.where.showPhotosCount).toEqual({ gt: 0 });
    expect(call.where.showYoutubesCount).toEqual({ equals: 0 });
  });
});

describe("computeAverageSongGap", () => {
  // Standard case: average of two real-gap tracks. Debut (gap=null) is
  // excluded from both numerator and denominator so it doesn't drag the
  // average down to "we never played this".
  test("averages real gaps and ignores debuts", () => {
    const tracks = [
      { songId: "a", position: 1, gap: null }, // Tractorbeam debut
      { songId: "b", position: 2, gap: 5 }, // Above the Waves
      { songId: "c", position: 3, gap: 10 }, // Confrontation
    ];
    expect(computeAverageSongGap(tracks)).toBe(7.5);
  });

  // Within-show repeat: a song that appears twice in the same show carries the
  // gap of its earlier in-show occurrence (recompute writes the same value to
  // both rows). Including the repeat would double-count the same song's
  // recency, so the second occurrence is excluded by (songId already seen).
  test("excludes within-show repeats by songId", () => {
    const tracks = [
      { songId: "a", position: 1, gap: null }, // Munchkin Invasion debut
      { songId: "b", position: 2, gap: 5 }, // Tempest
      { songId: "c", position: 3, gap: 10 }, // Mindless Dribble
      { songId: "b", position: 4, gap: 5 }, // Tempest reprise — same songId, drop
    ];
    expect(computeAverageSongGap(tracks)).toBe(7.5);
  });

  // All debuts (or all repeats of debuts) means there's no meaningful gap to
  // average — return null so the UI can hide the summary line entirely.
  test("returns null when no eligible tracks remain", () => {
    const tracks = [
      { songId: "a", position: 1, gap: null }, // Crickets debut
      { songId: "b", position: 2, gap: null }, // Spaga debut
    ];
    expect(computeAverageSongGap(tracks)).toBeNull();
  });
});

describe("computeMedianSongGap", () => {
  // Odd-length eligible list: median is the middle value after sorting.
  // 5 / 10 / 30 → median = 10. Surfaces "what's the typical gap" without
  // an outlier dragging it like the average can.
  test("returns the middle value for an odd-count eligible list", () => {
    const tracks = [
      { songId: "a", position: 1, gap: 30 }, // Tractorbeam
      { songId: "b", position: 2, gap: 5 }, // Above the Waves
      { songId: "c", position: 3, gap: 10 }, // Confrontation
    ];
    expect(computeMedianSongGap(tracks)).toBe(10);
  });

  // Even-length eligible list: median is the mean of the two middle values
  // after sorting. 5 / 10 / 20 / 30 → middles are 10 and 20 → 15.
  test("averages the two middle values for an even-count eligible list", () => {
    const tracks = [
      { songId: "a", position: 1, gap: 30 }, // Crickets
      { songId: "b", position: 2, gap: 5 }, // Munchkin Invasion
      { songId: "c", position: 3, gap: 20 }, // Spaga
      { songId: "d", position: 4, gap: 10 }, // Tempest
    ];
    expect(computeMedianSongGap(tracks)).toBe(15);
  });

  // Same exclusion rules as the average: debuts (gap=null) and within-show
  // repeats (songId already seen at an earlier position) are dropped before
  // sorting. Without this, a repeated song would distort the middle value.
  test("excludes debuts and within-show repeats before computing", () => {
    const tracks = [
      { songId: "a", position: 1, gap: null }, // Mindless Dribble debut — drop
      { songId: "b", position: 2, gap: 5 }, // Tempest
      { songId: "c", position: 3, gap: 10 }, // Spaga
      { songId: "d", position: 4, gap: 30 }, // Crickets
      { songId: "b", position: 5, gap: 5 }, // Tempest reprise — drop
    ];
    // Eligible gaps after exclusions: [5, 10, 30] → median = 10.
    expect(computeMedianSongGap(tracks)).toBe(10);
  });

  // No eligible tracks (all debuts or all repeats) → null, so the UI can
  // hide the summary line entirely.
  test("returns null when no eligible tracks remain", () => {
    const tracks = [
      { songId: "a", position: 1, gap: null }, // Tractorbeam debut
      { songId: "b", position: 2, gap: null }, // Above the Waves debut
    ];
    expect(computeMedianSongGap(tracks)).toBeNull();
  });
});

describe("SetlistService.findByShowSlug", () => {
  // The setlist payload powers the gap-chart view (Phase 5). It needs the
  // prior-show date+slug for the "Last Played" column, so the query must
  // include the previousPerformanceShow relation with date+slug only (no full
  // show payload — keeps the response compact).
  test("includes previousPerformanceShow date+slug on tracks", async () => {
    const db = makeMockDb();
    const service = new SetlistService(db as never);

    await service.findByShowSlug("2024-07-26-red-rocks-amphitheatre-morrison-co");

    const call = db.show.findUnique.mock.calls[0][0];
    expect(call.include.tracks.include.previousPerformanceShow).toEqual({
      select: { date: true, slug: true },
    });
  });

  // The setlist domain object exposes averageSongGap so SetlistTable can
  // render the summary without recomputing client-side. Tracks come back from
  // Prisma with `gap` already populated (Phase 1 denormalization).
  test("returns averageSongGap derived from tracks", async () => {
    const db = makeMockDb();
    const service = new SetlistService(db as never);
    db.show.findUnique.mockResolvedValue({
      id: "show-1",
      slug: "2024-07-26",
      date: "2024-07-26",
      createdAt: new Date(),
      updatedAt: new Date(),
      venueId: "v-1",
      bandId: "b-1",
      tracks: [
        // Tractorbeam debut — gap=null
        {
          id: "t-1",
          showId: "show-1",
          songId: "song-a",
          set: "S1",
          position: 1,
          segue: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          likesCount: 0,
          slug: "t-1",
          note: null,
          allTimer: false,
          previousTrackId: null,
          nextTrackId: null,
          averageRating: 0,
          ratingsCount: 0,
          gap: null,
          previousPerformanceShowId: null,
          previousPerformanceShow: null,
          song: null,
          annotations: [],
        },
        // Above the Waves — gap=5
        {
          id: "t-2",
          showId: "show-1",
          songId: "song-b",
          set: "S1",
          position: 2,
          segue: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          likesCount: 0,
          slug: "t-2",
          note: null,
          allTimer: false,
          previousTrackId: null,
          nextTrackId: null,
          averageRating: 0,
          ratingsCount: 0,
          gap: 5,
          previousPerformanceShowId: "prev-show-1",
          previousPerformanceShow: { date: "2024-06-15", slug: "2024-06-15-some-venue" },
          song: null,
          annotations: [],
        },
        // Confrontation — gap=10
        {
          id: "t-3",
          showId: "show-1",
          songId: "song-c",
          set: "S1",
          position: 3,
          segue: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          likesCount: 0,
          slug: "t-3",
          note: null,
          allTimer: false,
          previousTrackId: null,
          nextTrackId: null,
          averageRating: 0,
          ratingsCount: 0,
          gap: 10,
          previousPerformanceShowId: "prev-show-2",
          previousPerformanceShow: { date: "2024-04-20", slug: "2024-04-20-other-venue" },
          song: null,
          annotations: [],
        },
      ],
      venue: {
        id: "v-1",
        name: "Red Rocks",
        slug: "red-rocks",
        city: "Morrison",
        country: "US",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const setlist = await service.findByShowSlug("2024-07-26");

    expect(setlist?.averageSongGap).toBe(7.5);
    // Tracks pass through gap and the resolved prev-show pointer for the table.
    const tracks = setlist?.sets.flatMap((s) => s.tracks) ?? [];
    expect(tracks.find((t) => t.id === "t-1")?.gap).toBeNull();
    expect(tracks.find((t) => t.id === "t-2")?.gap).toBe(5);
    expect(tracks.find((t) => t.id === "t-2")?.previousPerformanceShow).toEqual({
      date: "2024-06-15",
      slug: "2024-06-15-some-venue",
    });
  });
});

describe("SetlistService.findManyLight", () => {
  // findManyLight powers the list pages (year, top-rated, etc.). The gap-chart
  // toggle on those pages needs the same prior-show pointer + averageSongGap.
  test("includes previousPerformanceShow date+slug on tracks", async () => {
    const db = makeMockDb();
    const service = new SetlistService(db as never);

    await service.findManyLight({ filters: { year: 2024 } });

    const call = db.show.findMany.mock.calls[0][0];
    expect(call.include.tracks.select.previousPerformanceShow).toEqual({
      select: { date: true, slug: true },
    });
    expect(call.include.tracks.select.gap).toBe(true);
    expect(call.include.tracks.select.previousPerformanceShowId).toBe(true);
  });
});

describe("SetlistService.countByMonthDay", () => {
  // Uses Prisma's count with endsWith to match any year for a given
  // calendar day, AND filters out count_for_stats=false shows so the home
  // page widget matches Song.timesPlayed semantics (no soundchecks etc).
  test("calls db.show.count with endsWith date filter scoped to stats shows", async () => {
    const db = makeMockDb();
    db.show.count.mockResolvedValue(7);
    const service = new SetlistService(db as never);

    const result = await service.countByMonthDay("04-08");

    expect(result).toBe(7);
    expect(db.show.count).toHaveBeenCalledWith({
      where: { countForStats: true, date: { endsWith: "-04-08" } },
    });
  });
});
