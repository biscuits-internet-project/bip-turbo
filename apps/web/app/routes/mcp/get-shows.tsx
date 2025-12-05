import type { ActionFunctionArgs } from "react-router";
import { z } from "zod";
import { formatVenueLocation, mcpError, mcpSuccess, parseRequestBody } from "~/lib/mcp-utils";
import { publicLoader } from "~/lib/base-loaders";
import { services } from "~/server/services";

const requestSchema = z.object({
  ids: z.array(z.string().uuid()).optional(),
  slugs: z.array(z.string()).optional(),
}).refine(
  (data) => data.ids || data.slugs,
  "Must provide either ids or slugs"
);

// POST /mcp/get-shows
export const action = publicLoader(async ({ request }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    return mcpError("Method not allowed", undefined, 405);
  }

  try {
    const parsed = await parseRequestBody(request, requestSchema);
    if (!parsed.success) {
      return parsed.response;
    }

    const { ids, slugs } = parsed.data;

    // Fetch shows - need to handle both ids and slugs
    let shows: Awaited<ReturnType<typeof services.shows.findMany>> = [];
    const errors: Array<{ id: string; error: string }> = [];

    if (ids) {
      // Fetch by IDs
      for (const id of ids) {
        try {
          const show = await services.shows.findById(id);
          if (show) {
            shows.push(show);
          } else {
            errors.push({ id, error: "Not found" });
          }
        } catch (error) {
          errors.push({ id, error: error instanceof Error ? error.message : "Unknown error" });
        }
      }
    }

    if (slugs) {
      // Fetch by slugs
      for (const slug of slugs) {
        try {
          const show = await services.shows.findBySlug(slug);
          if (show) {
            shows.push(show);
          } else {
            errors.push({ id: slug, error: "Not found" });
          }
        } catch (error) {
          errors.push({ id: slug, error: error instanceof Error ? error.message : "Unknown error" });
        }
      }
    }

    // Get venue information for each show
    const venueIds = shows.map(s => s.venueId).filter(Boolean) as string[];
    const venues = venueIds.length > 0
      ? await services.venues.findMany({
          filters: [{ field: "id", operator: "in", value: venueIds }]
        })
      : [];

    const venueMap = new Map(venues.map(v => [v.id, v]));

    // Format response
    const response = {
      shows: shows.map((show) => {
        const venue = show.venueId ? venueMap.get(show.venueId) : null;
        return {
          id: show.id,
          slug: show.slug,
          date: show.date,
          venueId: show.venueId || null,
          venueName: venue?.name || null,
          venueSlug: venue?.slug || null,
          venueCity: venue?.city || null,
          venueState: venue?.state || null,
          bandId: show.bandId || null,
          notes: show.notes || null,
          relistenUrl: show.relistenUrl || null,
          averageRating: show.averageRating || null,
          ratingsCount: show.ratingsCount,
          likesCount: show.likesCount,
          reviewsCount: show.reviewsCount,
          showPhotosCount: show.showPhotosCount,
          showYoutubesCount: show.showYoutubesCount,
        };
      }),
      ...(errors.length > 0 && { errors }),
    };

    return mcpSuccess(response);
  } catch (error) {
    console.error("MCP get-shows error:", error);
    return mcpError(
      "Failed to fetch shows",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});
