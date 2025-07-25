import { adminAction, publicLoader } from "~/lib/base-loaders";
import { services } from "~/server/services";

// GET /api/tracks?showId=xxx - Get tracks for a show
export const loader = publicLoader(async ({ request }) => {
  const url = new URL(request.url);
  const showId = url.searchParams.get("showId");

  if (!showId) {
    throw new Response("showId is required", { status: 400 });
  }

  console.log(`Loading tracks for show ${showId}`);

  try {
    const tracks = await services.tracks.findByShowId(showId);
    console.log(`Found ${tracks.length} tracks for show ${showId}`);
    return tracks;
  } catch (error) {
    console.error("Error loading tracks:", error);
    throw new Response("Failed to load tracks", { status: 500 });
  }
});

// POST /api/tracks - Create a new track
export const action = adminAction(async ({ request }) => {
  const method = request.method;

  if (method === "POST") {
    const data = await request.json();
    console.log("Creating track:", data);

    try {
      const track = await services.tracks.create({
        showId: data.showId,
        songId: data.songId,
        set: data.set,
        position: data.position,
        segue: data.segue,
        note: data.note,
      });
      
      console.log("Created track:", track.id);
      return track;
    } catch (error) {
      console.error("Error creating track:", error);
      throw new Response("Failed to create track", { status: 500 });
    }
  }

  throw new Response("Method not allowed", { status: 405 });
});