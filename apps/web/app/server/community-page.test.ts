import type { UserStats } from "@bip/core";
import { beforeEach, describe, expect, test, vi } from "vitest";

const getUserStats = vi.fn();
const getCommunityTotals = vi.fn();
const getOrSet = vi.fn();
const redisDel = vi.fn();

vi.mock("~/server/services", () => ({
  services: {
    cache: { getOrSet: (...args: unknown[]) => getOrSet(...args) },
    redis: { del: (...args: unknown[]) => redisDel(...args) },
    users: {
      getUserStats: (...args: unknown[]) => getUserStats(...args),
      getCommunityTotals: (...args: unknown[]) => getCommunityTotals(...args),
    },
  },
}));

const { COMMUNITY_PAGE_CACHE_TTL_SECONDS, getCommunityPageData } = await import("./community-page");

function makeStats(username: string, counts: Partial<UserStats>): UserStats {
  return {
    user: { username } as UserStats["user"],
    reviewCount: 0,
    attendanceCount: 0,
    ratingCount: 0,
    averageRating: null,
    badges: [],
    communityScore: 0,
    blogPostCount: 0,
    ...counts,
  } as UserStats;
}

describe("getCommunityPageData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Pass-through cache: exercise the builder, capture the getOrSet wiring.
    getOrSet.mockImplementation(async (_key: string, fetcher: () => Promise<unknown>) => fetcher());
    getCommunityTotals.mockResolvedValue({ totalUsers: 2, totalReviews: 9, totalAttendances: 4, totalRatings: 7 });
    getUserStats.mockResolvedValue([
      makeStats("magner", { reviewCount: 3, attendanceCount: 1, ratingCount: 5, blogPostCount: 2 }),
      makeStats("barber", { reviewCount: 8, attendanceCount: 0, ratingCount: 1, blogPostCount: 0 }),
    ]);
  });

  // The page has no hourly cron anymore: the first visitor inside a TTL
  // window pays one stats pass and everyone else reads the cached payload.
  test("builds through the cache with a TTL on a versioned key", async () => {
    await getCommunityPageData();

    expect(getOrSet).toHaveBeenCalledTimes(1);
    const [key, , options] = getOrSet.mock.calls[0];
    expect(key).toBe("community-page-data:v2");
    expect(options).toEqual({ ttl: COMMUNITY_PAGE_CACHE_TTL_SECONDS });
  });

  // One stats pass feeds the full user list and all four leaderboards, and
  // the build stamps its own lastUpdated so the page can show freshness
  // without a second Redis key.
  test("derives the four leaderboards from a single stats pass", async () => {
    const data = await getCommunityPageData();

    expect(getUserStats).toHaveBeenCalledTimes(1);
    expect(data.allUserStats).toHaveLength(2);
    expect(data.topReviewers.map((s) => s.user.username)).toEqual(["barber", "magner"]);
    expect(data.topAttenders.map((s) => s.user.username)).toEqual(["magner"]);
    expect(data.topRaters.map((s) => s.user.username)).toEqual(["magner", "barber"]);
    expect(data.topBloggers.map((s) => s.user.username)).toEqual(["magner"]);
    expect(data.communityTotals.totalUsers).toBe(2);
    expect(new Date(data.lastUpdated).getTime()).not.toBeNaN();
  });

  // The retired hourly cron left a TTL-less ~786KB key (plus its timestamp
  // sibling) in prod Redis; each rebuild clears them so they don't sit there
  // forever.
  test("deletes the legacy cron-era cache keys on rebuild", async () => {
    await getCommunityPageData();

    expect(redisDel).toHaveBeenCalledWith("community-page-data");
    expect(redisDel).toHaveBeenCalledWith("community-last-updated");
  });
});
