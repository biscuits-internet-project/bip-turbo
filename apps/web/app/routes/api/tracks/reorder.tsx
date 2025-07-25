import { adminAction } from "~/lib/base-loaders";
import { services } from "~/server/services";

// PUT /api/tracks/reorder - Bulk update track positions
export const action = adminAction(async ({ request }) => {
  const method = request.method;

  if (method === "PUT") {
    const { updates } = await request.json();
    console.log("Reordering tracks:", updates);

    if (!Array.isArray(updates)) {
      throw new Response("Updates must be an array", { status: 400 });
    }

    try {
      // Update all tracks with new positions
      const updatedTracks = await Promise.all(
        updates.map(async (update: { id: string; position: number; set: string }) => {
          return services.tracks.update(update.id, {
            position: update.position,
            set: update.set,
          });
        })
      );
      
      console.log(`Updated ${updatedTracks.length} track positions`);
      return updatedTracks;
    } catch (error) {
      console.error("Error reordering tracks:", error);
      throw new Response("Failed to reorder tracks", { status: 500 });
    }
  }

  throw new Response("Method not allowed", { status: 405 });
});