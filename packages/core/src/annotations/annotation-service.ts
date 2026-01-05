import type { Annotation, Logger } from "@bip/domain";
import type { CacheInvalidationService } from "../_shared/cache";
import type { DbAnnotation, DbClient } from "../_shared/database/models";

// Mapper functions
function mapAnnotationToDomainEntity(dbAnnotation: DbAnnotation): Annotation {
  const { createdAt, updatedAt, ...rest } = dbAnnotation;

  return {
    ...rest,
    createdAt: new Date(createdAt),
    updatedAt: new Date(updatedAt),
  };
}

function mapAnnotationToDbModel(entity: Partial<Annotation>): Partial<DbAnnotation> {
  return entity as Partial<DbAnnotation>;
}

export class AnnotationService {
  constructor(
    protected readonly db: DbClient,
    protected readonly logger: Logger,
    protected readonly cacheInvalidation?: CacheInvalidationService,
  ) {}

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
    return result ? mapAnnotationToDomainEntity(result) : null;
  }

  async findByTrackId(trackId: string): Promise<Annotation[]> {
    const results = await this.db.annotation.findMany({
      where: { trackId },
      orderBy: { createdAt: "desc" },
    });
    return results.map((result) => mapAnnotationToDomainEntity(result));
  }

  async create(data: Partial<Annotation>): Promise<Annotation> {
    if (!data.trackId) {
      throw new Error("trackId is required to create an annotation");
    }

    const now = new Date();
    const createData = {
      trackId: data.trackId,
      desc: data.desc || null,
      createdAt: now,
      updatedAt: now,
    };
    this.logger?.info("Creating annotation with data", { createData });
    const result = await this.db.annotation.create({
      data: createData,
    });

    const annotation = mapAnnotationToDomainEntity(result);

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

    const annotation = mapAnnotationToDomainEntity(result);

    // Invalidate show caches
    if (current?.trackId) {
      await this.invalidateShowCachesForTrack(current.trackId);
    }

    return annotation;
  }

  async delete(id: string): Promise<void> {
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
  }

  async deleteByTrackId(trackId: string): Promise<void> {
    await this.db.annotation.deleteMany({
      where: { trackId },
    });

    // Invalidate show caches
    await this.invalidateShowCachesForTrack(trackId);
  }

  async upsertForTrack(trackId: string, desc: string | null): Promise<Annotation | null> {
    // Check if annotation exists for this track
    const existingAnnotations = await this.findByTrackId(trackId);

    if (existingAnnotations.length > 0) {
      // Update the first annotation
      const annotation = existingAnnotations[0];
      if (desc === null || desc === "") {
        // Delete annotation if desc is empty
        await this.delete(annotation.id);
        return null;
      }
      return this.update(annotation.id, { desc });
    }
    if (desc && desc !== "") {
      // Create new annotation if desc is provided
      return this.create({ trackId, desc });
    }

    return null;
  }

  async upsertMultipleForTrack(trackId: string, annotationsText: string | null): Promise<Annotation[]> {
    // Delete existing annotations first
    await this.deleteByTrackId(trackId);

    if (!annotationsText || annotationsText.trim() === "") {
      return [];
    }

    // Split by line breaks and filter out empty lines
    const annotationLines = annotationsText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    // Create new annotations
    const annotations: Annotation[] = [];
    for (const desc of annotationLines) {
      const annotation = await this.create({ trackId, desc });
      annotations.push(annotation);
    }

    return annotations;
  }
}
