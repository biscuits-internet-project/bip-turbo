import type { ActionFunctionArgs } from "react-router";
import { z } from "zod";
import { mcpError, mcpSuccess, parseRequestBody } from "~/lib/mcp-utils";
import { protectedAction } from "~/lib/base-loaders";
import { services } from "~/server/services";

const requestSchema = z.object({
  query: z.string().min(1, "Query is required"),
  limit: z.number().int().positive().max(100).optional().default(50),
});

// POST /mcp/search-venues
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

    // Search venues using postgres search service
    const results = await services.postgresSearch.searchVenues(query.trim(), limit);

    // Format response
    const response = {
      results: results.map((venue) => ({
        id: venue.id,
        slug: venue.slug,
        name: venue.name,
        city: venue.city,
        state: venue.state || null,
        country: venue.country,
        timesPlayed: venue.timesPlayed,
      })),
    };

    return mcpSuccess(response);
  } catch (error) {
    console.error("MCP search-venues error:", error);
    return mcpError(
      "Search failed",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});
