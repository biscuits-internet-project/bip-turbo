import type { ShowExternalSources } from "~/components/setlist/show-external-badges";
import { services } from "~/server/services";

/**
 * Minimal show shape accepted by {@link computeShowExternalSources}. Defined
 * loosely so every kind of setlist/show fixture (Setlist, SetlistLight, etc.)
 * can satisfy it without coercion.
 */
interface ShowLike {
  id: string;
  date: string;
}

/**
 * Resolve external-source URLs for a batch of shows in a single pass. Used by
 * every route that renders a SetlistCard list so each row's badge strip gets
 * real link targets via one Redis read per catalog plus one DB query for
 * YouTube — independent of list length. Returning a plain object (not a Map)
 * keeps React Router's JSON serialization happy.
 *
 * @param shows Shows the caller plans to render. Empty input short-circuits
 *   both the Redis and DB calls so loaders can pass whatever they have.
 */
export async function computeShowExternalSources(shows: ShowLike[]): Promise<Record<string, ShowExternalSources>> {
  const result: Record<string, ShowExternalSources> = {};
  if (shows.length === 0) return result;

  const showIds = shows.map((s) => s.id);
  const [nugsUrlsByDate, archiveUrlsByDate, youtubeUrlsByShowId] = await Promise.all([
    services.nugs.getReleaseUrlsByDate(),
    services.archiveDotOrg.getPrimaryUrlsByDate(),
    services.youtube.getFirstVideoUrlByShowIds(showIds),
  ]);

  for (const show of shows) {
    result[show.id] = {
      nugsUrl: nugsUrlsByDate[show.date],
      archiveUrl: archiveUrlsByDate[show.date],
      youtubeUrl: youtubeUrlsByShowId[show.id],
    };
  }
  return result;
}
