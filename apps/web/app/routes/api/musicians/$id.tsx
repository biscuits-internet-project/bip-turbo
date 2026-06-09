import { publicLoader } from "~/lib/base-loaders";
import { logger } from "~/lib/logger";
import { services } from "~/server/services";

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

// GET /api/musicians/:id - the picker's fetchById, used to pre-fill a selection.
export const loader = publicLoader(async ({ params }) => {
  const { id } = params;

  if (!id) {
    return json({ error: "Musician ID is required" }, 400);
  }

  try {
    const musician = await services.musicians.findById(id);
    if (!musician) {
      return json({ error: "Musician not found" }, 404);
    }
    return json(musician, 200);
  } catch (error) {
    logger.error(`Error loading musician ${id}`, { error });
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return json({ error: errorMessage }, 500);
  }
});
