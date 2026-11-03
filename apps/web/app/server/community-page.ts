import { topUsersByMetric, type UserStats } from "@bip/core";
import { services } from "~/server/services";

// v3: user objects carry only id/username/avatarUrl/createdAt (no email or settings).
// Bumped so no instance serves a v2 payload.
const CACHE_KEY = "community-page-data:v3";

/**
 * The community page is not linked from anywhere in normal navigation, so the
 * key is absent from Redis most of the time; an hour bounds how often the
 * all-users stats pass (~260ms) can run when something is hitting the page.
 */
export const COMMUNITY_PAGE_CACHE_TTL_SECONDS = 60 * 60;

/** Superseded cache keys, deleted on each rebuild. The first two are from the retired
 * hourly community-refresh cron (~786KB, no TTL, so they never expire on their own);
 * `:v2` carried every user's email and must not outlive its TTL. */
const LEGACY_CACHE_KEYS = ["community-page-data", "community-last-updated", "community-page-data:v2"];

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
