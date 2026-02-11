import type { PrismaClient } from "@prisma/client";

export interface ParsedSegueQuery {
  venues: string[];      // Venue IDs that matched
  songs: string[];       // Individual song IDs (not in segue)
  segueSequence: string[]; // Ordered song IDs for segue search
  rawSegments: string[]; // Original text segments
}

interface EntityMatch {
  id: string;
  name: string;
  score: number;
  type: "song" | "venue";
}

export class SegueQueryParser {
  constructor(
    private readonly db: PrismaClient,
  ) {}

  /**
   * Parse a search query that may contain segue sequences and/or venue names
   * Example: "new york little shimmy > basis" or "shimmy > basis state college"
   */
  async parse(query: string): Promise<ParsedSegueQuery> {
    // Stage 1: Structural parsing - detect segue operator
    const hasSegue = query.includes(">");
    
    if (!hasSegue) {
      // No segue - just do regular entity resolution
      return this.parseSimpleQuery(query);
    }

    // Split on > to get segments
    const segments = query.split(">").map(s => s.trim()).filter(s => s.length > 0);
    
    if (segments.length < 2) {
      // Not a valid segue query
      return this.parseSimpleQuery(query);
    }

    // Stage 2: Entity classification - each segment could be venue or song
    const segmentMatches = await Promise.all(
      segments.map(segment => this.findEntityMatches(segment))
    );

    // Stage 2.5: Also search the entire query for venue matches
    const allQueryMatches = await this.findEntityMatches(query.replace(/>/g, ' '));

    // Stage 3: Disambiguation through scoring
    const bestParse = this.selectBestParse(segments, segmentMatches, allQueryMatches);

    // Stage 4: Return structured result
    return bestParse;
  }

  /**
   * Parse a simple query without segue operators
   */
  private async parseSimpleQuery(query: string): Promise<ParsedSegueQuery> {
    const matches = await this.findEntityMatches(query);
    
    const venues = matches
      .filter(m => m.type === "venue")
      .sort((a, b) => b.score - a.score)
      .slice(0, 1)
      .map(m => m.id);
    
    const songs = matches
      .filter(m => m.type === "song")
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(m => m.id);

    return {
      venues,
      songs,
      segueSequence: [],
      rawSegments: [query]
    };
  }

  /**
   * Find all possible entity matches for a text segment
   */
  private async findEntityMatches(text: string): Promise<EntityMatch[]> {
    const normalizedText = text.toLowerCase();
    const matches: EntityMatch[] = [];

    // Search for matching songs
    const songs = await this.db.$queryRaw<Array<{
      id: string;
      title: string;
      score: number;
    }>>`
      SELECT 
        id,
        title,
        similarity(LOWER(title), ${normalizedText}) * 100 as score
      FROM songs
      WHERE similarity(LOWER(title), ${normalizedText}) > 0.1
      ORDER BY score DESC
      LIMIT 5
    `;

    matches.push(...songs.map(s => ({
      id: s.id,
      name: s.title,
      score: s.score,
      type: "song" as const
    })));

    // Search for matching venues
    const venues = await this.db.$queryRaw<Array<{
      id: string;
      name: string;
      city: string;
      score: number;
    }>>`
      SELECT 
        id,
        name,
        city,
        GREATEST(
          similarity(LOWER(name), ${normalizedText}),
          similarity(LOWER(city), ${normalizedText}),
          similarity(LOWER(CONCAT(city, ' ', name)), ${normalizedText})
        ) * 100 as score
      FROM venues
      WHERE 
        similarity(LOWER(name), ${normalizedText}) > 0.1
        OR similarity(LOWER(city), ${normalizedText}) > 0.1
        OR similarity(LOWER(CONCAT(city, ' ', name)), ${normalizedText}) > 0.1
      ORDER BY score DESC
      LIMIT 5
    `;

    matches.push(...venues.map(v => ({
      id: v.id,
      name: `${v.city} - ${v.name}`,
      score: v.score,
      type: "venue" as const
    })));

    return matches;
  }

