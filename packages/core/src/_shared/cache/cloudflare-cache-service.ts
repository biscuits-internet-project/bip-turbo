import { type Logger, yearListingPath } from "@bip/domain";
import type { YearPurgeRegistry } from "./year-purge-registry";

export interface CloudflareCacheConfig {
  zoneId: string;
  apiToken: string;
  /** Public origin of the site, e.g. `https://discobiscuits.net`. Purge-by-URL
   *  needs absolute URLs that match the edge cache key exactly. */
  siteUrl: string;
}

/**
 * Cloudflare rejects a purge request holding more than this many URLs on
 * non-Enterprise plans, so `purgeUrls` splits a long list into several calls
 * rather than truncating it.
 */
const MAX_URLS_PER_PURGE = 30;

/**
 * The single-fetch twin of a request path. React Router suffixes the pathname,
 * so the query string has to stay on the end: `foo?bar` becomes `foo.data?bar`,
 * never `foo?bar.data`, which would match no cache key and purge nothing.
 */
function dataTwin(path: string): string {
  const queryStart = path.indexOf("?");
  if (queryStart === -1) return `${path}.data`;
  return `${path.slice(0, queryStart)}.data${path.slice(queryStart)}`;
}

export class CloudflareCacheService {
  private readonly baseUrl: string;
  /** `config.siteUrl` without a trailing slash, so path concatenation cannot
   *  produce a `//shows/...` URL that matches no cache key. */
  private readonly siteUrl: string;

  constructor(
    private readonly config: CloudflareCacheConfig,
    private readonly logger: Logger,
    private readonly yearPurgeRegistry: YearPurgeRegistry,
  ) {
    this.baseUrl = `https://api.cloudflare.com/client/v4/zones/${config.zoneId}/purge_cache`;
    this.siteUrl = config.siteUrl.replace(/\/+$/, "");
  }

  /**
   * Purge specific URLs from the edge. Available on every Cloudflare plan,
   * unlike purge-by-tag, which is Enterprise-only and fails silently
   * elsewhere.
   *
   * Each URL must match the edge cache key exactly, query string included, so
   * a caller that wants a filtered variant gone has to name that variant.
   */
  private async purgeUrls(urls: string[]): Promise<void> {
    if (urls.length === 0) return;

    this.logger.info("Purging Cloudflare cache by URL", { urls });

    for (let start = 0; start < urls.length; start += MAX_URLS_PER_PURGE) {
      await this.postPurge({ files: urls.slice(start, start + MAX_URLS_PER_PURGE) });
    }
  }

  /**
   * Purge the `/shows/year/:year` listing for each given year, including every
   * filter variant the origin recorded serving.
   *
   * The bare path goes first and unconditionally: it is the URL everyone lands
   * on, and it stays purgeable even when Redis is cold or the year hit the
   * registry's cap. The recorded variants follow, which is what lets them hold
   * a day-long edge TTL instead of the short self-healing one.
   *
   * Both the document URL and its single-fetch `.data` twin are separate edge
   * entries, and a client-side navigation to the year page reads `.data`
   * without ever requesting the document, so leaving either behind keeps a
   * stale setlist on screen after a show is edited.
   */
  async purgeYearListings(years: number[]): Promise<void> {
    const pathsByYear = await Promise.all(
      years.map(async (year) => {
        const barePath = yearListingPath(year);
        const recorded = await this.yearPurgeRegistry.servedPaths(year);
        return [barePath, ...recorded.filter((path) => path !== barePath)];
      }),
    );

    const urls = pathsByYear.flat().flatMap((path) => [`${this.siteUrl}${path}`, `${this.siteUrl}${dataTwin(path)}`]);
    await this.purgeUrls(urls);
  }

  /**
   * Purge all cached content (use sparingly)
   */
  async purgeAll(): Promise<void> {
    this.logger.info("Purging all Cloudflare cache");
    await this.postPurge({ purge_everything: true });
  }

  /**
   * POST one purge body and report the outcome. Purge failures never throw:
   * the caller has already wiped Redis, and a stale edge entry expires on its
   * own, so breaking the mutation that triggered the purge would be worse
   * than serving a stale page.
   */
  private async postPurge(body: Record<string, unknown>): Promise<void> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error("Cloudflare cache purge failed", {
          status: response.status,
          error: errorText,
        });
        return;
      }

      const data = (await response.json()) as { success: boolean; errors?: Array<{ message: string }> };

      if (!data.success) {
        const errorMessage = data.errors?.map((e) => e.message).join(", ") ?? "Unknown error";
        this.logger.error("Cloudflare cache purge failed", { error: errorMessage });
        return;
      }

      this.logger.info("Cloudflare cache purged successfully");
    } catch (error) {
      this.logger.error("Cloudflare cache purge error", { error });
    }
  }
}
