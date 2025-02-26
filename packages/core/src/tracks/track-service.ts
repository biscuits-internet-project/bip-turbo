import type { Logger, Track } from "@bip/domain";
import { BaseService } from "../_shared/base-service";
import type { DbTrack } from "../_shared/database/models";
import type { QueryOptions } from "../_shared/database/types";
import type { TrackRepository } from "./track-repository";

export class TrackService extends BaseService<Track, DbTrack> {
  constructor(
    protected readonly repository: TrackRepository,
    logger: Logger,
  ) {
    super(repository, logger);
  }

  async findById(id: string): Promise<Track | null> {
    return this.repository.findById(id);
  }

  async findBySlug(slug: string): Promise<Track | null> {
    return this.repository.findBySlug(slug);
  }

  async findMany(filter: QueryOptions<Track>): Promise<Track[]> {
    return this.repository.findMany(filter);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
