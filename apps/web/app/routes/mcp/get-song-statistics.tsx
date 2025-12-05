import type { ActionFunctionArgs } from "react-router";
import { z } from "zod";
import { formatDate, mcpError, mcpSuccess, parseRequestBody } from "~/lib/mcp-utils";
import { publicLoader } from "~/lib/base-loaders";
import { services } from "~/server/services";

const requestSchema = z.object({
  songSlug: z.string().min(1, "songSlug is required"),
});

// POST /mcp/get-song-statistics
export const action = publicLoader(async ({ request }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    return mcpError("Method not allowed", undefined, 405);
  }

  try {
    const parsed = await parseRequestBody(request, requestSchema);
    if (!parsed.success) {
      return parsed.response;
    }

    const { songSlug } = parsed.data;

    // Get song
    const song = await services.songs.findBySlug(songSlug);
    if (!song) {
      return mcpError("Song not found", undefined, 404);
    }

    // Format response
    const response = {
      song: {
        id: song.id,
        slug: song.slug,
        title: song.title,
      },
      statistics: {
        timesPlayed: song.timesPlayed,
        dateFirstPlayed: formatDate(song.dateFirstPlayed),
        dateLastPlayed: formatDate(song.dateLastPlayed),
        yearlyPlayData: song.yearlyPlayData || {},
        longestGapsData: song.longestGapsData || {},
        mostCommonYear: song.mostCommonYear || null,
        leastCommonYear: song.leastCommonYear || null,
      },
    };

    return mcpSuccess(response);
  } catch (error) {
    console.error("MCP get-song-statistics error:", error);
    return mcpError(
      "Failed to fetch song statistics",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});
