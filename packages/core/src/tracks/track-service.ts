import type { Logger, Track } from "@bip/domain";
import { BaseService } from "../_shared/base-service";
import type { NewTrack } from "../_shared/drizzle/types";
import type { TrackRepository } from "./track-repository";

export type TrackFilter = {
  showId?: string;
};

export class TrackService extends BaseService {
  constructor(
    private readonly repository: TrackRepository,
    logger: Logger,
  ) {
    super(logger);
  }

  async findById(id: string): Promise<Track | null> {
    return this.repository.findById(id);
  }

  async findBySlug(slug: string): Promise<Track | null> {
    return this.repository.findBySlug(slug);
  }

  async findMany(filter: TrackFilter): Promise<Track[]> {
    return this.repository.findMany(filter);
  }

  async create(data: NewTrack): Promise<Track> {
    return this.repository.create(data);
  }

  async update(id: string, data: Partial<NewTrack>): Promise<Track> {
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
