import { trackUpdateSchema } from "@bip/domain";
import { protectedAction, publicLoader } from "~/lib/base-loaders";
import { badRequest, methodNotAllowed } from "~/lib/errors";
import { services } from "~/server/services";

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

  // Get the fresh average rating and count (already on track from DB)
  const averageRating = track.averageRating || 0;
  const ratingsCount = track.ratingsCount || 0;

  return {
    track: {
      id: track.id,
      songTitle: track.song?.title || "",
      averageRating,
      ratingsCount,
      likesCount: track.likesCount || 0,
      note: track.note,
    },
    userRating: userRating?.value || null,
  };
});

export const action = protectedAction(async ({ request, params }) => {
  const { trackId } = params;

  if (!trackId) return badRequest();

  if (request.method === "PUT") {
    try {
      const body = await request.json();

      // Parse and validate only allowed update fields
      const { annotationDesc, ...updateData } = trackUpdateSchema.parse(body);

      // Update track with the validated data
      await services.tracks.update(trackId, updateData);

      // Handle multiple annotations if provided
      if (annotationDesc !== undefined) {
        await services.annotations.upsertMultipleForTrack(trackId, annotationDesc);
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
      console.error("Error updating track:", error);
      return new Response(JSON.stringify({ error: "Failed to update track" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  if (request.method === "DELETE") {
    try {
      // Delete all related data first
      await services.annotations.deleteByTrackId(trackId);
      await services.ratings.deleteByRateableId(trackId, "Track");

      await services.tracks.delete(trackId);
      return { success: true };
    } catch (error) {
      console.error("Error deleting track:", error);
      return new Response(JSON.stringify({ error: "Failed to delete track" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return methodNotAllowed();
});
