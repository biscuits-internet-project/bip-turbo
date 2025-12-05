import type { ActionFunctionArgs } from "react-router";
import { z } from "zod";
import { mcpError, mcpSuccess, parseRequestBody } from "~/lib/mcp-utils";
import { publicLoader } from "~/lib/base-loaders";
import { services } from "~/server/services";

const requestSchema = z.object({
  date: z.string().min(1, "Date is required"),
  dateType: z.enum(["exact", "month", "year"]),
});

// POST /mcp/search-by-date
export const action = publicLoader(async ({ request }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    return mcpError("Method not allowed", undefined, 405);
  }

  try {
    const parsed = await parseRequestBody(request, requestSchema);
    if (!parsed.success) {
      return parsed.response;
    }

    const { date } = parsed.data;

    // Use search service which handles date parsing
    const searchResponse = await services.postgresSearch.search(date, {
      limit: 50,
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
      })),
    };

    return mcpSuccess(response);
  } catch (error) {
    console.error("MCP search-by-date error:", error);
    return mcpError(
      "Search failed",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});
