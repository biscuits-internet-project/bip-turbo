import { InvalidSearchQueryError, MAX_SEARCH_QUERY_LENGTH } from "@bip/core";
import type { ActionFunctionArgs } from "react-router";
import { type PublicContext, publicLoader } from "~/lib/base-loaders";
import { logger } from "~/lib/logger";
import { enforceRateLimit } from "~/server/rate-limit";
import { services } from "~/server/services";

interface SearchRequest {
  query: string;
  limit?: number;
}

interface SearchResponse {
  results: Array<{
    id: string;
    entityType: string;
    entityId: string;
    displayText: string;
    score: number;
    url: string;
    metadata?: Record<string, unknown>;
  }>;
  query: string;
  totalResults: number;
  executionTimeMs: number;
  searchHistoryId?: string;
}

// POST /api/search - Perform vector search
export const action = publicLoader(async ({ request, context }: ActionFunctionArgs & { context: PublicContext }) => {
  if (request.method !== "POST") {
    throw new Response("Method not allowed", { status: 405 });
  }

  await enforceRateLimit(request, "search", context.currentUser?.id);

  const startTime = Date.now();

  try {
    const body = (await request.json()) as SearchRequest;
    const { query, limit = 30 } = body;

    if (typeof query !== "string" || query.trim().length === 0) {
      throw new Response(JSON.stringify({ error: "Query is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (query.trim().length < 2) {
      throw new Response(JSON.stringify({ error: "Query must be at least 2 characters" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // The body is only cast to SearchRequest, so nothing above validates it at runtime.
    // Bound the query before it becomes a LIKE pattern over full-table scans and is
    // persisted verbatim to search_histories.
    if (query.length > MAX_SEARCH_QUERY_LENGTH) {
      throw new Response(JSON.stringify({ error: `Query must be at most ${MAX_SEARCH_QUERY_LENGTH} characters` }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (limit !== undefined && (typeof limit !== "number" || !Number.isFinite(limit) || limit < 1)) {
      throw new Response(JSON.stringify({ error: "limit must be a positive number" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Perform the search using PostgreSQL search
    const searchResponse = await services.postgresSearch.search(query.trim(), {
      limit,
    });

    const executionTimeMs = Date.now() - startTime;

    const response: SearchResponse = {
      results: searchResponse.results,
      query,
      totalResults: searchResponse.results.length,
      executionTimeMs,
      searchHistoryId: searchResponse.searchHistoryId,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300", // Cache for 5 minutes
      },
    });
  } catch (error) {
    // The validation above throws its 400s as Responses; let them through instead of
    // reporting a client mistake as a server failure.
    if (error instanceof Response) throw error;
    // The service's own bounds (e.g. segue chain length) are the caller's mistake too.
    if (error instanceof InvalidSearchQueryError) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    logger.error("Search API error", { error });

    // Fixed text: the underlying message can be a Prisma invocation dump. It is logged above.
    const errorMessage = "Search failed";
    const executionTimeMs = Date.now() - startTime;

    return new Response(
      JSON.stringify({
        error: errorMessage,
        executionTimeMs,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
});

// GET /api/search/status - Get search status
export const loader = publicLoader(async () => {
  return new Response(
    JSON.stringify({
      status: "healthy",
      searchProvider: "postgresql",
      features: ["full-text", "trigram-similarity", "segue-search"],
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60", // Cache for 1 minute
      },
    },
  );
});
