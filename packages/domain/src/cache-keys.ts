/**
 * Centralized cache key generation for consistent caching across the application
 */

export const CacheKeys = {
  /**
   * Show-related cache keys
   */
  show: {
    /** Complete show + setlist data for show page */
    data: (slug: string) => `show:${slug}:data`,

    // Note: Reviews are loaded fresh from DB, not cached

    /** All cache keys for a show (for pattern deletion) */
    all: (slug: string) => `show:${slug}:*`,
  },

  /**
   * Show listing cache keys
   */
  shows: {
    /** Paginated show listings with filters */
    list: (filters: Record<string, any>) => {
      const filterHash = hashFilters(filters);
      return `shows:list:${filterHash}`;
    },

    /** All show listing caches (for pattern deletion) */
    allLists: () => `shows:list:*`,
  },

  /**
   * Setlist cache keys
   */
  setlist: {
    /** Complete setlist data with tracks and annotations */
    data: (slug: string) => `setlist:${slug}:data`,
  },

  /**
   * Archive.org recording cache keys
   */
  archive: {
    recordings: (showDate: string) => `archive-recordings-${showDate}`,
  },

  /**
   * Home page cache keys
   */
  home: {
    /** Recent setlists for home page (limit + sort direction) */
    recentSetlists: (limit: number) => `home:recent-setlists:${limit}`,
  },
} as const;

/**
 * Simple hash function for filter objects to create consistent cache keys
 */
function hashFilters(filters: Record<string, any>): string {
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
