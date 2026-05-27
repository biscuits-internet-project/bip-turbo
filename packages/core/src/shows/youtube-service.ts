import { type CacheInvalidationService, yearFromShowDate } from "../_shared/cache";
import type { DbClient } from "../_shared/database/models";

function videoUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export interface ShowYoutubeEntry {
  id: string;
  videoId: string;
  url: string;
}

/**
 * Surfaces the band's curated YouTube video links for shows. Video IDs live in
 * the `show_youtubes` table (many-per-show, manually curated); this service
 * resolves them to ready-to-link URLs for the show detail "Video" card and
 * for the per-row YouTube badge on listing pages. No external fetch — all
 * data is local.
 */
export class YoutubeService {
  constructor(
    private readonly db: DbClient,
    private readonly cacheInvalidation?: CacheInvalidationService,
  ) {}

  /**
   * Return every curated video URL for a show in insertion order, so the
   * detail-page list matches the order the admin added them.
   */
  async getVideoUrlsForShow(showId: string): Promise<string[]> {
    const rows = await this.db.showYoutube.findMany({
      where: { showId },
      select: { videoId: true },
      orderBy: { createdAt: "asc" },
    });
    return rows.map((r) => videoUrl(r.videoId));
  }

  /**
   * Build a showId → first-video-URL map for a batch of shows so listing
   * pages can render YouTube badges without an N+1 query. The "first" video
   * is the oldest by createdAt, which is stable across requests and makes
   * the badge link target deterministic.
   *
   * @param showIds Shows to resolve. Empty input short-circuits the query so
   *   callers can pass an unfiltered list without a guard.
   */
  async getFirstVideoUrlByShowIds(showIds: string[]): Promise<Record<string, string>> {
    if (showIds.length === 0) return {};
    const rows = await this.db.showYoutube.findMany({
      where: { showId: { in: showIds } },
      select: { showId: true, videoId: true },
      orderBy: { createdAt: "asc" },
    });
    const result: Record<string, string> = {};
    for (const row of rows) {
      if (!result[row.showId]) result[row.showId] = videoUrl(row.videoId);
    }
    return result;
  }

  /**
   * Lists curated videos for a show with their row ids, so the admin editor
   * can render a list and target individual rows for deletion.
   */
  async listEntriesForShow(showId: string): Promise<ShowYoutubeEntry[]> {
    const rows = await this.db.showYoutube.findMany({
      where: { showId },
      select: { id: true, videoId: true },
      orderBy: { createdAt: "asc" },
    });
    return rows.map((row) => ({ id: row.id, videoId: row.videoId, url: videoUrl(row.videoId) }));
  }

  /**
   * Adds a curated video to a show. Also bumps the denormalized
   * `Show.showYoutubesCount` so the `hasYoutube` filter sees the new row, and
   * invalidates the show's cached pages.
   */
  async createForShow(showId: string, videoId: string): Promise<ShowYoutubeEntry> {
    const now = new Date();
    const created = await this.db.showYoutube.create({
      data: { showId, videoId, createdAt: now, updatedAt: now },
      select: { id: true, videoId: true },
    });
    await this.db.show.update({
      where: { id: showId },
      data: { showYoutubesCount: { increment: 1 } },
    });
    await this.invalidateShowCaches(showId);
    return { id: created.id, videoId: created.videoId, url: videoUrl(created.videoId) };
  }

  /**
   * Removes a curated video by row id. Decrements the show's count and
   * invalidates the show's cached pages.
   */
  async deleteEntry(id: string): Promise<void> {
    const existing = await this.db.showYoutube.findUnique({
      where: { id },
      select: { showId: true },
    });
    if (!existing) return;
    await this.db.showYoutube.delete({ where: { id } });
    await this.db.show.update({
      where: { id: existing.showId },
      data: { showYoutubesCount: { decrement: 1 } },
    });
    await this.invalidateShowCaches(existing.showId);
  }

  private async invalidateShowCaches(showId: string): Promise<void> {
    if (!this.cacheInvalidation) return;
    const show = await this.db.show.findUnique({
      where: { id: showId },
      select: { slug: true, date: true },
    });
    if (show?.slug) {
      const year = yearFromShowDate(show.date);
      await this.cacheInvalidation.invalidateShowComprehensive(showId, show.slug, [year]);
    }
  }
}
