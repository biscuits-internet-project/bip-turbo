import { adminAction } from "~/lib/base-loaders";
import { badRequest, methodNotAllowed } from "~/lib/errors";
import { logger } from "~/lib/logger";
import { services } from "~/server/services";

export const action = adminAction(async ({ request }) => {
  const method = request.method;

  try {
    if (method === "POST") {
      // Create author
      const body = await request.json();
      const { name } = body;

      if (!name || typeof name !== "string") {
        return badRequest("Author name is required");
      }

      const author = await services.authors.create({ name });

      logger.info(`Admin created author: ${author.name} (${author.id})`);

      return new Response(JSON.stringify(author), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (method === "PUT") {
      // Update author
      const body = await request.json();
      const { slug, name } = body;

      if (!slug || typeof slug !== "string") {
        return badRequest("Author slug is required");
      }

      if (!name || typeof name !== "string") {
        return badRequest("Author name is required");
      }

      const author = await services.authors.update(slug, { name });

      logger.info(`Admin updated author: ${author.name} (${author.id})`);

      return new Response(JSON.stringify(author), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (method === "DELETE") {
      // Delete author
      const body = await request.json();
      const { id } = body;

      if (!id || typeof id !== "string") {
        return badRequest("Author ID is required");
      }

      try {
        const deleted = await services.authors.delete(id);

        if (!deleted) {
          return new Response(JSON.stringify({ error: "Failed to delete author" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }

        logger.info(`Admin deleted author: ${id}`);

        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        // Return 400 if it's a constraint error (author has songs)
        if (errorMessage.includes("Cannot delete author with")) {
          return new Response(JSON.stringify({ error: errorMessage }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
        throw error;
      }
    }

    return methodNotAllowed();
  } catch (error) {
    logger.error("Error in admin authors endpoint", { error, method });
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
