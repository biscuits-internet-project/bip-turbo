import type { Logger } from "@bip/domain";
import { CacheKeys } from "@bip/domain";
import { DateIndexedCatalog } from "../_shared/catalog/date-indexed-catalog";
import type { RedisService } from "../_shared/redis";

/** Relisten files Disco Biscuits shows under this artist slug. */
export const RELISTEN_ARTIST_SLUG = "disco-biscuits";

const API_BASE = `https://api.relisten.net/api/v2/artists/${RELISTEN_ARTIST_SLUG}`;

/** One entry from Relisten's `/years` list endpoint. */
interface RelistenYear {
  year?: string;
}

/** A single show inside a `/years/{year}` response. */
interface RelistenShow {
  display_date?: string;
  source_count?: number;
}

/** Envelope shape from Relisten's `/years/{year}` endpoint. */
interface RelistenYearResponse {
  shows?: RelistenShow[];
}

/**
 * Web link for a show date. Relisten's player URL is purely date-derived, so
 * the catalog only exists to tell us which dates Relisten actually has — we
 * never want to render a link to a date with no recordings.
 */
function buildShowUrl(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `https://relisten.net/${RELISTEN_ARTIST_SLUG}/${year}/${month}/${day}`;
}

function buildFetcher(logger?: Logger) {
  return async (): Promise<Record<string, string>> => {
    logger?.info("Fetching Relisten catalog", { slug: RELISTEN_ARTIST_SLUG });
    const yearsResponse = await fetch(`${API_BASE}/years`);
    if (!yearsResponse.ok) {
      throw new Error(`Failed to fetch Relisten years: ${yearsResponse.status}`);
    }
    const years: RelistenYear[] = await yearsResponse.json();

    // ~30 concurrent year requests. Use allSettled (not all) so one flaky or
    // rate-limited year doesn't reject the batch and wipe the entire catalog —
    // the years that loaded still produce links; the rest are logged and
    // retried on the next refresh (empty maps aren't cached).
    const settled = await Promise.allSettled(
      years
        .map((y) => y.year)
        .filter((year): year is string => Boolean(year))
        .map(async (year) => {
          const response = await fetch(`${API_BASE}/years/${year}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch Relisten year ${year}: ${response.status}`);
          }
          const data: RelistenYearResponse = await response.json();
          return data.shows ?? [];
        }),
    );

    const map: Record<string, string> = {};
    for (const result of settled) {
      if (result.status === "rejected") {
        logger?.error("Relisten year fetch failed, skipping", { error: result.reason });
        continue;
      }
      for (const show of result.value) {
        if (!show.display_date || !show.source_count) continue;
        map[show.display_date] = buildShowUrl(show.display_date);
      }
    }
    return map;
  };
}

/**
 * Wraps Relisten's public REST API for Disco Biscuits shows. Relisten streams
 * fan recordings; this service learns which show dates Relisten has so the UI
 * can render a "Listen on Relisten" link without ever pointing at a date that
 * has no recordings. The link target itself is derived from the date. Backs
 * the show-page Relisten card and the listing-page favicon badge.
 */
export class RelistenService {
  private readonly catalog: DateIndexedCatalog<string>;

  /**
   * @param redis Shared Redis client for the underlying catalog cache.
   * @param logger Optional logger; fetch failures are swallowed so a show page
   *   never breaks on Relisten downtime.
   */
  constructor(redis: RedisService, logger?: Logger) {
    this.catalog = new DateIndexedCatalog<string>(redis, CacheKeys.relisten.catalog(), buildFetcher(logger), logger);
  }

  /**
   * Relisten link for a single show date, or undefined when Relisten has no
   * recordings for it.
   */
  async findUrlForDate(date: string): Promise<string | undefined> {
    return this.catalog.findByDate(date);
  }

  /**
   * Full date → Relisten-URL map for listing pages that need O(1) per-row
   * lookups across many shows via a single Redis read.
   */
  async getUrlsByDate(): Promise<Record<string, string>> {
    return this.catalog.getAll();
  }
}
