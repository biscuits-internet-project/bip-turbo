import { average, median } from "@bip/domain";
import { describe, expect, test, vi } from "vitest";
import type { RockOperaService } from "../rock-operas/rock-opera-service";
import { computeDebutCount, eligibleGapsForAggregation, SetlistService } from "./setlist-service";

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

// RockOperaService stub — SetlistService overlays annotations onto every
// returned setlist via `findPerformancesForShows`. Default to an empty
// map so existing tests don't have to wire annotation data; tests that
// care can swap in a custom mock.
function makeRockOperaStub(): RockOperaService {
  return {
    findPerformancesForShows: vi.fn().mockResolvedValue(new Map()),
    findPerformancesForShow: vi.fn().mockResolvedValue([]),
    findAll: vi.fn().mockResolvedValue([]),
    findBySlug: vi.fn().mockResolvedValue(null),
    findPerformanceShowIds: vi.fn().mockResolvedValue([]),
  } as unknown as RockOperaService;
}

describe("SetlistService.findManyLight", () => {
  // monthDay filter passes endsWith to Prisma's date where clause
  test("applies endsWith date filter when monthDay is provided", async () => {
    const db = makeMockDb();
    const service = new SetlistService(db as never, makeRockOperaStub());

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
    const service = new SetlistService(db as never, makeRockOperaStub());

    await service.findManyLight({
      filters: { year: 2024 },
    });

    const call = db.show.findMany.mock.calls[0][0];
    expect(call.where.date).toEqual({ gte: "2024-01-01", lt: "2025-01-01" });
  });

  // No date filter when neither year nor monthDay is provided
  test("omits date filter when no year or monthDay provided", async () => {
    const db = makeMockDb();
    const service = new SetlistService(db as never, makeRockOperaStub());

    await service.findManyLight({ filters: {} });

    const call = db.show.findMany.mock.calls[0][0];
    expect(call.where.date).toBeUndefined();
  });

  // hasYoutube=true maps to showYoutubesCount > 0 — same pattern as hasPhotos
  // but targets the denormalized YouTube count on the Show model.
  test("applies showYoutubesCount > 0 when hasYoutube is true", async () => {
    const db = makeMockDb();
    const service = new SetlistService(db as never, makeRockOperaStub());

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
    const service = new SetlistService(db as never, makeRockOperaStub());

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
    const service = new SetlistService(db as never, makeRockOperaStub());

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
    const service = new SetlistService(db as never, makeRockOperaStub());

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
    const service = new SetlistService(db as never, makeRockOperaStub());

    await service.findManyLight({
      filters: { year: 2024, hasPhotos: true, hasYoutube: false },
    });

    const call = db.show.findMany.mock.calls[0][0];
    expect(call.where.showPhotosCount).toEqual({ gt: 0 });
    expect(call.where.showYoutubesCount).toEqual({ equals: 0 });
  });

  // Year listings on prod include orphan placeholder shows (bare YYYY-MM-DD
  // slug, no venue) which double-count alongside the real show on the same
  // date. They render as a blank row in the list with no setlist data, so the
  // query must drop them at the SQL boundary. Keyed on the missing venue —
  // see NON_STUB_SHOWS_WHERE.
  test("excludes orphan stub shows (no venue) from year listings", async () => {
    const db = makeMockDb();
    const service = new SetlistService(db as never, makeRockOperaStub());

    await service.findManyLight({ filters: { year: 2024 } });

    const call = db.show.findMany.mock.calls[0][0];
    expect(call.where.venueId).toEqual({ not: null });
  });
});

