import { logger } from "~/lib/logger";
import { services } from "~/server/services";

/** Touchdowns All Day feed on acast; limit=1 returns only the newest episode. */
const ACAST_FEED_URL = "https://feeder.acast.com/api/v1/shows/d690923d-524e-5c8b-b29f-d66517615b5b?limit=1&from=0";

const CACHE_KEY = "home:latest-podcast-episode:v1";

/** A podcast posts roughly weekly; half an hour of staleness is invisible. */
export const PODCAST_EPISODE_CACHE_TTL_SECONDS = 60 * 30;

/**
 * The slice of an acast episode the homepage podcast card actually renders.
 * The raw feed entry is ~15KB of extra fields (checksums, acast settings,
 * content lengths); trimming here keeps the Redis payload and the loader
 * data small.
 */
export interface AcastEpisode {
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
  const response = await fetch(ACAST_FEED_URL);
  if (!response.ok) {
    logger.error("Acast feed responded non-OK", { status: response.status });
    return null;
  }

  const data: { episodes?: AcastFeedEpisode[] } = await response.json();
  const episode = data.episodes?.[0];
  if (!episode?.title || !episode.url) return null;

  return {
    title: episode.title,
    description: episode.description ?? "",
    publishDate: episode.publishDate ?? "",
    duration: episode.duration ?? 0,
    image: episode.image,
    url: episode.url,
  };
}
