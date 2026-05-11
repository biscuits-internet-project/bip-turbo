import type { Song } from "@bip/domain";
import { beforeEach, describe, expect, test, vi } from "vitest";

const basisForADay = {
  id: "1",
  title: "Basis for a Day",
  timesPlayed: 100,
  dateFirstPlayed: null,
  dateLastPlayed: null,
} as unknown as Song;

const homeAgain = {
  id: "2",
  title: "Home Again",
  timesPlayed: 50,
  dateFirstPlayed: null,
  dateLastPlayed: null,
} as unknown as Song;

const crickets = {
  id: "3",
  title: "Crickets",
  timesPlayed: 30,
  dateFirstPlayed: null,
  dateLastPlayed: null,
} as unknown as Song;

const shelbyRose = {
  id: "4",
  title: "Shelby Rose",
  timesPlayed: 0,
  dateFirstPlayed: null,
  dateLastPlayed: null,
} as unknown as Song;

const mockFindMany = vi.fn();
const mockFindManyInDateRange = vi.fn();
const mockShowsFindMany = vi.fn();
const mockFindManyByDates = vi.fn().mockResolvedValue([]);
const mockBuildSongPerformanceCounts = vi.fn();
const mockBuildFilteredSongRarity = vi.fn().mockResolvedValue(new Map());
const mockCacheGetOrSet = vi.fn().mockImplementation((_key: string, fn: () => Promise<unknown>) => fn());
const mockFindByEmail = vi.fn();
const mockFindByUsername = vi.fn();
const mockGetShowsByYear = vi.fn();
const mockGetShowsSinceLastPlayedBySongIds = vi.fn();

vi.mock("~/server/services", () => ({
  services: {
    songs: {
      findMany: (...args: unknown[]) => mockFindMany(...args),
      findManyInDateRange: (...args: unknown[]) => mockFindManyInDateRange(...args),
    },
    songPageComposer: {
      buildSongPerformanceCounts: (...args: unknown[]) => mockBuildSongPerformanceCounts(...args),
      buildFilteredSongRarity: (...args: unknown[]) => mockBuildFilteredSongRarity(...args),
    },
    cache: {
      getOrSet: (...args: unknown[]) => mockCacheGetOrSet(...args),
    },
    shows: {
      findMany: (...args: unknown[]) => mockShowsFindMany(...args),
      findManyByDates: (...args: unknown[]) => mockFindManyByDates(...args),
    },
    users: {
      findByEmail: (...args: unknown[]) => mockFindByEmail(...args),
      findByUsername: (...args: unknown[]) => mockFindByUsername(...args),
    },
    stats: {
      getShowsByYear: (...args: unknown[]) => mockGetShowsByYear(...args),
      getShowsSinceLastPlayedBySongIds: (...args: unknown[]) => mockGetShowsSinceLastPlayedBySongIds(...args),
    },
  },
}));

import type { PublicContext } from "~/lib/base-loaders";
import { fetchFilteredSongs } from "./song-utilities";

const ctx = {} as PublicContext;

