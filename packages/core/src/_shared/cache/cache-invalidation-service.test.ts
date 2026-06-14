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

describe("CacheInvalidationService.invalidatePerformanceListings", () => {
  // The per-track Time column renders on three listing pages that each key off
  // their own cache: All-Timers, Jam Charts, and the per-day On-This-Day
  // all-timer list. A track duration save (manual or nugs/archive) must wipe
  // all three, or those pages keep showing stale times even after the show
  // detail page updates.
  test("wipes all-timers, jam-charts, and every on-this-day cache", async () => {
    const cache = makeCache();
    const service = new CacheInvalidationService(cache as never, logger);

    await service.invalidatePerformanceListings();

    expect(cache.del).toHaveBeenCalledWith(CacheKeys.songs.allTimers());
    expect(cache.del).toHaveBeenCalledWith(CacheKeys.songs.jamCharts());
    expect(cache.delPattern).toHaveBeenCalledWith(CacheKeys.songs.jamChartsOnThisDayAll());
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

    await service.invalidateShowListings([2018]);

    expect(cache.delPattern).toHaveBeenCalledWith(CacheKeys.users.allAttendedSetlists());
  });

  // Regression guard for the existing global show-listing invalidations —
  // adding the new attended-setlists pattern shouldn't have dropped any of
  // the original wipes.
  test("still wipes the original show-listing + stats caches", async () => {
    const cache = makeCache();
    const service = new CacheInvalidationService(cache as never, logger);

    await service.invalidateShowListings([2018]);

    expect(cache.delPattern).toHaveBeenCalledWith(CacheKeys.shows.allLists());
    expect(cache.delPattern).toHaveBeenCalledWith("home:*");
    expect(cache.del).toHaveBeenCalledWith(CacheKeys.stats.showsByYear());
    expect(cache.del).toHaveBeenCalledWith(CacheKeys.stats.showDates());
    expect(cache.del).toHaveBeenCalledWith(CacheKeys.stats.songPlayDates());
  });

  // Per-user song-history embeds track-level data from every attended show,
  // so any catalog-level show mutation can shift values. Wildcard wipe
  // avoids tracking which users were affected.
  test("wipes per-user song-history across all users", async () => {
    const cache = makeCache();
    const service = new CacheInvalidationService(cache as never, logger);

    await service.invalidateShowListings([2018]);

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

    await service.invalidateShowListings([2018]);

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

    await service.invalidateShowListings([2018]);

    expect(cache.delPattern).toHaveBeenCalledWith(CacheKeys.show.allData());
  });

  // The `/shows/year/:year` route is edge-cached with a `year-YYYY`
  // Cache-Tag (24h s-maxage past years, 5m current). Mutations on a show
  // must purge exactly the year(s) tied to that show; otherwise the year
  // listing stays stale at the edge even though Redis has been wiped.
  test("purges Cloudflare year tags for the supplied years", async () => {
    const cache = makeCache();
    const cloudflareCache = { purgeYearListings: vi.fn().mockResolvedValue(undefined) };
    const service = new CacheInvalidationService(cache as never, logger, cloudflareCache as never);

    await service.invalidateShowListings([2018, 2024]);

    expect(cloudflareCache.purgeYearListings).toHaveBeenCalledWith([2018, 2024]);
  });

  // An empty years array means "no edge entry to evict" — the API call
  // is skipped entirely. The Redis layer is still wiped above. A silent
  // fallback to a default year would hide caller bugs.
  test("skips Cloudflare purge when years is empty", async () => {
    const cache = makeCache();
    const cloudflareCache = { purgeYearListings: vi.fn().mockResolvedValue(undefined) };
    const service = new CacheInvalidationService(cache as never, logger, cloudflareCache as never);

    await service.invalidateShowListings([]);

    expect(cloudflareCache.purgeYearListings).not.toHaveBeenCalled();
  });

  // Date-move edits pass both the old and new year, which collapse to one
  // year when the move stays within a calendar year. Dedupe lives in the
  // service so callers can pass duplicates without spamming Cloudflare.
  test("dedupes year tags before calling Cloudflare", async () => {
    const cache = makeCache();
    const cloudflareCache = { purgeYearListings: vi.fn().mockResolvedValue(undefined) };
    const service = new CacheInvalidationService(cache as never, logger, cloudflareCache as never);

    await service.invalidateShowListings([2018, 2018, 2019]);

    expect(cloudflareCache.purgeYearListings).toHaveBeenCalledWith([2018, 2019]);
  });
});
