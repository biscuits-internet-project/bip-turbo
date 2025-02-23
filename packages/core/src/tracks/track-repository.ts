import type { Track } from "@bip/domain";
import type { SQL } from "drizzle-orm";
import { and, eq } from "drizzle-orm";
import { type TrackFilter, transformTrack } from "..";
import { tracks } from "../_shared/drizzle";
import type { NewTrack } from "../_shared/drizzle/types";
import { BaseRepository } from "../_shared/repository/base";

export class TrackRepository extends BaseRepository<Track, NewTrack> {
  async findById(id: string): Promise<Track | null> {
    const result = await this.db.select().from(tracks).where(eq(tracks.id, id));
    return result[0] ? transformTrack(result[0]) : null;
  }

  async findBySlug(slug: string): Promise<Track | null> {
    const result = await this.db.select().from(tracks).where(eq(tracks.slug, slug));
    return result[0] ? transformTrack(result[0]) : null;
  }

  async findMany(filter: TrackFilter): Promise<Track[]> {
    const conditions: SQL<unknown>[] = [];

    if (filter.showId) {
      conditions.push(eq(tracks.showId, filter.showId));
    }

    const result = await this.db
      .select()
      .from(tracks)
      .where(conditions.length > 0 ? and(...conditions) : undefined);
    return result.map(transformTrack);
  }

  async create(data: NewTrack): Promise<Track> {
    const result = await this.db.insert(tracks).values(data).returning();
    return transformTrack(result[0]);
  }

  async update(id: string, data: Partial<NewTrack>): Promise<Track> {
    const result = await this.db.update(tracks).set(data).where(eq(tracks.id, id)).returning();
    return transformTrack(result[0]);
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(tracks).where(eq(tracks.id, id));
  }
}
