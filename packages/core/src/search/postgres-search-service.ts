import type { Logger, SearchResult, SearchRowResult } from "@bip/domain";
import type { DbClient } from "../_shared/database/models";
import { SegueQueryParser } from "./segue-query-parser";
import type { SearchHistoryService } from "./search-history-service";

type VenueResult = {
  venue_id: string;
  venue_name: string;
  venue_slug: string;
  match_score: number;
};

type SongResult = {
  song_id: string;
  song_title: string;
  song_slug: string;
  match_score: number;
};

type ShowResult = {
  show_id: string;
  show_slug: string;
  show_date: string;
  venue_name: string | null;
  venue_city: string | null;
  venue_state: string | null;
  venue_country: string | null;
  match_score: number;
  match_details: string;
};

export interface SearchOptions {
  limit: number;
}

export interface SearchResponse {
  results: SearchResult[];
  searchHistoryId?: string;
}

export class PostgresSearchService {
  private segueQueryParser: SegueQueryParser;

  constructor(
    private readonly db: DbClient,
    private readonly logger: Logger,
    private readonly searchHistoryService?: SearchHistoryService,
  ) {
    this.segueQueryParser = new SegueQueryParser(db);
  }

  async search(query: string, options: SearchOptions = { limit: 30 }): Promise<SearchResponse> {
    this.logger.info(`Performing PostgreSQL search for: "${query}"`);

    try {
      const results = await this.performSearch(query, options);
      
      // Log the search to analytics
      const searchHistoryId = await this.logSearch(query, results);
      
      return {
        results,
        searchHistoryId,
      };
    } catch (error) {
      this.logger.error(`Search failed for query "${query}":`, error instanceof Error ? error.message : String(error));
      
      // Log the failed search
      await this.logSearch(query, []);
      
      throw error;
    }
  }

  private async performSearch(query: string, options: SearchOptions): Promise<SearchResult[]> {
    const normalizedQuery = this.normalizeQuery(query);

    try {
      // Check for segue search (contains ">")
      if (query.includes(">")) {
        return this.searchWithSegues(query, options);
      }

      // Check for full date search (complete dates only)
      if (this.looksLikeFullDate(query)) {
        return this.searchByDate(normalizedQuery, options);
      }

      // Extract date filters and remaining query
      const dateFilter = this.extractDateFilter(query);
      const searchQuery = dateFilter.remainingQuery || normalizedQuery;
      
      // If we extracted date info and have no remaining query, do a pure date search
      if ((dateFilter.year || dateFilter.month || dateFilter.day) && !dateFilter.remainingQuery.trim()) {
        return this.searchByDate(normalizedQuery, options);
      }
      
      // Try to parse combined venue+song queries intelligently
      const combinedSearch = await this.tryParseCombinedQuery(searchQuery);
      
      // Search for songs 
      const songQuery = combinedSearch.songQuery || searchQuery;
      const songResults = await this.performSongSearch(songQuery);
      const strongSongIds = songResults.filter((s) => s.match_score >= 50).map((s) => s.song_id);
      const mediumSongIds = songResults.filter((s) => s.match_score >= 30).map((s) => s.song_id);
      const weakSongIds = songResults.filter((s) => s.match_score >= 15).map((s) => s.song_id);

      // Search for venues 
      const venueQuery = combinedSearch.venueQuery || searchQuery;
      const venueResults = await this.performVenueSearch(venueQuery);
      const strongVenueIds = venueResults.filter((v) => v.match_score >= 50).map((v) => v.venue_id);
      const mediumVenueIds = venueResults.filter((v) => v.match_score >= 10).map((v) => v.venue_id);
      const weakVenueIds = venueResults.filter((v) => v.match_score >= 1).map((v) => v.venue_id);

      // Try strong matches first
      if (strongSongIds.length > 0 || strongVenueIds.length > 0) {
        const showResults = await this.performShowSearch(searchQuery, strongSongIds, strongVenueIds, options.limit, dateFilter);
        if (showResults.length > 0) {
          return this.convertShowResultsToSearchResults(showResults);
        }
      }

      // Try medium matches
      if (mediumSongIds.length > 0 || mediumVenueIds.length > 0) {
        const showResults = await this.performShowSearch(searchQuery, mediumSongIds, mediumVenueIds, options.limit, dateFilter);
        if (showResults.length > 0) {
          return this.convertShowResultsToSearchResults(showResults);
        }
      }

      // Try weak matches
      if (weakSongIds.length > 0 || weakVenueIds.length > 0) {
        const showResults = await this.performShowSearch(searchQuery, weakSongIds, weakVenueIds, options.limit, dateFilter);
        if (showResults.length > 0) {
          return this.convertShowResultsToSearchResults(showResults);
        }
      }

      // Only do general search if no songs or venues found at all
      if (songResults.length === 0 && venueResults.length === 0) {
        const generalResults = await this.performShowSearch(searchQuery, [], [], Math.min(options.limit, 10), dateFilter);
        return this.convertShowResultsToSearchResults(generalResults);
      }

      // If we found songs/venues but no shows, return empty
      return [];
    } catch (error) {
      this.logger.error(`Search failed: ${error}`);
      throw error;
    }
  }

