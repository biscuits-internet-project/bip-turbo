import { adminAction } from "~/lib/base-loaders";
import { logger } from "~/lib/logger";
import { services } from "~/server/services";

interface LineupEntryInput {
  musicianId: string;
  instrumentIds?: string[];
}

function parseEntries(raw: unknown): LineupEntryInput[] {
  if (!Array.isArray(raw)) {
    throw new Response("entries must be an array", { status: 400 });
  }
  return raw.map((entry) => {
    if (typeof entry !== "object" || entry === null) {
      throw new Response("each entry must be an object", { status: 400 });
    }
    const { musicianId, instrumentIds } = entry as Record<string, unknown>;
    if (typeof musicianId !== "string" || !musicianId) {
      throw new Response("each entry needs a string musicianId", { status: 400 });
    }
    if (instrumentIds !== undefined) {
      if (!Array.isArray(instrumentIds) || !instrumentIds.every((id) => typeof id === "string")) {
        throw new Response("instrumentIds must be an array of strings", { status: 400 });
      }
      return { musicianId, instrumentIds: instrumentIds as string[] };
    }
    return { musicianId };
  });
}

// POST /api/shows/:showId/lineup - Full-set replace of a show's musician lineup.
export const action = adminAction(async ({ request, params }) => {
  if (request.method !== "POST") {
    throw new Response("Method not allowed", { status: 405 });
  }

  const showId = params.showId as string;
  const { entries } = (await request.json()) as { entries?: unknown };
  const parsed = parseEntries(entries);

  try {
    await services.shows.setLineup(showId, parsed);
    logger.info("Set show lineup", { showId, count: parsed.length });
    // Return the resolved lineup (with names) so the widget can re-render its
    // read-only view without a second round trip.
    const lineup = await services.shows.getLineup(showId);
    return { ok: true, lineup };
  } catch (error) {
    logger.error("Error setting show lineup", { error });
    throw new Response(error instanceof Error ? error.message : "Failed to set lineup", { status: 400 });
  }
});
