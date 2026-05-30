import {
  type AllTimersPageView,
  type Annotation,
  countSortedAfter,
  countSortedBetween,
  countSortedOnOrAfter,
  type SongPagePerformance,
  type SongPageView,
} from "@bip/domain";
import { Prisma } from "@prisma/client";
import type { DbClient } from "../_shared/database/models";
import { showOrderBySql, statsShowsSql } from "../_shared/show-ordering";
import { computeTrackGaps, sortTracksForGapWalk, type TrackForGapWalk } from "../_shared/track-gap";
import type { SongService } from "../songs/song-service";
import type { StatsService } from "../stats/stats-service";

/**
 * Filters for querying performances. All fields are optional — only
 * active filters produce SQL conditions. Used by buildAllTimers and
 * buildSongPerformances to construct dynamic WHERE clauses.
 */
/** Per-song aggregates returned by `buildFilteredSongRarity`. */
export interface FilteredSongRarity {
  filteredShowsSinceLastPlayed: number | null;
  filteredPercentSinceDebut: number | null;
  filteredAverageGapShows: number | null;
  dateFirstFilteredPlayed: Date;
  dateLastFilteredPlayed: Date;
}

export interface PerformanceFilterOptions {
  startDate?: Date;
  endDate?: Date;
  cover?: boolean;
  authorId?: string;
  attendedUserId?: string;
  encore?: boolean;
  setOpener?: boolean;
  setCloser?: boolean;
  segueIn?: boolean;
  segueOut?: boolean;
  standalone?: boolean;
  inverted?: boolean;
  dyslexic?: boolean;
  /** Narrow to tracks carrying a curated jam-chart note (non-empty). */
  jamChart?: boolean;
  allTimer?: boolean;
  monthDay?: string;
}

export class SongPageComposer {
  constructor(
    private db: DbClient,
    private songService: SongService,
    private statsService?: StatsService,
  ) {}

