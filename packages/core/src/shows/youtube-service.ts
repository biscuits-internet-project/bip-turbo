import type { DbClient } from "../_shared/database/models";

function videoUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

/**
 * Surfaces the band's curated YouTube video links for shows. Video IDs live in
 * the `show_youtubes` table (many-per-show, manually curated); this service
 * resolves them to ready-to-link URLs for the show detail "Video" card and
 * for the per-row YouTube badge on listing pages. No external fetch — all
 * data is local.
 */
export class YoutubeService {
  constructor(private readonly db: DbClient) {}

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
}
