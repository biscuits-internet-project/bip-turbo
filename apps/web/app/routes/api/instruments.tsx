import { publicLoader } from "~/lib/base-loaders";
import { logger } from "~/lib/logger";
import { services } from "~/server/services";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;
const DEFAULT_TOP_LIMIT = 10;

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

  // If top parameter is present, return top instruments by usage count
  if (topParam) {
    const topLimit = parseBoundedPositiveInt(topParam, DEFAULT_TOP_LIMIT);
    try {
      const instruments = await services.instruments.findManyWithUsageCount();
      const topInstruments = instruments.slice(0, topLimit);

      logger.info(`Fetched top ${topInstruments.length} instruments by usage count`);
      return new Response(JSON.stringify(topInstruments), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      logger.error("Top instruments fetch error", { error });
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
    const instruments = await services.instruments.search(query, limit);

    logger.info(`Instrument search for "${query}" returned ${instruments.length} results`);
    return new Response(JSON.stringify(instruments), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    logger.error("Instrument search error", { error });
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage, query }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
