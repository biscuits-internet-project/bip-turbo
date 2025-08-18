import type { ActionFunctionArgs } from "react-router";
import { services } from "~/server/services";

interface CronJobResult {
  success: boolean;
  message: string;
  duration?: number;
  timestamp: string;
}

async function refreshCommunityCache(): Promise<CronJobResult> {
  const startTime = Date.now();
  
  try {
    console.log("Starting community cache refresh...");
    
    // Clear existing cache
    const redis = services.redis;
    await redis.del("community-page-data");
    
    // Fetch fresh data (same logic as community route loader)
    const [allUserStats, communityTotals, topReviewers, topAttenders, topRaters, topBloggers] = await Promise.all([
      services.users.getUserStats(),
      services.users.getCommunityTotals(),
      services.users.getTopUsersByMetric("reviews", 5),
      services.users.getTopUsersByMetric("attendance", 5),
      services.users.getTopUsersByMetric("ratings", 5),
      services.users.getTopUsersByMetric("blogPostCount", 5),
    ]);

    const result = {
      allUserStats: allUserStats, // Show all users, no limit
      topReviewers,
      topAttenders,
      topRaters,
      topBloggers,
      communityTotals,
    };

    // Debug: Log a sample user to see the structure  
    if (allUserStats.length > 0) {
      console.log("COMMUNITY_SCORE_DEBUG:", allUserStats[0].communityScore);
      console.log("BADGES_DEBUG:", allUserStats[0].badges);
      console.log("REVIEW_COUNT_DEBUG:", allUserStats[0].reviewCount);
    }
    
    // Cache the fresh data (no expiration - refreshed by cron)
    await redis.set("community-page-data", result);
    
    const duration = Date.now() - startTime;
    console.log(`Community cache refreshed successfully in ${duration}ms`);
    
    return {
      success: true,
      message: `Community cache refreshed successfully. Cached ${allUserStats.length} user stats.`,
      duration,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error("Failed to refresh community cache:", error);
    
    return {
      success: false,
      message: `Failed to refresh community cache: ${error instanceof Error ? error.message : "Unknown error"}`,
      duration,
      timestamp: new Date().toISOString(),
    };
  }
}

// Map of available cron jobs
const cronJobs: Record<string, () => Promise<CronJobResult>> = {
  "community-refresh": refreshCommunityCache,
};

export async function action({ params, request }: ActionFunctionArgs) {
  const { action } = params;
  
  if (!action) {
    return new Response(JSON.stringify({ error: "Action parameter is required" }), { 
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  // Simple security check - require specific user agent from GitHub Actions
  const userAgent = request.headers.get("user-agent") || "";
  const isGitHubActions = userAgent.includes("curl") || userAgent.includes("GitHub-Actions");
  
  if (!isGitHubActions) {
    console.warn(`Unauthorized cron access attempt from: ${userAgent}`);
    return new Response(JSON.stringify({ error: "Unauthorized" }), { 
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  const cronJob = cronJobs[action];
  if (!cronJob) {
    return new Response(JSON.stringify(
      { error: `Unknown cron action: ${action}. Available actions: ${Object.keys(cronJobs).join(", ")}` }
    ), { 
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    console.log(`🤖 Executing cron job: ${action}`);
    const result = await cronJob();
    
    return new Response(JSON.stringify({
      action,
      ...result,
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error(`Cron job ${action} failed:`, error);
    
    return new Response(JSON.stringify({
      action,
      success: false,
      message: `Cron job failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      timestamp: new Date().toISOString(),
    }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}