  async build(songSlug: string): Promise<SongPageView> {
    const song = await this.songService.findBySlug(songSlug);

    if (!song) throw new Error("Song not found");

    // Computed off the cached stats-show-dates array; cheap enough that
    // recomputing below against `actualLastPlayedDate` is fine.
    let showsSinceLastPlayed: number | null = null;
    if (song.dateLastPlayed && this.statsService) {
      showsSinceLastPlayed = await this.statsService.getShowsSinceLastPlayed(song.dateLastPlayed);
    }

    // Get actual last performance date, venue, and show slug
    let actualLastPlayedDate: Date | null = null;
    let lastVenue: { name: string; city?: string; state?: string } | null = null;
    let lastShowSlug: string | null = null;
    const lastPerformance = await this.db.$queryRaw<
      [
        {
          show_date: string | null;
          show_slug: string | null;
          venue_name: string | null;
          venue_city: string | null;
          venue_state: string | null;
        },
      ]
    >`
      SELECT shows.date as show_date, shows.slug as show_slug, venues.name as venue_name, venues.city as venue_city, venues.state as venue_state
      FROM tracks
      JOIN shows ON tracks.show_id = shows.id
      LEFT JOIN venues ON shows.venue_id = venues.id
      WHERE tracks.song_id = ${song.id}::uuid
        AND ${statsShowsSql("shows")}
      ORDER BY ${showOrderBySql("shows", "DESC")}
      LIMIT 1
    `;

    if (lastPerformance[0]) {
      if (lastPerformance[0].show_date) {
        actualLastPlayedDate = new Date(lastPerformance[0].show_date);
      }
      if (lastPerformance[0].show_slug) {
        lastShowSlug = lastPerformance[0].show_slug;
      }
      if (lastPerformance[0].venue_name) {
        lastVenue = {
          name: lastPerformance[0].venue_name,
          city: lastPerformance[0].venue_city || undefined,
          state: lastPerformance[0].venue_state || undefined,
        };
      }
    }

    // Get first performance venue and show slug
    let firstVenue: { name: string; city?: string; state?: string } | null = null;
    let firstShowSlug: string | null = null;
    const firstPerformance = await this.db.$queryRaw<
      [{ show_slug: string | null; venue_name: string | null; venue_city: string | null; venue_state: string | null }]
    >`
      SELECT shows.slug as show_slug, venues.name as venue_name, venues.city as venue_city, venues.state as venue_state
      FROM tracks
      JOIN shows ON tracks.show_id = shows.id
      LEFT JOIN venues ON shows.venue_id = venues.id
      WHERE tracks.song_id = ${song.id}::uuid
        AND ${statsShowsSql("shows")}
      ORDER BY ${showOrderBySql("shows", "ASC")}
      LIMIT 1
    `;

    if (firstPerformance[0]) {
      if (firstPerformance[0].show_slug) {
        firstShowSlug = firstPerformance[0].show_slug;
      }
      if (firstPerformance[0].venue_name) {
        firstVenue = {
          name: firstPerformance[0].venue_name,
          city: firstPerformance[0].venue_city || undefined,
          state: firstPerformance[0].venue_state || undefined,
        };
      }
    }

    // Recompute against the stats-eligible actual-last-played date — may
    // differ from song.dateLastPlayed if the most recent track sits on a
    // count_for_stats=false show.
    if (actualLastPlayedDate && this.statsService) {
      showsSinceLastPlayed = await this.statsService.getShowsSinceLastPlayed(actualLastPlayedDate);
    }

    const result = await this.queryPerformances({
      whereClause: Prisma.sql`tracks.song_id = ${song.id}::uuid`,
    });

    const performances = result.map((row) => ({
      ...this.transformToSongPagePerformanceView(row),
      cover: song.cover ?? undefined,
      authorId: song.authorId ?? null,
      // Single-song rows skip the song join; fill in title/slug from the
      // page's song context so cross-song renderers (e.g. the
      // noteworthy-track popover header) see a populated title.
      songTitle: song.title,
      songSlug: song.slug,
    }));
    await this.enrichPerformances(performances);

    const showsByYear = this.statsService ? await this.statsService.getShowsByYear() : {};
    const rarity = computeRarityStats(
      { dateFirstPlayed: song.dateFirstPlayed, timesPlayed: song.timesPlayed },
      showsByYear,
    );

    // Aggregate the closed gaps between consecutive stats-eligible plays
    // of this song. `tracks.gap` is NULL on debuts and populated for
    // every later performance, so MAX/AVG/percentile cover only real
    // closed intervals. Non-stats shows are excluded so late-night side
    // projects don't pollute the numbers. All three are null when the
    // song has been played at most once (no closed gap exists).
    const gapAggregateResult = await this.db.$queryRaw<
      [{ longest: number | null; average: number | null; median: number | null }]
    >`
      SELECT
        MAX(tracks.gap)::int AS longest,
        AVG(tracks.gap)::float AS average,
        percentile_cont(0.5) WITHIN GROUP (ORDER BY tracks.gap)::float AS median
      FROM tracks
      JOIN shows ON tracks.show_id = shows.id
      WHERE tracks.song_id = ${song.id}::uuid
        AND tracks.gap IS NOT NULL
        AND ${statsShowsSql("shows")}
    `;
    const longestGapShows = gapAggregateResult[0]?.longest ?? null;
    const averageGapShows = gapAggregateResult[0]?.average ?? null;
    const medianGapShows = gapAggregateResult[0]?.median ?? null;

    return {
      song: {
        ...song,
        actualLastPlayedDate,
        showsSinceLastPlayed,
        lastVenue,
        lastShowSlug,
        firstVenue,
        firstShowSlug,
        ...rarity,
        averageGapShows,
        medianGapShows,
        longestGapShows,
      },
      performances,
      showsByYear,
    };
  }

  async countAllTimersByMonthDay(monthDay: string): Promise<number> {
    const result = await this.db.$queryRaw<[{ count: string }]>`
      SELECT COUNT(*)::text as count
      FROM tracks
      JOIN shows ON tracks.show_id = shows.id
      WHERE tracks.all_timer = true
        AND shows.date LIKE ${`%-${monthDay}`}
        AND ${statsShowsSql("shows")}
    `;
    return Number.parseInt(result[0].count, 10);
  }

  /** Build the all-timers page view, optionally filtered by date range, cover, author, attendance, and performance tags. */
  async buildAllTimers(options?: PerformanceFilterOptions): Promise<AllTimersPageView> {
    return this.buildCrossSongPerformanceView(Prisma.sql`tracks.all_timer = true`, options);
  }

  /**
   * Build the Jam Charts page view. Includes any track that is either an
   * all-timer OR carries a curated note — the union of the two
   * noteworthy categories surfaced throughout the app. The note column
   * historically allows empty strings as well as NULL for "no note", so
   * both are filtered out to match what the UI treats as a real note.
   */
  async buildJamCharts(options?: PerformanceFilterOptions): Promise<AllTimersPageView> {
    return this.buildCrossSongPerformanceView(
      Prisma.sql`(tracks.all_timer = true OR (tracks.note IS NOT NULL AND tracks.note <> ''))`,
      options,
    );
  }

