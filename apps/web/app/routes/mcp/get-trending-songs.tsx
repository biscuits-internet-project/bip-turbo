import type { ActionFunctionArgs } from "react-router";
import { z } from "zod";
import { formatDate, mcpError, mcpSuccess, parseRequestBody } from "~/lib/mcp-utils";
import { publicLoader } from "~/lib/base-loaders";
import { services } from "~/server/services";

const requestSchema = z.object({
  lastXShows: z.number().int().positive().max(200).optional().default(50),
  limit: z.number().int().positive().max(100).optional().default(50),
});

// POST /mcp/get-trending-songs
export const action = publicLoader(async ({ request }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    return mcpError("Method not allowed", undefined, 405);
  }

  try {
    const parsed = await parseRequestBody(request, requestSchema);
    if (!parsed.success) {
      return parsed.response;
    }

    const { lastXShows, limit } = parsed.data;

    // Get trending songs
    const trendingSongs = await services.songs.findTrendingLastXShows(lastXShows, limit);

    // Format response
    const response = {
      songs: trendingSongs.map((song) => ({
        id: song.id,
        slug: song.slug,
        title: song.title,
        playCount: song.count,
        lastPlayed: formatDate(song.dateLastPlayed),
      })),
    };

    return mcpSuccess(response);
  } catch (error) {
    console.error("MCP get-trending-songs error:", error);
    return mcpError(
      "Failed to fetch trending songs",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});
