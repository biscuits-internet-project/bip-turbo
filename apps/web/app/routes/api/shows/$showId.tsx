import { adminAction } from "~/lib/base-loaders";
import { logger } from "~/lib/logger";
import { services } from "~/server/services";

// DELETE /api/shows/:showId - Remove a show (and its cascade) from the admin UI.
export const action = adminAction(async ({ request, params }) => {
  if (request.method !== "DELETE") {
    throw new Response("Method not allowed", { status: 405 });
  }

  const showId = params.showId as string;
  try {
    await services.shows.delete(showId);
    logger.info("Deleted show", { showId });
    return { ok: true };
  } catch (error) {
    logger.error("Error deleting show", { error });
    throw new Response(error instanceof Error ? error.message : "Failed to delete show", { status: 400 });
  }
});
