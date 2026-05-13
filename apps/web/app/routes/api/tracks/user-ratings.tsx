import { publicAction } from "~/lib/base-loaders";
import { badRequest } from "~/lib/errors";
import { logger } from "~/lib/logger";
import { computeTrackUserRatings } from "~/server/track-user-ratings";

export const action = publicAction(async ({ request, context }) => {
  let trackIds: string[];
  try {
    const body = await request.json();
    trackIds = body.trackIds;
  } catch {
    return badRequest();
  }

  if (!Array.isArray(trackIds) || trackIds.length === 0) {
    return badRequest();
  }

  if (trackIds.length > 500) {
    return new Response(JSON.stringify({ error: "Too many track IDs (max 500)" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const response = await computeTrackUserRatings(context, trackIds);
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    logger.error("Error fetching track user ratings", { error, trackIds: trackIds.length });
    return new Response(JSON.stringify({ error: "Failed to fetch track ratings" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
