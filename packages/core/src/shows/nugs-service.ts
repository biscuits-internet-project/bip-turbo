import type { Logger } from "@bip/domain";
import { CacheKeys } from "@bip/domain";
import { DateIndexedCatalog } from "../_shared/catalog/date-indexed-catalog";
import type { RedisService } from "../_shared/redis";
import type { ExternalDurationTrack } from "../tracks/duration-matching";

export const NUGS_ARTIST_IDS = {
  discoBiscuits: 128,
  tractorbeam: 514,
} as const;

/** Per-container track-list cache lifetime — these never change once posted. */
const CONTAINER_TTL_SECONDS = 60 * 60 * 24 * 7;

/**
 * A single official release on nugs.net. `artistName` matters when the same
 * show exists under both Disco Biscuits and Tractorbeam catalogs — the UI
 * disambiguates so users know which billing they're clicking through to.
 */
export interface NugsRelease {
  /** Display name as nugs.net categorizes it (e.g. "The Disco Biscuits", "Tractorbeam"). */
  artistName: string;
  /** Fully-qualified `play.nugs.net/release/{containerID}` link. */
  url: string;
  /** Container id, needed to fetch the per-track running times. */
  containerId: number;
}

/**
 * One container entry from nugs.net's catalog API. Not exported — the service
 * normalizes to {@link NugsRelease} before anything else sees it.
 */
interface NugsApiContainer {
  containerID?: number;
  artistName?: string;
  performanceDateFormatted?: string;
}

/** Envelope shape from nugs.net's catalog.containersAll endpoint. */
interface NugsApiResponse {
  Response?: {
    containers?: NugsApiContainer[];
  };
}

/** One track row from the catalog.container detail endpoint. */
interface NugsApiTrack {
  songTitle?: string;
  /** Running time in whole seconds. */
  totalRunningTime?: number;
  discNum?: number;
  trackNum?: number;
}

/**
 * Envelope shape from nugs.net's catalog.container endpoint. The per-track
 * running times live on `Response.tracks`; the sibling `Response.songs` array
 * is the catalog-style listing WITHOUT durations, so it must not be read here.
 */
interface NugsContainerResponse {
  Response?: {
    tracks?: NugsApiTrack[];
  };
}

function buildFetcher(artistId: number, logger?: Logger) {
  return async (): Promise<Record<string, NugsRelease>> => {
    const url = `https://api.nugs.net/api.aspx?method=catalog.containersAll&artistID=${artistId}&availableOnly=1`;
    logger?.info("Fetching nugs.net catalog", { artistId });
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch nugs catalog: ${response.status}`);
    }
    const data: NugsApiResponse = await response.json();
    const containers = data.Response?.containers ?? [];

    const map: Record<string, NugsRelease> = {};
    for (const c of containers) {
      if (!c.containerID || !c.artistName || !c.performanceDateFormatted) continue;
      const isoDate = c.performanceDateFormatted.replaceAll("/", "-");
      map[isoDate] = {
        artistName: c.artistName,
        url: `https://play.nugs.net/release/${c.containerID}`,
        containerId: c.containerID,
      };
    }
    return map;
  };
}

/**
 * Wraps nugs.net's catalog API for official Disco Biscuits releases. The band
 * plays as both "The Disco Biscuits" (artist 128) and "Tractorbeam" (artist
 * 514, their side project); each is a separate catalog on nugs with its own
 * artistID, so the service fetches and caches one catalog per artist and
 * merges results when looking up a show date. Used to render a "Listen on
 * nugs.net" link on the show page and the nugs badge on listing pages.
 */
export class NugsService {
  private readonly catalogs: DateIndexedCatalog<NugsRelease>[];

  /**
   * @param redis Shared Redis client. Each artist's catalog gets its own cache
   *   key so a partial failure on one artist doesn't invalidate the other.
   * @param logger Optional logger; fetch failures are swallowed so a show page
   *   renders even when nugs.net is unreachable.
   */
  constructor(
    private readonly redis: RedisService,
    private readonly logger?: Logger,
  ) {
    this.catalogs = Object.values(NUGS_ARTIST_IDS).map(
      (artistId) =>
        new DateIndexedCatalog<NugsRelease>(
          this.redis,
          CacheKeys.nugs.catalog(artistId),
          buildFetcher(artistId, this.logger),
          this.logger,
        ),
    );
  }

  /**
   * Return every release known for a show date across every artist catalog.
   * Most dates have zero or one release, but dual-billed nights can surface
   * both a Biscuits and a Tractorbeam entry — the UI shows both as separate
   * links.
   */
  async findReleasesForDate(date: string): Promise<NugsRelease[]> {
    const results = await Promise.all(this.catalogs.map((c) => c.findByDate(date)));
    return results.filter((r): r is NugsRelease => r !== undefined);
  }

  /**
   * Build a date → release-URL list map for every show nugs has, merged
   * across artist catalogs. Exists so listing pages can render nugs badges
   * with real link targets via a single Redis read. Dates with both a
   * Disco Biscuits and a Tractorbeam release surface both URLs (in the
   * {@link NUGS_ARTIST_IDS} order — Disco Biscuits first), so callers can
   * indicate "more than one release" without a second round-trip.
   */
  async getReleaseUrlsByDate(): Promise<Record<string, string[]>> {
    const maps = await Promise.all(this.catalogs.map((c) => c.getAll()));
    const urls: Record<string, string[]> = {};
    for (const map of maps) {
      for (const [date, release] of Object.entries(map)) {
        if (!urls[date]) urls[date] = [];
        urls[date].push(release.url);
      }
    }
    return urls;
  }

  /**
   * Fetch the ordered track list (title + running time in seconds) for one
   * release via the catalog.container detail endpoint, the authoritative
   * source of per-track durations. Cached per container in Redis since the
   * track list of a posted release never changes. Returns an empty list on any
   * failure so duration resolution degrades to the next source.
   */
  async fetchContainerTracks(containerId: number): Promise<ExternalDurationTrack[]> {
    const cacheKey = CacheKeys.nugs.container(containerId);
    const cached = await this.redis.get<ExternalDurationTrack[]>(cacheKey);
    if (cached) return cached;

    try {
      const url = `https://streamapi.nugs.net/api.aspx?method=catalog.container&containerID=${containerId}&vdisp=1`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch nugs container ${containerId}: ${response.status}`);
      }
      const data: NugsContainerResponse = await response.json();
      const containerTracks = data.Response?.tracks ?? [];

      const tracks = containerTracks
        .filter(
          (t): t is Required<Pick<NugsApiTrack, "songTitle" | "totalRunningTime">> & NugsApiTrack =>
            Boolean(t.songTitle) && typeof t.totalRunningTime === "number" && t.totalRunningTime > 0,
        )
        .sort((a, b) => (a.discNum ?? 0) - (b.discNum ?? 0) || (a.trackNum ?? 0) - (b.trackNum ?? 0))
        .map((t) => ({ title: t.songTitle, seconds: t.totalRunningTime }));

      if (tracks.length > 0) {
        await this.redis.set<ExternalDurationTrack[]>(cacheKey, tracks, { EX: CONTAINER_TTL_SECONDS });
      }
      return tracks;
    } catch (error) {
      this.logger?.error("nugs container fetch failed", { containerId, error });
      return [];
    }
  }
}
