import { publicLoader } from "~/lib/base-loaders";
import { logger } from "~/lib/logger";
import { services } from "~/server/services";

// GET /api/authors/:id - Get a single author by ID
export const loader = publicLoader(async ({ params }) => {
  const { id } = params;

  if (!id) {
    throw new Response("Author ID is required", { status: 400 });
  }

  try {
    const author = await services.authors.findById(id);

    if (!author) {
      throw new Response("Author not found", { status: 404 });
    }

    return new Response(JSON.stringify(author), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    logger.error(`Error loading author ${id}`, { error });
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
