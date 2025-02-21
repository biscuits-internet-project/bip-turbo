import type { Song } from "@bip/domain";
import type { SQL } from "drizzle-orm";
import { and, count, desc, eq, inArray, sql } from "drizzle-orm";
import { shows, songs, tracks } from "../_shared/drizzle/schema";
import type { NewSong } from "../_shared/drizzle/types";
import { BaseRepository } from "../_shared/repository/base";
import type { SongFilter } from "./song-service";
import { transformSong } from "./song-transformer";

export class SongRepository extends BaseRepository<Song, NewSong, SongFilter> {
  async findById(id: string): Promise<Song | null> {
    const result = await this.db.select().from(songs).where(eq(songs.id, id));
    return result[0] ? transformSong(result[0]) : null;
  }

  async findBySlug(slug: string): Promise<Song | null> {
    const result = await this.db.select().from(songs).where(eq(songs.slug, slug));
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
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(songs.timesPlayed));

    return result.map(transformSong);
  }

  async findTrending() {
    // First get the IDs of the last 10 shows
    const recentShows = await this.db.select({ id: shows.id }).from(shows).orderBy(desc(shows.date)).limit(10);
    const recentShowIds = recentShows.map((show) => show.id);

    const result = await this.db
      .select({
        song: songs,
        showCount: count(),
      })
      .from(songs)
      .innerJoin(tracks, eq(songs.id, tracks.songId))
      .innerJoin(shows, eq(tracks.showId, shows.id))
      .where(inArray(shows.id, recentShowIds))
      .groupBy(songs.id)
      .orderBy(desc(count()))
      .limit(3);

    return result.map((row) => ({
      ...transformSong(row.song),
      count: Number(row.showCount),
    }));
  }

  async findTrendingLastYear() {
    const result = await this.db
      .select({
        song: songs,
        showCount: count(),
      })
      .from(songs)
      .innerJoin(tracks, eq(songs.id, tracks.songId))
      .innerJoin(shows, eq(tracks.showId, shows.id))
      .where(sql`${shows.date} >= (SELECT MAX(date) - INTERVAL '1 year' FROM ${shows})`)
      .groupBy(songs.id)
      .orderBy(desc(count()))
      .limit(10);

    return result.map((row) => ({
      ...transformSong(row.song),
      count: Number(row.showCount),
    }));
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
