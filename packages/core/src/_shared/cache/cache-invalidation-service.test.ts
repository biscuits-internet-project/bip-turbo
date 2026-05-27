import { CacheKeys } from "@bip/domain";
import { describe, expect, test, vi } from "vitest";
import { CacheInvalidationService } from "./cache-invalidation-service";

const logger = { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() } as never;

function makeCache() {
  return {
    del: vi.fn().mockResolvedValue(undefined),
    delPattern: vi.fn().mockResolvedValue(undefined),
  };
}

describe("CacheInvalidationService.invalidateAttendanceCaches", () => {
  // Toggling attendance changes which shows appear in /songs filtered-by-user
  // results AND which setlists appear on the user-profile Shows Attended tab.
  // Both per-user caches must be wiped together — otherwise the profile shows
  // stale setlists or the /songs filter shows stale attendance hits.
  test("wipes both per-user filtered-songs and attended-setlists patterns", async () => {
    const cache = makeCache();
    const service = new CacheInvalidationService(cache as never, logger);

    await service.invalidateAttendanceCaches("u-rynow");

    expect(cache.delPattern).toHaveBeenCalledWith(CacheKeys.songs.allFilteredForUser("u-rynow"));
    expect(cache.delPattern).toHaveBeenCalledWith(CacheKeys.users.allAttendedSetlistsForUser("u-rynow"));
    // Both patterns scope by user — never wipe global caches from a single
    // user's attendance change.
    expect(cache.delPattern).toHaveBeenCalledTimes(2);
  });

  // The SetlistCard "personal gap chart" view reads this user's song-history
  // blob — toggling attendance changes its content and must wipe it.
  test("wipes the per-user song-history blob", async () => {
    const cache = makeCache();
    const service = new CacheInvalidationService(cache as never, logger);

    await service.invalidateAttendanceCaches("u-rynow");

    expect(cache.del).toHaveBeenCalledWith(CacheKeys.users.songHistory("u-rynow"));
  });
});

describe("CacheInvalidationService.invalidateShowListings", () => {
  // Admin edits to show metadata (date, venue, etc.) bubble through here.
  // Per-user attended-setlists caches embed that metadata, so they must be
  // wiped along with the global show-listing caches. Pattern-wide wipe avoids
  // tracking which users attended which show.
  test("wipes per-user attended-setlists across all users on show-listing changes", async () => {
    const cache = makeCache();
    const service = new CacheInvalidationService(cache as never, logger);

    await service.invalidateShowListings();

    expect(cache.delPattern).toHaveBeenCalledWith(CacheKeys.users.allAttendedSetlists());
  });

  // Regression guard for the existing global show-listing invalidations —
  // adding the new attended-setlists pattern shouldn't have dropped any of
  // the original wipes.
  test("still wipes the original show-listing + stats caches", async () => {
    const cache = makeCache();
    const service = new CacheInvalidationService(cache as never, logger);

    await service.invalidateShowListings();

    expect(cache.delPattern).toHaveBeenCalledWith(CacheKeys.shows.allLists());
    expect(cache.delPattern).toHaveBeenCalledWith("home:*");
    expect(cache.del).toHaveBeenCalledWith(CacheKeys.stats.showsByYear());
    expect(cache.del).toHaveBeenCalledWith(CacheKeys.stats.showDates());
  });

  // Per-user song-history embeds track-level data from every attended show,
  // so any catalog-level show mutation can shift values. Wildcard wipe
  // avoids tracking which users were affected.
  test("wipes per-user song-history across all users", async () => {
    const cache = makeCache();
    const service = new CacheInvalidationService(cache as never, logger);

    await service.invalidateShowListings();

    expect(cache.delPattern).toHaveBeenCalledWith(CacheKeys.users.allSongHistory());
  });

  // Rock opera resource pages cache full Setlists (with tracks, annotations,
  // ratings, notes, date) for every tagged show. Any non-rock-opera mutation
  // on a tagged show — notes, a track edit, a rating, even a date shift —
  // makes that fat payload stale. Wildcard wipe so the cache rebuilds on the
  // next visit; cost is trivial (~3 keys for 3 rock operas).
  test("wipes the rock opera resource-page cache on show-listing changes", async () => {
    const cache = makeCache();
    const service = new CacheInvalidationService(cache as never, logger);

    await service.invalidateShowListings();

    expect(cache.delPattern).toHaveBeenCalledWith(CacheKeys.rockOperas.allPerformances());
  });

  // show.data caches per-slug Setlists with rockOperaPerformances baked
  // in by the SetlistService overlay. A date change on one tagged show
  // — or any rock opera assignment — shifts every neighbor's rank /
  // prev / next, so neighbor show.data entries are stale even though
  // their own row didn't move. Wipe the whole per-slug pattern so the
  // next request rebuilds with fresh annotations.
  test("wipes per-slug show.data on show-listing changes", async () => {
    const cache = makeCache();
    const service = new CacheInvalidationService(cache as never, logger);

    await service.invalidateShowListings();

    expect(cache.delPattern).toHaveBeenCalledWith(CacheKeys.show.allData());
  });
});