  private async logSearch(query: string, results: SearchResult[]): Promise<string | undefined> {
    if (!this.searchHistoryService) {
      return undefined;
    }

    try {
      // Determine the search type based on the results or query patterns
      const searchType: "songs" | "venues" | "shows" | "setlists" = "shows";
      
      // For now, we'll default to 'shows' as that's what most searches return
      // This could be enhanced to detect actual search intent
      
      const searchHistory = await this.searchHistoryService.create({
        searchQuery: query.trim(),
        resultCount: results.length,
        searchType,
      });
      
      return searchHistory.id;
    } catch (error) {
      this.logger.error(`Failed to log search analytics: ${error}`);
      // Don't throw here - search logging shouldn't break the actual search
      return undefined;
    }
  }

  async updateSearchFeedback(searchHistoryId: string, sentiment: "positive" | "negative", feedbackMessage?: string): Promise<void> {
    if (!this.searchHistoryService) {
      throw new Error("Search history service not available");
    }

    try {
      await this.searchHistoryService.update(searchHistoryId, {
        sentiment,
        feedbackMessage,
      });
    } catch (error) {
      this.logger.error(`Failed to update search feedback: ${error}`);
      throw error;
    }
  }

  async searchSongs(query: string, limit: number = 50) {
    const results = await this.performSongSearch(query);
    const songIds = results.slice(0, limit).map((r) => r.song_id);

    if (songIds.length === 0) return [];

    const songs = await this.db.song.findMany({
      where: { id: { in: songIds } },
      include: { author: true },
    });

    // Sort by original search order and add authorName
    const songMap = new Map(songs.map((s) => [s.id, s]));
    return songIds
      .map((id) => songMap.get(id))
      .filter((s): s is NonNullable<typeof s> => s !== undefined)
      .map((s) => ({
        ...s,
        authorName: s.author?.name || null,
      }));
  }

  async searchVenues(query: string, limit: number = 50) {
    const results = await this.performVenueSearch(query);
    const venueIds = results.slice(0, limit).map((r) => r.venue_id);

    if (venueIds.length === 0) return [];

    const venues = await this.db.venue.findMany({
      where: { id: { in: venueIds } },
    });

    // Sort by original search order
    const venueMap = new Map(venues.map((v) => [v.id, v]));
    return venueIds
      .map((id) => venueMap.get(id))
      .filter((v): v is NonNullable<typeof v> => v !== undefined);
  }

