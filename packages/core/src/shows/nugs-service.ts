import type { Logger } from "@bip/domain";
import { CacheKeys } from "@bip/domain";
import { DateIndexedCatalog } from "../_shared/catalog/date-indexed-catalog";
import type { RedisService } from "../_shared/redis";

export const NUGS_ARTIST_IDS = {
  discoBiscuits: 128,
  tractorbeam: 514,
} as const;

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
  constructor(redis: RedisService, logger?: Logger) {
    this.catalogs = Object.values(NUGS_ARTIST_IDS).map(
      (artistId) =>
        new DateIndexedCatalog<NugsRelease>(
          redis,
          CacheKeys.nugs.catalog(artistId),
          buildFetcher(artistId, logger),
          logger,
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
   * Build a date → release-URL map for every show nugs has, merged across
   * artist catalogs. Exists so listing pages can render the nugs badge with a
   * real link target via a single Redis read. When the same date exists under
   * multiple artists, the first one wins (Disco Biscuits comes before
   * Tractorbeam in {@link NUGS_ARTIST_IDS}, matching the "main act" default).
   */
  async getReleaseUrlsByDate(): Promise<Record<string, string>> {
    const maps = await Promise.all(this.catalogs.map((c) => c.getAll()));
    const urls: Record<string, string> = {};
    for (const map of maps) {
      for (const [date, release] of Object.entries(map)) {
        if (!urls[date]) urls[date] = release.url;
      }
    }
    return urls;
  }
}
