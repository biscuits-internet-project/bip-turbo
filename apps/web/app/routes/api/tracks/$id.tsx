import { adminAction } from "~/lib/base-loaders";
import { services } from "~/server/services";

// PUT /api/tracks/:id - Update a track
// DELETE /api/tracks/:id - Delete a track
export const action = adminAction(async ({ request, params }) => {
  const method = request.method;
  const { id } = params;

  if (!id) {
    throw new Response("Track ID is required", { status: 400 });
  }

  if (method === "PUT") {
    const data = await request.json();
    console.log(`Updating track ${id}:`, data);

    try {
      const track = await services.tracks.update(id, {
        songId: data.songId,
        set: data.set,
        position: data.position,
        segue: data.segue,
        note: data.note,
      });
      
      console.log(`Updated track ${id}`);
      return track;
    } catch (error) {
      console.error(`Error updating track ${id}:`, error);
      throw new Response("Failed to update track", { status: 500 });
    }
  }

  if (method === "DELETE") {
    console.log(`Deleting track ${id}`);

    try {
      await services.tracks.delete(id);
      console.log(`Deleted track ${id}`);
      return { success: true };
    } catch (error) {
      console.error(`Error deleting track ${id}:`, error);
      throw new Response("Failed to delete track", { status: 500 });
    }
  }

  throw new Response("Method not allowed", { status: 405 });
});