  private async performVenueSearch(query: string): Promise<VenueResult[]> {
    return this.db.$queryRawUnsafe<VenueResult[]>(
      `
        WITH search_matches AS (
          SELECT
            v.id as venue_id,
            v.name as venue_name,
            v.slug as venue_slug,
            ts_rank(v.search_vector, plainto_tsquery('english', $1)) as fts_rank,
            similarity(v.search_text, $1) as trgm_sim,
            CASE
              WHEN LOWER(v.name) = LOWER($1) THEN 1.0
              WHEN LOWER(v.name) LIKE LOWER($1) || '%' THEN 0.9
              WHEN LOWER(v.name) LIKE '%' || LOWER($1) || '%' THEN 0.8
              WHEN LOWER(v.city) = LOWER($1) THEN 0.7
              WHEN LOWER(v.city) LIKE '%' || LOWER($1) || '%' THEN 0.6
              ELSE 0
            END as exact_score
          FROM venues v
          WHERE
            v.search_vector @@ plainto_tsquery('english', $1)
            OR similarity(v.search_text, $1) > 0.10  -- 10% threshold
            OR LOWER(v.name) LIKE '%' || LOWER($1) || '%'

            OR LOWER(v.city) LIKE '%' || LOWER($1) || '%'
        )
        SELECT
          venue_id,
          venue_name,
          venue_slug,
          GREATEST(
            exact_score * 200,  -- Double weight for exact matches
            fts_rank * 60,
            trgm_sim * 100
          )::INTEGER as match_score
        FROM search_matches
        ORDER BY match_score DESC
        LIMIT 100
      `,
      query,
    );
  }

  private async performSongSearch(query: string): Promise<SongResult[]> {
    // Inline SQL from search_songs function - easier to debug and modify
    const sql = `
      WITH search_matches AS (
        SELECT 
          s.id as song_id,
          s.title as song_title,
          s.slug as song_slug,
          ts_rank(s.search_vector, websearch_to_tsquery('english', $1)) as fts_rank,
          similarity(s.search_text, $1) as trgm_sim,
          CASE 
            WHEN LOWER(s.title) = LOWER($1) THEN 1.0
            WHEN LOWER(s.title) LIKE LOWER($1) || '%' THEN 0.9
            WHEN LOWER(s.title) LIKE '%' || LOWER($1) || '%' THEN 0.8
            ELSE 0
          END as exact_score,
          s.times_played
        FROM songs s
        WHERE 
          -- Use websearch_to_tsquery for better multi-word handling
          s.search_vector @@ websearch_to_tsquery('english', $1)
          -- Lower similarity threshold for multi-word matches
          OR similarity(s.search_text, $1) > 0.15
          -- Also check if all words appear in the title
          OR LOWER(s.title) LIKE '%' || REPLACE(LOWER($1), ' ', '%') || '%'
      )
      SELECT 
        song_id,
        song_title::TEXT,
        song_slug::TEXT,
        GREATEST(
          exact_score * 100,
          fts_rank * 60,
          trgm_sim * 100
        )::INTEGER as match_score
      FROM search_matches
      ORDER BY match_score DESC, times_played DESC
      LIMIT 10
    `;

    this.logger.debug(`Song search SQL for query "${query}"`);
    return this.db.$queryRawUnsafe<SongResult[]>(sql, query);
  }

  private async performShowSearch(
    query: string,
    songIds: string[],
    venueIds: string[],
    limit: number,
    dateFilter?: { year?: number; month?: number; day?: number }
  ): Promise<ShowResult[]> {
    this.logger.info(`Show search: ${songIds.length} songs, ${venueIds.length} venues from query: "${query}"`);

    // If we only have venues (no songs), do a simple venue-based show search
    if (venueIds.length > 0 && songIds.length === 0) {
      // Pure venue search - just return shows at those venues
      return this.db.$queryRawUnsafe<ShowResult[]>(
        `
        SELECT 
          s.id as show_id,
          s.slug as show_slug,
          s.date::TEXT as show_date,
          v.name as venue_name,
          v.city as venue_city,
          v.state as venue_state,
          v.country as venue_country,
          100 as match_score,
          json_build_object(
            'type', 'venueMatch',
            'venue', v.name,
            'city', v.city,
            'state', v.state
          )::text as match_details
        FROM shows s
        JOIN venues v ON s.venue_id = v.id
        WHERE s.venue_id = ANY($1::UUID[])
        ORDER BY s.date DESC
        LIMIT $2
      `,
        venueIds,
        limit,
      );
    }

    // Inline the complex show search SQL for better debugging and flexibility
    const sql = this.buildShowSearchSQL(query, songIds, venueIds, limit, dateFilter);

    this.logger.debug(`Show search SQL - songs: ${songIds.length}, venues: ${venueIds.length}, date filter: ${JSON.stringify(dateFilter)}`);

    return this.db.$queryRawUnsafe<ShowResult[]>(sql);
  }