  /**
   * Shared body of the cross-song page views (all-timers, jam-charts).
   * The two endpoints differ only in their base WHERE condition; this
   * helper composes the rest of the pipeline — filter merging, the
   * cross-song SELECT with song title/slug, and per-track enrichment.
   */
  private async buildCrossSongPerformanceView(
    baseCondition: Prisma.Sql,
    options?: PerformanceFilterOptions,
  ): Promise<AllTimersPageView> {
    const { conditions, extraJoins } = SongPageComposer.buildFilterQuery([baseCondition], options);
    const whereClause = Prisma.join(conditions, " AND ");
    const result = await this.queryPerformances({
      whereClause,
      includeSongInfo: true,
      extraJoins,
    });

    const performances = (result as AllTimerPerformanceDto[]).map((row) => ({
      ...this.transformToSongPagePerformanceView(row),
      songTitle: row.song_title,
      songSlug: row.song_slug,
    }));
    await this.enrichPerformances(performances);

    return { performances };
  }

  /** Build a filtered list of performances for a single song. */
  async buildSongPerformances(songSlug: string, options?: PerformanceFilterOptions): Promise<SongPagePerformance[]> {
    const song = await this.songService.findBySlug(songSlug);
    if (!song) throw new Error("Song not found");

    const { conditions, extraJoins } = SongPageComposer.buildFilterQuery(
      [Prisma.sql`tracks.song_id = ${song.id}::uuid`],
      options,
    );

    const whereClause = Prisma.join(conditions, " AND ");
    const result = await this.queryPerformances({ whereClause, extraJoins });

    const performances = result.map((row) => ({
      ...this.transformToSongPagePerformanceView(row),
      cover: song.cover ?? undefined,
      authorId: song.authorId ?? null,
      // The per-song composer queries without a song join (the song is
      // already known), so the raw rows don't carry song_title/song_slug.
      // Fill them in from the page's song context so downstream renderers
      // (e.g. the noteworthy-track popover header) don't see an empty
      // title when this projection lands in a cross-song UI component.
      songTitle: song.title,
      songSlug: song.slug,
    }));
    await this.enrichPerformances(performances);

    if (isNarrowingFilter(options)) {
      const matchingShowDates = await this.getFilterMatchingShowDates(options ?? {});
      assignFilteredGaps(performances, matchingShowDates);
    }

    return performances;
  }

  /**
   * Count matching performances per song, grouped by song_id.
   * Used by /songs to show per-song counts when toggle filters are active.
   */
  async buildSongPerformanceCounts(options?: PerformanceFilterOptions): Promise<Record<string, number>> {
    // Always exclude count_for_stats=false shows so the "filtered plays"
    // column on /songs matches the global Song.timesPlayed semantic.
    const { conditions, extraJoins } = SongPageComposer.buildFilterQuery([statsShowsSql("shows")], options);

    const whereClause = conditions.length > 0 ? Prisma.sql`WHERE ${Prisma.join(conditions, " AND ")}` : Prisma.empty;

    const extraJoinsSql = extraJoins.length > 0 ? Prisma.sql`${Prisma.join(extraJoins, "\n      ")}` : Prisma.empty;

    const rows = await this.db.$queryRaw<Array<{ song_id: string; count: string }>>`
      SELECT tracks.song_id, COUNT(DISTINCT tracks.id)::text as count
      FROM tracks
      JOIN shows ON tracks.show_id = shows.id
      JOIN songs ON tracks.song_id = songs.id
      ${extraJoinsSql}
      LEFT JOIN tracks prevTracks ON tracks.show_id = prevTracks.show_id
        AND prevTracks.position = tracks.position - 1
        AND prevTracks.set = tracks.set
      ${whereClause}
      GROUP BY tracks.song_id
    `;

    const result: Record<string, number> = {};
    for (const row of rows) {
      result[row.song_id] = Number.parseInt(row.count, 10);
    }
    return result;
  }

