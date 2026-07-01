import { beforeEach, describe, expect, test, vi } from "vitest";

const findManyByUserIdAndRateableIds = vi.fn();
const getAveragesForRateables = vi.fn();
const findByEmail = vi.fn();

vi.mock("~/server/services", () => ({
  services: {
    ratings: {
      findManyByUserIdAndRateableIds: (...args: unknown[]) => findManyByUserIdAndRateableIds(...args),
      getAveragesForRateables: (...args: unknown[]) => getAveragesForRateables(...args),
    },
    users: {
      findByEmail: (...args: unknown[]) => findByEmail(...args),
    },
  },
}));

vi.mock("~/lib/logger", () => ({
  logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn() },
}));

import { computeTrackUserRatings } from "./track-user-ratings";

describe("computeTrackUserRatings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getAveragesForRateables.mockResolvedValue({});
  });

  // Empty input avoids a DB round-trip. Loaders pass [] when the page renders
  // no performance/setlist rows (e.g. a venue with no tracked shows yet).
  test("returns empty response and makes no service calls when trackIds is empty", async () => {
    const result = await computeTrackUserRatings({ currentUser: undefined }, []);
    expect(result).toEqual({ userRatings: {}, averageRatings: {} });
    expect(findManyByUserIdAndRateableIds).not.toHaveBeenCalled();
    expect(getAveragesForRateables).not.toHaveBeenCalled();
    expect(findByEmail).not.toHaveBeenCalled();
  });

  // The community average + count is public — anonymous browsers still see it,
  // so averages are fetched without a session. Only the personal userRatings
  // map stays empty (and no user-scoped query runs) when unauthenticated.
  test("fetches public averages but no personal ratings when currentUser is missing", async () => {
    getAveragesForRateables.mockResolvedValue({ t1: { average: 4.5, count: 12 } });
    const result = await computeTrackUserRatings({ currentUser: undefined }, ["t1", "t2"]);
    expect(result.averageRatings).toEqual({ t1: { average: 4.5, count: 12 } });
    expect(result.userRatings).toEqual({});
    expect(getAveragesForRateables).toHaveBeenCalledWith(["t1", "t2"], "Track");
    expect(findByEmail).not.toHaveBeenCalled();
    expect(findManyByUserIdAndRateableIds).not.toHaveBeenCalled();
  });

  // Edge case: Supabase session exists but the local users row was never
  // created. Don't blow up; still surface public averages, empty personal map.
  test("returns public averages with empty personal map when local users record is missing", async () => {
    getAveragesForRateables.mockResolvedValue({ t1: { average: 3, count: 2 } });
    findByEmail.mockResolvedValue(null);
    const result = await computeTrackUserRatings(
      { currentUser: { id: "auth-1", email: "evan@foo.net", isAdmin: false } },
      ["t1"],
    );
    expect(result.averageRatings).toEqual({ t1: { average: 3, count: 2 } });
    expect(result.userRatings).toEqual({});
    expect(findManyByUserIdAndRateableIds).not.toHaveBeenCalled();
  });

  // Happy path: community averages plus only the tracks the user has rated.
  // Other ids requested but not rated are simply absent from the personal map
  // (not explicitly null), matching the previous API route's contract.
  test("populates averages and userRatings for an authenticated rater", async () => {
    getAveragesForRateables.mockResolvedValue({
      t1: { average: 5, count: 8 },
      t3: { average: 4, count: 4 },
    });
    findByEmail.mockResolvedValue({ id: "user-1", email: "evan@foo.net" });
    findManyByUserIdAndRateableIds.mockResolvedValue([
      { rateableId: "t1", rateableType: "Track", value: 5, userId: "user-1" },
      { rateableId: "t3", rateableType: "Track", value: 3, userId: "user-1" },
    ]);

    const result = await computeTrackUserRatings(
      { currentUser: { id: "auth-1", email: "evan@foo.net", isAdmin: false } },
      ["t1", "t2", "t3"],
    );

    expect(result.averageRatings).toEqual({
      t1: { average: 5, count: 8 },
      t3: { average: 4, count: 4 },
    });
    expect(result.userRatings).toEqual({ t1: 5, t3: 3 });
  });
});
