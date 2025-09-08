import type { Song, TrendingSong } from "@bip/domain";
import type { DbClient, DbSong } from "../_shared/database/models";
import { buildOrderByClause, buildWhereClause } from "../_shared/database/query-utils";
import type { QueryOptions } from "../_shared/database/types";
import { slugify } from "../_shared/utils/slugify";
import type { CreateSongInput, UpdateSongInput } from "./song-service";

export function mapSongToDomainEntity(dbSong: DbSong): Song {
  const { createdAt, updatedAt, dateLastPlayed, dateFirstPlayed, yearlyPlayData, longestGapsData, cover, ...rest } =
    dbSong;

  return {
    ...rest,
    createdAt: new Date(createdAt),
    updatedAt: new Date(updatedAt),
    dateLastPlayed: dateLastPlayed ? new Date(dateLastPlayed) : null,
    dateFirstPlayed: dateFirstPlayed ? new Date(dateFirstPlayed) : null,
    actualLastPlayedDate: null,
    showsSinceLastPlayed: null,
    lastVenue: null,
    firstVenue: null,
    firstShowSlug: null,
    lastShowSlug: null,
    yearlyPlayData: yearlyPlayData as Record<string, unknown>,
    longestGapsData: longestGapsData as Record<string, unknown>,
    cover: cover ?? false,
  };
}

export function mapSongToDbModel(entity: Partial<Song>): Partial<DbSong> {
  return entity as Partial<DbSong>;
}

export class SongRepository {
  constructor(private readonly db: DbClient) {}

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
    const where = options?.filters ? buildWhereClause(options.filters) : {};
    const orderBy = options?.sort ? buildOrderByClause(options.sort) : [{ timesPlayed: "desc" }];
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

  async create(input: CreateSongInput): Promise<Song> {
    const slug = slugify(input.title);
    const now = new Date();
    const result = await this.db.song.create({
      data: {
        ...input,
        slug,
        createdAt: now,
        updatedAt: now,
        yearlyPlayData: {},
        longestGapsData: {},
        timesPlayed: 0,
      },
    });

    return this.mapToDomainEntity(result);
  }

  async update(slug: string, input: UpdateSongInput): Promise<Song> {
    const now = new Date();
    const result = await this.db.song.update({
      where: { slug },
      data: {
        ...input,
        updatedAt: now,
        ...(input.title ? { slug: slugify(input.title) } : {}),
      },
    });

    return this.mapToDomainEntity(result);
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
    // Calculate date range for the current calendar year
    const currentYear = new Date().getFullYear();

    // Find shows from the current calendar year
    const shows = await this.db.show.findMany({
      where: {
        date: {
          gte: `${currentYear}-01-01`,
          lte: `${currentYear}-12-31`,
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

    // Count unique shows for each song (not individual tracks)
    const songCounts = new Map<string, { song: DbSong; showIds: Set<string> }>();

    for (const track of tracks) {
      if (!track.song) continue;

      const songId = track.song.id;
      const existing = songCounts.get(songId);

      if (existing) {
        existing.showIds.add(track.showId);
      } else {
        songCounts.set(songId, { song: track.song, showIds: new Set([track.showId]) });
      }
    }

    // Convert to array, sort by count, and limit to top 10
    const trendingSongs = Array.from(songCounts.values())
      .sort((a, b) => b.showIds.size - a.showIds.size)
      .slice(0, 10)
      .map(({ song, showIds }) => ({
        ...this.mapToDomainEntity(song),
        count: showIds.size,
      }));

    return trendingSongs;
  }

  async delete(id: string): Promise<boolean> {
    await this.db.song.delete({
      where: { id },
    });
    return true;
  }

  /**
   * Recalculate and update statistics for a specific song based on its tracks
   */
  async updateSongStatistics(songId: string): Promise<void> {
    // Get all unique shows for this song (count shows, not individual tracks)
    const uniqueShows = await this.db.track.findMany({
      where: { songId },
      distinct: ["showId"],
      include: {
        show: {
          select: { date: true },
        },
      },
      orderBy: {
        show: {
          date: "asc",
        },
      },
    });

    if (uniqueShows.length === 0) {
      // No tracks, reset statistics
      await this.db.song.update({
        where: { id: songId },
        data: {
          timesPlayed: 0,
          dateFirstPlayed: null,
          dateLastPlayed: null,
          yearlyPlayData: {},
        },
      });
      return;
    }

    // Calculate statistics based on unique shows
    const timesPlayed = uniqueShows.length;
    const firstShow = uniqueShows[0];
    const lastShow = uniqueShows[uniqueShows.length - 1];

    // Build yearly play data (count unique shows per year)
    const yearlyPlayData: Record<string, number> = {};
    uniqueShows.forEach((track) => {
      if (track.show?.date) {
        const year = new Date(track.show.date).getFullYear().toString();
        yearlyPlayData[year] = (yearlyPlayData[year] || 0) + 1;
      }
    });

    // Update the song
    await this.db.song.update({
      where: { id: songId },
      data: {
        timesPlayed,
        dateFirstPlayed: firstShow.show?.date ? new Date(firstShow.show.date) : null,
        dateLastPlayed: lastShow.show?.date ? new Date(lastShow.show.date) : null,
        yearlyPlayData: yearlyPlayData as any,
        updatedAt: new Date(),
      },
    });
  }
}
