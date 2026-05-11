import { adminAction } from "~/lib/base-loaders";
import { logger } from "~/lib/logger";
import { services } from "~/server/services";

// POST /api/shows/reorder - Rewrite dayOrder for a same-date show group.
export const action = adminAction(async ({ request }) => {
  if (request.method !== "POST") {
    throw new Response("Method not allowed", { status: 405 });
  }

  const { date, orderedIds } = (await request.json()) as { date?: unknown; orderedIds?: unknown };

  if (typeof date !== "string" || !date) {
    throw new Response("date is required", { status: 400 });
  }
  if (!Array.isArray(orderedIds) || !orderedIds.every((id) => typeof id === "string")) {
    throw new Response("orderedIds must be an array of strings", { status: 400 });
  }

  try {
    await services.shows.reorderByDate(date, orderedIds as string[]);
    logger.info("Reordered shows", { date, count: orderedIds.length });
    return { ok: true };
  } catch (error) {
    logger.error("Error reordering shows", { error });
    throw new Response(error instanceof Error ? error.message : "Failed to reorder shows", { status: 400 });
  }
});
