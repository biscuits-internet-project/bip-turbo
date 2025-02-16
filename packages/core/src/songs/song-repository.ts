import type { Song } from "@bip/domain";
import type { SQL } from "drizzle-orm";
import { and, eq } from "drizzle-orm";
import { songs } from "../_shared/drizzle/schema";
import type { NewSong } from "../_shared/drizzle/types";
import { BaseRepository } from "../_shared/repository/base";
import type { SongFilter } from "./song-service";
import { transformSong } from "./song-transformer";

export class SongRepository extends BaseRepository<Song, NewSong, SongFilter> {
  async findById(id: string): Promise<Song | null> {
    const result = await this.db.select().from(songs).where(eq(songs.id, id));
    return result[0] ? transformSong(result[0]) : null;
  }

  async findMany(filter: SongFilter): Promise<Song[]> {
    const conditions: SQL<unknown>[] = [];

    if (filter.title) {
      conditions.push(eq(songs.title, filter.title));
    }

    const result = await this.db
      .select()
      .from(songs)
      .where(conditions.length > 0 ? and(...conditions) : undefined);
    return result.map(transformSong);
  }

  async create(data: NewSong): Promise<Song> {
    const result = await this.db.insert(songs).values(data).returning();
    return transformSong(result[0]);
  }

  async update(id: string, data: Partial<NewSong>): Promise<Song> {
    const result = await this.db.update(songs).set(data).where(eq(songs.id, id)).returning();
    return transformSong(result[0]);
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(songs).where(eq(songs.id, id));
  }
}
