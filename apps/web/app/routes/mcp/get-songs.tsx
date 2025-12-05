import type { ActionFunctionArgs } from "react-router";
import { z } from "zod";
import { formatDate, mcpError, mcpSuccess, parseRequestBody } from "~/lib/mcp-utils";
import { publicLoader } from "~/lib/base-loaders";
import { services } from "~/server/services";

const requestSchema = z.object({
  ids: z.array(z.string().uuid()).optional(),
  slugs: z.array(z.string()).optional(),
}).refine(
  (data) => data.ids || data.slugs,
  "Must provide either ids or slugs"
);

// POST /mcp/get-songs
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

    // Fetch songs
    let songs: Awaited<ReturnType<typeof services.songs.findById>>[] = [];
    const errors: Array<{ id: string; error: string }> = [];

    if (ids) {
      for (const id of ids) {
        try {
          const song = await services.songs.findById(id);
          if (song) {
            songs.push(song);
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
          const song = await services.songs.findBySlug(slug);
          if (song) {
            songs.push(song);
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
      songs: songs.filter(Boolean).map((song) => ({
        id: song.id,
        slug: song.slug,
        title: song.title,
        lyrics: song.lyrics || null,
        tabs: song.tabs || null,
        notes: song.notes || null,
        history: song.history || null,
        featuredLyric: song.featuredLyric || null,
        cover: song.cover,
        authorName: song.authorName || null,
        guitarTabsUrl: song.guitarTabsUrl || null,
        timesPlayed: song.timesPlayed,
        dateFirstPlayed: formatDate(song.dateFirstPlayed),
        dateLastPlayed: formatDate(song.dateLastPlayed),
        mostCommonYear: song.mostCommonYear || null,
        leastCommonYear: song.leastCommonYear || null,
      })),
      ...(errors.length > 0 && { errors }),
    };

    return mcpSuccess(response);
  } catch (error) {
    console.error("MCP get-songs error:", error);
    return mcpError(
      "Failed to fetch songs",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});
