import type { ActionFunctionArgs } from "react-router";
import { z } from "zod";
import { mcpError, mcpSuccess, parseRequestBody } from "~/lib/mcp-utils";
import { protectedAction } from "~/lib/base-loaders";
import { services } from "~/server/services";

const requestSchema = z.object({
  year: z.number().int().min(1990).max(2100),
  sortBy: z.enum(["date", "rating"]).optional().default("date"),
  limit: z.number().int().positive().max(500).optional().default(50),
});

// POST /mcp/get-shows-by-year
export const action = protectedAction(async ({ request }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    return mcpError("Method not allowed", undefined, 405);
  }

  try {
    const parsed = await parseRequestBody(request, requestSchema);
    if (!parsed.success) {
      return parsed.response;
    }

    const { year, sortBy, limit } = parsed.data;

    // Get shows for this year
    const shows = await services.shows.findMany({
      filters: [
        { field: "date", operator: "gte", value: `${year}-01-01` },
        { field: "date", operator: "lt", value: `${year + 1}-01-01` },
      ],
      sort: sortBy === "rating"
        ? [{ field: "averageRating", direction: "desc" }]
        : [{ field: "date", direction: "asc" }],
      pagination: { page: 1, limit },
      includes: ["venue"],
    });

    // Format response
    const response = {
      year,
      shows: shows.map((show) => ({
        id: show.id,
        slug: show.slug,
        date: show.date,
        venueName: show.venue?.name || "",
        venueCity: show.venue?.city || "",
        averageRating: show.averageRating || null,
      })),
    };

    return mcpSuccess(response);
  } catch (error) {
    console.error("MCP get-shows-by-year error:", error);
    return mcpError(
      "Failed to fetch shows by year",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});
