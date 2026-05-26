import { beforeEach, describe, expect, test, vi } from "vitest";

const findManyByUserIdAndRateableIds = vi.fn();
const findByEmail = vi.fn();

vi.mock("~/server/services", () => ({
  services: {
    ratings: {
      findManyByUserIdAndRateableIds: (...args: unknown[]) => findManyByUserIdAndRateableIds(...args),
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
  });

  // Empty input avoids a DB round-trip. Loaders pass [] when the page renders
  // no performance/setlist rows (e.g. a venue with no tracked shows yet).
  test("returns empty response and makes no service calls when trackIds is empty", async () => {
    const result = await computeTrackUserRatings({ currentUser: undefined }, []);
    expect(result).toEqual({ userRatings: {} });
    expect(findManyByUserIdAndRateableIds).not.toHaveBeenCalled();
    expect(findByEmail).not.toHaveBeenCalled();
  });

  // Anonymous browsers have no personal rating data; the loader still calls
  // this so the dehydrated cache entry exists with the right key, but the
  // payload is just the empty skeleton.
  test("returns empty response without DB calls when currentUser is missing", async () => {
    const result = await computeTrackUserRatings({ currentUser: undefined }, ["t1", "t2"]);
    expect(result).toEqual({ userRatings: {} });
    expect(findByEmail).not.toHaveBeenCalled();
  });

  // Edge case: Supabase session exists but the local users row was never
  // created. Don't blow up; return the empty skeleton.
  test("returns empty response when local users record is missing", async () => {
    findByEmail.mockResolvedValue(null);
    const result = await computeTrackUserRatings(
      { currentUser: { id: "auth-1", email: "evan@foo.net", isAdmin: false } },
      ["t1"],
    );
    expect(result.userRatings).toEqual({});
    expect(findManyByUserIdAndRateableIds).not.toHaveBeenCalled();
  });

  // Happy path: only the tracks the user has rated appear in the response.
  // Other ids requested but not rated are simply absent from the map (not
  // explicitly null), matching the previous API route's contract.
  test("populates userRatings for tracks the user has rated", async () => {
    findByEmail.mockResolvedValue({ id: "user-1", email: "evan@foo.net" });
    findManyByUserIdAndRateableIds.mockResolvedValue([
      { rateableId: "t1", rateableType: "Track", value: 5, userId: "user-1" },
      { rateableId: "t3", rateableType: "Track", value: 3, userId: "user-1" },
    ]);

    const result = await computeTrackUserRatings(
      { currentUser: { id: "auth-1", email: "evan@foo.net", isAdmin: false } },
      ["t1", "t2", "t3"],
    );

    expect(result.userRatings).toEqual({ t1: 5, t3: 3 });
  });
});
