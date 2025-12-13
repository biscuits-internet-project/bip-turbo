import type { ActionFunctionArgs } from "react-router";
import { z } from "zod";
import { mcpError, mcpSuccess, parseRequestBody } from "~/lib/mcp-utils";
import { protectedAction } from "~/lib/base-loaders";
import { services } from "~/server/services";

const requestSchema = z.object({
  songSlug: z.string().min(1, "songSlug is required"),
  limit: z.number().int().positive().max(500).optional().default(50),
  sortBy: z.enum(["date", "rating"]).optional().default("date"),
});

// POST /mcp/get-song-performances
export const action = protectedAction(async ({ request }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    return mcpError("Method not allowed", undefined, 405);
  }

  try {
    const parsed = await parseRequestBody(request, requestSchema);
    if (!parsed.success) {
      return parsed.response;
    }

    const { songSlug, limit, sortBy } = parsed.data;

    // Get song
    const song = await services.songs.findBySlug(songSlug);
    if (!song) {
      return mcpError("Song not found", undefined, 404);
    }

    // Get all tracks for this song
    const tracks = await services.tracks.findMany({
      filters: [{ field: "songId", operator: "eq", value: song.id }],
      sort: sortBy === "rating"
        ? [{ field: "averageRating", direction: "desc" }]
        : [{ field: "createdAt", direction: "desc" }],
      pagination: { page: 1, limit },
      includes: ["annotations"],
    });

    // Fetch show and venue data for each track
    const showIds = [...new Set(tracks.map((t) => t.showId))];
    const showsData = await Promise.all(
      showIds.map(async (showId) => {
        const show = await services.shows.findById(showId);
        if (!show) return null;
        const venue = show.venueId ? await services.venues.findById(show.venueId) : null;
        return { showId, show, venue };
      })
    );
    const showMap = new Map(
      showsData
        .filter((d): d is NonNullable<typeof d> => d !== null)
        .map((d) => [d.showId, d])
    );

    // Format response
    const response = {
      song: {
        id: song.id,
        slug: song.slug,
        title: song.title,
      },
      performances: tracks.map((track) => {
        const showData = showMap.get(track.showId);
        return {
          trackId: track.id,
          showId: track.showId,
          showSlug: showData?.show.slug || "",
          showDate: showData?.show.date || "",
          venueSlug: showData?.venue?.slug || "",
          venueName: showData?.venue?.name || "",
          venueCity: showData?.venue?.city || "",
          set: track.set,
          position: track.position,
          averageRating: track.averageRating || null,
          ratingsCount: track.ratingsCount,
          allTimer: track.allTimer || false,
          note: track.note || null,
          annotations: track.annotations?.map((ann) => ({ desc: ann.desc })) || [],
        };
      }),
    };

    return mcpSuccess(response);
  } catch (error) {
    console.error("MCP get-song-performances error:", error);
    return mcpError(
      "Failed to fetch song performances",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});