  /**
   * Per-song aggregates restricted to the active filter scope. Returns
   * filtered-version analogs of the three rarity columns on /songs:
   *   - filteredShowsSinceLastPlayed: matching-universe shows strictly
   *     after this song's last filtered play
   *   - filteredPercentSinceDebut: filteredTimesPlayed divided by the
   *     count of matching-universe shows on or after this song's first
   *     filtered play
   *   - filteredAverageGapShows: mean closed gap within the filter scope —
   *     matching shows strictly between first and last filtered plays
   *     divided by (filteredTimesPlayed - 1)
   *
   * Only computed for the survivor set the loader already produced. Songs
   * absent from the result map are left untouched by the caller; the UI
   * renders em-dash for missing entries.
   */
  async buildFilteredSongRarity(
    songIds: string[],
    options: PerformanceFilterOptions,
  ): Promise<Map<string, FilteredSongRarity>> {
    if (songIds.length === 0) return new Map();

    const matchingShowDates = await this.getFilterMatchingShowDates(options);
    if (matchingShowDates.length === 0) return new Map();

    const { conditions, extraJoins } = SongPageComposer.buildFilterQuery([statsShowsSql("shows")], options);
    conditions.push(Prisma.sql`tracks.song_id = ANY(${songIds}::uuid[])`);

    const whereClause = Prisma.sql`WHERE ${Prisma.join(conditions, " AND ")}`;
    const extraJoinsSql = extraJoins.length > 0 ? Prisma.sql`${Prisma.join(extraJoins, "\n      ")}` : Prisma.empty;

    const rows = await this.db.$queryRaw<
      Array<{ song_id: string; show_count: string; first_date: string; last_date: string }>
    >`
      SELECT
        tracks.song_id,
        COUNT(DISTINCT tracks.show_id)::text AS show_count,
        to_char(MIN(shows.date::date), 'YYYY-MM-DD') AS first_date,
        to_char(MAX(shows.date::date), 'YYYY-MM-DD') AS last_date
      FROM tracks
      JOIN shows ON tracks.show_id = shows.id
      JOIN songs ON tracks.song_id = songs.id
      ${extraJoinsSql}
      LEFT JOIN tracks prevTracks ON tracks.show_id = prevTracks.show_id
        AND prevTracks.position = tracks.position - 1
        AND prevTracks.set = tracks.set
      ${whereClause}
      GROUP BY tracks.song_id
    `;

    const out = new Map<string, FilteredSongRarity>();
    for (const row of rows) {
      const filteredTimesPlayed = Number.parseInt(row.show_count, 10);
      const filteredShowsSinceLastPlayed = countSortedAfter(matchingShowDates, row.last_date);
      const showsOnOrAfterDebut = countSortedOnOrAfter(matchingShowDates, row.first_date);
      const filteredPercentSinceDebut = showsOnOrAfterDebut === 0 ? null : filteredTimesPlayed / showsOnOrAfterDebut;
      // Mean closed gap within the filter scope. Numerator counts only
      // matching shows strictly BETWEEN the first and last filtered plays,
      // excluding the trailing dry spell after the last play and the
      // pre-first-play stretch. Without that bracketing, an early-clustered
      // song with a long quiet tail inside the filter would have its avg
      // inflated by the tail. Requires ≥ 2 plays for a closed gap to exist.
      const filteredAverageGapShows =
        filteredTimesPlayed < 2
          ? null
          : countSortedBetween(matchingShowDates, row.first_date, row.last_date) / (filteredTimesPlayed - 1);
      out.set(row.song_id, {
        filteredShowsSinceLastPlayed,
        filteredPercentSinceDebut,
        filteredAverageGapShows,
        dateFirstFilteredPlayed: new Date(row.first_date),
        dateLastFilteredPlayed: new Date(row.last_date),
      });
    }
    return out;
  }

  /**
   * Returns sorted ISO date strings (`YYYY-MM-DD`) for the stats-eligible
   * shows that contain at least one track matching the active filters.
   * Drives the "shows between" denominator for the Filtered Gap column on
   * song detail and the filtered rarity aggregates on /songs.
   *
   * The query reuses the same JOINs as `buildSongPerformanceCounts` so the
   * filter SQL composes consistently — anything that affects which
   * performances count also affects which shows qualify here.
   */
  async getFilterMatchingShowDates(options: PerformanceFilterOptions): Promise<string[]> {
    const { conditions, extraJoins } = SongPageComposer.buildFilterQuery([statsShowsSql("shows")], options);

    const whereClause = conditions.length > 0 ? Prisma.sql`WHERE ${Prisma.join(conditions, " AND ")}` : Prisma.empty;
    const extraJoinsSql = extraJoins.length > 0 ? Prisma.sql`${Prisma.join(extraJoins, "\n      ")}` : Prisma.empty;

    const rows = await this.db.$queryRaw<Array<{ d: string }>>`
      SELECT DISTINCT to_char(shows.date::date, 'YYYY-MM-DD') AS d
      FROM tracks
      JOIN shows ON tracks.show_id = shows.id
      JOIN songs ON tracks.song_id = songs.id
      ${extraJoinsSql}
      LEFT JOIN tracks prevTracks ON tracks.show_id = prevTracks.show_id
        AND prevTracks.position = tracks.position - 1
        AND prevTracks.set = tracks.set
      ${whereClause}
      ORDER BY d
    `;
    return rows.map((row) => row.d);
  }

