import type { Logger } from "@bip/domain";

export interface CloudflareCacheConfig {
  zoneId: string;
  apiToken: string;
}

export class CloudflareCacheService {
  private readonly baseUrl: string;

  constructor(
    private readonly config: CloudflareCacheConfig,
    private readonly logger: Logger,
  ) {
    this.baseUrl = `https://api.cloudflare.com/client/v4/zones/${config.zoneId}/purge_cache`;
  }

  /**
   * Purge cache by tags. Cloudflare will purge all cached responses
   * that have any of the specified Cache-Tag headers.
   */
  async purgeByTags(tags: string[]): Promise<void> {
    if (tags.length === 0) return;

    this.logger.info("Purging Cloudflare cache by tags", { tags });

    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tags }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error("Cloudflare cache purge failed", {
          status: response.status,
          error: errorText,
        });
        // Don't throw - cache purge failures shouldn't break the app
        return;
      }

      const data = (await response.json()) as { success: boolean; errors?: Array<{ message: string }> };

      if (!data.success) {
        const errorMessage = data.errors?.map((e) => e.message).join(", ") ?? "Unknown error";
        this.logger.error("Cloudflare cache purge failed", { error: errorMessage });
        return;
      }

      this.logger.info("Cloudflare cache purged successfully", { tags });
    } catch (error) {
      this.logger.error("Cloudflare cache purge error", { error });
      // Don't throw - cache purge failures shouldn't break the app
    }
  }

  /**
   * Purge cache for year listing pages
   */
  async purgeYearListings(years?: number[]): Promise<void> {
    const currentYear = new Date().getFullYear();
    const tagsToInvalidate = years?.map((y) => `year-${y}`) ?? [`year-${currentYear}`];
    await this.purgeByTags(tagsToInvalidate);
  }

  /**
   * Purge all cached content (use sparingly)
   */
  async purgeAll(): Promise<void> {
    this.logger.info("Purging all Cloudflare cache");

    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ purge_everything: true }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error("Cloudflare cache purge all failed", {
          status: response.status,
          error: errorText,
        });
        return;
      }

      this.logger.info("Cloudflare cache purged completely");
    } catch (error) {
      this.logger.error("Cloudflare cache purge all error", { error });
    }
  }
}
