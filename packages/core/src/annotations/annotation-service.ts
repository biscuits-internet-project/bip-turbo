import type { Annotation, Logger } from "@bip/domain";
import type { AnnotationRepository } from "./annotation-repository";

export class AnnotationService {
  constructor(
    protected readonly repository: AnnotationRepository,
    protected readonly logger: Logger,
  ) {}

  async findById(id: string): Promise<Annotation | null> {
    return this.repository.findById(id);
  }

  async findByTrackId(trackId: string): Promise<Annotation[]> {
    return this.repository.findByTrackId(trackId);
  }

  async create(data: Partial<Annotation>): Promise<Annotation> {
    return this.repository.create(data);
  }

  async update(id: string, data: Partial<Annotation>): Promise<Annotation> {
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async deleteByTrackId(trackId: string): Promise<void> {
    await this.repository.deleteByTrackId(trackId);
  }

  async upsertForTrack(trackId: string, desc: string | null): Promise<Annotation | null> {
    // Check if annotation exists for this track
    const existingAnnotations = await this.repository.findByTrackId(trackId);

    if (existingAnnotations.length > 0) {
      // Update the first annotation
      const annotation = existingAnnotations[0];
      if (desc === null || desc === "") {
        // Delete annotation if desc is empty
        await this.repository.delete(annotation.id);
        return null;
      } else {
        return this.repository.update(annotation.id, { desc });
      }
    } else if (desc && desc !== "") {
      // Create new annotation if desc is provided
      return this.repository.create({ trackId, desc });
    }

    return null;
  }

  async upsertMultipleForTrack(trackId: string, annotationsText: string | null): Promise<Annotation[]> {
    // Delete existing annotations first
    await this.repository.deleteByTrackId(trackId);

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
      const annotation = await this.repository.create({ trackId, desc });
      annotations.push(annotation);
    }

    return annotations;
  }
}
