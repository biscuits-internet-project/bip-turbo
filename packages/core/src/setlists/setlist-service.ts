import type { Annotation, Setlist, SetlistLight, Show, Track, TrackLight, Venue } from "@bip/domain";
import type { DbAnnotation, DbClient, DbShow, DbSong, DbTrack, DbVenue } from "../_shared/database/models";
import { buildOrderByClause } from "../_shared/database/query-utils";
import type { PaginationOptions, SortOptions } from "../_shared/database/types";

export type SetlistFilter = {
  year?: number;
  venueId?: string;
  hasPhotos?: boolean;
};

type DbTrackLight = {
  id: string;
  showId: string;
  songId: string;
  set: string;
  position: number;
  segue: string | null;
  likesCount: number;
  note: string | null;
  allTimer: boolean | null;
  averageRating: number | null;
  ratingsCount: number;
  song: { id: string; title: string; slug: string } | null;
  annotations: DbAnnotation[];
};

// Mapper functions
function mapShowToDomainEntity(dbShow: DbShow): Show {
  const { createdAt, updatedAt, slug, venueId, bandId, ...rest } = dbShow;
  return {
    ...rest,
    slug: slug ?? "",
    venueId: venueId ?? "",
    bandId: bandId ?? "",
    date: String(dbShow.date),
    createdAt: new Date(createdAt),
    updatedAt: new Date(updatedAt),
  };
}

function mapVenueToDomainEntity(dbVenue: DbVenue): Venue {
  const { createdAt, updatedAt, name, slug, city, country, ...rest } = dbVenue;
  return {
    ...rest,
    name: name ?? "",
    slug: slug ?? "",
    city: city ?? "",
    country: country ?? "",
    createdAt: new Date(createdAt),
    updatedAt: new Date(updatedAt),
  };
}

function mapAnnotationToDomainEntity(dbAnnotation: DbAnnotation): Annotation {
  const { createdAt, updatedAt, ...rest } = dbAnnotation;
  return {
    ...rest,
    createdAt: new Date(createdAt),
    updatedAt: new Date(updatedAt),
  };
}

function mapTrackToDomainEntity(dbTrack: DbTrack & { song: DbSong | null }): Track {
  const { createdAt, updatedAt, slug, ...rest } = dbTrack;
  return {
    ...rest,
    slug: slug ?? "",
    createdAt: new Date(createdAt),
    updatedAt: new Date(updatedAt),
    song: dbTrack.song
      ? {
          id: dbTrack.song.id,
          title: dbTrack.song.title,
          slug: dbTrack.song.slug ?? "",
          lyrics: dbTrack.song.lyrics,
          tabs: dbTrack.song.tabs,
          notes: dbTrack.song.notes,
          cover: dbTrack.song.cover ?? false,
          history: dbTrack.song.history,
          featuredLyric: dbTrack.song.featuredLyric,
          timesPlayed: dbTrack.song.timesPlayed,
          guitarTabsUrl: dbTrack.song.guitarTabsUrl,
          dateLastPlayed: dbTrack.song.dateLastPlayed ? new Date(dbTrack.song.dateLastPlayed) : null,
          dateFirstPlayed: dbTrack.song.dateFirstPlayed ? new Date(dbTrack.song.dateFirstPlayed) : null,
          actualLastPlayedDate: null,
          showsSinceLastPlayed: null,
          lastVenue: null,
          firstVenue: null,
          firstShowSlug: null,
          lastShowSlug: null,
          yearlyPlayData: dbTrack.song.yearlyPlayData as Record<string, unknown>,
          longestGapsData: dbTrack.song.longestGapsData as Record<string, unknown>,
          mostCommonYear: null,
          leastCommonYear: null,
          createdAt: new Date(dbTrack.song.createdAt),
          updatedAt: new Date(dbTrack.song.updatedAt),
          authorId: dbTrack.song.authorId,
          authorName: null,
        }
      : undefined,
  };
}

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
  const setGroups = new Map<string, (DbTrack & { song: DbSong | null; annotations: DbAnnotation[] })[]>();

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

function mapTrackLightToDomainEntity(track: DbTrackLight): TrackLight {
  return {
    id: track.id,
    showId: track.showId,
    songId: track.songId,
    set: track.set,
    position: track.position,
    segue: track.segue,
    likesCount: track.likesCount,
    note: track.note,
    allTimer: track.allTimer,
    averageRating: track.averageRating,
    ratingsCount: track.ratingsCount,
    song: track.song ?? undefined,
  };
}

function mapSetlistLightToDomainEntity(
  show: DbShow & {
    tracks: DbTrackLight[];
    venue: DbVenue;
  },
): SetlistLight {
  const tracks = show.tracks ?? [];
  const setGroups = new Map<string, DbTrackLight[]>();

  for (const track of tracks) {
    const setTracks = setGroups.get(track.set) ?? [];
    setTracks.push(track);
    setGroups.set(track.set, setTracks);
  }

  const sets = Array.from(setGroups.entries()).map(([label, setTracks]) => {
    const sortedTracks = [...setTracks].sort((a, b) => {
      const posA = Number(a.position);
      const posB = Number(b.position);
      return posA - posB;
    });

    return {
      label,
      sort: getSetSortOrder(label),
      tracks: sortedTracks.map((t) => mapTrackLightToDomainEntity(t)),
    };
  });

  sets.sort((a, b) => a.sort - b.sort);

  return {
    show: mapShowToDomainEntity(show),
    venue: mapVenueToDomainEntity(show.venue),
    sets,
    annotations: tracks.flatMap((t) => t.annotations ?? []).map((a) => mapAnnotationToDomainEntity(a)),
  };
}

export class SetlistService {
  constructor(private readonly db: DbClient) {}

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
    const hasPhotos = options?.filters?.hasPhotos;

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
        showPhotosCount: hasPhotos ? { gt: 0 } : undefined,
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

  /**
   * Find setlists with minimal song data (id, title, slug only).
   * Use this for list views where full song objects (lyrics, history) aren't needed.
   */
  async findManyLight(options?: {
    pagination?: PaginationOptions;
    sort?: SortOptions<Show>[];
    filters?: SetlistFilter;
  }): Promise<SetlistLight[]> {
    const year = options?.filters?.year;
    const venueId = options?.filters?.venueId;
    const hasPhotos = options?.filters?.hasPhotos;

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
        showPhotosCount: hasPhotos ? { gt: 0 } : undefined,
      },
      orderBy,
      skip,
      take,
      include: {
        tracks: {
          select: {
            id: true,
            showId: true,
            songId: true,
            set: true,
            position: true,
            segue: true,
            likesCount: true,
            note: true,
            allTimer: true,
            averageRating: true,
            ratingsCount: true,
            song: {
              select: {
                id: true,
                title: true,
                slug: true,
              },
            },
            annotations: true,
          },
        },
        venue: true,
      },
    });

    return results
      .filter((result): result is typeof result & { venue: NonNullable<typeof result.venue> } => result.venue !== null)
      .map((show) =>
        mapSetlistLightToDomainEntity({
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
