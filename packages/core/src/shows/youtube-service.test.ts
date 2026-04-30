import { describe, expect, test, vi } from "vitest";
import { YoutubeService } from "./youtube-service";

function makeMockDb() {
  return {
    showYoutube: {
      findMany: vi.fn().mockResolvedValue([]),
    },
  };
}

describe("YoutubeService.getVideoUrlsForShow", () => {
  // The show detail page uses this to render a per-video link list. URLs are
  // built by the service so consumers never need to know the watch URL format.
  // Order matches insertion order (createdAt asc) so curated playlists stay
  // deterministic across page reloads.
  test("returns watch URLs for each video id in createdAt ascending order", async () => {
    const db = makeMockDb();
    db.showYoutube.findMany.mockResolvedValue([{ videoId: "abc123" }, { videoId: "def456" }]);
    const service = new YoutubeService(db as never);

    const result = await service.getVideoUrlsForShow("show-1");

    expect(result).toEqual(["https://www.youtube.com/watch?v=abc123", "https://www.youtube.com/watch?v=def456"]);
    expect(db.showYoutube.findMany).toHaveBeenCalledWith({
      where: { showId: "show-1" },
      select: { videoId: true },
      orderBy: { createdAt: "asc" },
    });
  });

  // Shows with no linked videos return an empty array; caller decides whether
  // to render the card at all.
  test("returns an empty array when the show has no videos", async () => {
    const db = makeMockDb();
    const service = new YoutubeService(db as never);

    const result = await service.getVideoUrlsForShow("show-with-no-videos");

    expect(result).toEqual([]);
  });
});

describe("YoutubeService.getFirstVideoUrlByShowIds", () => {
  // Bulk variant used by SetlistCard listing pages (year, on-this-day, etc.)
  // to populate the YouTube badge link per row without an N+1 query. A single
  // fetch ordered by createdAt; we keep the first video per show and hand
  // back a ready-to-use URL so consumers never see the raw videoId.
  test("returns a record mapping show id to the first video's watch URL", async () => {
    const db = makeMockDb();
    db.showYoutube.findMany.mockResolvedValue([
      { showId: "show-1", videoId: "first-vid" },
      { showId: "show-1", videoId: "second-vid" },
      { showId: "show-3", videoId: "show3-vid" },
    ]);
    const service = new YoutubeService(db as never);

    const result = await service.getFirstVideoUrlByShowIds(["show-1", "show-2", "show-3"]);

    expect(result).toEqual({
      "show-1": "https://www.youtube.com/watch?v=first-vid",
      "show-3": "https://www.youtube.com/watch?v=show3-vid",
    });
    expect(db.showYoutube.findMany).toHaveBeenCalledWith({
      where: { showId: { in: ["show-1", "show-2", "show-3"] } },
      select: { showId: true, videoId: true },
      orderBy: { createdAt: "asc" },
    });
  });

  // Empty input list short-circuits the DB call so listing-page loaders can
  // pass whatever set of show ids they have without a guard.
  test("empty input skips the db query and returns an empty record", async () => {
    const db = makeMockDb();
    const service = new YoutubeService(db as never);

    const result = await service.getFirstVideoUrlByShowIds([]);

    expect(result).toEqual({});
    expect(db.showYoutube.findMany).not.toHaveBeenCalled();
  });
});
