import { trackUpdateSchema } from "@bip/domain";
import { protectedAction, publicLoader } from "~/lib/base-loaders";
import { badRequest, methodNotAllowed } from "~/lib/errors";
import { logger } from "~/lib/logger";
import { services } from "~/server/services";
import { resolveViewerRatingMode } from "~/server/viewer-rating";

export const loader = publicLoader(async ({ params, context }) => {
  const { currentUser } = context;
  const { trackId } = params;

  if (!trackId) return badRequest();

  // Get fresh track data with rating stats
  const track = await services.tracks.findById(trackId);

  if (!track) {
    return new Response(JSON.stringify({ error: "Track not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Get user's rating if logged in
  let userRating = null;
  if (currentUser) {
    const localUser = await services.users.findByEmail(currentUser.email);
    if (localUser) {
      userRating = await services.ratings.getByRateableIdAndUserId(trackId, "Track", localUser.id);
    }
  }

  // Headline rating + count AND the histogram both track the viewer's rating mode: a
  // calibrated viewer sees the Calibrated Track Rating and the fluffer-dropped
  // contributing distribution (so the overlay matches the setlist's inline cell);
  // everyone else sees the plain community average + deduped distribution. Computed
  // here (not denormalized) so it loads only when a track's overlay opens.
  let averageRating = track.averageRating || 0;
  let ratingsCount = track.ratingsCount || 0;
  const { trackMode } = await resolveViewerRatingMode(context);
  const calibrated = trackMode === "calibrated";
  if (calibrated) {
    const score = (await services.raterWeights.getCalibratedForTracks([trackId]))[trackId];
    if (score) {
      averageRating = score.rating;
      ratingsCount = score.count;
    }
  }

  const distribution = calibrated
    ? await services.raterWeights.getCalibratedTrackDistribution(trackId)
    : await services.ratings.getRatingDistribution(trackId, "Track");

  return new Response(
    JSON.stringify({
      track: {
        id: track.id,
        songTitle: track.song?.title || "",
        averageRating,
        ratingsCount,
        likesCount: track.likesCount || 0,
        note: track.note,
      },
      userRating: userRating?.value || null,
      distribution,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
});

export const action = protectedAction(async ({ request, params }) => {
  const { trackId } = params;

  if (!trackId) return badRequest();

  if (request.method === "PUT") {
    try {
      const body = await request.json();

      // Parse and validate only allowed update fields
      const { annotationDesc, ...updateData } = trackUpdateSchema.parse(body);

      // Get the current track to check if songId is changing
      const currentTrack = await services.tracks.findById(trackId);
      const oldSongId = currentTrack?.songId;
      const newSongId = updateData.songId;

      // Update track with the validated data
      await services.tracks.update(trackId, updateData);

      // Handle multiple annotations if provided
      if (annotationDesc !== undefined) {
        await services.annotations.upsertMultipleForTrack(trackId, annotationDesc);
      }

      // Update song statistics if songId changed
      if (oldSongId && newSongId && oldSongId !== newSongId) {
        // Update stats for both old and new song
        await Promise.all([
          services.songs.updateSongStatistics(oldSongId),
          services.songs.updateSongStatistics(newSongId),
        ]);
      } else if (newSongId) {
        // Just update the current song's stats
        await services.songs.updateSongStatistics(newSongId);
      }

      // Fetch the complete track with song relation
      const completeTrack = await services.tracks.findById(trackId);

      if (!completeTrack) {
        return new Response(JSON.stringify({ error: "Track not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      return completeTrack;
    } catch (error) {
      logger.error("Error updating track", { error });
      return new Response(JSON.stringify({ error: "Failed to update track" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  if (request.method === "DELETE") {
    try {
      // Get the track before deletion to retrieve songId for statistics update
      const track = await services.tracks.findById(trackId);
      const songId = track?.songId;

      // Delete all related data first
      await services.annotations.deleteByTrackId(trackId);
      await services.ratings.deleteByRateableId(trackId, "Track");

      await services.tracks.delete(trackId);

      // Update song statistics after deleting a track
      if (songId) {
        await services.songs.updateSongStatistics(songId);
      }

      return { success: true };
    } catch (error) {
      logger.error("Error deleting track", { error });
      return new Response(JSON.stringify({ error: "Failed to delete track" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return methodNotAllowed();
});
