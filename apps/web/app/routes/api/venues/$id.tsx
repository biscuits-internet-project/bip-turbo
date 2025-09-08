import { publicLoader } from "~/lib/base-loaders";
import { services } from "~/server/services";

// GET /api/venues/:id - Get a single venue by ID
export const loader = publicLoader(async ({ params }) => {
  const { id } = params;

  if (!id) {
    throw new Response("Venue ID is required", { status: 400 });
  }

  try {
    const venue = await services.venues.findById(id);

    if (!venue) {
      throw new Response("Venue not found", { status: 404 });
    }

    return new Response(JSON.stringify(venue), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(`Error loading venue ${id}:`, error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
