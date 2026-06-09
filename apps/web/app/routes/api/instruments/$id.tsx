import { publicLoader } from "~/lib/base-loaders";
import { logger } from "~/lib/logger";
import { services } from "~/server/services";

// GET /api/instruments/:id - Get a single instrument by ID
export const loader = publicLoader(async ({ params }) => {
  const { id } = params;

  if (!id) {
    throw new Response("Instrument ID is required", { status: 400 });
  }

  try {
    const instrument = await services.instruments.findById(id);

    if (!instrument) {
      throw new Response("Instrument not found", { status: 404 });
    }

    return new Response(JSON.stringify(instrument), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    logger.error(`Error loading instrument ${id}`, { error });
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
