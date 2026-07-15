import { getFeatureFlags, runRatingsRecompute } from "@bip/core";
import type { ActionFunctionArgs } from "react-router";
import { logger } from "~/lib/logger";
import { services } from "~/server/services";

interface CronJobResult {
  success: boolean;
  message: string;
  duration?: number;
  timestamp: string;
}

/**
 * Hourly full rating recompute (and deploy-time backfill via the same routine).
 * Gated by the `ratings.recompute-enabled` flag, then dirty-gated internally so it
 * no-ops cheaply when no ratings changed since the last run.
 */
async function recomputeRatings(): Promise<CronJobResult> {
  const startTime = Date.now();

  try {
    const flags = await getFeatureFlags();
    if (!flags.recomputeEnabled) {
      return {
        success: true,
        message: "Ratings recompute disabled by flag",
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      };
    }

    const result = await runRatingsRecompute({
      raterWeights: services.raterWeights,
      ratings: services.ratings,
      logger,
    });
    const duration = Date.now() - startTime;
    const message = result.ran
      ? `Recomputed ratings: ${result.users} raters, ${result.shows} shows, ${result.rateables} canonical averages, anchor ${result.anchor?.toFixed(3)}`
      : "Ratings unchanged since last recompute; skipped";
    logger.info(message);

    return { success: true, message, duration, timestamp: new Date().toISOString() };
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error("Failed to recompute ratings", { error });
    return {
      success: false,
      message: `Failed to recompute ratings: ${error instanceof Error ? error.message : "Unknown error"}`,
      duration,
      timestamp: new Date().toISOString(),
    };
  }
}

// Map of available cron jobs. The community page builds its own cache on
// demand (see ~/server/community-page), so no cron warms it anymore.
const cronJobs: Record<string, () => Promise<CronJobResult>> = {
  "recompute-ratings": recomputeRatings,
};

export async function action({ params, request }: ActionFunctionArgs) {
  const { action } = params;

  if (!action) {
    return new Response(JSON.stringify({ error: "Action parameter is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Simple security check - require specific user agent from GitHub Actions
  const userAgent = request.headers.get("user-agent") || "";
  const isGitHubActions = userAgent.includes("curl") || userAgent.includes("GitHub-Actions");

  if (!isGitHubActions) {
    logger.warn(`Unauthorized cron access attempt from: ${userAgent}`);
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const cronJob = cronJobs[action];
  if (!cronJob) {
    return new Response(
      JSON.stringify({
        error: `Unknown cron action: ${action}. Available actions: ${Object.keys(cronJobs).join(", ")}`,
      }),
      {
        status: 404,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  try {
    logger.info(`🤖 Executing cron job: ${action}`);
    const result = await cronJob();

    return new Response(
      JSON.stringify({
        action,
        ...result,
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    logger.error(`Cron job ${action} failed`, { error });

    return new Response(
      JSON.stringify({
        action,
        success: false,
        message: `Cron job failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