  /**
   * Maps each filter field to a function that returns its SQL condition
   * (WHERE clause) or join. Returns null when the filter is inactive.
   * Value-carrying filters (dates, IDs) interpolate their values into
   * parameterized SQL. Boolean filters produce static SQL fragments.
   */
  static readonly FILTER_BUILDERS: Record<
    string,
    (options: PerformanceFilterOptions) => { condition?: Prisma.Sql; join?: Prisma.Sql } | null
  > = {
    startDate: (o) =>
      o.startDate ? { condition: Prisma.sql`shows.date >= ${o.startDate.toISOString().slice(0, 10)}` } : null,
    endDate: (o) =>
      o.endDate ? { condition: Prisma.sql`shows.date <= ${o.endDate.toISOString().slice(0, 10)}` } : null,
    cover: (o) => (o.cover !== undefined ? { condition: Prisma.sql`songs.cover = ${o.cover}` } : null),
    authorId: (o) => (o.authorId ? { condition: Prisma.sql`songs.author_id = ${o.authorId}::uuid` } : null),
    attendedUserId: (o) =>
      o.attendedUserId
        ? {
            join: Prisma.sql`JOIN attendances ON attendances.show_id = shows.id AND attendances.user_id = ${o.attendedUserId}::uuid`,
          }
        : null,
    encore: (o) => (o.encore ? { condition: Prisma.sql`tracks.set LIKE 'E%'` } : null),
    setOpener: (o) =>
      o.setOpener
        ? {
            condition: Prisma.sql`tracks.position = (SELECT MIN(t2.position) FROM tracks t2 WHERE t2.show_id = tracks.show_id AND t2.set = tracks.set) AND tracks.set NOT LIKE 'E%'`,
          }
        : null,
    setCloser: (o) =>
      o.setCloser
        ? {
            condition: Prisma.sql`tracks.position = (SELECT MAX(t2.position) FROM tracks t2 WHERE t2.show_id = tracks.show_id AND t2.set = tracks.set) AND tracks.set NOT LIKE 'E%'`,
          }
        : null,
    segueOut: (o) => (o.segueOut ? { condition: Prisma.sql`tracks.segue IS NOT NULL AND tracks.segue != ''` } : null),
    segueIn: (o) =>
      o.segueIn ? { condition: Prisma.sql`prevTracks.segue IS NOT NULL AND prevTracks.segue != ''` } : null,
    standalone: (o) =>
      o.standalone
        ? {
            condition: Prisma.sql`(tracks.segue IS NULL OR tracks.segue = '') AND (prevTracks.segue IS NULL OR prevTracks.segue = '')`,
          }
        : null,
    allTimer: (o) => (o.allTimer ? { condition: Prisma.sql`tracks.all_timer = true` } : null),
    jamChart: (o) => (o.jamChart ? { condition: Prisma.sql`tracks.note IS NOT NULL AND tracks.note <> ''` } : null),
    monthDay: (o) => (o.monthDay ? { condition: Prisma.sql`shows.date LIKE ${`%-${o.monthDay}`}` } : null),
    inverted: (o) =>
      o.inverted
        ? {
            condition: Prisma.sql`EXISTS (SELECT 1 FROM annotations WHERE annotations.track_id = tracks.id AND LOWER(annotations.desc) LIKE '%inverted%')`,
          }
        : null,
    dyslexic: (o) =>
      o.dyslexic
        ? {
            condition: Prisma.sql`EXISTS (SELECT 1 FROM annotations WHERE annotations.track_id = tracks.id AND LOWER(annotations.desc) LIKE '%dyslexic%')`,
          }
        : null,
  };

  /** Combine base conditions with active filter conditions and joins. */
  static buildFilterQuery(
    baseConditions: Prisma.Sql[],
    options?: PerformanceFilterOptions,
  ): { conditions: Prisma.Sql[]; extraJoins: Prisma.Sql[] } {
    const conditions = [...baseConditions];
    const extraJoins: Prisma.Sql[] = [];

    if (!options) return { conditions, extraJoins };

    for (const builder of Object.values(SongPageComposer.FILTER_BUILDERS)) {
      const result = builder(options);
      if (result?.condition) conditions.push(result.condition);
      if (result?.join) extraJoins.push(result.join);
    }

    return { conditions, extraJoins };
  }

