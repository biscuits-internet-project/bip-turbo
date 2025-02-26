import type { SongPagePerformance, SongPageView } from "@bip/domain";
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
        tracks.all_timer,
        tracks.average_rating,
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
      WHERE tracks.song_id = ${song.id}
      ORDER BY shows.date DESC, tracks.set, tracks.position
    `;

    const performances = result.map((row) => this.transformToSongPagePerformanceView(row));

    return {
      song,
      performances,
    };
  }

  private transformToSongPagePerformanceView(row: PerformanceDto): SongPagePerformance {
    return {
      trackId: row.track_id,
      show: {
        id: row.id,
        slug: row.slug,
        date: new Date(row.date),
        venueId: row.venue_id,
      },
      venue:
        row.venue_id && row.venue_slug && row.venue_name
          ? {
              id: row.venue_id,
              slug: row.venue_slug,
              name: row.venue_name,
              city: row.venue_city,
              state: row.venue_state,
              country: row.venue_country,
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
      notes: row.note || undefined,
      allTimer: row.all_timer,
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
  segue: boolean;
  all_timer: boolean;
  average_rating: number;
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
