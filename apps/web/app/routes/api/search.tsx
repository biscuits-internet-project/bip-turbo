import type { ActionFunctionArgs } from "react-router";
import { publicLoader } from "~/lib/base-loaders";
import { services } from "~/server/services";

interface SearchRequest {
  query: string;
  entityTypes?: string[];
  limit?: number;
  threshold?: number;
}

interface SearchResponse {
  results: Array<{
    id: string;
    entityType: string;
    entityId: string;
    displayText: string;
    score: number;
    url: string;
    metadata?: Record<string, any>;
  }>;
  query: string;
  totalResults: number;
  executionTimeMs: number;
}

// POST /api/search - Perform vector search
export const action = publicLoader(async ({ request }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    throw new Response("Method not allowed", { status: 405 });
  }

  const startTime = Date.now();

  try {
    const body = await request.json() as SearchRequest;
    const { query, entityTypes, limit = 20, threshold = 0.3 } = body;

    if (!query || query.trim().length === 0) {
      throw new Response(
        JSON.stringify({ error: "Query is required" }), 
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    if (query.trim().length < 2) {
      throw new Response(
        JSON.stringify({ error: "Query must be at least 2 characters" }), 
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Perform the search
    const searchResults = await services.search.search({
      query: query.trim(),
      entityTypes,
      limit: Math.min(limit, 100), // Cap at 100 results
      threshold: Math.max(0, Math.min(1, threshold)), // Ensure threshold is between 0-1
    });

    // Format results for frontend consumption
    const formattedResults = searchResults.map(result => {
      let url = "/";
      
      // Generate URLs based on entity type
      switch (result.entityType) {
        case "show":
          url = `/shows/${result.entityId}`;
          break;
        case "song":
          url = `/songs/${result.entityId}`;
          break;
        case "venue":
          url = `/venues/${result.entityId}`;
          break;
        case "track":
          url = `/tracks/${result.entityId}`;
          break;
        default:
          url = `/${result.entityType}s/${result.entityId}`;
      }

      return {
        id: result.id,
        entityType: result.entityType,
        entityId: result.entityId,
        displayText: result.displayText,
        score: result.score,
        url,
        metadata: {
          similarity: result.similarity,
          createdAt: result.createdAt,
          updatedAt: result.updatedAt,
        },
      };
    });

    const executionTimeMs = Date.now() - startTime;

    const response: SearchResponse = {
      results: formattedResults,
      query,
      totalResults: formattedResults.length,
      executionTimeMs,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300", // Cache for 5 minutes
      },
    });

  } catch (error) {
    console.error("Search API error:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Search failed";
    const executionTimeMs = Date.now() - startTime;

    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        executionTimeMs,
      }), 
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
});

// GET /api/search/status - Get search index status
export const loader = publicLoader(async () => {
  try {
    const stats = await services.search.getStats();
    
    return new Response(JSON.stringify({
      status: "healthy",
      vectorExtensionAvailable: stats.isVectorExtensionAvailable,
      totalIndexedItems: stats.totalCount,
      itemsByType: stats.countsByType,
      registeredFormatters: services.search.getRegisteredEntityTypes(),
    }), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60", // Cache for 1 minute
      },
    });
  } catch (error) {
    console.error("Search status error:", error);
    
    return new Response(JSON.stringify({
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});