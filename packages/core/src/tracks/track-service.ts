import type { Logger, Track } from "@bip/domain";
import type { DbTrack } from "../_shared/database/models";
import type { QueryOptions } from "../_shared/database/types";
import type { TrackRepository } from "./track-repository";

export class TrackService {
  constructor(
    protected readonly repository: TrackRepository,
    protected readonly logger: Logger,
  ) {}

  async findById(id: string): Promise<Track | null> {
    return this.repository.findById(id);
  }

  async findBySlug(slug: string): Promise<Track | null> {
    return this.repository.findBySlug(slug);
  }

  async findMany(filter: QueryOptions<Track>): Promise<Track[]> {
    return this.repository.findMany(filter);
  }

  async create(data: Partial<Track>): Promise<Track> {
    return this.repository.create(data);
  }

  async update(id: string, data: Partial<Track>): Promise<Track> {
    return this.repository.update(id, data);
  }

  async findByShowId(showId: string): Promise<Track[]> {
    return this.repository.findByShowId(showId);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
