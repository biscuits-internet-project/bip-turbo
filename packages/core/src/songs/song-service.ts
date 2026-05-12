import type { Logger, Song, TrendingSong } from "@bip/domain";
import type { DbClient, DbSong } from "../_shared/database/models";
import { buildOrderByClause, buildWhereClause } from "../_shared/database/query-utils";
import type { FilterCondition, QueryOptions } from "../_shared/database/types";
import { SHOW_ORDER_DESC, STATS_SHOWS_WHERE, TRACK_BY_SHOW_ORDER_ASC } from "../_shared/show-ordering";
import { computeSongStats, computeTrackGaps, sortTracksForGapWalk, type TrackForGapWalk } from "../_shared/track-gap";
import { slugify } from "../_shared/utils/slugify";

export interface SongFilter {
  title?: string;
  legacyId?: number;
  startDate?: Date;
  endDate?: Date;
  authorId?: string;
  cover?: boolean;
  attendedUserId?: string;
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

// Mapper function
function mapSongToDomainEntity(dbSong: DbSong): Song {
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
    showsBeforeDebut: null,
    showsSinceDebut: null,
    totalShows: 0,
    percentOfAllShows: null,
    percentSinceDebut: null,
    averageGapShows: null,
    medianGapShows: null,
    longestGapShows: null,
    yearlyPlayData: yearlyPlayData as Record<string, unknown>,
    longestGapsData: longestGapsData as Record<string, unknown>,
    cover: cover ?? false,
  };
}

export class SongService {
  constructor(
    protected readonly db: DbClient,
    protected readonly logger: Logger,
  ) {}

  async findById(id: string): Promise<Song | null> {
    const result = await this.db.song.findUnique({
      where: { id },
    });

    if (!result) return null;
    return mapSongToDomainEntity(result);
  }

  async findBySlug(slug: string): Promise<Song | null> {
    const result = await this.db.song.findUnique({
      where: { slug },
      include: {
        author: true,
      },
    });

    if (!result) return null;

    const song = mapSongToDomainEntity(result);
    if (result.author) {
      song.authorName = result.author.name;
    }

    return song;
  }

  async findMany(filter: SongFilter): Promise<Song[]> {
    // When filtering by attended shows, we need to recalculate timesPlayed from tracks
    if (filter.attendedUserId) {
      return this.findManyInDateRange(filter);
    }

    const { attendedUserId: _, ...dbFilter } = filter;
    const queryOptions: QueryOptions<Song> = {
      filters: Object.entries(dbFilter).map(([field, value]) => ({
        field: field as keyof Song,
        operator: "eq",
        value,
      })) as FilterCondition<Song>[],
    };

    const where = queryOptions.filters ? buildWhereClause(queryOptions.filters) : {};
    const orderBy = queryOptions.sort ? buildOrderByClause(queryOptions.sort) : [{ timesPlayed: "desc" }];
    const skip =
      queryOptions.pagination?.page && queryOptions.pagination?.limit
        ? (queryOptions.pagination.page - 1) * queryOptions.pagination.limit
        : undefined;
    const take = queryOptions.pagination?.limit;

    const results = await this.db.song.findMany({
      where,
      orderBy,
      skip,
      take,
    });

    return results.map((result: DbSong) => mapSongToDomainEntity(result));
  }

  async findManyInDateRange(filter: SongFilter): Promise<Song[]> {
    const { startDate, endDate, attendedUserId, ...restFilter } = filter;

    const queryOptions: QueryOptions<Song> = {
      filters: Object.entries(restFilter).map(([field, value]) => ({
        field: field as keyof Song,
        operator: "eq",
        value,
      })) as FilterCondition<Song>[],
    };

    const where = queryOptions.filters ? buildWhereClause(queryOptions.filters) : {};
    const songs: DbSong[] = await this.db.song.findMany({
      where,
    });

    // Build show filter for tracks query. The STATS_SHOWS_WHERE prefix
    // excludes count_for_stats=false shows so the filtered timesPlayed we
    // produce here matches the global Song.timesPlayed semantic.
    const showFilter: Record<string, unknown> = {
      ...STATS_SHOWS_WHERE,
      date: {
        ...(startDate ? { gte: startDate.toISOString().slice(0, 10) } : {}),
        ...(endDate ? { lte: endDate.toISOString().slice(0, 10) } : {}),
      },
      ...(attendedUserId ? { attendances: { some: { userId: attendedUserId } } } : {}),
    };

    // Get tracks in date range (and optionally attended shows only), unique by song per show
    const tracks = await this.db.track.findMany({
      where: {
        show: showFilter,
      },
      include: {
        song: true,
        show: true,
      },
      distinct: ["songId", "showId"],
    });

    const songShowDates = new Map<string, Date[]>();
    for (const track of tracks) {
      const dbSong = (track as { song?: DbSong }).song;
      if (!dbSong || !track.show?.date) continue;
      const songId = dbSong.id;
      const showDate = new Date(track.show.date);
      if (!songShowDates.has(songId)) {
        songShowDates.set(songId, []);
      }
      const dates = songShowDates.get(songId);
      if (dates) {
        dates.push(showDate);
      }
    }

    // Map original songs, set timesPlayed, dateFirstPlayed, dateLastPlayed
    const songsWithStatsForDateRange = songs.map((dbSong) => {
      const showDates = songShowDates.get(dbSong.id) ?? [];
      showDates.sort((a, b) => a.getTime() - b.getTime());
      const timesPlayed = showDates.length;
      const dateFirstPlayed = timesPlayed > 0 ? showDates[0] : null;
      const dateLastPlayed = timesPlayed > 0 ? showDates[showDates.length - 1] : null;
      return {
        ...mapSongToDomainEntity(dbSong),
        timesPlayed,
        dateFirstPlayed,
        dateLastPlayed,
      };
    });

    // Sort by new timesPlayed descending
    songsWithStatsForDateRange.sort((a, b) => b.timesPlayed - a.timesPlayed);

    return songsWithStatsForDateRange;
  }

