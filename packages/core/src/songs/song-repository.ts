import type { Song, TrendingSong } from "@bip/domain";
import { BaseRepository } from "../_shared/database/base-repository";
import type { DbSong } from "../_shared/database/models";
import type { QueryOptions } from "../_shared/database/types";

export function mapSongToDomainEntity(dbSong: DbSong): Song {
  const { createdAt, updatedAt, dateLastPlayed, yearlyPlayData, longestGapsData, cover, ...rest } = dbSong;

  return {
    ...rest,
    createdAt: new Date(createdAt),
    updatedAt: new Date(updatedAt),
    dateLastPlayed: dateLastPlayed ? new Date(dateLastPlayed) : null,
    yearlyPlayData: yearlyPlayData as Record<string, unknown>,
    longestGapsData: longestGapsData as Record<string, unknown>,
    cover: cover ?? false,
  };
}

export function mapSongToDbModel(entity: Partial<Song>): Partial<DbSong> {
  return entity as Partial<DbSong>;
}

export class SongRepository extends BaseRepository<Song, DbSong> {
  protected modelName = "song" as const;

  protected mapToDomainEntity(dbSong: DbSong): Song {
    return mapSongToDomainEntity(dbSong);
  }

  protected mapToDbModel(entity: Partial<Song>): Partial<DbSong> {
    return mapSongToDbModel(entity);
  }

  async findById(id: string): Promise<Song | null> {
    const result = await this.db.song.findUnique({
      where: { id },
    });

    if (!result) return null;
    return this.mapToDomainEntity(result);
  }

  async findBySlug(slug: string): Promise<Song | null> {
    const result = await this.db.song.findUnique({
      where: { slug },
      include: {
        author: true,
      },
    });

    if (!result) return null;

    const song = this.mapToDomainEntity(result);
    if (result.author) {
      song.authorName = result.author.name;
    }

    return song;
  }

  async findMany(options?: QueryOptions<Song>): Promise<Song[]> {
    const where = options?.filters ? this.buildWhereClause(options.filters) : {};
    const orderBy = options?.sort ? this.buildOrderByClause(options.sort) : [{ timesPlayed: "desc" }];
    const skip =
      options?.pagination?.page && options?.pagination?.limit
        ? (options.pagination.page - 1) * options.pagination.limit
        : undefined;
    const take = options?.pagination?.limit;

    const results = await this.db.song.findMany({
      where,
      orderBy,
      skip,
      take,
    });

    return results.map((result: DbSong) => this.mapToDomainEntity(result));
  }

  async findTrendingLastXShows(lastXShows: number, limit: number): Promise<TrendingSong[]> {
    // Get the most recent shows
    const recentShows = await this.db.show.findMany({
      orderBy: { date: "desc" },
      take: lastXShows,
    });

    if (recentShows.length === 0) return [];

    // Get the show IDs
    const showIds = recentShows.map((show) => show.id);

    // Find tracks from these shows and count songs
    const tracks = await this.db.track.findMany({
      where: { showId: { in: showIds } },
      include: { song: true },
    });

    // Count occurrences of each song
    const songCounts = new Map<string, { song: DbSong; count: number }>();

    for (const track of tracks) {
      if (!track.song) continue;

      const songId = track.song.id;
      const existing = songCounts.get(songId);

      if (existing) {
        existing.count += 1;
      } else {
        songCounts.set(songId, { song: track.song, count: 1 });
      }
    }

    // Convert to array, sort by count, and limit
    const trendingSongs = Array.from(songCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
      .map(({ song, count }) => ({
        ...this.mapToDomainEntity(song),
        count,
      }));

    return trendingSongs;
  }

  async findTrendingLastYear(): Promise<TrendingSong[]> {
    // Calculate date range for the last year
    const now = new Date();
    const oneYearAgo = new Date(now);
    oneYearAgo.setFullYear(now.getFullYear() - 1);

    // Find shows from the last year
    const shows = await this.db.show.findMany({
      where: {
        date: {
          gte: `${oneYearAgo.getFullYear()}-${String(oneYearAgo.getMonth() + 1).padStart(2, "0")}-${String(oneYearAgo.getDate()).padStart(2, "0")}`,
          lte: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`,
        },
      },
    });

    if (shows.length === 0) return [];

    // Get the show IDs
    const showIds = shows.map((show) => show.id);

    // Find tracks from these shows and count songs
    const tracks = await this.db.track.findMany({
      where: { showId: { in: showIds } },
      include: { song: true },
    });

    // Count occurrences of each song
    const songCounts = new Map<string, { song: DbSong; count: number }>();

    for (const track of tracks) {
      if (!track.song) continue;

      const songId = track.song.id;
      const existing = songCounts.get(songId);

      if (existing) {
        existing.count += 1;
      } else {
        songCounts.set(songId, { song: track.song, count: 1 });
      }
    }

    // Convert to array, sort by count, and limit to top 10
    const trendingSongs = Array.from(songCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map(({ song, count }) => ({
        ...this.mapToDomainEntity(song),
        count,
      }));

    return trendingSongs;
  }

  async delete(id: string): Promise<boolean> {
    await this.db.song.delete({
      where: { id },
    });
    return true;
  }
}
