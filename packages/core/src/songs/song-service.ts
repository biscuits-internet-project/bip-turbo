import type { Logger, Song } from "@bip/domain";
import { BaseService } from "../_shared/base-service";
import type { NewSong } from "../_shared/drizzle/types";
import type { SongRepository } from "./song-repository";

export interface SongFilter {
  title?: string;
  legacyId?: number;
}

export interface TrendingSong extends Song {
  count: number;
}

export class SongService extends BaseService {
  constructor(
    private readonly repository: SongRepository,
    logger: Logger,
  ) {
    super(logger);
  }

  async findById(id: string): Promise<Song | null> {
    return this.repository.findById(id);
  }

  async findBySlug(slug: string): Promise<Song | null> {
    return this.repository.findBySlug(slug);
  }

  async findMany(filter: SongFilter): Promise<Song[]> {
    return this.repository.findMany(filter);
  }

  async findTrending(): Promise<TrendingSong[]> {
    return this.repository.findTrending();
  }

  async findTrendingLastYear(): Promise<TrendingSong[]> {
    return this.repository.findTrendingLastYear();
  }

  async create(song: NewSong): Promise<Song> {
    return this.repository.create(song);
  }

  async update(id: string, song: Partial<NewSong>): Promise<Song> {
    return this.repository.update(id, song);
  }

  async delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