  private async queryPerformances(options: {
    whereClause: Prisma.Sql;
    includeSongInfo?: boolean;
    extraJoins?: Prisma.Sql[];
  }): Promise<PerformanceDto[]> {
    const songColumns = options.includeSongInfo
      ? Prisma.sql`, songs.title as song_title, songs.slug as song_slug, songs.cover as song_cover, songs.author_id as song_author_id`
      : Prisma.empty;
    const songJoin = options.includeSongInfo ? Prisma.sql`JOIN songs ON tracks.song_id = songs.id` : Prisma.empty;
    const extraJoinsSql =
      options.extraJoins && options.extraJoins.length > 0
        ? Prisma.sql`${Prisma.join(options.extraJoins, "\n      ")}`
        : Prisma.empty;

    return this.db.$queryRaw<PerformanceDto[]>`
      SELECT
        shows.id,
        shows.date,
        shows.venue_id,
        shows.slug,
        shows.day_order,
        shows.count_for_stats,
        venues.id as venue_id,
        venues.name as venue_name,
        venues.city as venue_city,
        venues.state as venue_state,
        venues.country as venue_country,
        venues.slug as venue_slug,
        tracks.id as track_id,
        tracks.song_id,
        tracks.segue,
        tracks.set,
        tracks.position,
        tracks.all_timer,
        tracks.average_rating,
        tracks.ratings_count,
        tracks.note,
        tracks.gap,
        tracks.duration,
        tracks.duration_source,
        tracks.previous_performance_show_id,
        prevShows.slug as previous_show_slug,
        prevShows.date as previous_show_date
        ${songColumns},
        nextTracks.segue as next_track_segue,
        prevTracks.segue as prev_track_segue,
        nextSongs.id as next_song_id,
        nextSongs.title as next_song_title,
        nextSongs.slug as next_song_slug,
        prevSongs.id as prev_song_id,
        prevSongs.title as prev_song_title,
        prevSongs.slug as prev_song_slug
      FROM tracks
      ${songJoin}
      JOIN shows ON tracks.show_id = shows.id
      LEFT JOIN venues ON shows.venue_id = venues.id
      ${extraJoinsSql}
      LEFT JOIN tracks nextTracks ON tracks.show_id = nextTracks.show_id
        AND nextTracks.position = tracks.position + 1
        AND nextTracks.set = tracks.set
      LEFT JOIN songs nextSongs ON nextTracks.song_id = nextSongs.id
      LEFT JOIN tracks prevTracks ON tracks.show_id = prevTracks.show_id
        AND prevTracks.position = tracks.position - 1
        AND prevTracks.set = tracks.set
      LEFT JOIN songs prevSongs ON prevTracks.song_id = prevSongs.id
      LEFT JOIN shows prevShows ON tracks.previous_performance_show_id = prevShows.id
      WHERE ${options.whereClause}
      ORDER BY ${showOrderBySql("shows", "DESC")}, tracks.set, tracks.position
    `;
  }

  private async enrichPerformances(performances: SongPagePerformance[]): Promise<void> {
    const trackIds = performances.map((p) => p.trackId);
    const annotations = await this.db.annotation.findMany({
      where: { trackId: { in: trackIds } },
      orderBy: { createdAt: "desc" },
    });

    const annotationsByTrackId = new Map<string, Annotation[]>();
    for (const annotation of annotations) {
      const trackAnnotations = annotationsByTrackId.get(annotation.trackId) || [];
      trackAnnotations.push(annotation);
      annotationsByTrackId.set(annotation.trackId, trackAnnotations);
    }

    for (const performance of performances) {
      performance.annotations = annotationsByTrackId.get(performance.trackId) || [];
    }

    await this.computePerformanceTags(performances);
  }

  private async computePerformanceTags(performances: SongPagePerformance[]): Promise<void> {
    const setPositionData = await this.fetchSetPositionData(performances);
    for (const performance of performances) {
      performance.tags = computeTagsForPerformance(performance, setPositionData);
    }
  }

  /**
   * Fetches the min/max track positions for each (show, set) pair touched by the
   * given performances. Used to identify set openers and closers.
   */
  private async fetchSetPositionData(
    performances: SongPagePerformance[],
  ): Promise<Map<string, { min: number; max: number }>> {
    const setPositionData = new Map<string, { min: number; max: number }>();
    const showIds = [...new Set(performances.map((p) => p.show.id))];

    if (showIds.length === 0) {
      return setPositionData;
    }

    const setRanges = await this.db.$queryRaw<
      Array<{ show_id: string; set: string; min_position: number; max_position: number }>
    >`
      SELECT show_id, set, MIN(position) as min_position, MAX(position) as max_position
      FROM tracks
      WHERE show_id = ANY(${showIds}::uuid[])
      GROUP BY show_id, set
    `;

    for (const range of setRanges) {
      setPositionData.set(buildSetPositionKey(range.show_id, range.set), {
        min: range.min_position,
        max: range.max_position,
      });
    }

    return setPositionData;
  }

