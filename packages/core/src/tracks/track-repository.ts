import type { Annotation, Track } from "@bip/domain";
import type { CacheInvalidationService } from "../_shared/cache";
import type { DbAnnotation, DbClient, DbTrack } from "../_shared/database/models";
import { buildOrderByClause, buildWhereClause } from "../_shared/database/query-utils";
import type { QueryOptions } from "../_shared/database/types";
import { slugify } from "../_shared/utils/slugify";

export function mapTrackToDomainEntity(dbTrack: DbTrack): Track {
  const { slug, createdAt, updatedAt, ...rest } = dbTrack;

  return {
    ...rest,
    slug: slug || "",
    createdAt: new Date(createdAt),
    updatedAt: new Date(updatedAt),
  };
}

export function mapAnnotationToDomainEntity(dbAnnotation: DbAnnotation): Annotation {
  const { createdAt, updatedAt, ...rest } = dbAnnotation;

  return {
    ...rest,
    createdAt: new Date(createdAt),
    updatedAt: new Date(updatedAt),
  };
}

export function mapTrackToDbModel(entity: Partial<Track>): Partial<DbTrack> {
  return entity as Partial<DbTrack>;
}

export class TrackRepository {
  constructor(
    private readonly db: DbClient,
    private readonly cacheInvalidation?: CacheInvalidationService,
  ) {}

  protected mapToDomainEntity(dbTrack: DbTrack): Track {
    return mapTrackToDomainEntity(dbTrack);
  }

  protected mapToDbModel(entity: Partial<Track>): Partial<DbTrack> {
    return mapTrackToDbModel(entity);
  }

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

    console.log("Raw DB result has ratingsCount:", "ratingsCount" in result, result.ratingsCount);

    const track = this.mapToDomainEntity(result);

    console.log("Mapped domain entity has ratingsCount:", "ratingsCount" in track, track.ratingsCount);
    if (result.annotations) {
      track.annotations = result.annotations.map(mapAnnotationToDomainEntity);
    }
    if (result.song) {
      track.song = result.song as any;
    }
    return track;
  }

  async findBySlug(slug: string): Promise<Track | null> {
    const result = await this.db.track.findUnique({
      where: { slug },
    });
    return result ? this.mapToDomainEntity(result) : null;
  }

  async findMany(options?: QueryOptions<Track>): Promise<Track[]> {
    const where = options?.filters ? buildWhereClause(options.filters) : {};
    const orderBy = options?.sort ? buildOrderByClause(options.sort) : [{ createdAt: "desc" }];
    const skip =
      options?.pagination?.page && options?.pagination?.limit
        ? (options.pagination.page - 1) * options.pagination.limit
        : undefined;
    const take = options?.pagination?.limit;

    const results = await this.db.track.findMany({
      where,
      orderBy,
      skip,
      take,
    });

    return results.map((result: DbTrack) => this.mapToDomainEntity(result));
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

    const dbData = this.mapToDbModel({ ...data, slug });
    const result = await this.db.track.create({
      // biome-ignore lint/suspicious/noExplicitAny: Prisma type requires any for dynamic data mapping
      data: dbData as any,
    });

    const track = this.mapToDomainEntity(result);

    // Invalidate show caches (track changes affect setlist data)
    if (this.cacheInvalidation && data.showId) {
      await this.invalidateShowCaches(data.showId);
    }

    return track;
  }

  async update(id: string, data: Partial<Track>): Promise<Track> {
    // Remove relation fields and computed fields that shouldn't be updated directly
    const { song, annotations, songId, showId, ...updateableData } = data;
    const updateData = this.mapToDbModel(updateableData);

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

    const track = this.mapToDomainEntity(result);

    // Invalidate show caches
    if (currentTrack?.showId) {
      await this.invalidateShowCaches(currentTrack.showId);
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
        const aNum = parseInt(a.set.slice(1));
        const bNum = parseInt(b.set.slice(1));

        if (aType !== bType) {
          return setOrder[aType] - setOrder[bType];
        }
        return aNum - bNum;
      }
      return a.position - b.position;
    });

    return sortedResults.map((result: Record<string, unknown>) => {
      const track = this.mapToDomainEntity(result as DbTrack);
      if ((result as any).annotations) {
        track.annotations = (result as any).annotations.map(mapAnnotationToDomainEntity);
      }
      if ((result as any).song) {
        track.song = (result as any).song as any;
      }
      return track;
    });
  }

  async delete(id: string): Promise<boolean> {
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

    return true;
  }
}
