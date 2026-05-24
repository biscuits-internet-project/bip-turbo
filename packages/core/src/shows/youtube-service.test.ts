import { describe, expect, test, vi } from "vitest";
import { YoutubeService } from "./youtube-service";

function makeMockDb() {
  return {
    showYoutube: {
      findMany: vi.fn().mockResolvedValue([]),
      findUnique: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
    show: {
      findUnique: vi.fn(),
      update: vi.fn().mockResolvedValue(undefined),
    },
  };
}

function makeMockCacheInvalidation() {
  return { invalidateShowComprehensive: vi.fn().mockResolvedValue(undefined) };
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

describe("YoutubeService.listEntriesForShow", () => {
  // The admin editor needs row ids alongside URLs so it can target individual
  // rows for deletion. URLs are still resolved server-side so the UI never
  // builds the watch URL format on its own.
  test("returns entries with id, videoId, and resolved url", async () => {
    const db = makeMockDb();
    db.showYoutube.findMany.mockResolvedValue([
      { id: "row-1", videoId: "abc12345678" },
      { id: "row-2", videoId: "xyz12345678" },
    ]);
    const service = new YoutubeService(db as never);

    const result = await service.listEntriesForShow("show-1");

    expect(result).toEqual([
      { id: "row-1", videoId: "abc12345678", url: "https://www.youtube.com/watch?v=abc12345678" },
      { id: "row-2", videoId: "xyz12345678", url: "https://www.youtube.com/watch?v=xyz12345678" },
    ]);
    expect(db.showYoutube.findMany).toHaveBeenCalledWith({
      where: { showId: "show-1" },
      select: { id: true, videoId: true },
      orderBy: { createdAt: "asc" },
    });
  });
});

describe("YoutubeService.createForShow", () => {
  // Adding a video must do three things atomically from the caller's
  // perspective: persist the row, bump the show's denormalized count (so
  // `hasYoutube` filters see it), and invalidate the show's cached pages so
  // the public detail page reflects the change on next view.
  test("persists the row, increments showYoutubesCount, and invalidates show caches", async () => {
    const db = makeMockDb();
    db.showYoutube.create.mockResolvedValue({ id: "row-new", videoId: "dQw4w9WgXcQ" });
    db.show.findUnique.mockResolvedValue({ slug: "2001-09-01-wetlands" });
    const cache = makeMockCacheInvalidation();
    const service = new YoutubeService(db as never, cache as never);

    const result = await service.createForShow("show-1", "dQw4w9WgXcQ");

    expect(db.showYoutube.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ showId: "show-1", videoId: "dQw4w9WgXcQ" }),
      select: { id: true, videoId: true },
    });
    expect(db.show.update).toHaveBeenCalledWith({
      where: { id: "show-1" },
      data: { showYoutubesCount: { increment: 1 } },
    });
    expect(cache.invalidateShowComprehensive).toHaveBeenCalledWith("show-1", "2001-09-01-wetlands");
    expect(result).toEqual({
      id: "row-new",
      videoId: "dQw4w9WgXcQ",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    });
  });

  // Cache invalidation must not break the create when the cache service
  // isn't wired (e.g. in environments where it's optional). The row is still
  // persisted and the count is still bumped.
  test("works without a cache invalidation service", async () => {
    const db = makeMockDb();
    db.showYoutube.create.mockResolvedValue({ id: "row-new", videoId: "abc12345678" });
    const service = new YoutubeService(db as never);

    const result = await service.createForShow("show-1", "abc12345678");

    expect(db.showYoutube.create).toHaveBeenCalled();
    expect(db.show.update).toHaveBeenCalled();
    expect(result.url).toBe("https://www.youtube.com/watch?v=abc12345678");
  });

  // If the show row has no slug (data integrity edge case), the cache call
  // is skipped — there's no slug-keyed cache to invalidate. The mutation
  // itself still completes.
  test("skips cache invalidation when the show has no slug", async () => {
    const db = makeMockDb();
    db.showYoutube.create.mockResolvedValue({ id: "row-new", videoId: "abc12345678" });
    db.show.findUnique.mockResolvedValue({ slug: null });
    const cache = makeMockCacheInvalidation();
    const service = new YoutubeService(db as never, cache as never);

    await service.createForShow("show-1", "abc12345678");

    expect(cache.invalidateShowComprehensive).not.toHaveBeenCalled();
  });
});

describe("YoutubeService.deleteEntry", () => {
  // Symmetric to createForShow: delete the row, decrement the show's count,
  // and invalidate caches. The showId is looked up from the row first so
  // callers only need to pass the row id.
  test("looks up the show, deletes the row, decrements count, invalidates caches", async () => {
    const db = makeMockDb();
    db.showYoutube.findUnique.mockResolvedValue({ showId: "show-1" });
    db.show.findUnique.mockResolvedValue({ slug: "2001-09-01-wetlands" });
    const cache = makeMockCacheInvalidation();
    const service = new YoutubeService(db as never, cache as never);

    await service.deleteEntry("row-1");

    expect(db.showYoutube.findUnique).toHaveBeenCalledWith({
      where: { id: "row-1" },
      select: { showId: true },
    });
    expect(db.showYoutube.delete).toHaveBeenCalledWith({ where: { id: "row-1" } });
    expect(db.show.update).toHaveBeenCalledWith({
      where: { id: "show-1" },
      data: { showYoutubesCount: { decrement: 1 } },
    });
    expect(cache.invalidateShowComprehensive).toHaveBeenCalledWith("show-1", "2001-09-01-wetlands");
  });

  // Deleting a row that no longer exists is a no-op — no delete, no count
  // change, no cache churn. Prevents a 500 on a double-click or stale row id.
  test("silently no-ops when the row does not exist", async () => {
    const db = makeMockDb();
    db.showYoutube.findUnique.mockResolvedValue(null);
    const cache = makeMockCacheInvalidation();
    const service = new YoutubeService(db as never, cache as never);

    await service.deleteEntry("missing-id");

    expect(db.showYoutube.delete).not.toHaveBeenCalled();
    expect(db.show.update).not.toHaveBeenCalled();
    expect(cache.invalidateShowComprehensive).not.toHaveBeenCalled();
  });
});
