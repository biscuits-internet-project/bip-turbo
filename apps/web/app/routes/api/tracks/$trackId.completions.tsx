import { adminAction } from "~/lib/base-loaders";
import { logger } from "~/lib/logger";
import { services } from "~/server/services";

function parseEarlierTrackIds(raw: unknown): string[] {
  if (!Array.isArray(raw)) {
    throw new Response("earlierTrackIds must be an array", { status: 400 });
  }
  if (!raw.every((id) => typeof id === "string" && id)) {
    throw new Response("earlierTrackIds must be an array of non-empty strings", { status: 400 });
  }
  return raw as string[];
}

// PUT /api/tracks/:trackId/completions - Full-set replace of the earlier
// same-song versions this track completes. Returns the resolved "completes …"
// links for live footnote refresh.
export const action = adminAction(async ({ request, params }) => {
  if (request.method !== "PUT") {
    throw new Response("Method not allowed", { status: 405 });
  }

  const trackId = params.trackId as string;
  const { earlierTrackIds } = (await request.json()) as { earlierTrackIds?: unknown };
  const parsed = parseEarlierTrackIds(earlierTrackIds);

  try {
    await services.tracks.setTrackCompletions(trackId, parsed);
    logger.info("Set track completions", { trackId, count: parsed.length });
    const completes = await services.tracks.getTrackCompletes(trackId);
    return { ok: true, completes };
  } catch (error) {
    logger.error("Error setting track completions", { error });
    throw new Response(error instanceof Error ? error.message : "Failed to set completions", { status: 400 });
  }
});
