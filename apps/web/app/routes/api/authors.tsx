import { publicLoader } from "~/lib/base-loaders";
import { logger } from "~/lib/logger";
import { services } from "~/server/services";

export const loader = publicLoader(async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") || "";
  const limit = Number.parseInt(url.searchParams.get("limit") || "10", 10);
  const top = url.searchParams.get("top");

  // If top parameter is present, return top authors by song count
  if (top) {
    const topLimit = Number.parseInt(top, 10);
    try {
      const authors = await services.authors.findManyWithSongCount();
      const topAuthors = authors.slice(0, topLimit);

      logger.info(`Fetched top ${topAuthors.length} authors by song count`);
      return new Response(JSON.stringify(topAuthors), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      logger.error("Top authors fetch error", { error });
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  if (!query || query.length < 2) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Use the author service to search authors
    const authors = await services.authors.search(query, limit);

    logger.info(`Author search for "${query}" returned ${authors.length} results`);
    return new Response(JSON.stringify(authors), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    logger.error("Author search error", { error });
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage, query }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
