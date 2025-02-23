import type { Annotation, Setlist, Show, Song, Track, Venue } from "@bip/domain";
import type { SQL } from "drizzle-orm";
import { and, asc, between, eq } from "drizzle-orm";
import { annotations, shows, songs, tracks, venues } from "../_shared/drizzle";
import type { AnnotationRow, ShowRow, SongRow, TrackRow, VenueRow } from "../_shared/drizzle/types";
import { BaseRepository } from "../_shared/repository/base";
import type { ShowFilter } from "../shows/show-service";
import { transformShow } from "../shows/show-transformer";
import { transformSong } from "../songs/song-transformer";
import { transformAnnotation, transformTrack } from "../tracks/track-transformer";
import { transformVenue } from "../venues/venue-transformer";

export class SetlistRepository extends BaseRepository<Setlist, never, ShowFilter> {
  async findById(id: string): Promise<Setlist | null> {
    const show = await this.db.query.shows.findFirst({
      with: {
        tracks: {
          with: {
            song: true,
            annotations: true,
          },
        },
        venue: true,
        band: true,
      },
      where: eq(shows.id, id),
    });

    if (!show) return null;

    return this.#transformSetlist(show);
  }

  async findBySlug(slug: string): Promise<Setlist | null> {
    const result = await this.db.query.shows.findFirst({
      with: {
        tracks: {
          with: {
            song: true,
            annotations: true,
          },
        },
        venue: true,
        band: true,
      },
      where: eq(shows.slug, slug),
    });

    if (!result) return null;

    return this.#transformSetlist(result);
  }

  async findMany(filter?: ShowFilter): Promise<Setlist[]> {
    const conditions: SQL<unknown>[] = [];

    if (filter?.year) {
      const startDate = new Date(filter.year, 0, 1);
      const endDate = new Date(filter.year + 1, 0, 1);
      conditions.push(between(shows.date, startDate.toISOString(), endDate.toISOString()));
    }

    const result = await this.db.query.shows.findMany({
      with: {
        tracks: {
          with: {
            song: true,
            annotations: true,
          },
        },
        venue: true,
        band: true,
      },
      where: conditions.length > 0 ? and(...conditions) : undefined,
      orderBy: [asc(shows.date)],
    });

    return result.map((show) => this.#transformSetlist(show));
  }

  #transformSetlist(show: ShowRow & { tracks: TrackRow[]; venue: VenueRow }): Setlist {
    const tracks = show.tracks ?? [];
    const setGroups = new Map<string, TrackRow[]>();

    // Group tracks by set label
    for (const track of tracks) {
      const setTracks = setGroups.get(track.set) ?? [];
      setTracks.push(track);
      setGroups.set(track.set, setTracks);
    }

    // Convert the grouped tracks into sets
    const sets = Array.from(setGroups.entries()).map(([label, setTracks]) => ({
      label,
      sort: this.#getSetSortOrder(label),
      tracks: setTracks.map((t) => transformTrack(t)),
    }));

    // Sort sets by their sort order
    sets.sort((a, b) => a.sort - b.sort);

    return {
      show: transformShow(show),
      venue: transformVenue(show.venue),
      sets,
      annotations: tracks.flatMap((t) => t.annotations ?? []).map((a) => transformAnnotation(a)),
    };
  }

  #getSetSortOrder(setLabel: string): number {
    // Handle common set labels
    if (setLabel.toLowerCase() === "soundcheck") return 0;
    if (setLabel.match(/^s\d+$/i)) return Number.parseInt(setLabel.slice(1));
    if (setLabel.match(/^e\d+$/i)) return 100 + Number.parseInt(setLabel.slice(1));
    // Default sort order for unknown set types
    return 999;
  }

  async create(): Promise<never> {
    throw new Error("Create operation not supported for Setlist");
  }

  async update(): Promise<never> {
    throw new Error("Update operation not supported for Setlist");
  }

  async delete(): Promise<never> {
    throw new Error("Delete operation not supported for Setlist");
  }
}
