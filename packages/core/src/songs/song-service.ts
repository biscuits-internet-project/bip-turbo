import type { Song } from "@bip/domain";
import type { SQL } from "drizzle-orm";
import type { NewSong } from "../_shared/drizzle/types";
import type { SongRepository } from "./song-repository";
import { transformSong } from "./song-transformer";

export interface SongFilter {
  title?: string;
  legacyId?: number;
}

export class SongService {
  constructor(private readonly repository: SongRepository) {}

  async find(id: string): Promise<Song | null> {
    return this.repository.findById(id);
  }

  async findMany(filter: SongFilter): Promise<Song[]> {
    return this.repository.findMany(filter);
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
