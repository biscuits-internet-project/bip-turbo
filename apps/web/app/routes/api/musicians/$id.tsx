import { publicLoader } from "~/lib/base-loaders";
import { logger } from "~/lib/logger";
import { services } from "~/server/services";

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// GET /api/musicians/:id - the picker's fetchById, used to pre-fill a selection.
// Accepts either a musician id or a slug: admin editors pre-fill by id, while
// the public "played by musician" filter pre-fills by the slug it carries in
// the URL. A uuid-shaped param looks up by id (the id column rejects non-uuids),
// anything else by the unique slug.
export const loader = publicLoader(async ({ params }) => {
  const { id } = params;

  if (!id) {
    return json({ error: "Musician ID is required" }, 400);
  }

  try {
    const musician = UUID_REGEX.test(id)
      ? await services.musicians.findById(id)
      : await services.musicians.findBySlug(id);
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
