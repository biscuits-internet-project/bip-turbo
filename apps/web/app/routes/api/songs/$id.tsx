import { publicLoader } from "~/lib/base-loaders";
import { logger } from "~/lib/logger";
import { services } from "~/server/services";

export const loader = publicLoader(async ({ params }) => {
  const { id } = params;

  if (!id) {
    throw new Response("Song ID is required", { status: 400 });
  }

  try {
    const song = await services.songs.findById(id);

    if (!song) {
      throw new Response("Song not found", { status: 404 });
    }

    return song;
  } catch (error) {
    logger.error("Error fetching song", { error });
    throw new Response("Failed to fetch song", { status: 500 });
  }
});