  private transformToSongPagePerformanceView(row: PerformanceDto): SongPagePerformance {
    return transformToSongPagePerformanceView(row);
  }
}

/**
 * Build the lookup key used for set-position data. The triple-pipe separator
 * is unlikely to appear in show IDs or set labels.
 */
export function buildSetPositionKey(showId: string, set: string): string {
  return `${showId}|||${set}`;
}

/**
 * True when the active filter set actually narrows which performances
 * count — i.e., would produce a meaningfully different result than the
 * all-time view. `cover` and `authorId` are intentionally excluded:
 * they pick which songs surface (on /songs) but every performance of a
 * surfacing song still counts, so they don't change per-song gap math.
 *
 * Used to gate the per-row filteredGap computation in
 * `buildSongPerformances` — skipping the work entirely when no narrowing
 * filter is active.
 */
export function isNarrowingFilter(options: PerformanceFilterOptions | undefined): boolean {
  if (!options) return false;
  return Boolean(
    options.startDate ||
      options.endDate ||
      options.attendedUserId ||
      options.encore ||
      options.setOpener ||
      options.setCloser ||
      options.segueIn ||
      options.segueOut ||
      options.standalone ||
      options.inverted ||
      options.dyslexic ||
      options.jamChart ||
      options.allTimer ||
      options.monthDay,
  );
}

/**
 * Mutates each performance in `performances` to set `filteredGap` against
 * the supplied `matchingShowDates` (the canonical-ordered ISO dates of
 * shows in the active filter's universe). Reuses the pure `computeTrackGaps`
 * walk used for all-time `Track.gap` — same algorithm, different denominator.
 * Within-show repeats share the gap of their show's first track.
 *
 * Called after `enrichPerformances` so the performances already have their
 * `show` and `position` fields populated.
 */
export function assignFilteredGaps(performances: SongPagePerformance[], matchingShowDates: string[]): void {
  if (performances.length === 0) return;

  const walkInput: TrackForGapWalk[] = performances.map((performance) => ({
    trackId: performance.trackId,
    showId: performance.show.id,
    showDate: performance.show.date,
    dayOrder: performance.show.dayOrder ?? null,
    // Every filtered performance participates in the filtered-universe walk.
    // The filtered set is the universe, so each row advances the "last
    // performance" cursor — no count_for_stats sub-distinction here.
    showCountForStats: true,
    position: performance.position ?? 0,
  }));

  const sorted = sortTracksForGapWalk(walkInput);
  const results = computeTrackGaps(sorted, matchingShowDates);

  const gapByTrackId = new Map<string, number | null>();
  for (const result of results) {
    gapByTrackId.set(result.trackId, result.gap);
  }

  for (const performance of performances) {
    performance.filteredGap = gapByTrackId.get(performance.trackId) ?? null;
  }
}

/**
 * Compute the performance tags (encore, opener/closer, segues, standalone,
 * inverted, dyslexic) for a single performance. Pure function — no DB,
 * no side effects.
 */
export function computeTagsForPerformance(
  performance: SongPagePerformance,
  setPositionData: Map<string, { min: number; max: number }>,
): NonNullable<SongPagePerformance["tags"]> {
  const tags: NonNullable<SongPagePerformance["tags"]> = {};

  // Encore (sets that start with "E") - check this first
  const isEncore = performance.set?.startsWith("E");
  if (isEncore) {
    tags.encore = true;
  }

  // Set opener/closer (only for non-encore sets)
  if (performance.set && performance.position !== undefined && !isEncore) {
    const setRange = setPositionData.get(buildSetPositionKey(performance.show.id, performance.set));
    if (setRange) {
      tags.setOpener = performance.position === setRange.min;
      tags.setCloser = performance.position === setRange.max;
    }
  }

  // Segue in/out
  const hasSegueIn = performance.songBefore?.segue;
  const hasSegueOut = performance.segue;
  tags.segueIn = !!hasSegueIn;
  tags.segueOut = !!hasSegueOut;

  // Standalone (no segue in or out)
  tags.standalone = !hasSegueIn && !hasSegueOut;

  // Inverted/Dyslexic from annotations
  if (performance.annotations) {
    const annotationText = performance.annotations.map((a) => a.desc?.toLowerCase() || "").join(" ");
    tags.inverted = annotationText.includes("inverted");
    tags.dyslexic = annotationText.includes("dyslexic");
  }

  return tags;
}

/**
 * Map a raw DB DTO row to a SongPagePerformance view. Pure function.
 */
