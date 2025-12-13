import type { ActionFunctionArgs } from "react-router";
import { z } from "zod";
import { mcpError, mcpSuccess, parseRequestBody } from "~/lib/mcp-utils";
import { protectedAction } from "~/lib/base-loaders";
import { services } from "~/server/services";

const requestSchema = z.object({
  sequence: z.string().min(1, "Sequence is required"),
  venueFilter: z.string().optional(),
});

// POST /mcp/search-segues
export const action = protectedAction(async ({ request }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    return mcpError("Method not allowed", undefined, 405);
  }

  try {
    const parsed = await parseRequestBody(request, requestSchema);
    if (!parsed.success) {
      return parsed.response;
    }

    const { sequence, venueFilter } = parsed.data;

    // Build search query with venue filter if provided
    const searchQuery = venueFilter ? `${venueFilter} ${sequence}` : sequence;

    // Use search service which handles segue queries (containing ">")
    const searchResponse = await services.postgresSearch.search(searchQuery, {
      limit: 50,
    });

    // Format response - these should all be show results with segue matches
    const response = {
      results: searchResponse.results.map((result) => ({
        showId: result.entityId,
        showSlug: result.entitySlug,
        showDate: result.date || "",
        venueName: result.venueName || "",
        set: result.setInfo || "",
        matchedSequence: sequence,
      })),
    };

    return mcpSuccess(response);
  } catch (error) {
    console.error("MCP search-segues error:", error);
    return mcpError(
      "Search failed",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});
