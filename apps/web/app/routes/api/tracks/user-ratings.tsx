import { publicAction } from "~/lib/base-loaders";
import { badRequest } from "~/lib/errors";
import { logger } from "~/lib/logger";
import { services } from "~/server/services";

export interface TrackUserRatingsResponse {
  userRatings: Record<string, number | null>;
}

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

  const response: TrackUserRatingsResponse = {
    userRatings: {},
  };

  try {
    if (context.currentUser) {
      const user = await services.users.findByEmail(context.currentUser.email);
      if (user) {
        const ratings = await services.ratings.findManyByUserIdAndRateableIds(user.id, trackIds, "Track");
        for (const rating of ratings) {
          response.userRatings[rating.rateableId] = rating.value;
        }
      }
    }

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
