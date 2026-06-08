/**
 * Centralized cache key generation for consistent caching across the application
 */

// Type for filter values that can be serialized into cache keys
type FilterValue = string | number | boolean | null | undefined;
type CacheFilters = Record<string, FilterValue>;

export const CacheKeys = {
  /**
   * Show-related cache keys
   */
  show: {
    /** Complete show + setlist data for show page */
    data: (slug: string) => `show:${slug}:data:v12`,

    // Note: Reviews are loaded fresh from DB, not cached

    /** All cache keys for a show (for pattern deletion) */
    all: (slug: string) => `show:${slug}:*`,
    /** Every show.data entry across all slugs (for invalidations on
     *  mutations that ripple beyond a single show — e.g. a date shift
     *  on a tagged show changes neighbors' rock opera annotations). */
    allData: () => "show:*:data:*",
  },

  /**
   * Show listing cache keys
   */
  shows: {
    /** Paginated show listings with filters */
    list: (filters: CacheFilters) => {
      const filterHash = hashFilters(filters);
      return `shows:list:${filterHash}:v12`;
    },

    /** All show listing caches (for pattern deletion) */
    allLists: () => `shows:list:*`,

    /** Show + all-timer counts for a calendar day (On This Day home page widget) */
    onThisDayCounts: (monthDay: string) => `shows:on-this-day-counts:${monthDay}`,
  },

  /**
   * Setlist cache keys
   */
  setlist: {
    /** Complete setlist data with tracks and annotations */
    data: (slug: string) => `setlist:${slug}:data:v12`,
  },

  /**
   * archive.org full-catalog cache (date-indexed map of all Disco Biscuits recordings)
   */
  archiveDotOrg: {
    catalog: () => "archive-dot-org-catalog-disco-biscuits",
    /** Per-recording track list (title + duration seconds) from the metadata API. */
    recording: (identifier: string) => `archive-dot-org-recording:${identifier}:v1`,
  },

  /**
   * nugs.net catalog cache keys (keyed by nugs artist id)
   */
  nugs: {
    // :v2 — NugsRelease gained `containerId` (needed to fetch per-track
    // running times); pre-bump cached entries lack it.
    catalog: (artistId: number) => `nugs-catalog-artist-${artistId}:v2`,
    /** Per-container track list (title + totalRunningTime seconds) from catalog.container. */
    container: (containerId: number) => `nugs-container:${containerId}:v1`,
  },

  /**
   * Relisten full-catalog cache (date-indexed map of all Disco Biscuits shows)
   */
  relisten: {
    catalog: () => "relisten-catalog-disco-biscuits",
  },

  /**
   * Song-related cache keys
   */
  songs: {
    /** Full songs index page data */
    index: () => "songs:index:full:v4",
    /** All-timers page data */
    allTimers: () => "songs:all-timers:v5",
    /** Jam Charts page data (tracks that are all-timers OR carry a curated note) */
    jamCharts: () => "songs:jam-charts:v6",
    /** Songs with history content */
    histories: () => "songs:histories:v4",
    /** All-timers for a specific calendar day (On This Day page) */
    allTimersOnThisDay: (monthDay: string) => `songs:all-timers:on-this-day:${monthDay}:v5`,
    /** Every On-This-Day all-timer cache across all calendar days (for pattern deletion). */
    allTimersOnThisDayAll: () => "songs:all-timers:on-this-day:*",
    /** Filtered song results by era/author/kind/tags/attended */
    filtered: (filters: CacheFilters) => {
      const filterHash = hashFilters(filters);
      const attendedUserId = filters.attended;
      if (attendedUserId) {
        return `songs:filtered:user:${attendedUserId}:${filterHash}:v5`;
      }
      return `songs:filtered:${filterHash}:v5`;
    },
    /** All filtered song caches (for pattern deletion) */
    allFiltered: () => "songs:filtered:*",
    /** Filtered caches for a specific user's attendance (for pattern deletion) */
    allFilteredForUser: (userId: string) => `songs:filtered:user:${userId}:*`,
  },

  /**
   * Per-user cache keys
   */
  users: {
    /**
     * Pre-built SetlistList payload (setlists + external sources) for one
     * page of a user's attended shows. Paginated because the heaviest users
     * have 400+ attended shows and the un-paginated payload is large enough
     * to be slow to deserialize/transport even from Redis.
     */
    attendedSetlists: (userId: string, page: number) => `user:${userId}:attended-setlists:p${page}:v11`,
    /** All pages of a single user's attended-setlists caches (for per-user invalidation). */
    allAttendedSetlistsForUser: (userId: string) => `user:${userId}:attended-setlists:*`,
    /** All per-user attended-setlists caches (for pattern deletion on broad show mutations). */
    allAttendedSetlists: () => "user:*:attended-setlists:*",
    /**
     * Per-user attendance + setlist aggregate that backs the SetlistCard
     * "personal" view: sorted attended-show dates plus a {songId: dates[]}
     * map. Invalidated when the user toggles attendance and when any show
     * mutation changes the broader catalog.
     */
    songHistory: (userId: string) => `user:${userId}:song-history`,
    /** Pattern for invalidating every user's song-history blob on broad show mutations. */
    allSongHistory: () => "user:*:song-history",
  },

  /**
   * Rock opera cache keys. `performances` payloads back the resource-page
   * lists (Hot Air Balloon / CWB / RIM). Per-show annotation data is no
   * longer cached separately — SetlistService overlays it onto every
   * returned setlist, so it rides inside the existing show.data /
   * shows.list / users.attendedSetlists payloads.
   */
  rockOperas: {
    /** Resource-page list payload: setlists + external sources for one rock opera. */
    performances: (slug: string) => `rock-operas:performances:${slug}:v9`,
    /** Pattern for invalidating every performances cache (broad mutations). */
    allPerformances: () => "rock-operas:performances:*",
  },

  /**
   * Home page cache keys
   */
  home: {
    /** Recent setlists for home page (limit + sort direction) */
    recentSetlists: (limit: number) => `home:recent-setlists:${limit}:v10`,
  },

  /**
   * Cross-domain stats cache keys (denormalized aggregates that span shows
   * and songs and back rarity/normalization features).
   */
  stats: {
    /**
     * Map of `{year: showCount}` for the entire show catalog. `:v2` bump:
     * now excludes orphan stub shows (venue_id IS NULL); semantics changed,
     * pre-bump cached values would over-count by the number of stubs.
     */
    showsByYear: () => "stats:shows-by-year:v2",
    /**
     * Sorted ISO date strings (YYYY-MM-DD) for every count_for_stats=true
     * show. `:v2` bump: now excludes orphan stub shows (venue_id IS NULL).
     */
    showDates: () => "stats:show-dates:v2",
    /**
     * Catalog play-history blob: `{songId: [date, date, ...]}` with every
     * stats-track performance per song, dates sorted ascending. Backs the
     * gap-chart "Played Before" column — clients fetch this once per
     * session (lazy on first gap-chart open), then binary-search prior
     * counts client-side instead of paying a per-show server query.
     */
    songPlayDates: () => "stats:song-play-dates:v1",
  },
} as const;

/**
 * Simple hash function for filter objects to create consistent cache keys
 */
function hashFilters(filters: CacheFilters): string {
  const sortedKeys = Object.keys(filters).sort();
  const normalized = sortedKeys.map((key) => `${key}:${filters[key]}`).join("|");

  // Simple hash - could use a proper hash function if needed
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return Math.abs(hash).toString(36);
}
