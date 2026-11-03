import { sanitizeFeedHtml } from "@bip/core";
import { logger } from "~/lib/logger";
import { services } from "~/server/services";

/**
 * Both feed reads run inside SSR loaders, so a hung acast connection would hold the page
 * until the proxy's 30s timeout. Five seconds, then the caller degrades to no episodes.
 */
const ACAST_TIMEOUT_MS = 5_000;

/** Touchdowns All Day feed on acast. */
const ACAST_SHOW_ID = "d690923d-524e-5c8b-b29f-d66517615b5b";
const acastFeedUrl = (limit: number) => `https://feeder.acast.com/api/v1/shows/${ACAST_SHOW_ID}?limit=${limit}&from=0`;
const ACAST_FEED_URL = acastFeedUrl(1);

/** How many episodes the Touchdowns resource page lists. */
export const PODCAST_EPISODE_LIST_LIMIT = 30;

const EPISODE_LIST_CACHE_KEY = `home:podcast-episodes:${PODCAST_EPISODE_LIST_LIMIT}:v1`;

// v2: descriptions are now sanitized at ingest. Bumped so deployed instances stop
// serving the unsanitized payloads v1 wrote before this change.
const CACHE_KEY = "home:latest-podcast-episode:v2";

/** A podcast posts roughly weekly; half an hour of staleness is invisible. */
export const PODCAST_EPISODE_CACHE_TTL_SECONDS = 60 * 30;

/**
 * The slice of an acast episode the homepage podcast card actually renders.
 * The raw feed entry is ~15KB of extra fields (checksums, acast settings,
 * content lengths); trimming here keeps the Redis payload and the loader
 * data small.
 */
export interface AcastEpisode {
  /** Stable feed id; the list page uses it as a React key. */
  id?: string;
  title: string;
  /** HTML fragment; rendered with dangerouslySetInnerHTML, line-clamped. */
  description: string;
  publishDate: string;
  /** Whole seconds. */
  duration: number;
  image?: string;
  /** Direct media URL; the card's "Listen" link target. */
  url: string;
}

/** Raw episode shape from feeder.acast.com; only the fields we map. */
interface AcastFeedEpisode {
  id?: string;
  title?: string;
  description?: string;
  publishDate?: string;
  duration?: number;
  image?: string;
  url?: string;
}

/**
 * Newest podcast episode for the homepage card, read through Redis so the
 * feed is fetched at most once per TTL instead of once per homepage request.
 * Any failure (acast down, junk payload, cache error) degrades to null and
 * the card simply doesn't render.
 */
export async function getLatestPodcastEpisode(): Promise<AcastEpisode | null> {
  try {
    return await services.cache.getOrSet<AcastEpisode | null>(CACHE_KEY, fetchLatestEpisode, {
      ttl: PODCAST_EPISODE_CACHE_TTL_SECONDS,
    });
  } catch (error) {
    logger.error("Error fetching latest podcast episode", { error });
    return null;
  }
}

async function fetchLatestEpisode(): Promise<AcastEpisode | null> {
  const response = await fetch(ACAST_FEED_URL, { signal: AbortSignal.timeout(ACAST_TIMEOUT_MS) });
  if (!response.ok) {
    logger.error("Acast feed responded non-OK", { status: response.status });
    return null;
  }

  const data: { episodes?: AcastFeedEpisode[] } = await response.json();
  const episode = data.episodes?.[0];
  if (!episode) return null;

  return toEpisode(episode);
}

/** Map one raw feed entry to our trimmed shape, sanitizing the HTML description. */
function toEpisode(episode: AcastFeedEpisode): AcastEpisode | null {
  if (!episode?.title || !episode.url) return null;

  return {
    id: episode.id,
    title: episode.title,
    description: sanitizeFeedHtml(episode.description),
    publishDate: episode.publishDate ?? "",
    duration: episode.duration ?? 0,
    image: episode.image,
    url: episode.url,
  };
}

/**
 * Recent episodes for the Touchdowns resource page.
 *
 * Server-side and cached, matching the homepage card. The page used to fetch acast from
 * the browser and render each description with dangerouslySetInnerHTML, which put a third
 * party's HTML straight into the DOM with nothing in between. Fetching here means the feed
 * is sanitized once, before it is ever cached or sent to a client.
 */
export async function getRecentPodcastEpisodes(): Promise<AcastEpisode[]> {
  try {
    return await services.cache.getOrSet<AcastEpisode[]>(EPISODE_LIST_CACHE_KEY, fetchRecentEpisodes, {
      ttl: PODCAST_EPISODE_CACHE_TTL_SECONDS,
    });
  } catch (error) {
    logger.error("Error fetching podcast episodes", { error });
    return [];
  }
}

async function fetchRecentEpisodes(): Promise<AcastEpisode[]> {
  const response = await fetch(acastFeedUrl(PODCAST_EPISODE_LIST_LIMIT), {
    signal: AbortSignal.timeout(ACAST_TIMEOUT_MS),
  });
  if (!response.ok) {
    // Throw rather than return []: `getOrSet` caches whatever this resolves to, so a
    // returned empty array would pin "no episodes" for the full 30-minute TTL over a
    // blip. The caller catches and degrades for this request only.
    throw new Error(`Acast feed responded ${response.status}`);
  }

  const data: { episodes?: AcastFeedEpisode[] } = await response.json();
  return (data.episodes ?? []).map(toEpisode).filter((e): e is AcastEpisode => e !== null);
}
