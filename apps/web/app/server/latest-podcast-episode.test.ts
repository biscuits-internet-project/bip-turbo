import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

const getOrSet = vi.fn();

vi.mock("~/server/services", () => ({
  services: {
    cache: { getOrSet: (...args: unknown[]) => getOrSet(...args) },
  },
}));

const { PODCAST_EPISODE_CACHE_TTL_SECONDS, getLatestPodcastEpisode } = await import("./latest-podcast-episode");

// Trimmed slice of a real feeder.acast.com response (2026-07-14). The episode
// carries many fields the homepage never reads (checkSum, acastSettings,
// contentLength, ...); the fixture keeps a few of those to prove the mapper
// drops them from the cached payload.
const ACAST_FIXTURE = {
  id: "d690923d-524e-5c8b-b29f-d66517615b5b",
  count: 120,
  episodes: [
    {
      id: "69b83e33a0bc40a270d6e41d",
      title: "E120 - 2026 And Beyond (w/Marc Brownstein)",
      subtitle: "DJ Brownie on the future of The Disco Biscuits",
      description:
        '<p>E120 - 2026 And Beyond - <a href="https://www.instagram.com/marcbrownstein">Marc Brownstein</a> returns to discuss The Disco Biscuits\' new lineup.</p>',
      publishDate: "2026-03-17T19:15:09.000Z",
      duration: 4916,
      image:
        "https://assets.pippa.io/shows/61b7acde1695626467e95304/1773682146361-0956c916-71ab-4ee9-be32-0a58fcca3ce2.jpeg",
      url: "https://sphinx.acast.com/p/acast/s/touchdownsallday/e/69b83e33a0bc40a270d6e41d/media.mp3",
      episodeUrl: "e120",
      contentLength: 59019685,
      checkSum: "abc123",
    },
  ],
};

function mockFetchResponse(body: unknown, ok = true): void {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({ ok, status: ok ? 200 : 502, json: async () => body })),
  );
}

describe("getLatestPodcastEpisode", () => {
  beforeEach(() => {
    // Pass-through cache: exercise the fetcher, capture the getOrSet wiring.
    getOrSet.mockImplementation(async (_key: string, fetcher: () => Promise<unknown>) => fetcher());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  // The raw acast episode is ~15KB of fields the page never uses. Only the
  // six rendered fields may reach the cache and the loader payload.
  test("maps the newest episode to exactly the rendered fields", async () => {
    mockFetchResponse(ACAST_FIXTURE);

    const episode = await getLatestPodcastEpisode();

    expect(episode).toEqual({
      title: "E120 - 2026 And Beyond (w/Marc Brownstein)",
      description: ACAST_FIXTURE.episodes[0].description,
      publishDate: "2026-03-17T19:15:09.000Z",
      duration: 4916,
      image: ACAST_FIXTURE.episodes[0].image,
      url: ACAST_FIXTURE.episodes[0].url,
    });
  });

  // The fetch goes through the Redis cache so the homepage stops hitting
  // acast on every request; a podcast feed does not need sub-30-minute
  // freshness.
  test("reads through the cache with a TTL", async () => {
    mockFetchResponse(ACAST_FIXTURE);

    await getLatestPodcastEpisode();

    expect(getOrSet).toHaveBeenCalledTimes(1);
    const [key, , options] = getOrSet.mock.calls[0];
    expect(key).toContain("podcast");
    expect(options).toEqual({ ttl: PODCAST_EPISODE_CACHE_TTL_SECONDS });
  });

  // Acast being down or returning junk must degrade to "no podcast card",
  // never break the homepage.
  test("returns null on a non-OK response", async () => {
    mockFetchResponse({}, false);

    expect(await getLatestPodcastEpisode()).toBeNull();
  });

  test("returns null when the feed has no episodes", async () => {
    mockFetchResponse({ episodes: [] });

    expect(await getLatestPodcastEpisode()).toBeNull();
  });

  test("returns null when fetch throws", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("network down");
      }),
    );

    expect(await getLatestPodcastEpisode()).toBeNull();
  });
});
