import type { ActionFunctionArgs } from "react-router";
import { z } from "zod";
import { mcpError, mcpSuccess, parseRequestBody } from "~/lib/mcp-utils";
import { publicLoader } from "~/lib/base-loaders";
import { services } from "~/server/services";

const requestSchema = z.object({
  showIds: z.array(z.string().uuid()).optional(),
  showSlugs: z.array(z.string()).optional(),
}).refine(
  (data) => data.showIds || data.showSlugs,
  "Must provide either showIds or showSlugs"
);

// POST /mcp/get-setlists
export const action = publicLoader(async ({ request }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    return mcpError("Method not allowed", undefined, 405);
  }

  try {
    const parsed = await parseRequestBody(request, requestSchema);
    if (!parsed.success) {
      return parsed.response;
    }

    const { showIds, showSlugs } = parsed.data;

    // Fetch setlists
    let setlists: Awaited<ReturnType<typeof services.setlists.findByShowSlug>>[] = [];
    const errors: Array<{ id: string; error: string }> = [];

    if (showIds) {
      // Need to get show slugs first since the service uses slugs
      const shows = await Promise.all(
        showIds.map(async (id) => {
          try {
            return await services.shows.findById(id);
          } catch (error) {
            errors.push({ id, error: error instanceof Error ? error.message : "Unknown error" });
            return null;
          }
        })
      );

      // Fetch setlists by slug
      for (const show of shows) {
        if (show) {
          try {
            const setlist = await services.setlists.findByShowSlug(show.slug);
            if (setlist) {
              setlists.push(setlist);
            } else {
              errors.push({ id: show.id, error: "Setlist not found" });
            }
          } catch (error) {
            errors.push({ id: show.id, error: error instanceof Error ? error.message : "Unknown error" });
          }
        }
      }
    }

    if (showSlugs) {
      for (const slug of showSlugs) {
        try {
          const setlist = await services.setlists.findByShowSlug(slug);
          if (setlist) {
            setlists.push(setlist);
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
      setlists: setlists.filter(Boolean).map((setlist) => ({
        showId: setlist.show.id,
        showSlug: setlist.show.slug,
        showDate: setlist.show.date,
        venue: {
          name: setlist.venue.name,
          city: setlist.venue.city,
          state: setlist.venue.state || null,
          slug: setlist.venue.slug,
        },
        sets: setlist.sets.map((set) => ({
          label: set.label,
          tracks: set.tracks.map((track) => ({
            position: track.position,
            songId: track.songId,
            songTitle: track.song?.title || "",
            songSlug: track.song?.slug || "",
            segue: track.segue || null,
            note: track.note || null,
            allTimer: track.allTimer || false,
            annotations: track.annotations?.map((ann) => ({ desc: ann.desc })) || [],
          })),
        })),
      })),
      ...(errors.length > 0 && { errors }),
    };

    return mcpSuccess(response);
  } catch (error) {
    console.error("MCP get-setlists error:", error);
    return mcpError(
      "Failed to fetch setlists",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});
