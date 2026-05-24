import { adminAction, publicLoader } from "~/lib/base-loaders";
import { badRequest, methodNotAllowed } from "~/lib/errors";
import { logger } from "~/lib/logger";
import { services } from "~/server/services";

// Accept a raw 11-char YouTube video ID, a full youtube.com/watch?v=…
// URL, or a youtu.be/… short link. Returns null when no id can be extracted.
function extractVideoId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) return trimmed;
  try {
    const url = new URL(trimmed);
    if (url.hostname.endsWith("youtu.be")) {
      const id = url.pathname.replace(/^\//, "");
      return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
    }
    if (url.hostname.endsWith("youtube.com") || url.hostname.endsWith("youtube-nocookie.com")) {
      const v = url.searchParams.get("v");
      if (v && /^[A-Za-z0-9_-]{11}$/.test(v)) return v;
      const embedMatch = url.pathname.match(/^\/embed\/([A-Za-z0-9_-]{11})/);
      if (embedMatch) return embedMatch[1];
    }
  } catch {
    return null;
  }
  return null;
}

// GET /api/show-youtubes?showId=xxx — list curated videos for a show
export const loader = publicLoader(async ({ request }) => {
  const url = new URL(request.url);
  const showId = url.searchParams.get("showId");
  if (!showId) return badRequest();
  const entries = await services.youtube.listEntriesForShow(showId);
  return entries;
});

export const action = adminAction(async ({ request }) => {
  if (request.method === "POST") {
    const { showId, input } = (await request.json()) as { showId?: string; input?: string };
    if (!showId || !input) return badRequest();
    const videoId = extractVideoId(input);
    if (!videoId) {
      return new Response(JSON.stringify({ error: "Could not extract a YouTube video id from that input." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    try {
      const entry = await services.youtube.createForShow(showId, videoId);
      return entry;
    } catch (error) {
      logger.error("Failed to add show youtube", { error });
      return new Response(JSON.stringify({ error: "Failed to add video." }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  if (request.method === "DELETE") {
    const { id } = (await request.json()) as { id?: string };
    if (!id) return badRequest();
    try {
      await services.youtube.deleteEntry(id);
      return { success: true };
    } catch (error) {
      logger.error("Failed to delete show youtube", { error });
      return new Response(JSON.stringify({ error: "Failed to delete video." }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return methodNotAllowed();
});
