import { adminAction, publicLoader } from "~/lib/base-loaders";
import { logger } from "~/lib/logger";
import { services } from "~/server/services";

// GET /api/tracks?showId=xxx - Get tracks for a show
export const loader = publicLoader(async ({ request }) => {
  const url = new URL(request.url);
  const showId = url.searchParams.get("showId");

  if (!showId) {
    throw new Response("showId is required", { status: 400 });
  }

  logger.info(`Loading tracks for show ${showId}`);

  try {
    const tracks = await services.tracks.findByShowId(showId);
    logger.info(`Found ${tracks.length} tracks for show ${showId}`);
    return tracks;
  } catch (error) {
    logger.error("Error loading tracks", { error });
    throw new Response("Failed to load tracks", { status: 500 });
  }
});

// POST /api/tracks - Create a new track
export const action = adminAction(async ({ request }) => {
  const method = request.method;

  if (method === "POST") {
    const data = await request.json();
    logger.info("Creating track", { data });

    try {
      const track = await services.tracks.create({
        showId: data.showId,
        songId: data.songId,
        set: data.set,
        position: data.position,
        segue: data.segue,
        note: data.note,
      });

      // Create annotations if provided
      if (data.annotationDesc && track.id) {
        await services.annotations.upsertMultipleForTrack(track.id, data.annotationDesc);
      }

      // Fetch the track with annotations
      const trackWithAnnotations = await services.tracks.findById(track.id);

      logger.info("Created track", { trackId: track.id });
      return trackWithAnnotations;
    } catch (error) {
      logger.error("Error creating track", { error });
      throw new Response("Failed to create track", { status: 500 });
    }
  }

  throw new Response("Method not allowed", { status: 405 });
});