describe("fetchFilteredSongs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFindMany.mockResolvedValue([basisForADay, homeAgain, crickets, shelbyRose]);
    mockFindManyInDateRange.mockResolvedValue([]);
    mockBuildSongPerformanceCounts.mockResolvedValue({});
    mockShowsFindMany.mockResolvedValue([]);
    mockFindManyByDates.mockResolvedValue([]);
    mockGetShowsByYear.mockResolvedValue({});
    mockGetShowsSinceLastPlayedBySongIds.mockResolvedValue(new Map());
  });

  // The unfiltered /songs path calls findMany({}) for the canonical all-time
  // dataset, drops never-played rows, and leaves filteredTimesPlayed unset
  // (no scope to compare against).
  test("no filters: returns all-time songs with no filteredTimesPlayed and unplayed excluded", async () => {
    const result = await fetchFilteredSongs(new URL("http://test/songs"), ctx);

    expect(mockFindMany).toHaveBeenCalledWith({});
    expect(mockFindManyInDateRange).not.toHaveBeenCalled();
    expect(mockBuildSongPerformanceCounts).not.toHaveBeenCalled();

    const titles = result.map((s) => s.title);
    expect(titles).not.toContain("Shelby Rose");
    expect(titles).toContain("Basis for a Day");
    expect(result.every((s) => s.filteredTimesPlayed === undefined)).toBe(true);
  });

  // Cover and author are non-narrowing — they restrict which songs appear
  // but every matching song still surfaces its full play history. So the
  // canonical fetch carries the cover/author filter and no scope counting
  // happens. filteredTimesPlayed stays undefined.
  test("cover only: includes cover in baseFilter, no scope counts attached", async () => {
    await fetchFilteredSongs(new URL("http://test/songs?cover=cover"), ctx);

    expect(mockFindMany).toHaveBeenCalledWith({ cover: true });
    expect(mockFindManyInDateRange).not.toHaveBeenCalled();
    expect(mockBuildSongPerformanceCounts).not.toHaveBeenCalled();
  });

  test("author only: includes authorId in baseFilter, no scope counts attached", async () => {
    const author = "11111111-1111-1111-1111-111111111111";
    await fetchFilteredSongs(new URL(`http://test/songs?author=${author}`), ctx);

    expect(mockFindMany).toHaveBeenCalledWith({ authorId: author });
    expect(mockBuildSongPerformanceCounts).not.toHaveBeenCalled();
  });

  // A bogus author param (not a UUID) is dropped rather than passed
  // through, so the filter degrades to "no author constraint" instead of
  // hitting the DB with garbage.
  test("invalid author UUID is ignored", async () => {
    await fetchFilteredSongs(new URL("http://test/songs?author=not-a-uuid"), ctx);

    expect(mockFindMany).toHaveBeenCalledWith({});
  });

  // Date range is narrowing: timesPlayed must remain all-time (from the
  // canonical findMany), and filteredTimesPlayed comes from the range
  // count returned by findManyInDateRange. Songs with no plays in the
  // range are excluded.
  test("date range: timesPlayed is all-time, filteredTimesPlayed is the range count", async () => {
    // findManyInDateRange returns rows where timesPlayed represents the
    // range count. Only basisForADay had any plays in 1999.
    mockFindManyInDateRange.mockResolvedValueOnce([
      { ...basisForADay, timesPlayed: 7 },
      { ...crickets, timesPlayed: 0 },
    ]);

    const result = await fetchFilteredSongs(new URL("http://test/songs?timeRange=1999"), ctx);

    expect(mockFindManyInDateRange).toHaveBeenCalled();
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1");
    expect(result[0].timesPlayed).toBe(100); // all-time, from findMany
    expect(result[0].filteredTimesPlayed).toBe(7); // range count
  });

  // Toggle filters route through buildSongPerformanceCounts, which is the
  // only counter that understands toggles. We still hit findMany for the
  // canonical all-time list; the Map<id, count> attaches as
  // filteredTimesPlayed.
  test("toggle filter: uses buildSongPerformanceCounts for scope, all-time from findMany", async () => {
    mockBuildSongPerformanceCounts.mockResolvedValueOnce({ "2": 4 });

    const result = await fetchFilteredSongs(new URL("http://test/songs?filters=encore"), ctx);

    expect(mockBuildSongPerformanceCounts).toHaveBeenCalled();
    expect(mockFindMany).toHaveBeenCalledWith({});
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("2");
    expect(result[0].timesPlayed).toBe(50); // Home Again all-time
    expect(result[0].filteredTimesPlayed).toBe(4);
  });

  // played=notPlayed combined with a narrowing filter returns songs that
  // exist all-time but didn't appear in the filter scope. They keep their
  // canonical timesPlayed and have no filteredTimesPlayed — there's
  // nothing to scope to. Sort is most-played-overall first.
  test("played=notPlayed with date range: returns played-overall-but-not-in-range, no filteredTimesPlayed", async () => {
    // basisForADay played in range; the other two played overall did not
    mockFindManyInDateRange.mockResolvedValueOnce([{ ...basisForADay, timesPlayed: 7 }]);

    const result = await fetchFilteredSongs(new URL("http://test/songs?timeRange=1999&played=notPlayed"), ctx);

    const ids = result.map((s) => s.id);
    expect(ids).not.toContain("1"); // basisForADay was in range
    expect(ids).not.toContain("4"); // shelbyRose never played overall
    expect(ids).toEqual(["2", "3"]); // sorted by all-time desc: Home Again, Crickets
    expect(result.every((s) => s.filteredTimesPlayed === undefined)).toBe(true);
    expect(result.every((s) => typeof s.timesPlayed === "number" && s.timesPlayed > 0)).toBe(true);
  });

  // played=notPlayed without a narrowing filter is ignored — there's no
  // scope to be "not played in." Behaves like the unfiltered case.
  test("played=notPlayed without narrowing filter behaves as unfiltered", async () => {
    const result = await fetchFilteredSongs(new URL("http://test/songs?played=notPlayed"), ctx);

    expect(result.every((s) => s.filteredTimesPlayed === undefined)).toBe(true);
    expect(result.map((s) => s.title)).not.toContain("Shelby Rose");
  });

  // The rarity columns on /songs (Current Gap, % Since Debut, Avg Gap)
  // read showsSinceLastPlayed, percentSinceDebut, and averageShowsPerPlay
  // off each row. Verifies fetchFilteredSongs pulls showsByYear (cached
  // catalogue-level data) + per-song current-gap counts and runs each
  // song through computeRarityStats so the columns render real values
  // rather than em-dashes.
  test("rarity: populates showsSinceLastPlayed / percentSinceDebut / averageShowsPerPlay on returned rows", async () => {
    const helicopters = {
      id: "hel",
      title: "Helicopters",
      timesPlayed: 200,
      dateFirstPlayed: new Date(Date.UTC(1995, 5, 1)),
      dateLastPlayed: new Date(Date.UTC(2024, 0, 1)),
    } as unknown as Song;
    const aboveTheWaves = {
      id: "atw",
      title: "Above The Waves",
      timesPlayed: 50,
      dateFirstPlayed: new Date(Date.UTC(2010, 0, 1)),
      dateLastPlayed: new Date(Date.UTC(2023, 0, 1)),
    } as unknown as Song;
    mockFindMany.mockResolvedValueOnce([helicopters, aboveTheWaves]);

    // 1995 + 2010 era totals: Helicopters debuted in 1995 and gets all 1000
    // shows since debut → 200/1000 = 20%, mean-gap = (1000-200)/(200-1) ≈
    // 4.02 shows. Above The Waves debuted in 2010 with 600 shows since →
    // 50/600 ≈ 8.33%, mean-gap = (600-50)/(50-1) ≈ 11.22 shows.
    mockGetShowsByYear.mockResolvedValueOnce({ 1995: 400, 2010: 600 });
    mockGetShowsSinceLastPlayedBySongIds.mockResolvedValueOnce(
      new Map([
        ["hel", 12],
        ["atw", 47],
      ]),
    );

    const result = await fetchFilteredSongs(new URL("http://test/songs"), ctx);

    const hel = result.find((s) => s.id === "hel");
    const atw = result.find((s) => s.id === "atw");
    expect(hel?.showsSinceLastPlayed).toBe(12);
    expect(hel?.percentSinceDebut).toBeCloseTo(0.2, 5);
    expect(hel?.averageShowsPerPlay).toBeCloseTo(800 / 199, 5);
    expect(atw?.showsSinceLastPlayed).toBe(47);
    expect(atw?.percentSinceDebut).toBeCloseTo(50 / 600, 5);
    expect(atw?.averageShowsPerPlay).toBeCloseTo(550 / 49, 5);
  });

  // Songs with no debut date keep null rarity fields (computeRarityStats
  // returns nulls for percentSinceDebut and averageShowsPerPlay) — the
  // table cell renders em-dash instead of NaN/Infinity. showsSinceLastPlayed
  // also stays null when the gap map has no entry for the song.
  test("rarity: never-debuted song keeps null rarity fields", async () => {
    const neverPlayed = {
      id: "np",
      title: "Munchkin Invasion",
      timesPlayed: 0,
      dateFirstPlayed: null,
      dateLastPlayed: null,
    } as unknown as Song;
    // Played-but-never-played songs are filtered out without a scope, so
    // we use the played-but-no-debut-date edge case (rare migration drift)
    // by giving it timesPlayed > 0 so it survives the filter.
    const survivor = { ...neverPlayed, timesPlayed: 3 } as unknown as Song;
    mockFindMany.mockResolvedValueOnce([survivor]);
    mockGetShowsByYear.mockResolvedValueOnce({ 2000: 100 });
    mockGetShowsSinceLastPlayedBySongIds.mockResolvedValueOnce(new Map());

    const result = await fetchFilteredSongs(new URL("http://test/songs"), ctx);

    expect(result[0].showsSinceLastPlayed).toBeNull();
    expect(result[0].percentSinceDebut).toBeNull();
    expect(result[0].averageShowsPerPlay).toBeNull();
  });

  // The cache wrapper keys off the URL params. Same URL → one upstream
  // call; different URL → distinct keys. Pins the contract that the same
  // /songs?timeRange=X URL and /api/songs?timeRange=X URL hit the same
  // entry (the keys are derived purely from search params, ignoring the
  // path).
  test("cache: invokes getOrSet with a stable key per filter combination", async () => {
    await fetchFilteredSongs(new URL("http://test/songs?timeRange=1999"), ctx);
    await fetchFilteredSongs(new URL("http://test/api/songs?timeRange=1999"), ctx);

    const keys = mockCacheGetOrSet.mock.calls.map((c) => c[0]);
    expect(keys[0]).toBe(keys[1]);

    await fetchFilteredSongs(new URL("http://test/songs?timeRange=2000"), ctx);
    expect(mockCacheGetOrSet.mock.calls[2][0]).not.toBe(keys[0]);
  });
});
