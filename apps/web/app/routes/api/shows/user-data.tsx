import type { Attendance } from "@bip/domain";
import { publicAction } from "~/lib/base-loaders";
import { badRequest } from "~/lib/errors";
import { logger } from "~/lib/logger";
import { services } from "~/server/services";

export interface ShowUserDataResponse {
  attendances: Record<string, Attendance | null>;
  userRatings: Record<string, number | null>;
  averageRatings: Record<string, { average: number; count: number } | null>;
}

export const action = publicAction(async ({ request, context }) => {
  // Parse JSON body
  let showIds: string[];
  try {
    const body = await request.json();
    showIds = body.showIds;
  } catch {
    return badRequest();
  }

  if (!Array.isArray(showIds) || showIds.length === 0) {
    return badRequest();
  }

  // Limit to prevent abuse
  if (showIds.length > 200) {
    return new Response(JSON.stringify({ error: "Too many show IDs (max 200)" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const response: ShowUserDataResponse = {
    attendances: {},
    userRatings: {},
    averageRatings: {},
  };

  // Initialize all show IDs with null
  for (const showId of showIds) {
    response.attendances[showId] = null;
    response.userRatings[showId] = null;
    response.averageRatings[showId] = null;
  }

  try {
    // Fetch average ratings calculated from ratings table (available to everyone)
    const averages = await services.ratings.getAveragesForRateables(showIds, "Show");
    for (const [showId, data] of Object.entries(averages)) {
      response.averageRatings[showId] = data;
    }

    // For authenticated users, also fetch their attendances and ratings
    if (context.currentUser) {
      const user = await services.users.findByEmail(context.currentUser.email);
      if (user) {
        // Fetch user attendances
        const attendances = await services.attendances.findManyByUserIdAndShowIds(user.id, showIds);
        for (const attendance of attendances) {
          response.attendances[attendance.showId] = attendance;
        }

        // Fetch user ratings
        const ratings = await services.ratings.findManyByUserIdAndRateableIds(user.id, showIds, "Show");
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
    logger.error("Error fetching show user data", { error, showIds: showIds.length });
    return new Response(JSON.stringify({ error: "Failed to fetch show data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
