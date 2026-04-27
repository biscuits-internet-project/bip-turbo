import { publicLoader } from "~/lib/base-loaders";
import { logger } from "~/lib/logger";
import { fetchFilteredSongs } from "~/lib/song-utilities";
import { services } from "~/server/services";

const FILTER_PARAMS = ["timeRange", "year", "era", "played", "author", "cover", "attended", "filters"] as const;

function hasAnyFilterParam(url: URL): boolean {
  return FILTER_PARAMS.some((key) => url.searchParams.has(key));
}

export const loader = publicLoader(async ({ request, context }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("q");

  // The `q=` path is a name-search fallback used by the admin SongSearch
  // (track-manager). It bypasses the filter pipeline entirely — no cache,
  // no venue info, just a string match against song titles.
  if (!hasAnyFilterParam(url) && query && query.length >= 2) {
    logger.info(`Song search for '${query}'`);
    try {
      const songs = await services.songs.search(query, 20);
      logger.info(`Song search for '${query}' returned ${songs.length} results`);
      return songs;
    } catch (error) {
      logger.error("Song search error", { error });
      return [];
    }
  }

  try {
    return await fetchFilteredSongs(url, context);
  } catch (error) {
    logger.error("Error fetching filtered songs", { error });
    return [];
  }
});