  /**
   * Select the best interpretation of the segmented query
   * This is where we handle "new york little shimmy > basis" and "shimmy > basis state college"
   */
  private selectBestParse(
    segments: string[],
    segmentMatches: EntityMatch[][],
    allQueryMatches?: EntityMatch[]
  ): ParsedSegueQuery {
    let venues: string[] = [];

    // First, check for venues across the entire query (handles "shimmy > basis state college")
    if (allQueryMatches) {
      const globalVenues = allQueryMatches
        .filter(m => m.type === "venue" && m.score > 30)
        .sort((a, b) => b.score - a.score);
      
      if (globalVenues.length > 0) {
        venues = globalVenues.map(v => v.id);
      }
    }

    // If no global venue found, check the first segment for venue + song combo
    if (venues.length === 0) {
      const firstSegmentText = segments[0];
      const firstMatches = segmentMatches[0];
      
      // Check if first segment has a high-scoring venue match
      const topVenue = firstMatches.find(m => m.type === "venue" && m.score > 60);
      
      if (topVenue && segments.length > 1) {
        // We might have "venue song > song" pattern
        // Try to parse the first segment as venue + song
        const venueAndSong = this.tryParseVenueAndSong(firstSegmentText, firstMatches);
        
        if (venueAndSong) {
          venues = [venueAndSong.venueId];
          // Replace first segment matches with just the song
          segmentMatches[0] = [venueAndSong.song];
        }
      }
    }

    // Build segue sequence from all segments
    const segueSequence: string[] = [];
    
    for (let i = 0; i < segments.length; i++) {
      const matches = segmentMatches[i];
      // Pick the best song match for each segment
      const bestSong = matches
        .filter(m => m.type === "song")
        .sort((a, b) => b.score - a.score)[0];
      
      if (bestSong) {
        segueSequence.push(bestSong.id);
      }
    }

    return {
      venues,
      songs: [],
      segueSequence,
      rawSegments: segments
    };
  }

  /**
   * Try to parse a segment as venue + song combination
   * Example: "new york little shimmy" -> venue: "New York", song: "Little Shimmy in a Conga Line"
   */
  private tryParseVenueAndSong(
    text: string,
    matches: EntityMatch[]
  ): { venueId: string; song: EntityMatch } | null {
    const topVenue = matches.find(m => m.type === "venue" && m.score > 60);
    const topSong = matches.find(m => m.type === "song" && m.score > 50);
    
    if (!topVenue || !topSong) {
      return null;
    }

    // Check if the text contains both venue and song keywords
    // This is a heuristic - we could make it smarter
    const words = text.toLowerCase().split(/\s+/);
    const venueWords = topVenue.name.toLowerCase().split(/\s+/);
    const songWords = topSong.name.toLowerCase().split(/\s+/);
    
    let hasVenueMatch = false;
    let hasSongMatch = false;
    
    for (const word of words) {
      if (venueWords.some(vw => vw.includes(word) || word.includes(vw))) {
        hasVenueMatch = true;
      }
      if (songWords.some(sw => sw.includes(word) || word.includes(sw))) {
        hasSongMatch = true;
      }
    }
    
    if (hasVenueMatch && hasSongMatch) {
      return {
        venueId: topVenue.id,
        song: topSong
      };
    }
    
    return null;
  }

  /**
   * Search for segue runs that match a song sequence
   * Returns an array of objects with show_id and segue_run_id
   */
  async findMatchingSegueRuns(songIds: string[]): Promise<Array<{ showId: string; segueRunId: string }>> {
    if (songIds.length < 2) {
      return [];
    }

    // Build the sequence string to search for
    const songNames = await this.db.song.findMany({
      where: { id: { in: songIds } },
      select: { id: true, title: true }
    });

    const songMap = new Map(songNames.map(s => [s.id, s.title]));
    const sequencePattern = songIds
      .map(id => songMap.get(id))
      .filter(Boolean)
      .join(" > ");

    const runs = await this.db.$queryRaw<Array<{ show_id: string; segue_run_id: string }>>`
      SELECT show_id, id as segue_run_id
      FROM segue_runs
      WHERE LOWER(sequence) LIKE '%' || LOWER(${sequencePattern}) || '%'
      LIMIT 100
    `;

    return runs.map(r => ({ showId: r.show_id, segueRunId: r.segue_run_id }));
  }
}