import type { Setlist, Show } from "@bip/domain";
import type { DbAnnotation, DbClient, DbShow, DbSong, DbTrack, DbVenue } from "../_shared/database/models";
import { dbClient } from "../_shared/database/models";
import { buildOrderByClause, buildWhereClause } from "../_shared/database/query-utils";
import type { PaginationOptions, SortOptions } from "../_shared/database/types";
import { mapShowToDomainEntity } from "../shows/show-repository";
import { mapAnnotationToDomainEntity, mapTrackToDomainEntity } from "../tracks/track-repository";
import { mapVenueToDomainEntity } from "../venues/venue-repository";
import type { SetlistFilter } from "./setlist-service";

function getSetSortOrder(setLabel: string): number {
  // Handle common set labels
  if (setLabel.toLowerCase() === "soundcheck") return 0;

  const upperLabel = setLabel.toUpperCase();

  // S sets come first (10-40)
  if (upperLabel === "S1") return 10;
  if (upperLabel === "S2") return 20;
  if (upperLabel === "S3") return 30;
  if (upperLabel === "S4") return 40;

  // E sets come after (50-60)
  if (upperLabel === "E1") return 50;
  if (upperLabel === "E2") return 60;

  // Default sort order for unknown set types
  return 999;
}

function mapSetlistToDomainEntity(
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
  const sets = Array.from(setGroups.entries()).map(([label, setTracks]) => {
    // Sort tracks by position within each set
    const sortedTracks = [...setTracks].sort((a, b) => {
      // Ensure we're sorting numerically by position
      const posA = Number(a.position);
      const posB = Number(b.position);
      return posA - posB;
    });

    return {
      label,
      sort: getSetSortOrder(label),
      tracks: sortedTracks.map((t) => mapTrackToDomainEntity(t)),
    };
  });

  // Sort sets by their sort order
  sets.sort((a, b) => a.sort - b.sort);

  return {
    show: mapShowToDomainEntity(show),
    venue: mapVenueToDomainEntity(show.venue),
    sets,
    annotations: tracks.flatMap((t) => t.annotations ?? []).map((a) => mapAnnotationToDomainEntity(a)),
  };
}

export class SetlistRepository {
  constructor(protected db: DbClient) {}

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

    return mapSetlistToDomainEntity({
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

    return mapSetlistToDomainEntity({
      ...result,
      venue: result.venue,
    });
  }

  /**
   * Find setlists by an array of show IDs
   * @param showIds Array of show IDs to find setlists for
   * @param options Optional query options for pagination, sorting, etc.
   * @returns An array of setlists for the specified show IDs
   */
  async findManyByShowIds(
    showIds: string[],
    options?: {
      pagination?: PaginationOptions;
      sort?: SortOptions<Show>[];
    },
  ): Promise<Setlist[]> {
    if (!showIds.length) return [];

    const orderBy = buildOrderByClause(options?.sort, { date: "desc" });
    const skip =
      options?.pagination?.page && options?.pagination?.limit
        ? (options.pagination.page - 1) * options.pagination.limit
        : undefined;
    const take = options?.pagination?.limit;

    const results = await this.db.show.findMany({
      where: {
        id: {
          in: showIds,
        },
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
        mapSetlistToDomainEntity({
          ...show,
          venue: show.venue as DbVenue,
          tracks: show.tracks.map((track) => ({
            ...track,
            annotations: track.annotations || [],
          })),
        }),
      );
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
              gte: `${year}-01-01`,
              lt: `${year + 1}-01-01`,
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
      .filter((result): result is typeof result & { venue: NonNullable<typeof result.venue> } => result.venue !== null)
      .map((show) =>
        mapSetlistToDomainEntity({
          ...show,
          venue: show.venue,
          tracks: show.tracks.map((track) => ({
            ...track,
            annotations: track.annotations || [],
          })),
        }),
      );
  }
}
