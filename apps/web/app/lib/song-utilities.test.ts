import { beforeEach, describe, expect, test, vi } from "vitest";

const mockSong = {
  id: "1",
  title: "Basis for a Day",
  timesPlayed: 5,
  dateFirstPlayed: null,
  dateLastPlayed: null,
};

const mockUnplayedSong = {
  id: "2",
  title: "Shelby Rose",
  timesPlayed: 0,
  dateFirstPlayed: null,
  dateLastPlayed: null,
};

const mockFindMany = vi.fn().mockResolvedValue([mockSong, mockUnplayedSong]);
const mockFindManyInDateRange = vi.fn().mockResolvedValue([mockSong]);
const mockCacheGetOrSet = vi.fn().mockImplementation((_key: string, fn: () => Promise<unknown>) => fn());
const mockFindManyByDates = vi.fn().mockResolvedValue([]);

vi.mock("~/server/services", () => ({
  services: {
    songs: {
      findMany: (...args: unknown[]) => mockFindMany(...args),
      findManyInDateRange: (...args: unknown[]) => mockFindManyInDateRange(...args),
    },
    cache: {
      getOrSet: (...args: unknown[]) => mockCacheGetOrSet(...args),
    },
    shows: {
      findManyByDates: (...args: unknown[]) => mockFindManyByDates(...args),
    },
  },
}));

import { loadSongsWithVenueInfo } from "./song-utilities";

describe("loadSongsWithVenueInfo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Fetches all songs, filters out unplayed ones, and adds venue info.
  test("fetches all songs when no date range is provided", async () => {
    const result = await loadSongsWithVenueInfo("test-cache-key");

    expect(mockCacheGetOrSet).toHaveBeenCalledWith("test-cache-key", expect.any(Function), { ttl: 3600 });
    expect(mockFindMany).toHaveBeenCalledWith({});
    expect(result.songs).toHaveLength(1);
    expect(result.songs[0].title).toBe("Basis for a Day");
  });

  // When a date range is provided, uses findManyInDateRange instead.
  test("fetches songs in date range when startDate is provided", async () => {
    const startDate = new Date("2024-01-01");
    const endDate = new Date("2024-12-31");

    await loadSongsWithVenueInfo("test-cache-key", { startDate, endDate });

    expect(mockFindManyInDateRange).toHaveBeenCalledWith({ startDate, endDate });
    expect(mockFindMany).not.toHaveBeenCalled();
  });

  // Songs with timesPlayed === 0 should be excluded from results.
  test("filters out songs with zero plays", async () => {
    const result = await loadSongsWithVenueInfo("test-cache-key");

    const titles = result.songs.map((s: { title: string }) => s.title);
    expect(titles).not.toContain("Shelby Rose");
  });
});