  private async searchByDate(query: string, options: SearchOptions): Promise<SearchResult[]> {
    const { limit = 20 } = options;

    const sql = `
      WITH enriched_results AS (
        SELECT 
          'show' as entity_type,
          s.id as entity_id,
          s.slug as entity_slug,
          100 as score,
          s.date,
          s.slug as show_slug,
          v.name as venue_name,
          v.city as venue_city,
          v.state as venue_state,
          v.country as venue_country
        FROM shows s
        LEFT JOIN venues v ON s.venue_id = v.id
        WHERE search_date_match(s.date, $1)
      )
      SELECT 
        entity_type,
        entity_id,
        entity_slug,
        score,
        TO_CHAR(date::DATE, 'MM/DD/YYYY') as date_str,
        venue_name,
        CASE 
          WHEN venue_city IS NOT NULL AND venue_state IS NOT NULL THEN venue_city || ', ' || venue_state
          WHEN venue_country IS NOT NULL THEN venue_country
          ELSE NULL
        END as venue_location,
        NULL::TEXT as song_title,
        NULL::TEXT as track_annotation,
        NULL::TEXT as set_info,
        NULL::INTEGER as track_position,
        NULL::TEXT as prev_song_title,
        NULL::TEXT as next_song_title,
        NULL::TEXT as track_segue,
        show_slug
      FROM enriched_results
      ORDER BY date DESC
      LIMIT $2
    `;

    const results = await this.db.$queryRawUnsafe<
      Array<{
        entity_type: "show" | "track";
        entity_id: string;
        entity_slug: string;
        score: number;
        date_str: string;
        venue_name: string | null;
        venue_location: string | null;
        song_title: string | null;
        track_annotation: string | null;
        set_info: string | null;
        track_position: number | null;
        prev_song_title: string | null;
        next_song_title: string | null;
        track_segue: string | null;
        show_slug: string;
      }>
    >(sql, query, limit);

    return results.map((r) => this.formatResult(r as SearchRowResult));
  }


  private formatResult(row: SearchRowResult): SearchResult {
    const baseResult: SearchResult = {
      id: row.entity_id,
      entityType: row.entity_type,
      entityId: row.entity_id,
      entitySlug: row.entity_slug,
      displayText: "", // We'll build this
      score: Math.min(100, Math.round(row.score)),
      url: `/shows/${row.show_slug || row.entity_slug}`,
      date: row.date_str,
      venueName: row.venue_name ?? undefined,
      venueLocation: row.venue_location ?? undefined,
      songTitle: row.song_title,
      annotation: row.track_annotation,
      setInfo: row.set_info,
      trackPosition: row.track_position?.toString(),
      prevSong: row.prev_song_title,
      nextSong: row.next_song_title,
      segueType: row.track_segue,
    };

    // Build display text based on entity type
    if (row.entity_type === "show") {
      baseResult.displayText = `${row.date_str} • ${row.venue_name || "Unknown Venue"}${row.venue_location ? ` • ${row.venue_location}` : ""}`;
    } else if (row.entity_type === "track") {
      // Format: Date • Venue • City, State
      // Song before (segue), Song Name, Song after (segue) (annotation, set info)
      let trackDisplay = `${row.date_str} • ${row.venue_name || "Unknown Venue"}`;
      if (row.venue_location) {
        trackDisplay += ` • ${row.venue_location}`;
      }

      // Add song context
      let songContext = "";
      if (row.prev_song_title) {
        songContext += row.prev_song_title + (row.track_segue === ">" ? " > " : ", ");
      }
      songContext += `**${row.song_title}**`;
      if (row.next_song_title && row.track_segue) {
        songContext += (row.track_segue === ">" ? " > " : ", ") + row.next_song_title;
      }

      // Add annotation and set info
      let extraInfo = "";
      if (row.track_annotation) {
        extraInfo += row.track_annotation;
      }
      if (row.set_info) {
        extraInfo += (extraInfo ? ", " : "") + row.set_info;
      }
      if (extraInfo) {
        songContext += ` (${extraInfo})`;
      }

      baseResult.displayText = `${trackDisplay}\n${songContext}`;
    }

    return baseResult;
  }