export function transformToSongPagePerformanceView(row: PerformanceDto): SongPagePerformance {
  return {
    trackId: row.track_id,
    show: {
      id: row.id,
      slug: row.slug,
      date: row.date,
      venueId: row.venue_id,
      dayOrder: row.day_order,
      countForStats: row.count_for_stats,
    },
    venue:
      row.venue_id && row.venue_slug && row.venue_name
        ? {
            id: row.venue_id,
            slug: row.venue_slug,
            name: row.venue_name,
            city: row.venue_city || "",
            state: row.venue_state,
            country: row.venue_country || "",
          }
        : undefined,
    songBefore:
      row.prev_song_id && row.prev_song_slug && row.prev_song_title
        ? {
            id: row.prev_song_id,
            songId: row.prev_song_id,
            segue: row.prev_track_segue,
            songSlug: row.prev_song_slug,
            songTitle: row.prev_song_title,
          }
        : undefined,
    songAfter:
      row.next_song_id && row.next_song_slug && row.next_song_title
        ? {
            id: row.next_song_id,
            songId: row.next_song_id,
            segue: row.next_track_segue,
            songSlug: row.next_song_slug,
            songTitle: row.next_song_title,
          }
        : undefined,
    rating: row.average_rating || undefined,
    ratingsCount: row.ratings_count || undefined,
    notes: row.note || undefined,
    allTimer: row.all_timer,
    segue: row.segue,
    set: row.set,
    position: row.position,
    cover: row.song_cover ?? undefined,
    authorId: row.song_author_id ?? null,
    duration: row.duration ?? null,
    durationSource: row.duration_source ?? null,
    gap: row.gap,
    previousPerformanceShowId: row.previous_performance_show_id,
    previousShow:
      row.previous_show_slug && row.previous_show_date
        ? { slug: row.previous_show_slug, date: row.previous_show_date }
        : undefined,
  };
}

/**
 * Compute the catalogue-relative rarity numbers shown on the song detail
 * page. Pure function — no DB, no side effects. Year-bucket granularity
 * matches the per-year show-count cache (`stats:shows-by-year`); the
 * debut year is counted on the "since" side, so Before + Since always
 * equals totalShows.
 */
export function computeRarityStats(
  song: { dateFirstPlayed: Date | null; timesPlayed: number },
  showsByYear: Record<number, number>,
): {
  totalShows: number;
  showsBeforeDebut: number | null;
  showsSinceDebut: number | null;
  percentOfAllShows: number | null;
  percentSinceDebut: number | null;
} {
  const totalShows = Object.values(showsByYear).reduce((sum, count) => sum + count, 0);
  const percentOfAllShows = totalShows === 0 ? null : song.timesPlayed / totalShows;

  if (!song.dateFirstPlayed) {
    return {
      totalShows,
      showsBeforeDebut: null,
      showsSinceDebut: null,
      percentOfAllShows,
      percentSinceDebut: null,
    };
  }

  const debutYear = song.dateFirstPlayed.getUTCFullYear();
  const showsSinceDebut = Object.entries(showsByYear)
    .filter(([year]) => Number(year) >= debutYear)
    .reduce((sum, [, count]) => sum + count, 0);
  const showsBeforeDebut = totalShows - showsSinceDebut;
  const percentSinceDebut = showsSinceDebut === 0 ? null : song.timesPlayed / showsSinceDebut;

  return {
    totalShows,
    showsBeforeDebut,
    showsSinceDebut,
    percentOfAllShows,
    percentSinceDebut,
  };
}

export type PerformanceDto = {
  // Show fields
  id: string;
  date: string;
  venue_id: string;
  slug: string;
  day_order: number | null;
  count_for_stats: boolean;

  // Venue fields
  venue_name: string | null;
  venue_city: string | null;
  venue_state: string | null;
  venue_slug: string | null;
  venue_country: string | null;

  // Track fields
  track_id: string;
  song_id: string;
  segue: string | null;
  set: string;
  position: number;
  all_timer: boolean;
  average_rating: number;
  ratings_count: number;
  note: string | null;
  gap: number | null;
  duration: number | null;
  duration_source: string | null;
  previous_performance_show_id: string | null;
  previous_show_slug: string | null;
  previous_show_date: string | null;

  // Next/Prev track fields
  next_track_segue: string | null;
  prev_track_segue: string | null;

  // Next/Prev song fields
  next_song_id: string | null;
  next_song_title: string | null;
  next_song_slug: string | null;
  prev_song_id: string | null;
  prev_song_title: string | null;
  prev_song_slug: string | null;

  // Song fields (present when songs table is joined)
  song_cover?: boolean | null;
  song_author_id?: string | null;
};

type AllTimerPerformanceDto = PerformanceDto & {
  song_title: string;
  song_slug: string;
  song_cover: boolean | null;
  song_author_id: string | null;
};
