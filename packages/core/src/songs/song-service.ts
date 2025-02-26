import type { Logger, Song, TrendingSong } from "@bip/domain";
import { BaseService } from "../_shared/base-service";
import type { DbSong } from "../_shared/database/models";
import type { FilterCondition, QueryOptions } from "../_shared/database/types";
import type { SongRepository } from "./song-repository";

export interface SongFilter {
  title?: string;
  legacyId?: number;
}

export class SongService extends BaseService<Song, DbSong> {
  constructor(
    protected repository: SongRepository,
    logger: Logger,
  ) {
    super(repository, logger);
  }

  async findById(id: string): Promise<Song | null> {
    return this.repository.findById(id);
  }

  async findBySlug(slug: string): Promise<Song | null> {
    return this.repository.findBySlug(slug);
  }

  async findMany(filter: SongFilter): Promise<Song[]> {
    const queryOptions: QueryOptions<Song> = {
      filters: Object.entries(filter).map(([field, value]) => ({
        field: field as keyof Song,
        operator: "eq",
        value,
      })) as FilterCondition<Song>[],
    };

    return this.repository.findMany(queryOptions);
  }

  async findTrendingLastXShows(lastXShows: number, limit: number): Promise<TrendingSong[]> {
    return this.repository.findTrendingLastXShows(lastXShows, limit);
  }

  async findTrendingLastYear(): Promise<TrendingSong[]> {
    return this.repository.findTrendingLastYear();
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