  private normalizeQuery(query: string): string {
    return query.trim().toLowerCase();
  }

  private buildShowSearchSQL(
    searchTerm: string,
    songIds: string[], 
    venueIds: string[], 
    limit: number,
    dateFilter?: { year?: number; month?: number; day?: number }
  ): string {
    // Properly escape and format arrays for SQL
    const searchTermSQL = `'${searchTerm.replace(/'/g, "''")}'`;
    const songIdsSQL = songIds.length > 0 
      ? `ARRAY[${songIds.map(id => `'${id}'::UUID`).join(',')}]`
      : 'NULL::UUID[]';
    const venueIdsSQL = venueIds.length > 0
      ? `ARRAY[${venueIds.map(id => `'${id}'::UUID`).join(',')}]`
      : 'NULL::UUID[]';
    
    // Build date filter condition
    let dateCondition = '';
    if (dateFilter) {
      const conditions: string[] = [];
      if (dateFilter.year) {
        conditions.push(`EXTRACT(YEAR FROM s.date::timestamp) = ${dateFilter.year}`);
      }
      if (dateFilter.month) {
        conditions.push(`EXTRACT(MONTH FROM s.date::timestamp) = ${dateFilter.month}`);
      }
      if (dateFilter.day) {
        conditions.push(`EXTRACT(DAY FROM s.date::timestamp) = ${dateFilter.day}`);
      }
      if (conditions.length > 0) {
        dateCondition = ` AND ${conditions.join(' AND ')}`;
      }
    }

    return `
      WITH filtered_shows AS (
        SELECT s.id, s.slug, s.date, s.venue_id
        FROM shows s
        WHERE (${venueIdsSQL} IS NULL OR s.venue_id = ANY(${venueIdsSQL}))${dateCondition}
      ),
      filtered_tracks AS (
        SELECT 
          t.show_id,
          t.id as track_id,
          t.position,
          t.set,
          t.note,
          s.title as song_title,
          s.id as song_id,
          LOWER(s.title) as song_lower,
          t.next_track_id,
          LAG(s2.title) OVER (PARTITION BY t.show_id ORDER BY t.position) as prev_song,
          LEAD(s3.title) OVER (PARTITION BY t.show_id ORDER BY t.position) as next_song
        FROM tracks t
        JOIN songs s ON t.song_id = s.id
        JOIN filtered_shows fs ON t.show_id = fs.id
        LEFT JOIN tracks t2 ON t2.next_track_id = t.id
        LEFT JOIN songs s2 ON t2.song_id = s2.id
        LEFT JOIN tracks t3 ON t.next_track_id = t3.id
        LEFT JOIN songs s3 ON t3.song_id = s3.id
        WHERE ${songIdsSQL} IS NULL OR t.song_id = ANY(${songIdsSQL})
      ),
      matched_tracks AS (
        SELECT 
          ft.*,
          CASE 
            WHEN ${songIdsSQL} IS NOT NULL THEN 100
            WHEN ft.song_lower LIKE '%' || LOWER(${searchTermSQL}) || '%' THEN 70
            ELSE 30
          END as song_match_score,
          CASE WHEN ${songIdsSQL} IS NOT NULL THEN true ELSE false END as is_exact_match
        FROM filtered_tracks ft
        WHERE 
          ${songIdsSQL} IS NOT NULL
          OR
          (${songIdsSQL} IS NULL AND ft.song_lower LIKE '%' || LOWER(${searchTermSQL}) || '%')
      ),
      show_matches AS (
        SELECT 
          mt.show_id AS match_show_id,
          GREATEST(50, MAX(mt.song_match_score)) + 
          CASE 
            WHEN ${venueIdsSQL} IS NOT NULL THEN 50
            ELSE 0
          END as final_score,
          json_build_object(
            'type', 'trackMatches',
            'tracks', json_agg(
              json_build_object(
                'song', mt.song_title,
                'position', mt.position,
                'set', mt.set,
                'note', mt.note,
                'prevSong', mt.prev_song,
                'nextSong', mt.next_song,
                'isExactMatch', mt.is_exact_match,
                'isOpener', CASE WHEN mt.position = 1 THEN true ELSE false END,
                'isCloser', CASE WHEN mt.next_track_id IS NULL THEN true ELSE false END
              ) ORDER BY mt.position
            )
          )::text as match_details
        FROM matched_tracks mt
        GROUP BY mt.show_id
      )
      SELECT 
        sm.match_show_id as show_id,
        sh.slug::TEXT as show_slug,
        sh.date::TEXT as show_date,
        v.name::TEXT as venue_name,
        v.city::TEXT as venue_city,
        v.state::TEXT as venue_state,
        v.country::TEXT as venue_country,
        sm.final_score::INTEGER as match_score,
        sm.match_details::TEXT as match_details
      FROM show_matches sm
      JOIN shows sh ON sm.match_show_id = sh.id
      LEFT JOIN venues v ON sh.venue_id = v.id
      ORDER BY sm.final_score DESC, sh.date DESC
      LIMIT ${limit}
    `;
  }

