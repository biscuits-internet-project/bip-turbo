import type { Annotation, SongPagePerformance, SongPageView } from "@bip/domain";
import type { DbClient } from "../_shared/database/models";
import type { SongRepository } from "../songs/song-repository";

export class SongPageComposer {
  constructor(
    private db: DbClient,
    private songRepository: SongRepository,
  ) {}

  async build(songSlug: string): Promise<SongPageView> {
    const song = await this.songRepository.findBySlug(songSlug);

    if (!song) throw new Error("Song not found");

    // Calculate shows since last played and get last venue
    let showsSinceLastPlayed: number | null = null;
    if (song.dateLastPlayed) {
      const showsAfterLastPlayed = await this.db.$queryRaw<[{ count: string }]>`
        SELECT COUNT(*)::text as count
        FROM shows
        WHERE date::date > ${song.dateLastPlayed}::date
      `;
      showsSinceLastPlayed = parseInt(showsAfterLastPlayed[0].count);
    }

    // Get actual last performance date, venue, and show slug
    let actualLastPlayedDate: Date | null = null;
    let lastVenue: { name: string; city?: string; state?: string } | null = null;
    let lastShowSlug: string | null = null;
    const lastPerformance = await this.db.$queryRaw<
      [
        {
          show_date: string | null;
          show_slug: string | null;
          venue_name: string | null;
          venue_city: string | null;
          venue_state: string | null;
        },
      ]
    >`
      SELECT shows.date as show_date, shows.slug as show_slug, venues.name as venue_name, venues.city as venue_city, venues.state as venue_state
      FROM tracks
      JOIN shows ON tracks.show_id = shows.id
      LEFT JOIN venues ON shows.venue_id = venues.id
      WHERE tracks.song_id = ${song.id}::uuid
      ORDER BY shows.date DESC
      LIMIT 1
    `;

    if (lastPerformance[0]) {
      if (lastPerformance[0].show_date) {
        actualLastPlayedDate = new Date(lastPerformance[0].show_date);
      }
      if (lastPerformance[0].show_slug) {
        lastShowSlug = lastPerformance[0].show_slug;
      }
      if (lastPerformance[0].venue_name) {
        lastVenue = {
          name: lastPerformance[0].venue_name,
          city: lastPerformance[0].venue_city || undefined,
          state: lastPerformance[0].venue_state || undefined,
        };
      }
    }

    // Get first performance venue and show slug
    let firstVenue: { name: string; city?: string; state?: string } | null = null;
    let firstShowSlug: string | null = null;
    const firstPerformance = await this.db.$queryRaw<
      [{ show_slug: string | null; venue_name: string | null; venue_city: string | null; venue_state: string | null }]
    >`
      SELECT shows.slug as show_slug, venues.name as venue_name, venues.city as venue_city, venues.state as venue_state
      FROM tracks
      JOIN shows ON tracks.show_id = shows.id
      LEFT JOIN venues ON shows.venue_id = venues.id
      WHERE tracks.song_id = ${song.id}::uuid
      ORDER BY shows.date ASC
      LIMIT 1
    `;

    if (firstPerformance[0]) {
      if (firstPerformance[0].show_slug) {
        firstShowSlug = firstPerformance[0].show_slug;
      }
      if (firstPerformance[0].venue_name) {
        firstVenue = {
          name: firstPerformance[0].venue_name,
          city: firstPerformance[0].venue_city || undefined,
          state: firstPerformance[0].venue_state || undefined,
        };
      }
    }

    // Recalculate shows since last played using the actual date
    if (actualLastPlayedDate) {
      const showsAfterLastPlayed = await this.db.$queryRaw<[{ count: string }]>`
        SELECT COUNT(*)::text as count
        FROM shows
        WHERE date::date > ${actualLastPlayedDate}::date
      `;
      showsSinceLastPlayed = parseInt(showsAfterLastPlayed[0].count);
    }

    const result = await this.db.$queryRaw<PerformanceDto[]>`
      SELECT
        shows.id,
        shows.date,
        shows.venue_id,
        shows.slug,
        venues.id as venue_id,
        venues.name as venue_name,
        venues.city as venue_city,
        venues.state as venue_state,
        venues.country as venue_country,
        venues.slug as venue_slug,
        tracks.id as track_id,
        tracks.song_id,
        tracks.segue,
        tracks.set,
        tracks.position,
        tracks.all_timer,
        tracks.average_rating,
        tracks.ratings_count,
        tracks.note,
        nextTracks.segue as next_track_segue,
        prevTracks.segue as prev_track_segue,
        nextSongs.id as next_song_id,
        nextSongs.title as next_song_title,
        nextSongs.slug as next_song_slug,
        prevSongs.id as prev_song_id,
        prevSongs.title as prev_song_title,
        prevSongs.slug as prev_song_slug
      FROM tracks
      JOIN shows on tracks.show_id = shows.id
      LEFT JOIN venues ON shows.venue_id = venues.id
      LEFT JOIN tracks nextTracks ON tracks.show_id = nextTracks.show_id
        and nextTracks.position = tracks.position + 1
        and nextTracks.set = tracks.set
      LEFT JOIN songs nextSongs ON nextTracks.song_id = nextSongs.id
      LEFT JOIN tracks prevTracks ON tracks.show_id = prevTracks.show_id
        and prevTracks.position = tracks.position - 1
        and prevTracks.set = tracks.set
      LEFT JOIN songs prevSongs ON prevTracks.song_id = prevSongs.id
      WHERE tracks.song_id = ${song.id}::uuid
      ORDER BY shows.date DESC, tracks.set, tracks.position
    `;

    const performances = result.map((row: PerformanceDto) => this.transformToSongPagePerformanceView(row));

    // Bulk fetch annotations for all tracks
    const trackIds = performances.map((p) => p.trackId);
    const annotations = await this.db.annotation.findMany({
      where: {
        trackId: {
          in: trackIds,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Group annotations by trackId
    const annotationsByTrackId = new Map<string, Annotation[]>();
    for (const annotation of annotations) {
      const trackAnnotations = annotationsByTrackId.get(annotation.trackId) || [];
      trackAnnotations.push(annotation);
      annotationsByTrackId.set(annotation.trackId, trackAnnotations);
    }

    // Map annotations to performances
    performances.forEach((perf) => {
      perf.annotations = annotationsByTrackId.get(perf.trackId) || [];
    });

    // Compute tags for each performance
    await this.computePerformanceTags(performances);

    return {
      song: {
        ...song,
        actualLastPlayedDate,
        showsSinceLastPlayed,
        lastVenue,
        lastShowSlug,
        firstVenue,
        firstShowSlug,
      },
      performances,
    };
  }

  private async computePerformanceTags(performances: SongPagePerformance[]): Promise<void> {
    // For set opener/closer computation, we need to know the min/max positions for each set in each show
    const setPositionData = new Map<string, { min: number; max: number }>();

    // Get all unique show IDs
    const showIds = [...new Set(performances.map((p) => p.show.id))];

    if (showIds.length > 0) {
      // Get all set position ranges in a single query
      const setRanges = await this.db.$queryRaw<
        Array<{ show_id: string; set: string; min_position: number; max_position: number }>
      >`
        SELECT show_id, set, MIN(position) as min_position, MAX(position) as max_position
        FROM tracks
        WHERE show_id = ANY(${showIds}::uuid[])
        GROUP BY show_id, set
      `;

      // Build the lookup map
      for (const range of setRanges) {
        const key = `${range.show_id}|||${range.set}`;
        setPositionData.set(key, {
          min: range.min_position,
          max: range.max_position,
        });
      }
    }

    // Compute tags for each performance
    performances.forEach((perf) => {
      const tags: SongPagePerformance["tags"] = {};

      // Encore (sets that start with "E") - check this first
      const isEncore = perf.set?.startsWith("E");
      if (isEncore) {
        tags.encore = true;
      }

      // Set opener/closer (only for non-encore sets)
      if (perf.set && perf.position !== undefined && !isEncore) {
        const showSetKey = `${perf.show.id}|||${perf.set}`;
        const setRange = setPositionData.get(showSetKey);

        if (setRange) {
          tags.setOpener = perf.position === setRange.min;
          tags.setCloser = perf.position === setRange.max;
        }
      }

      // Segue in/out
      const hasSegueIn = perf.songBefore?.segue;
      const hasSegueOut = perf.segue;
      tags.segueIn = !!hasSegueIn;
      tags.segueOut = !!hasSegueOut;

      // Standalone (no segue in or out)
      tags.standalone = !hasSegueIn && !hasSegueOut;

      // Inverted/Dyslexic from annotations
      if (perf.annotations) {
        const annotationText = perf.annotations.map((a) => a.desc?.toLowerCase() || "").join(" ");
        tags.inverted = annotationText.includes("inverted");
        tags.dyslexic = annotationText.includes("dyslexic");
      }

      perf.tags = tags;
    });
  }

  private transformToSongPagePerformanceView(row: PerformanceDto): SongPagePerformance {
    return {
      trackId: row.track_id,
      show: {
        id: row.id,
        slug: row.slug,
        date: row.date,
        venueId: row.venue_id,
      },
      venue:
        row.venue_id && row.venue_slug && row.venue_name
          ? {
              id: row.venue_id,
              slug: row.venue_slug,
              name: row.venue_name,
              city: row.venue_city || "",
              state: row.venue_state,
              country: row.venue_country || "",
            }
          : undefined,
      songBefore:
        row.prev_song_id && row.prev_song_slug && row.prev_song_title
          ? {
              id: row.prev_song_id,
              songId: row.prev_song_id,
              segue: row.prev_track_segue,
              songSlug: row.prev_song_slug,
              songTitle: row.prev_song_title,
            }
          : undefined,
      songAfter:
        row.next_song_id && row.next_song_slug && row.next_song_title
          ? {
              id: row.next_song_id,
              songId: row.next_song_id,
              segue: row.next_track_segue,
              songSlug: row.next_song_slug,
              songTitle: row.next_song_title,
            }
          : undefined,
      rating: row.average_rating || undefined,
      ratingsCount: row.ratings_count || undefined,
      notes: row.note || undefined,
      allTimer: row.all_timer,
      segue: row.segue,
      set: row.set,
      position: row.position,
    };
  }
}

type PerformanceDto = {
  // Show fields
  id: string;
  date: string;
  venue_id: string;
  slug: string;

  // Venue fields
  venue_name: string | null;
  venue_city: string | null;
  venue_state: string | null;
  venue_slug: string | null;
  venue_country: string | null;

  // Track fields
  track_id: string;
  song_id: string;
  segue: string | null;
  set: string;
  position: number;
  all_timer: boolean;
  average_rating: number;
  ratings_count: number;
  note: string | null;

  // Next/Prev track fields
  next_track_segue: string | null;
  prev_track_segue: string | null;

  // Next/Prev song fields
  next_song_id: string | null;
  next_song_title: string | null;
  next_song_slug: string | null;
  prev_song_id: string | null;
  prev_song_title: string | null;
  prev_song_slug: string | null;
};