describe("eligibleGapsForAggregation", () => {
  // Debuts (gap === null) are excluded so they don't drag the eventual
  // average down to "we never played this".
  test("excludes debuts", () => {
    const tracks = [
      { songId: "a", position: 1, gap: null }, // Basis for a Day debut
      { songId: "b", position: 2, gap: 5 }, // Above the Waves
      { songId: "c", position: 3, gap: 10 }, // Confrontation
    ];
    expect(eligibleGapsForAggregation(tracks)).toEqual([5, 10]);
  });

  // Within-show repeats inherit their earlier occurrence's gap. Counting
  // them would double-weight the same song's recency, so the second
  // occurrence is dropped by songId.
  test("excludes within-show repeats by songId (keeps the earliest position)", () => {
    const tracks = [
      { songId: "a", position: 1, gap: null }, // Munchkin Invasion debut
      { songId: "b", position: 2, gap: 5 }, // Tempest
      { songId: "c", position: 3, gap: 10 }, // Mindless Dribble
      { songId: "b", position: 4, gap: 5 }, // Tempest reprise — drop
    ];
    expect(eligibleGapsForAggregation(tracks)).toEqual([5, 10]);
  });

  // End-to-end sanity: filter + `average`/`median` from `@bip/domain`
  // produce the expected summary numbers (the same scenario as the old
  // wrapper-based tests, just composed explicitly).
  test("composes with average/median for typical summary numbers", () => {
    const tracks = [
      { songId: "a", position: 1, gap: 30 },
      { songId: "b", position: 2, gap: 5 },
      { songId: "c", position: 3, gap: 20 },
      { songId: "d", position: 4, gap: 10 },
    ];
    const eligible = eligibleGapsForAggregation(tracks);
    expect(average(eligible)).toBe(16.25);
    expect(median(eligible)).toBe(15);
  });

  // All debuts → empty array. `average` / `median` from the math util
  // turn that into a clean `null` at call sites so the UI hides the line.
  test("returns an empty array when nothing is eligible", () => {
    const tracks = [
      { songId: "a", position: 1, gap: null },
      { songId: "b", position: 2, gap: null },
    ];
    expect(eligibleGapsForAggregation(tracks)).toEqual([]);
    expect(average(eligibleGapsForAggregation(tracks))).toBeNull();
    expect(median(eligibleGapsForAggregation(tracks))).toBeNull();
  });
});

describe("computeDebutCount", () => {
  // Mixed setlist: only `gap === null` rows count as debuts. A song with
  // a real gap value is a re-play, not a debut.
  test("counts only tracks with gap === null", () => {
    const tracks = [
      { songId: "a", gap: null }, // Tractorbeam debut
      { songId: "b", gap: 5 }, // Spaga, played before
      { songId: "c", gap: null }, // Mr. Don debut
      { songId: "d", gap: 0 }, // Helicopters back-to-back, not a debut
    ];
    expect(computeDebutCount(tracks)).toBe(2);
  });

  // A song played twice in one show is still ONE debut — both tracks have
  // gap=null (the within-show repeat inherits the first occurrence's gap)
  // but it's the same song debuting.
  test("dedupes within-show repeats by songId", () => {
    const tracks = [
      { songId: "a", gap: null }, // Bombbasis debut, first occurrence
      { songId: "a", gap: null }, // Bombbasis reprise — same debut song
    ];
    expect(computeDebutCount(tracks)).toBe(1);
  });

  // All non-debut → 0. The UI uses this to skip the `· N debuts` suffix
  // when there's nothing to surface.
  test("returns 0 when no track is a debut", () => {
    const tracks = [
      { songId: "a", gap: 3 },
      { songId: "b", gap: 12 },
    ];
    expect(computeDebutCount(tracks)).toBe(0);
  });
});

describe("SetlistService.findByShowSlug", () => {
  // The setlist payload powers the gap-chart view. It needs the prior-show
  // date+slug for the "Last Played" column, so the query must include the
  // previousPerformanceShow relation with date+slug only (no full show
  // payload — keeps the response compact).
  test("includes previousPerformanceShow date+slug on tracks", async () => {
    const db = makeMockDb();
    const service = new SetlistService(db as never, makeRockOperaStub());

    await service.findByShowSlug("2024-07-26-red-rocks-amphitheatre-morrison-co");

    const call = db.show.findUnique.mock.calls[0][0];
    expect(call.include.tracks.include.previousPerformanceShow).toEqual({
      select: { date: true, slug: true },
    });
  });

  // The setlist domain object exposes averageSongGap so SetlistTable can
  // render the summary without recomputing client-side. Tracks come back
  // from Prisma with the denormalized `gap` field already populated.
  test("returns averageSongGap derived from tracks", async () => {
    const db = makeMockDb();
    const service = new SetlistService(db as never, makeRockOperaStub());
    db.show.findUnique.mockResolvedValue({
      id: "show-1",
      slug: "2024-07-26",
      date: "2024-07-26",
      createdAt: new Date(),
      updatedAt: new Date(),
      venueId: "v-1",
      bandId: "b-1",
      tracks: [
        // Basis for a Day debut — gap=null
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
    const service = new SetlistService(db as never, makeRockOperaStub());

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
    const service = new SetlistService(db as never, makeRockOperaStub());

    const result = await service.countByMonthDay("04-08");

    expect(result).toBe(7);
    expect(db.show.count).toHaveBeenCalledWith({
      where: { countForStats: true, date: { endsWith: "-04-08" } },
    });
  });
});
