import { publicAction } from "~/lib/base-loaders";
import { badRequest } from "~/lib/errors";
import { logger } from "~/lib/logger";
import { computeShowUserData } from "~/server/show-user-data";

export const action = publicAction(async ({ request, context }) => {
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

  // Abuse guard: batched-fetch client already chunks at 200 per POST.
  if (showIds.length > 200) {
    return new Response(JSON.stringify({ error: "Too many show IDs (max 200)" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const response = await computeShowUserData(context, showIds);
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
