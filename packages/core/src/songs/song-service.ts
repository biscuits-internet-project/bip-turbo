import type { Logger, Song, TrendingSong } from "@bip/domain";
import type { FilterCondition, QueryOptions } from "../_shared/database/types";
import type { SongRepository } from "./song-repository";

export interface SongFilter {
  title?: string;
  legacyId?: number;
}

export interface CreateSongInput {
  title: string;
  lyrics?: string | null;
  tabs?: string | null;
  notes?: string | null;
  cover?: boolean | null;
  history?: string | null;
  featuredLyric?: string | null;
  guitarTabsUrl?: string | null;
  authorId?: string | null;
}

export type UpdateSongInput = Partial<CreateSongInput>;

export class SongService {
  constructor(
    protected repository: SongRepository,
    protected logger: Logger,
  ) {}

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

  async create(input: CreateSongInput): Promise<Song> {
    return this.repository.create(input);
  }

  async update(slug: string, input: UpdateSongInput): Promise<Song> {
    return this.repository.update(slug, input);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
