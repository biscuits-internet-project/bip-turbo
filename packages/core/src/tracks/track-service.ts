import type { Annotation, Logger, Track } from "@bip/domain";
import type { CacheInvalidationService } from "../_shared/cache";
import type { DbAnnotation, DbClient, DbSong, DbTrack } from "../_shared/database/models";
import { buildIncludeClause, buildOrderByClause, buildWhereClause } from "../_shared/database/query-utils";
import type { QueryOptions } from "../_shared/database/types";
import { slugify } from "../_shared/utils/slugify";

// Database query result that includes song and annotations
type DbTrackWithSongAndAnnotations = DbTrack & {
  song?: DbSong | null;
  annotations?: DbAnnotation[] | null;
};

// Mapper functions
function mapTrackToDomainEntity(dbTrack: DbTrack): Track {
  const { slug, createdAt, updatedAt, ...rest } = dbTrack;

  return {
    ...rest,
    slug: slug || "",
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

function mapTrackToDbModel(entity: Partial<Track>): Partial<DbTrack> {
  return entity as Partial<DbTrack>;
}

export class TrackService {
  constructor(
    protected readonly db: DbClient,
    protected readonly logger: Logger,
    protected readonly cacheInvalidation?: CacheInvalidationService,
  ) {}

  private async invalidateShowCaches(showId: string): Promise<void> {
    if (!this.cacheInvalidation) return;

    // Get show slug for invalidation
    const show = await this.db.show.findUnique({
      where: { id: showId },
      select: { slug: true },
    });

    if (show?.slug) {
      await this.cacheInvalidation.invalidateShowComprehensive(showId, show.slug);
    }
  }

  private async invalidateAllTimersCache(): Promise<void> {
    if (!this.cacheInvalidation) return;
    await this.cacheInvalidation.invalidateAllTimers();
  }

  private async generateTrackSlug(
    showId: string,
    songId: string,
    showDate: string,
    songTitle: string,
  ): Promise<string> {
    const baseSlug = slugify(`${showDate}-${songTitle}`);

    // Count how many times this song already appears in the show
    const existingTracks = await this.db.track.findMany({
      where: {
        showId,
        songId,
      },
      orderBy: { position: "asc" },
    });

    // Add random chars to ensure uniqueness
    const randomSuffix = Math.random().toString(36).substring(2, 8);

    // If this is a repeat, add a number suffix + random chars
    if (existingTracks.length > 0) {
      return `${baseSlug}-${existingTracks.length + 1}-${randomSuffix}`;
    }

    return `${baseSlug}-${randomSuffix}`;
  }

  async findById(id: string): Promise<Track | null> {
    const result = await this.db.track.findUnique({
      where: { id },
      include: {
        annotations: true,
        song: true,
      },
    });

    if (!result) return null;

    this.logger?.info("Raw DB result has ratingsCount", {
      hasRatingsCount: "ratingsCount" in result,
      ratingsCount: result.ratingsCount,
    });

    const track = mapTrackToDomainEntity(result);

    this.logger?.info("Mapped domain entity has ratingsCount", {
      hasRatingsCount: "ratingsCount" in track,
      ratingsCount: track.ratingsCount,
    });
    if (result.annotations) {
      track.annotations = result.annotations.map(mapAnnotationToDomainEntity);
    }
    // Note: song is excluded here - computed fields like actualLastPlayedDate
    // should be populated by song-page-composer when needed
    return track;
  }

  async findBySlug(slug: string): Promise<Track | null> {
    const result = await this.db.track.findUnique({
      where: { slug },
    });
    return result ? mapTrackToDomainEntity(result) : null;
  }

  async findMany(filter: QueryOptions<Track>): Promise<Track[]> {
    const where = filter?.filters ? buildWhereClause(filter.filters) : {};
    const orderBy = filter?.sort ? buildOrderByClause(filter.sort) : [{ createdAt: "desc" }];
    const skip =
      filter?.pagination?.page && filter?.pagination?.limit
        ? (filter.pagination.page - 1) * filter.pagination.limit
        : undefined;
    const take = filter?.pagination?.limit;
    const include = filter?.includes ? buildIncludeClause(filter.includes) : undefined;

    const results = await this.db.track.findMany({
      where,
      orderBy,
      skip,
      take,
      include,
    });

    return results.map((result) => {
      const track = mapTrackToDomainEntity(result as DbTrack);
      // Attach related data if included
      if ((result as DbTrackWithSongAndAnnotations).annotations) {
        track.annotations = (result as DbTrackWithSongAndAnnotations).annotations?.map(mapAnnotationToDomainEntity);
      }
      if ((result as unknown as { show?: unknown }).show) {
        (track as unknown as { show?: unknown }).show = (result as unknown as { show?: unknown }).show;
      }
      return track;
    });
  }

  async create(data: Partial<Track>): Promise<Track> {
    let slug: string | undefined;

    if (data.showId && data.songId) {
      const [show, song] = await Promise.all([
        this.db.show.findUnique({ where: { id: data.showId }, select: { date: true } }),
        this.db.song.findUnique({ where: { id: data.songId }, select: { title: true } }),
      ]);

      if (show && song) {
        slug = await this.generateTrackSlug(data.showId, data.songId, show.date, song.title);
      }
    }

    const dbData = mapTrackToDbModel({ ...data, slug });
    const result = await this.db.track.create({
      // biome-ignore lint/suspicious/noExplicitAny: Prisma type requires any for dynamic data mapping
      data: dbData as any,
    });

    const track = mapTrackToDomainEntity(result);

    // Invalidate show caches (track changes affect setlist data)
    if (this.cacheInvalidation && data.showId) {
      await this.invalidateShowCaches(data.showId);
    }

    // Invalidate all-timers cache if this track is an all-timer
    if (data.allTimer) {
      await this.invalidateAllTimersCache();
    }

    return track;
  }

  async update(id: string, data: Partial<Track>): Promise<Track> {
    // Remove relation fields and computed fields that shouldn't be updated directly
    const { ...updateableData } = data;
    const updateData = mapTrackToDbModel(updateableData);

    // Get current track info for cache invalidation
    const currentTrack = await this.db.track.findUnique({
      where: { id },
      select: { showId: true },
    });

    const result = await this.db.track.update({
      where: { id },
      // biome-ignore lint/suspicious/noExplicitAny: Prisma type requires any for dynamic data mapping
      data: updateData as any,
    });

    const track = mapTrackToDomainEntity(result);

    // Invalidate show caches
    if (currentTrack?.showId) {
      await this.invalidateShowCaches(currentTrack.showId);
    }

    // Invalidate all-timers cache if allTimer field was changed
    if (data.allTimer !== undefined) {
      await this.invalidateAllTimersCache();
    }

    return track;
  }

  async findByShowId(showId: string): Promise<Track[]> {
    const results = await this.db.track.findMany({
      where: { showId },
      orderBy: [{ position: "asc" }],
      include: {
        song: true,
        annotations: true,
      },
    });

    // Sort by set properly (S1, S2, S3, E1, E2, E3) then by position
    const sortedResults = results.sort((a, b) => {
      if (a.set !== b.set) {
        const setOrder = { S: 0, E: 1 };
        const aType = a.set.charAt(0) as "S" | "E";
        const bType = b.set.charAt(0) as "S" | "E";
        const aNum = Number.parseInt(a.set.slice(1), 10);
        const bNum = Number.parseInt(b.set.slice(1), 10);

        if (aType !== bType) {
          return setOrder[aType] - setOrder[bType];
        }
        return aNum - bNum;
      }
      return a.position - b.position;
    });

    return sortedResults.map((result: DbTrackWithSongAndAnnotations) => {
      const track = mapTrackToDomainEntity(result);
      if (result.annotations) {
        track.annotations = result.annotations.map(mapAnnotationToDomainEntity);
      }
      // Note: song is excluded here - computed fields like actualLastPlayedDate
      // should be populated by song-page-composer when needed
      return track;
    });
  }

  async delete(id: string): Promise<void> {
    // Get track info before deletion for cache invalidation
    const track = await this.db.track.findUnique({
      where: { id },
      select: { showId: true },
    });

    await this.db.track.delete({
      where: { id },
    });

    // Invalidate show caches
    if (track?.showId) {
      await this.invalidateShowCaches(track.showId);
    }

    // Invalidate all-timers cache (deleted track may have been an all-timer)
    await this.invalidateAllTimersCache();
  }
}
