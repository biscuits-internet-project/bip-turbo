import { publicLoader } from "~/lib/base-loaders";
import { services } from "~/server/services";

export const loader = publicLoader(async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("q");

  if (!query || query.length < 2) {
    return [];
  }

  console.log(`Song search for '${query}'`);

  try {
    // Search songs by title
    const songs = await services.songs.search(query, 20);

    console.log(`Song search for '${query}' returned ${songs.length} results`);
    return songs;
  } catch (error) {
    console.error("Song search error:", error);
    return [];
  }
});