  async search(query: string, limit = 20): Promise<Song[]> {
    const queryOptions: QueryOptions<Song> = {
      filters: [
        {
          field: "title",
          operator: "contains",
          value: query,
        },
      ] as FilterCondition<Song>[],
      pagination: {
        limit,
        page: 1,
      },
      sort: [
        {
          field: "title",
          direction: "asc",
        },
      ],
    };

    const where = queryOptions.filters ? buildWhereClause(queryOptions.filters) : {};
    const orderBy = queryOptions.sort ? buildOrderByClause(queryOptions.sort) : [{ timesPlayed: "desc" }];
    const skip =
      queryOptions.pagination?.page && queryOptions.pagination?.limit
        ? (queryOptions.pagination.page - 1) * queryOptions.pagination.limit
        : undefined;
    const take = queryOptions.pagination?.limit;

    const results = await this.db.song.findMany({
      where,
      orderBy,
      skip,
      take,
    });

    return results.map((result: DbSong) => mapSongToDomainEntity(result));
  }

  async findTrendingLastXShows(lastXShows: number, limit: number): Promise<TrendingSong[]> {
    // Trending counts performances at real shows only — soundchecks, radio
    // sessions, and cancelled stubs are excluded so they don't dilute the
    // "what got played at the last N shows" answer.
    const recentShows = await this.db.show.findMany({
      where: STATS_SHOWS_WHERE,
      orderBy: SHOW_ORDER_DESC,
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
        ...mapSongToDomainEntity(song),
        count,
      }));

    return trendingSongs;
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

    return mapSongToDomainEntity(result);
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

    return mapSongToDomainEntity(result);
  }

  async delete(id: string): Promise<void> {
    await this.db.song.delete({
      where: { id },
    });
  }

  /**
   * Recalculate denormalized stats for a specific song: per-track gap +
   * previousPerformanceShowId, and Song.timesPlayed / dateFirst/LastPlayed /
   * yearlyPlayData. Algorithm lives in pure functions in `_shared/track-gap.ts`
   * so it's unit-tested without DB mocks; this method is a thin wrapper that
   * fetches data, runs the pure functions, and writes results.
   *
   * Stats rules:
   *  - Shows with `countForStats=false` (soundchecks, radio sessions, cancelled
   *    stubs, late-night Tractorbeam sets) are excluded from `timesPlayed` /
   *    `dateFirst/LastPlayed` / `yearlyPlayData`.
   *  - Tracks on those shows get a gap pointing at the prior stats-show (so
   *    the soundcheck row reads "last really played N shows ago") but never
   *    act as a `prev` for later tracks — the next stats-performance walks
   *    back past them.
   */
  async updateSongStatistics(songId: string): Promise<void> {
    const tracks = await this.db.track.findMany({
      where: { songId },
      include: {
        show: {
          select: { id: true, date: true, dayOrder: true, countForStats: true },
        },
      },
      orderBy: TRACK_BY_SHOW_ORDER_ASC,
    });

    if (tracks.length === 0) {
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

    // Universe of stats-show dates feeds the "shows between" denominator.
    const statsShows = await this.db.show.findMany({
      where: STATS_SHOWS_WHERE,
      select: { date: true },
      orderBy: { date: "asc" },
    });

    const walkInput: TrackForGapWalk[] = tracks.flatMap((t) => {
      // Drop tracks whose show row failed to join (shouldn't happen — FK
      // is enforced — but the include's type is `show: Show | null`).
      if (!t.show) return [];
      return [
        {
          trackId: t.id,
          showId: t.show.id,
          showDate: t.show.date,
          dayOrder: t.show.dayOrder,
          showCountForStats: t.show.countForStats,
          position: t.position,
        },
      ];
    });

    const sortedTracks = sortTracksForGapWalk(walkInput);
    const gapResults = computeTrackGaps(
      sortedTracks,
      statsShows.map((s) => s.date),
    );
    const songStats = computeSongStats(
      walkInput.filter((t) => t.showCountForStats).map((t) => ({ showId: t.showId, showDate: t.showDate })),
    );

    await Promise.all([
      ...gapResults.map((g) =>
        this.db.track.update({
          where: { id: g.trackId },
          data: { gap: g.gap, previousPerformanceShowId: g.previousPerformanceShowId },
        }),
      ),
      this.db.song.update({
        where: { id: songId },
        data: {
          timesPlayed: songStats.timesPlayed,
          dateFirstPlayed: songStats.dateFirstPlayed,
          dateLastPlayed: songStats.dateLastPlayed,
          yearlyPlayData: songStats.yearlyPlayData,
          updatedAt: new Date(),
        },
      }),
    ]);
  }
}
