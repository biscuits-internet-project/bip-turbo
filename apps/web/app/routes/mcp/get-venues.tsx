import type { ActionFunctionArgs } from "react-router";
import { z } from "zod";
import { mcpError, mcpSuccess, parseRequestBody } from "~/lib/mcp-utils";
import { protectedAction } from "~/lib/base-loaders";
import { services } from "~/server/services";

const requestSchema = z.object({
  ids: z.array(z.string().uuid()).optional(),
  slugs: z.array(z.string()).optional(),
}).refine(
  (data) => data.ids || data.slugs,
  "Must provide either ids or slugs"
);

// POST /mcp/get-venues
export const action = protectedAction(async ({ request }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    return mcpError("Method not allowed", undefined, 405);
  }

  try {
    const parsed = await parseRequestBody(request, requestSchema);
    if (!parsed.success) {
      return parsed.response;
    }

    const { ids, slugs } = parsed.data;

    // Fetch venues
    let venues: Awaited<ReturnType<typeof services.venues.findById>>[] = [];
    const errors: Array<{ id: string; error: string }> = [];

    if (ids) {
      for (const id of ids) {
        try {
          const venue = await services.venues.findById(id);
          if (venue) {
            venues.push(venue);
          } else {
            errors.push({ id, error: "Not found" });
          }
        } catch (error) {
          errors.push({ id, error: error instanceof Error ? error.message : "Unknown error" });
        }
      }
    }

    if (slugs) {
      for (const slug of slugs) {
        try {
          const venue = await services.venues.findBySlug(slug);
          if (venue) {
            venues.push(venue);
          } else {
            errors.push({ id: slug, error: "Not found" });
          }
        } catch (error) {
          errors.push({ id: slug, error: error instanceof Error ? error.message : "Unknown error" });
        }
      }
    }

    // Format response
    const response = {
      venues: venues.filter(Boolean).map((venue) => ({
        id: venue.id,
        slug: venue.slug,
        name: venue.name,
        city: venue.city,
        state: venue.state || null,
        country: venue.country,
        street: venue.street || null,
        postalCode: venue.postalCode || null,
        latitude: venue.latitude || null,
        longitude: venue.longitude || null,
        phone: venue.phone || null,
        website: venue.website || null,
        timesPlayed: venue.timesPlayed,
      })),
      ...(errors.length > 0 && { errors }),
    };

    return mcpSuccess(response);
  } catch (error) {
    console.error("MCP get-venues error:", error);
    return mcpError(
      "Failed to fetch venues",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});
