import { publicLoader } from "~/lib/base-loaders";
import { logger } from "~/lib/logger";
import { services } from "~/server/services";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;
const DEFAULT_TOP_LIMIT = 10;

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

const parseBoundedPositiveInt = (value: string | null, fallback: number) => {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }
  return Math.min(parsed, MAX_LIMIT);
};

export const loader = publicLoader(async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") || "";
  const limit = parseBoundedPositiveInt(url.searchParams.get("limit"), DEFAULT_LIMIT);
  const topParam = url.searchParams.get("top");

  // The picker's loadOnOpen asks for the top list; return musicians alphabetically.
  if (topParam) {
    const topLimit = parseBoundedPositiveInt(topParam, DEFAULT_TOP_LIMIT);
    try {
      const musicians = await services.musicians.findMany({ pagination: { limit: topLimit } });
      logger.info(`Fetched top ${musicians.length} musicians`);
      return json(musicians, 200);
    } catch (error) {
      logger.error("Top musicians fetch error", { error });
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      return json({ error: errorMessage }, 500);
    }
  }

  if (!query || query.length < 2) {
    return json([], 200);
  }

  try {
    const musicians = await services.musicians.search(query, limit);
    logger.info(`Musician search for "${query}" returned ${musicians.length} results`);
    return json(musicians, 200);
  } catch (error) {
    logger.error("Musician search error", { error });
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return json({ error: errorMessage, query }, 500);
  }
});
