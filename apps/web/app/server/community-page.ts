import { topUsersByMetric, type UserStats } from "@bip/core";
import { services } from "~/server/services";

const CACHE_KEY = "community-page-data:v2";

/**
 * The community page is not linked from anywhere in normal navigation, so the
 * key is absent from Redis most of the time; an hour bounds how often the
 * all-users stats pass (~260ms) can run when something is hitting the page.
 */
export const COMMUNITY_PAGE_CACHE_TTL_SECONDS = 60 * 60;

/** Cache keys written by the retired hourly community-refresh cron. The main
 * one is ~786KB with no TTL, so it never expires on its own. */
const LEGACY_CACHE_KEYS = ["community-page-data", "community-last-updated"];

export interface CommunityPageData {
  allUserStats: UserStats[];
  topReviewers: UserStats[];
  topAttenders: UserStats[];
  topRaters: UserStats[];
  topBloggers: UserStats[];
  communityTotals: {
    totalUsers: number;
    totalReviews: number;
    totalAttendances: number;
    totalRatings: number;
  };
  lastUpdated: string;
}

/**
 * Community-page payload, built on demand and cached for an hour. Replaces
 * the hourly community-refresh cron, which rebuilt this 24 times a day
 * whether or not anyone visited. The first request inside a TTL window pays
 * one all-users stats pass; every other request reads Redis.
 */
export async function getCommunityPageData(): Promise<CommunityPageData> {
  return services.cache.getOrSet<CommunityPageData>(CACHE_KEY, buildCommunityPageData, {
    ttl: COMMUNITY_PAGE_CACHE_TTL_SECONDS,
  });
}

async function buildCommunityPageData(): Promise<CommunityPageData> {
  await Promise.all(LEGACY_CACHE_KEYS.map((key) => services.redis.del(key)));

  const [allUserStats, communityTotals] = await Promise.all([
    services.users.getUserStats(),
    services.users.getCommunityTotals(),
  ]);

  return {
    allUserStats,
    topReviewers: topUsersByMetric(allUserStats, "reviews", 5),
    topAttenders: topUsersByMetric(allUserStats, "attendance", 5),
    topRaters: topUsersByMetric(allUserStats, "ratings", 5),
    topBloggers: topUsersByMetric(allUserStats, "blogPostCount", 5),
    communityTotals,
    lastUpdated: new Date().toISOString(),
  };
}
