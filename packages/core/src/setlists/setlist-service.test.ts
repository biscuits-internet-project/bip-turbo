import { average, median } from "@bip/domain";
import { describe, expect, test, vi } from "vitest";
import type { RockOperaService } from "../rock-operas/rock-opera-service";
import {
  computeDebutCount,
  eligibleGapsForAggregation,
  gateFlagRecurrences,
  gateSegueRecurrences,
  SetlistService,
} from "./setlist-service";

describe("recurrence server-gating", () => {
  // Compound rule per kind: fire when versionGap >= version OR
  // (versionGap > minVersions AND showGap > minShows).
  const rule = { version: 20, minVersions: 10, minShows: 100 };
  const thresholds = { DYSLEXIC: rule, STANDALONE: rule };
  const NOT_DEBUT = false;

  // A first-ever flag on a NON-debut track passes; with few prior versions
  // (below threshold) the projected versionGap is null → footnote stays "1st time".
  test("a first-time flag recurrence on a non-debut track is projected, versionGap nulled below threshold", () => {
    const gated = gateFlagRecurrences(
      [{ flag: "DYSLEXIC", flagVersionGap: 3, flagGap: null, flagPreviousShow: null }],
      NOT_DEBUT,
      thresholds,
    );
    expect(gated).toEqual([{ flag: "DYSLEXIC", versionGap: null, gap: null, lastPlayed: null }]);
  });

  // A first-ever flag that arrives LATE (versions-before clears the threshold)
  // projects the count → footnote reads "1st time (after X versions)".
  test("a first-time flag after many versions projects versions-before", () => {
    const gated = gateFlagRecurrences(
      [{ flag: "DYSLEXIC", flagVersionGap: 47, flagGap: null, flagPreviousShow: null }],
      NOT_DEBUT,
      thresholds,
    );
    expect(gated).toEqual([{ flag: "DYSLEXIC", versionGap: 47, gap: null, lastPlayed: null }]);
  });

  // On the song's DEBUT, a first-ever recurrence is noise — suppressed.
  test("a first-time flag recurrence on the song's debut is suppressed", () => {
    const gated = gateFlagRecurrences(
      [{ flag: "DYSLEXIC", flagVersionGap: null, flagGap: null, flagPreviousShow: null }],
      true, // isDebut
      thresholds,
    );
    expect(gated).toEqual([]);
  });

  // A version gap at/over the kind's threshold passes; both gaps thread through.
  test("an over-threshold flag recurrence is projected with both gaps and its prior show", () => {
    const gated = gateFlagRecurrences(
      [
        {
          flag: "DYSLEXIC",
          flagVersionGap: 25,
          flagGap: 140,
          flagPreviousShow: { date: "2024-05-02", slug: "2024-05-02-foo" },
        },
      ],
      NOT_DEBUT,
      thresholds,
    );
    expect(gated).toEqual([
      { flag: "DYSLEXIC", versionGap: 25, gap: 140, lastPlayed: { date: "2024-05-02", slug: "2024-05-02-foo" } },
    ]);
  });

  // A small version gap (<= minVersions) is omitted even with a huge show gap —
  // it failed both clauses of the rule.
  test("a small version gap is omitted despite a large show gap", () => {
    const gated = gateFlagRecurrences(
      [
        {
          flag: "DYSLEXIC",
          flagVersionGap: 5,
          flagGap: 200,
          flagPreviousShow: { date: "2024-05-02", slug: "2024-05-02-foo" },
        },
      ],
      NOT_DEBUT,
      thresholds,
    );
    expect(gated).toEqual([]);
  });

  // Compound rule (the Catalyst case): a moderate version gap (> minVersions but
  // < version) FIRES when the show gap also clears minShows. 18 versions / 303
  // shows → fires even though 18 < 20.
  test("a moderate version gap fires when the show gap is large enough", () => {
    const gated = gateFlagRecurrences(
      [
        {
          flag: "INVERTED",
          flagVersionGap: 18,
          flagGap: 303,
          flagPreviousShow: { date: "2021-04-23", slug: "2021-04-23-foo" },
        },
      ],
      NOT_DEBUT,
      { INVERTED: rule },
    );
    expect(gated).toEqual([
      { flag: "INVERTED", versionGap: 18, gap: 303, lastPlayed: { date: "2021-04-23", slug: "2021-04-23-foo" } },
    ]);
  });

  // The same moderate version gap is suppressed when the show gap is short — a
  // recently-but-rarely-played song flipping shape isn't notable.
  test("a moderate version gap is suppressed when the show gap is short", () => {
    const gated = gateFlagRecurrences(
      [
        {
          flag: "INVERTED",
          flagVersionGap: 18,
          flagGap: 60,
          flagPreviousShow: { date: "2025-01-01", slug: "2025-01-01-foo" },
        },
      ],
      NOT_DEBUT,
      { INVERTED: rule },
    );
    expect(gated).toEqual([]);
  });

  // A flag not in the threshold map (display-disabled) never projects.
  test("a display-disabled flag is omitted even when first-time", () => {
    const gated = gateFlagRecurrences(
      [{ flag: "UNFINISHED", flagVersionGap: null, flagGap: null, flagPreviousShow: null }],
      NOT_DEBUT,
      thresholds,
    );
    expect(gated).toEqual([]);
  });

  // HEADLINE (the Bazaar regression): the prior version was already the same
  // shape (versionGap 0 — no shape change), so even though the song was absent
  // for many SHOWS (large show-gap), no footnote fires.
  test("a versionGap-0 recurrence is suppressed even with a large show gap", () => {
    const gated = gateSegueRecurrences(
      [{ kind: "NOT_SEGUED_IN", versionGap: 0, gap: 166, previousShow: { date: "2023-06-14", slug: "2023-06-14-x" } }],
      NOT_DEBUT,
      { NOT_SEGUED_IN: rule },
    );
    expect(gated).toEqual([]);
  });

  // Segue recurrence gates the same way, keyed by kind.
  test("a first-time standalone segue recurrence is projected; a disabled kind is omitted", () => {
    const gated = gateSegueRecurrences(
      [
        { kind: "STANDALONE", versionGap: null, gap: null, previousShow: null },
        { kind: "NOT_SEGUED_IN", versionGap: null, gap: null, previousShow: null },
      ],
      NOT_DEBUT,
      thresholds,
    );
    expect(gated).toEqual([{ kind: "STANDALONE", versionGap: null, gap: null, lastPlayed: null }]);
  });

  // "1st standalone version" already implies not-segued-in and not-segued-out,
  // so when standalone is shown its narrower siblings are suppressed.
  test("a qualifying standalone recurrence suppresses NOT_SEGUED_IN / NOT_SEGUED_OUT", () => {
    const allKinds = { STANDALONE: rule, NOT_SEGUED_IN: rule, NOT_SEGUED_OUT: rule };
    const gated = gateSegueRecurrences(
      [
        { kind: "STANDALONE", versionGap: null, gap: null, previousShow: null },
        { kind: "NOT_SEGUED_IN", versionGap: null, gap: null, previousShow: null },
        { kind: "NOT_SEGUED_OUT", versionGap: null, gap: null, previousShow: null },
      ],
      NOT_DEBUT,
      allKinds,
    );
    expect(gated).toEqual([{ kind: "STANDALONE", versionGap: null, gap: null, lastPlayed: null }]);
  });

  // When standalone itself doesn't qualify (under threshold), its siblings are
  // NOT suppressed — they stand on their own.
  test("a non-qualifying standalone does not suppress its siblings", () => {
    const allKinds = { STANDALONE: rule, NOT_SEGUED_IN: rule, NOT_SEGUED_OUT: rule };
    const gated = gateSegueRecurrences(
      [
        { kind: "STANDALONE", versionGap: 5, gap: 30, previousShow: { date: "2024-01-01", slug: "2024-01-01-x" } },
        { kind: "NOT_SEGUED_IN", versionGap: null, gap: null, previousShow: null },
      ],
      NOT_DEBUT,
      allKinds,
    );
    expect(gated).toEqual([{ kind: "NOT_SEGUED_IN", versionGap: null, gap: null, lastPlayed: null }]);
  });
});

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

  // Regression: listing pages synthesize "with <guest> on <instrument>" footnotes
  // from the show lineup + per-track deltas. The light query used to omit those
  // relations, so the footnotes silently dropped from year/on-this-day listings
  // even though the single-show page showed them. The query must load both.
  test("loads show lineup + track performer deltas so listing footnotes render", async () => {
    const db = makeMockDb();
    const service = new SetlistService(db as never, makeRockOperaStub());

    await service.findManyLight({ filters: { year: 2024 } });

    const call = db.show.findMany.mock.calls[0][0];
    expect(call.include.showMusicians).toBeDefined();
    expect(call.include.tracks.select.trackMusicians).toBeDefined();
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

  // The debut footnote suppresses improvisations, so the song's kind must
  // survive the mapper onto the track. A jam mapped without it renders a
  // bogus "debut (original)".
  test("carries the song kind through onto the track", async () => {
    const db = makeMockDb();
    const service = new SetlistService(db as never, makeRockOperaStub());
    db.show.findUnique.mockResolvedValue({
      id: "show-1",
      slug: "2026-05-24",
      date: "2026-05-24",
      createdAt: new Date(),
      updatedAt: new Date(),
      venueId: "v-1",
      bandId: "b-1",
      tracks: [
        {
          id: "t-1",
          showId: "show-1",
          songId: "song-jam",
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
          song: {
            id: "song-jam",
            title: "Mishawaka Improv Jam",
            slug: "mishawaka-improv-jam",
            createdAt: new Date(),
            updatedAt: new Date(),
            kind: "improvisation",
            authorId: null,
            yearlyPlayData: {},
            longestGapsData: {},
            lyrics: null,
            tabs: null,
            notes: null,
            history: null,
            featuredLyric: null,
            timesPlayed: 0,
            guitarTabsUrl: null,
            dateLastPlayed: null,
            dateFirstPlayed: null,
            author: null,
          },
          annotations: [],
        },
      ],
      venue: {
        id: "v-1",
        name: "Mishawaka",
        slug: "mishawaka",
        city: "Bellvue",
        country: "US",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const setlist = await service.findByShowSlug("2026-05-24");
    const track = setlist?.sets.flatMap((s) => s.tracks).find((t) => t.id === "t-1");
    expect(track?.song?.kind).toBe("improvisation");
  });

  // A cover-debut footnote names the original artist, so authorName must flow
  // from the joined Author relation onto the track's song.
  test("flattens authorName from the joined author onto the track", async () => {
    const db = makeMockDb();
    const service = new SetlistService(db as never, makeRockOperaStub());
    db.show.findUnique.mockResolvedValue({
      id: "show-1",
      slug: "2026-03-20",
      date: "2026-03-20",
      createdAt: new Date(),
      updatedAt: new Date(),
      venueId: "v-1",
      bandId: "b-1",
      tracks: [
        {
          id: "t-1",
          showId: "show-1",
          songId: "song-cover",
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
          song: {
            id: "song-cover",
            title: "In This Bih’",
            slug: "in-this-bih",
            createdAt: new Date(),
            updatedAt: new Date(),
            kind: "cover",
            authorId: "author-1",
            yearlyPlayData: {},
            longestGapsData: {},
            lyrics: null,
            tabs: null,
            notes: null,
            history: null,
            featuredLyric: null,
            timesPlayed: 0,
            guitarTabsUrl: null,
            dateLastPlayed: null,
            dateFirstPlayed: null,
            author: { name: "Chris Lorenzo" },
          },
          annotations: [],
        },
      ],
      venue: {
        id: "v-1",
        name: "Okeechobee",
        slug: "okeechobee",
        city: "Okeechobee",
        country: "US",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const setlist = await service.findByShowSlug("2026-03-20");
    const track = setlist?.sets.flatMap((s) => s.tracks).find((t) => t.id === "t-1");
    expect(track?.song?.authorName).toBe("Chris Lorenzo");
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

describe("SetlistService.findMany stub filtering", () => {
  // findMany dropped venueless stub shows in JS *after* pagination, so a stub
  // landing on a page silently shrank it below the page size. Filter at the SQL
  // boundary instead (mirroring findManyLight) so pagination counts stay exact
  // and stubs never reach the listing.
  test("excludes venueless stubs at the SQL boundary when no venue filter is given", async () => {
    const db = makeMockDb();
    const service = new SetlistService(db as never, makeRockOperaStub());

    await service.findMany({ filters: { year: 2024 } });

    const call = db.show.findMany.mock.calls[0][0];
    expect(call.where.venueId).toEqual({ not: null });
  });

  // The venue-detail page passes an explicit venueId; that must win over the
  // stub default (a real venue is never null anyway).
  test("uses the caller's venueId when one is supplied", async () => {
    const db = makeMockDb();
    const service = new SetlistService(db as never, makeRockOperaStub());

    await service.findMany({ filters: { venueId: "venue-1" } });

    const call = db.show.findMany.mock.calls[0][0];
    expect(call.where.venueId).toBe("venue-1");
  });

  // The homepage and venue pages build setlists via findMany and render them
  // with the heavy mapper, so the query must join every relation that mapper
  // reads — the song author (debut-footnote text), structured flags / segue
  // recurrences / completions, and the track + show performer lineups — or those
  // footnotes silently vanish (the mapper defaults each absent relation to []).
  test("joins every relation the heavy setlist mapper renders", async () => {
    const db = makeMockDb();
    const service = new SetlistService(db as never, makeRockOperaStub());

    await service.findMany({ filters: { year: 2024 } });

    const call = db.show.findMany.mock.calls[0][0];
    const trackInclude = call.include.tracks.include;
    expect(trackInclude.song).toEqual({ include: { author: { select: { name: true } } } });
    expect(trackInclude.trackFlags).toBeDefined();
    expect(trackInclude.segueRecurrences).toBeDefined();
    expect(trackInclude.completionsAsLater).toBeDefined();
    expect(trackInclude.trackMusicians).toBeDefined();
    expect(call.include.showMusicians).toBeDefined();
  });
});

describe("SetlistService.findManyByShowIds stub filtering", () => {
  // Same post-pagination undercount as findMany: the id list can include a stub
  // (e.g. top-rated joins), so exclude venueless shows in the query.
  test("excludes venueless stubs at the SQL boundary", async () => {
    const db = makeMockDb();
    const service = new SetlistService(db as never, makeRockOperaStub());

    await service.findManyByShowIds(["show-1", "show-2"]);

    const call = db.show.findMany.mock.calls[0][0];
    expect(call.where.venueId).toEqual({ not: null });
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
