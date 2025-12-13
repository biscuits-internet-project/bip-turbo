import type { ActionFunctionArgs} from "react-router";
import { z } from "zod";
import { mcpError, mcpSuccess, parseRequestBody } from "~/lib/mcp-utils";
import { protectedAction } from "~/lib/base-loaders";
import { services } from "~/server/services";

const requestSchema = z.object({
  venueSlug: z.string().min(1, "venueSlug is required"),
  limit: z.number().int().positive().max(500).optional().default(50),
  sortBy: z.enum(["date", "rating"]).optional().default("date"),
});

// POST /mcp/get-venue-history
export const action = protectedAction(async ({ request }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    return mcpError("Method not allowed", undefined, 405);
  }

  try {
    const parsed = await parseRequestBody(request, requestSchema);
    if (!parsed.success) {
      return parsed.response;
    }

    const { venueSlug, limit, sortBy } = parsed.data;

    // Get venue
    const venue = await services.venues.findBySlug(venueSlug);
    if (!venue) {
      return mcpError("Venue not found", undefined, 404);
    }

    // Get shows at this venue
    const shows = await services.shows.findMany({
      filters: [{ field: "venueId", operator: "eq", value: venue.id }],
      sort: sortBy === "rating"
        ? [{ field: "averageRating", direction: "desc" }]
        : [{ field: "date", direction: "desc" }],
      pagination: { page: 1, limit },
    });

    // Format response
    const response = {
      venue: {
        id: venue.id,
        slug: venue.slug,
        name: venue.name,
        city: venue.city,
        state: venue.state || null,
      },
      shows: shows.map((show) => ({
        id: show.id,
        slug: show.slug,
        date: show.date,
        averageRating: show.averageRating || null,
        ratingsCount: show.ratingsCount,
      })),
    };

    return mcpSuccess(response);
  } catch (error) {
    console.error("MCP get-venue-history error:", error);
    return mcpError(
      "Failed to fetch venue history",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});
