import type { Annotation } from "@bip/domain";
import type { CacheInvalidationService } from "../_shared/cache";
import type { DbAnnotation, DbClient } from "../_shared/database/models";

export function mapAnnotationToDomainEntity(dbAnnotation: DbAnnotation): Annotation {
  const { createdAt, updatedAt, ...rest } = dbAnnotation;

  return {
    ...rest,
    createdAt: new Date(createdAt),
    updatedAt: new Date(updatedAt),
  };
}

export function mapAnnotationToDbModel(entity: Partial<Annotation>): Partial<DbAnnotation> {
  return entity as Partial<DbAnnotation>;
}

export class AnnotationRepository {
  constructor(
    private readonly db: DbClient,
    private readonly cacheInvalidation?: CacheInvalidationService,
  ) {}

  protected mapToDomainEntity(dbAnnotation: DbAnnotation): Annotation {
    return mapAnnotationToDomainEntity(dbAnnotation);
  }

  protected mapToDbModel(entity: Partial<Annotation>): Partial<DbAnnotation> {
    return mapAnnotationToDbModel(entity);
  }

  private async invalidateShowCachesForTrack(trackId: string): Promise<void> {
    if (!this.cacheInvalidation) return;

    // Get track's show ID for cache invalidation
    const track = await this.db.track.findUnique({
      where: { id: trackId },
      select: { showId: true, show: { select: { slug: true } } },
    });

    if (track?.showId && track.show?.slug) {
      await this.cacheInvalidation.invalidateShowComprehensive(track.showId, track.show.slug);
    }
  }

  async findById(id: string): Promise<Annotation | null> {
    const result = await this.db.annotation.findUnique({
      where: { id },
    });
    return result ? this.mapToDomainEntity(result) : null;
  }

  async findByTrackId(trackId: string): Promise<Annotation[]> {
    const results = await this.db.annotation.findMany({
      where: { trackId },
      orderBy: { createdAt: "desc" },
    });
    return results.map((result) => this.mapToDomainEntity(result));
  }

  async create(data: Partial<Annotation>): Promise<Annotation> {
    const now = new Date();
    const createData = {
      trackId: data.trackId!,
      desc: data.desc || null,
      createdAt: now,
      updatedAt: now,
    };
    console.log("Creating annotation with data:", createData);
    const result = await this.db.annotation.create({
      data: createData,
    });

    const annotation = this.mapToDomainEntity(result);

    // Invalidate show caches (annotation changes affect setlist data)
    if (data.trackId) {
      await this.invalidateShowCachesForTrack(data.trackId);
    }

    return annotation;
  }

  async update(id: string, data: Partial<Annotation>): Promise<Annotation> {
    // Get current annotation for cache invalidation
    const current = await this.db.annotation.findUnique({
      where: { id },
      select: { trackId: true },
    });

    const result = await this.db.annotation.update({
      where: { id },
      data: {
        ...(data.desc !== undefined && { desc: data.desc }),
        updatedAt: new Date(),
      },
    });

    const annotation = this.mapToDomainEntity(result);

    // Invalidate show caches
    if (current?.trackId) {
      await this.invalidateShowCachesForTrack(current.trackId);
    }

    return annotation;
  }

  async delete(id: string): Promise<boolean> {
    // Get annotation info before deletion for cache invalidation
    const annotation = await this.db.annotation.findUnique({
      where: { id },
      select: { trackId: true },
    });

    await this.db.annotation.delete({
      where: { id },
    });

    // Invalidate show caches
    if (annotation?.trackId) {
      await this.invalidateShowCachesForTrack(annotation.trackId);
    }

    return true;
  }

  async deleteByTrackId(trackId: string): Promise<boolean> {
    await this.db.annotation.deleteMany({
      where: { trackId },
    });

    // Invalidate show caches
    await this.invalidateShowCachesForTrack(trackId);

    return true;
  }
}
