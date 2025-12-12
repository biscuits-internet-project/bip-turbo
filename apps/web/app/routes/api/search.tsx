import type { ActionFunctionArgs } from "react-router";
import { publicLoader } from "~/lib/base-loaders";
import { logger } from "~/lib/logger";
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
export const action = publicLoader(async ({ request }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    throw new Response("Method not allowed", { status: 405 });
  }

  const startTime = Date.now();

  try {
    const body = (await request.json()) as SearchRequest;
    const { query, limit = 30 } = body;

    if (!query || query.trim().length === 0) {
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
    logger.error("Search API error", { error });

    const errorMessage = error instanceof Error ? error.message : "Search failed";
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