  private async searchWithSegues(query: string, options: SearchOptions): Promise<SearchResult[]> {
    this.logger.info(`Performing segue search for: "${query}"`);

    // Parse the query to extract venue and segue sequence
    const parsed = await this.segueQueryParser.parse(query);
    
    if (parsed.segueSequence.length < 2) {
      // Not a valid segue search, fall back to regular search
      const showResults = await this.performShowSearch(this.normalizeQuery(query), [], [], options.limit);
      return this.convertShowResultsToSearchResults(showResults);
    }

    // Find matching segue runs with their IDs
    const matchingRuns = await this.segueQueryParser.findMatchingSegueRuns(parsed.segueSequence);
    
    if (matchingRuns.length === 0) {
      return [];
    }

    // Apply venue filter if present
    let filteredRuns = matchingRuns;
    if (parsed.venues.length > 0) {
      const showIds = matchingRuns.map(r => r.showId);
      const showsAtVenues = await this.db.show.findMany({
        where: {
          id: { in: showIds },
          venueId: { in: parsed.venues }
        },
        select: { id: true }
      });
      const validShowIds = new Set(showsAtVenues.map(s => s.id));
      filteredRuns = matchingRuns.filter(r => validShowIds.has(r.showId));
    }

    // Get the segue run IDs
    const segueRunIds = filteredRuns.map(r => r.segueRunId);

    // Get the original query for venue matching
    const queryWords = query.toLowerCase().split(/\s+/);
    const nonSegueWords = queryWords.filter(w => w !== '>' && !w.includes('>'));
    const allNonSegueText = nonSegueWords.join(' ');
    
    // Get show details with the SPECIFIC segue run info and proper scoring
    const results = await this.db.$queryRaw<ShowResult[]>`
      SELECT 
        sh.id as show_id,
        sh.slug as show_slug,
        sh.date as show_date,
        v.name as venue_name,
        v.city as venue_city,
        v.state as venue_state,
        v.country as venue_country,
        CASE
          -- If venue was explicitly filtered, give higher score
          WHEN ${parsed.venues.length > 0} THEN 100
          -- Otherwise calculate score based on venue/location match against ALL non-segue words
          ELSE 
            70 + -- Base score for segue match
            CASE 
              WHEN v.name IS NOT NULL AND LOWER(v.name) LIKE '%' || LOWER(${allNonSegueText}) || '%' THEN 30
              WHEN v.city IS NOT NULL AND LOWER(v.city) LIKE '%' || LOWER(${allNonSegueText}) || '%' THEN 30
              WHEN v.state IS NOT NULL AND LOWER(v.state) LIKE '%' || LOWER(${allNonSegueText}) || '%' THEN 25
              ELSE 0
            END
        END as match_score,
        json_build_object(
          'type', 'segueMatch',
          'segueRun', json_build_object(
            'sequence', sr.sequence,
            'set', sr.set,
            'length', sr.length
          )
        )::text as match_details
      FROM segue_runs sr
      JOIN shows sh ON sr.show_id = sh.id
      LEFT JOIN venues v ON sh.venue_id = v.id
      WHERE sr.id = ANY(${segueRunIds}::uuid[])
      ORDER BY match_score DESC, sh.date DESC
      LIMIT ${options.limit}
    `;

    return this.convertShowResultsToSearchResults(results);
  }

