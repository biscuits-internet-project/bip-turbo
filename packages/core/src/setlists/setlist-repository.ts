import type { Setlist, Show } from "@bip/domain";
import type { DbAnnotation, DbClient, DbShow, DbSong, DbTrack, DbVenue } from "../_shared/database/models";
import { dbClient } from "../_shared/database/models";
import { buildOrderByClause, buildWhereClause } from "../_shared/database/query-utils";
import type { PaginationOptions, SortOptions } from "../_shared/database/types";
import { mapShowToDomainEntity } from "../shows/show-repository";
import { mapAnnotationToDomainEntity, mapTrackToDomainEntity } from "../tracks/track-repository";
import { mapVenueToDomainEntity } from "../venues/venue-repository";
import type { SetlistFilter } from "./setlist-service";

/**
 * Repository for Setlists
 * This is a custom repository that doesn't extend BaseRepository because
 * Setlist is a composite type that doesn't map 1:1 to a database model
 */
export class SetlistRepository {
  protected db: DbClient;

  constructor(client = dbClient) {
    this.db = client;
  }

  async findByShowId(id: string): Promise<Setlist | null> {
    const show = await this.db.show.findUnique({
      where: { id },
      include: {
        tracks: {
          include: {
            song: true,
            annotations: true,
          },
        },
        venue: true,
      },
    });

    if (!show || !show.venue) return null;

    return this.#mapSetlistToDomainEntity({
      ...show,
      venue: show.venue,
    });
  }

  async findByShowSlug(slug: string): Promise<Setlist | null> {
    const result = await this.db.show.findUnique({
      where: { slug },
      include: {
        tracks: {
          include: {
            song: true,
            annotations: true,
          },
        },
        venue: true,
      },
    });

    if (!result || !result.venue) return null;

    return this.#mapSetlistToDomainEntity({
      ...result,
      venue: result.venue,
    });
  }

  async findMany(options?: {
    pagination?: PaginationOptions;
    sort?: SortOptions<Show>[];
    filters?: SetlistFilter;
  }): Promise<Setlist[]> {
    const year = options?.filters?.year;
    const venueId = options?.filters?.venueId;

    const orderBy = buildOrderByClause(options?.sort, { date: "asc" });
    const skip =
      options?.pagination?.page && options?.pagination?.limit
        ? (options.pagination.page - 1) * options.pagination.limit
        : undefined;
    const take = options?.pagination?.limit;

    const results = await this.db.show.findMany({
      where: {
        venueId,
        date: year
          ? {
              gte: new Date(`${year}-01-01`),
              lt: new Date(`${year + 1}-01-01`),
            }
          : undefined,
      },
      orderBy,
      skip,
      take,
      include: {
        tracks: {
          include: {
            song: true,
            annotations: true,
          },
        },
        venue: true,
      },
    });

    return results
      .filter((show) => show.venue !== null)
      .map((show) =>
        this.#mapSetlistToDomainEntity({
          ...show,
          venue: show.venue as DbVenue,
          tracks: show.tracks.map((track) => ({
            ...track,
            annotations: track.annotations || [],
          })),
        }),
      );
  }

  #mapSetlistToDomainEntity(
    show: DbShow & {
      tracks: (DbTrack & { song: DbSong | null; annotations: DbAnnotation[] })[];
      venue: DbVenue;
    },
  ): Setlist {
    const tracks = show.tracks ?? [];
    const setGroups = new Map<string, DbTrack[]>();

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
      tracks: setTracks.map((t) => mapTrackToDomainEntity(t)),
    }));

    // Sort sets by their sort order
    sets.sort((a, b) => a.sort - b.sort);

    return {
      show: mapShowToDomainEntity(show),
      venue: mapVenueToDomainEntity(show.venue),
      sets,
      annotations: tracks.flatMap((t) => t.annotations ?? []).map((a) => mapAnnotationToDomainEntity(a)),
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
}
