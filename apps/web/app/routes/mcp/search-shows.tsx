import type { ActionFunctionArgs } from "react-router";
import { z } from "zod";
import { mcpError, mcpSuccess, parseRequestBody } from "~/lib/mcp-utils";
import { protectedAction } from "~/lib/base-loaders";
import { services } from "~/server/services";

const requestSchema = z.object({
  query: z.string().min(1, "Query is required"),
  limit: z.number().int().positive().max(100).optional().default(50),
});

type SearchShowsRequest = z.infer<typeof requestSchema>;

// POST /mcp/search-shows
export const action = protectedAction(async ({ request }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    return mcpError("Method not allowed", undefined, 405);
  }

  try {
    const parsed = await parseRequestBody(request, requestSchema);
    if (!parsed.success) {
      return parsed.response;
    }

    const { query, limit } = parsed.data;

    // Use existing search service
    const searchResponse = await services.postgresSearch.search(query.trim(), {
      limit,
    });

    // Filter to only show results
    const showResults = searchResponse.results.filter(
      (result) => result.entityType === "show"
    );

    // Format response
    const response = {
      results: showResults.map((result) => ({
        id: result.entityId,
        slug: result.entitySlug,
        date: result.date || "",
        venueName: result.venueName || "",
        venueCity: result.venueLocation || "",
        venueState: result.venueLocation?.split(", ")[1] || "",
        score: result.score,
      })),
    };

    return mcpSuccess(response);
  } catch (error) {
    console.error("MCP search-shows error:", error);
    return mcpError(
      "Search failed",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});