  private looksLikeFullDate(query: string): boolean {
    const fullDatePatterns = [
      /^\d{1,2}[/\-.]\d{1,2}[/\-.]\d{2,4}$/, // 12/30/99, 12-30-1999
      /^\d{4}[/\-.]\d{1,2}[/\-.]\d{1,2}$/, // 1999-12-30
      /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+\d{1,2},?\s+\d{2,4}$/i, // December 30, 1999
      /^\d{1,2}\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+\d{2,4}$/i, // 30 Dec 1999
    ];

    return fullDatePatterns.some((pattern) => pattern.test(query.trim()));
  }

  private extractDateFilter(query: string): { year?: number; month?: number; day?: number; remainingQuery: string } {
    const words = query.toLowerCase().split(/\s+/);
    let year: number | undefined;
    let month: number | undefined;
    let day: number | undefined;
    const remainingWords: string[] = [];

    for (const word of words) {
      // Check for MM/DD format (e.g., "12/30", "1/15")
      if (/^\d{1,2}\/\d{1,2}$/.test(word)) {
        const [monthStr, dayStr] = word.split('/');
        const parsedMonth = parseInt(monthStr);
        const parsedDay = parseInt(dayStr);
        
        // Validate month (1-12) and day (1-31)
        if (parsedMonth >= 1 && parsedMonth <= 12 && parsedDay >= 1 && parsedDay <= 31) {
          month = parsedMonth;
          day = parsedDay;
        } else {
          remainingWords.push(word);
        }
      }
      // Check for 4-digit year
      else if (/^(19|20)\d{2}$/.test(word)) {
        year = parseInt(word);
      }
      // Check for month names
      else if (/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i.test(word)) {
        const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun',
                           'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        month = monthNames.findIndex(m => word.startsWith(m)) + 1;
      }
      // Check for day (1-31)
      else if (/^\d{1,2}$/.test(word) && parseInt(word) >= 1 && parseInt(word) <= 31) {
        day = parseInt(word);
      }
      else {
        remainingWords.push(word);
      }
    }

    return {
      year,
      month,
      day,
      remainingQuery: remainingWords.join(' ')
    };
  }

