import { type TrackFlag, trackFlagSchema } from "@bip/domain";
import { adminAction } from "~/lib/base-loaders";
import { logger } from "~/lib/logger";
import { services } from "~/server/services";

function parseFlags(raw: unknown): TrackFlag[] {
  if (!Array.isArray(raw)) {
    throw new Response("flags must be an array", { status: 400 });
  }
  const flags: TrackFlag[] = [];
  for (const flag of raw) {
    const parsed = trackFlagSchema.safeParse(flag);
    if (!parsed.success) {
      throw new Response(`invalid track flag: ${String(flag)}`, { status: 400 });
    }
    flags.push(parsed.data);
  }
  return flags;
}

// PUT /api/tracks/:trackId/flags - Full-set replace of a track's structured
// flags. Recomputes the song's recurrence so the "1st/last time" footnotes stay
// accurate, and returns the resolved flag footnote slice for live refresh.
export const action = adminAction(async ({ request, params }) => {
  if (request.method !== "PUT") {
    throw new Response("Method not allowed", { status: 405 });
  }

  const trackId = params.trackId as string;
  const { flags } = (await request.json()) as { flags?: unknown };
  const parsed = parseFlags(flags);

  try {
    await services.tracks.setTrackFlags(trackId, parsed);
    logger.info("Set track flags", { trackId, count: parsed.length });
    const data = await services.tracks.getTrackFlagData(trackId);
    return { ok: true, ...data };
  } catch (error) {
    logger.error("Error setting track flags", { error });
    throw new Response(error instanceof Error ? error.message : "Failed to set flags", { status: 400 });
  }
});
