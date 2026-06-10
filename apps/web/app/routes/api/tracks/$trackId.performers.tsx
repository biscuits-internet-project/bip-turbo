import { adminAction } from "~/lib/base-loaders";
import { logger } from "~/lib/logger";
import { services } from "~/server/services";

interface TrackMusicianDeltaInput {
  musicianId: string;
  present: boolean;
  instrumentIds?: string[];
}

function parseDeltas(raw: unknown): TrackMusicianDeltaInput[] {
  if (!Array.isArray(raw)) {
    throw new Response("deltas must be an array", { status: 400 });
  }
  return raw.map((delta) => {
    if (typeof delta !== "object" || delta === null) {
      throw new Response("each delta must be an object", { status: 400 });
    }
    const { musicianId, present, instrumentIds } = delta as Record<string, unknown>;
    if (typeof musicianId !== "string" || !musicianId) {
      throw new Response("each delta needs a string musicianId", { status: 400 });
    }
    if (typeof present !== "boolean") {
      throw new Response("each delta needs a boolean present", { status: 400 });
    }
    if (instrumentIds !== undefined) {
      if (!Array.isArray(instrumentIds) || !instrumentIds.every((id) => typeof id === "string")) {
        throw new Response("instrumentIds must be an array of strings", { status: 400 });
      }
      return { musicianId, present, instrumentIds: instrumentIds as string[] };
    }
    return { musicianId, present };
  });
}

// PUT /api/tracks/:trackId/performers - Full-set replace of a track's per-track
// performer deltas (sit-ins / sat-outs).
export const action = adminAction(async ({ request, params }) => {
  if (request.method !== "PUT") {
    throw new Response("Method not allowed", { status: 405 });
  }

  const trackId = params.trackId as string;
  const { deltas } = (await request.json()) as { deltas?: unknown };
  const parsed = parseDeltas(deltas);

  try {
    await services.tracks.setTrackMusicianDeltas(trackId, parsed);
    logger.info("Set track performer deltas", { trackId, count: parsed.length });
    // Return the resolved deltas (with names) so the edit page can re-derive its
    // read-only footnotes without a reload.
    const deltas = await services.tracks.getTrackMusicianDeltas(trackId);
    return { ok: true, deltas };
  } catch (error) {
    logger.error("Error setting track performer deltas", { error });
    throw new Response(error instanceof Error ? error.message : "Failed to set performers", { status: 400 });
  }
});