  private async tryParseCombinedQuery(query: string): Promise<{ venueQuery?: string; songQuery?: string }> {
    // For multi-word queries, try to identify if we can split them intelligently
    const words = query.toLowerCase().split(/\s+/);
    if (words.length < 2) {
      return {}; // Single word queries don't need parsing
    }

    // First check if the entire query matches an exact song title - if so, don't split
    const exactSongMatch = await this.db.$queryRawUnsafe<Array<{ id: string; title: string }>>(
      `SELECT id, title FROM songs WHERE LOWER(title) = LOWER($1) LIMIT 1`,
      query
    );

    if (exactSongMatch.length > 0) {
      // This is an exact song match, don't split it
      return {};
    }

    // Try different combinations to see if we can identify venue and song parts
    const potentialSplits: Array<{ venueWords: string[]; songWords: string[]; confidence: number }> = [];
    
    // Try splitting at each word boundary
    for (let i = 1; i < words.length; i++) {
      const venueWords = words.slice(0, i);
      const songWords = words.slice(i);
      
      const venueQuery = venueWords.join(' ');
      const songQuery = songWords.join(' ');

      // Quick check: does the venue part match known venues?
      const venueMatches = await this.db.$queryRawUnsafe<Array<{ id: string; name: string; city: string | null; state: string | null }>>(
        `SELECT id, name, city, state FROM venues WHERE LOWER(name) LIKE '%' || LOWER($1) || '%' OR LOWER(city) LIKE '%' || LOWER($1) || '%' OR LOWER(state) LIKE '%' || LOWER($1) || '%' LIMIT 5`,
        venueQuery
      );

      // Quick check: does the song part match known songs?
      const songMatches = await this.db.$queryRawUnsafe<Array<{ id: string; title: string }>>(
        `SELECT id, title FROM songs WHERE LOWER(title) LIKE '%' || LOWER($1) || '%' LIMIT 5`,
        songQuery
      );

      // Calculate confidence based on match quality
      let confidence = 0;
      if (venueMatches.length > 0 && songMatches.length > 0) {
        // Prefer splits where venue part is a substantial portion and has good matches
        const hasExactVenueMatch = venueMatches.some(v => v.name.toLowerCase().includes(venueQuery));
        const hasExactSongMatch = songMatches.some(s => s.title.toLowerCase().includes(songQuery));
        const hasVenueCityMatch = venueMatches.some(v => 
          (v.city?.toLowerCase().includes(venueQuery)) ||
          (v.state?.toLowerCase().includes(venueQuery))
        );
        
        // Base confidence from matches
        confidence = (hasExactVenueMatch ? 50 : (hasVenueCityMatch ? 40 : 20)) + (hasExactSongMatch ? 50 : 25);
        
        // Penalize splits where venue part is too short (likely not a real venue)
        if (venueWords.length === 1 && venueWords[0].length < 5) {
          confidence -= 30;
        }
        
        // Bonus for venue matches with city matches (indicates likely venue+song split)
        if (hasVenueCityMatch && venueWords.length >= 2) {
          confidence += 15;
        }
        
        potentialSplits.push({ venueWords, songWords, confidence });
      }
    }

    // Use the split with highest confidence, but only if confidence > 60
    const bestSplit = potentialSplits.sort((a, b) => b.confidence - a.confidence)[0];
    if (bestSplit) {
      this.logger.debug(`Best split for "${query}": venue="${bestSplit.venueWords.join(' ')}" song="${bestSplit.songWords.join(' ')}" confidence=${bestSplit.confidence}`);
    }
    if (bestSplit && bestSplit.confidence > 60) {
      const venueQuery = bestSplit.venueWords.join(' ');
      const songQuery = bestSplit.songWords.join(' ');
      this.logger.debug(`Split query "${query}" into venue: "${venueQuery}" and song: "${songQuery}" (confidence: ${bestSplit.confidence})`);
      return { venueQuery, songQuery };
    }

    // If no high-confidence split found, return empty (will use original query for both)
    return {};
  }

  private convertShowResultsToSearchResults(showResults: ShowResult[]): SearchResult[] {
    return showResults.map(show => ({
      id: show.show_id,
      entityType: 'show' as const,
      entityId: show.show_id,
      entitySlug: show.show_slug,
      displayText: `${show.show_date} • ${show.venue_name || 'Unknown Venue'}${show.venue_city ? ` • ${show.venue_city}` : ''}${show.venue_state ? `, ${show.venue_state}` : ''}`,
      score: Math.min(100, Math.round(show.match_score)),
      url: `/shows/${show.show_slug}`,
      date: show.show_date,
      venueName: show.venue_name || undefined,
      venueLocation: show.venue_city && show.venue_state ? `${show.venue_city}, ${show.venue_state}` : show.venue_city || show.venue_state || undefined,
      metadata: show.match_details ? { matchDetails: show.match_details } : undefined,
    }));
  }

  async rebuildSearchData(): Promise<void> {
    this.logger.info("Rebuilding all search data...");

    try {
      await this.db.$executeRawUnsafe(`SELECT rebuild_all_search_data()`);
      this.logger.info("Search data rebuild complete");
    } catch (error) {
      this.logger.error(`Failed to rebuild search data: ${error}`);
      throw error;
    }
  }

  async rebuildSearchForDateRange(startDate: string, endDate: string): Promise<void> {
    this.logger.info(`Rebuilding search data for ${startDate} to ${endDate}...`);

    try {
      await this.db.$executeRawUnsafe(`SELECT rebuild_search_for_date_range($1, $2)`, startDate, endDate);
      this.logger.info(`Search data rebuild complete for date range`);
    } catch (error) {
      this.logger.error(`Failed to rebuild search data for date range: ${error}`);
      throw error;
    }
  }
}
