import type {
  Instrument,
  Logger,
  Musician,
  MusicianAppearanceShow,
  MusicianAppearances,
  MusicianPerformance,
  MusicianSongPlay,
  MusicianWithStats,
} from "@bip/domain";
import type { DbClient, DbInstrument, DbMusician } from "../_shared/database/models";
import { buildOrderByClause, buildWhereClause } from "../_shared/database/query-utils";
import type { FilterCondition, QueryOptions } from "../_shared/database/types";
import { slugify } from "../_shared/utils/slugify";

export interface CreateInstrumentInput {
  name: string;
}

export type UpdateInstrumentInput = Partial<CreateInstrumentInput>;

export interface CreateMusicianInput {
  name: string;
  knownFrom?: string | null;
  defaultInstrumentId?: string | null;
}

export type UpdateMusicianInput = Partial<CreateMusicianInput>;

function mapInstrumentToDomainEntity(db: DbInstrument): Instrument {
  return {
    id: db.id,
    name: db.name,
    slug: db.slug,
    createdAt: new Date(db.createdAt),
    updatedAt: new Date(db.updatedAt),
  };
}

function mapMusicianToDomainEntity(db: DbMusician): Musician {
  return {
    id: db.id,
    name: db.name,
    slug: db.slug,
    knownFrom: db.knownFrom ?? null,
    defaultInstrumentId: db.defaultInstrumentId ?? null,
    createdAt: new Date(db.createdAt),
    updatedAt: new Date(db.updatedAt),
  };
}

/**
 * Unlike AuthorService, both services here dedupe on create by slug and return
 * the existing row rather than appending a `-2` suffix. Musicians and
 * instruments are a small shared vocabulary: two "Sam Altman" entries would be
 * the same person, and the performer backfill (which resolves names to
 * musicians and re-runs as data is corrected) needs create to be idempotent on
 * slug. Do not "fix" this back to the auto-suffix scheme.
 */
export class InstrumentService {
  constructor(
    protected readonly db: DbClient,
    protected readonly logger: Logger,
  ) {}

  async findById(id: string): Promise<Instrument | null> {
    const result = await this.db.instrument.findUnique({ where: { id } });
    return result ? mapInstrumentToDomainEntity(result) : null;
  }

  async findBySlug(slug: string): Promise<Instrument | null> {
    const result = await this.db.instrument.findUnique({ where: { slug } });
    return result ? mapInstrumentToDomainEntity(result) : null;
  }

  async findMany(): Promise<Instrument[]> {
    const results = await this.db.instrument.findMany({ orderBy: { name: "asc" } });
    return results.map(mapInstrumentToDomainEntity);
  }

  async create(data: CreateInstrumentInput): Promise<Instrument> {
    const name = data.name?.trim();
    if (!name) {
      throw new Error("Instrument name is required");
    }

    const slug = slugify(name);
    const existing = await this.db.instrument.findUnique({ where: { slug } });
    if (existing) {
      return mapInstrumentToDomainEntity(existing);
    }

    const result = await this.db.instrument.create({
      data: { name, slug, createdAt: new Date(), updatedAt: new Date() },
    });
    return mapInstrumentToDomainEntity(result);
  }

  // A rename can collide with another instrument's slug, so append a suffix
  // (mirrors AuthorService). create() still dedupes on slug — see the class doc.
  private async generateInstrumentSlug(name: string, excludeId?: string): Promise<string> {
    const baseSlug = slugify(name);
    let slug = baseSlug;
    let counter = 2;

    while (true) {
      const existing = await this.db.instrument.findFirst({
        where: { slug, ...(excludeId && { id: { not: excludeId } }) },
      });
      if (!existing) {
        return slug;
      }
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  async update(slug: string, data: UpdateInstrumentInput): Promise<Instrument> {
    // Resolve by slug — that's what the admin edit route and API pass in.
    const current = await this.db.instrument.findFirst({
      where: { slug },
      select: { id: true },
    });
    if (!current) {
      throw new Error(`Instrument with slug "${slug}" not found`);
    }

    const name = data.name?.trim();
    if (data.name !== undefined && !name) {
      throw new Error("Instrument name is required");
    }

    const updateData: { name?: string; slug?: string; updatedAt: Date } = {
      updatedAt: new Date(),
    };
    if (name) {
      updateData.name = name;
      updateData.slug = await this.generateInstrumentSlug(name, current.id);
    }

    const result = await this.db.instrument.update({
      where: { id: current.id },
      data: updateData,
    });
    return mapInstrumentToDomainEntity(result);
  }

  // Total references to an instrument across show lineups, track deltas, and
  // musician defaults — drives both the delete guard and the UI's decision to
  // hide the delete affordance.
  async countReferences(id: string): Promise<number> {
    const [showUses, trackUses, defaultFor] = await Promise.all([
      this.db.showMusicianInstrument.count({ where: { instrumentId: id } }),
      this.db.trackMusicianInstrument.count({ where: { instrumentId: id } }),
      this.db.musician.count({ where: { defaultInstrumentId: id } }),
    ]);
    return showUses + trackUses + defaultFor;
  }

  async delete(id: string): Promise<boolean> {
    // The schema would cascade the join rows and null out musician defaults, so
    // guard against deleting an instrument that's still referenced anywhere.
    const references = await this.countReferences(id);
    if (references > 0) {
      throw new Error(`Cannot delete instrument with ${references} reference(s)`);
    }

    try {
      await this.db.instrument.delete({ where: { id } });
      return true;
    } catch (_error) {
      return false;
    }
  }

  async findManyWithUsageCount(): Promise<Array<Instrument & { usageCount: number }>> {
    const results = await this.db.instrument.findMany({
      include: {
        _count: {
          select: {
            showMusicianInstruments: true,
            trackMusicianInstruments: true,
            musicians: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return results.map((result) => ({
      ...mapInstrumentToDomainEntity(result),
      usageCount:
        result._count.showMusicianInstruments + result._count.trackMusicianInstruments + result._count.musicians,
    }));
  }

  async search(query: string, limit = 10): Promise<Instrument[]> {
    const results = await this.db.instrument.findMany({
      where: { name: { contains: query, mode: "insensitive" } },
      orderBy: { name: "asc" },
      take: limit,
    });
    return results.map(mapInstrumentToDomainEntity);
  }
}

/** Dedupes on create by slug like InstrumentService — see the note there. */
export class MusicianService {
  constructor(
    protected readonly db: DbClient,
    protected readonly logger: Logger,
  ) {}

  async findById(id: string): Promise<Musician | null> {
    const result = await this.db.musician.findUnique({ where: { id } });
    return result ? mapMusicianToDomainEntity(result) : null;
  }

  async findBySlug(slug: string): Promise<Musician | null> {
    const result = await this.db.musician.findUnique({ where: { slug } });
    return result ? mapMusicianToDomainEntity(result) : null;
  }

  async findMany(options?: QueryOptions<Musician>): Promise<Musician[]> {
    const where = options?.filters ? buildWhereClause(options.filters) : {};
    const orderBy = options?.sort ? buildOrderByClause(options.sort) : [{ name: "asc" }];
    const skip =
      options?.pagination?.page && options?.pagination?.limit
        ? (options.pagination.page - 1) * options.pagination.limit
        : undefined;
    const take = options?.pagination?.limit;

    const results = await this.db.musician.findMany({ where, orderBy, skip, take });
    return results.map(mapMusicianToDomainEntity);
  }

  async search(query: string, limit = 10): Promise<Musician[]> {
    const queryOptions: QueryOptions<Musician> = {
      filters: [{ field: "name", operator: "contains", value: query }] as FilterCondition<Musician>[],
      pagination: { limit: limit * 3 },
    };

    const results = await this.findMany(queryOptions);

    const queryLower = query.toLowerCase();
    const sorted = results.sort((a, b) => {
      const aNameLower = a.name.toLowerCase();
      const bNameLower = b.name.toLowerCase();

      const aExact = aNameLower === queryLower ? 0 : 1;
      const bExact = bNameLower === queryLower ? 0 : 1;
      if (aExact !== bExact) return aExact - bExact;

      const aStartsWith = aNameLower.startsWith(queryLower) ? 0 : 1;
      const bStartsWith = bNameLower.startsWith(queryLower) ? 0 : 1;
      if (aStartsWith !== bStartsWith) return aStartsWith - bStartsWith;

      return aNameLower.localeCompare(bNameLower);
    });

    return sorted.slice(0, limit);
  }

  /**
   * Shows and track count a musician appears on, for their profile page.
   * Appearances combine lineup membership (every track of a show they were in
   * the lineup for, minus their per-track sat-outs) with sit-ins (present=true
   * deltas on shows they were not in the lineup for).
   *
   * Known simplification for this preview: a show where the musician is in the
   * lineup but sat out every track still counts as an appearance. Full
   * lineup-minus-satouts-plus-sitins show filtering is deferred to the Phase 8
   * filter work.
   */
  async findAppearances(musicianId: string): Promise<MusicianAppearances> {
    const [lineupRows, presentDeltas, songCountRows] = await Promise.all([
      this.db.showMusician.findMany({ where: { musicianId }, select: { showId: true } }),
      this.db.trackMusician.findMany({
        where: { musicianId, present: true },
        select: { track: { select: { showId: true } } },
      }),
      // Distinct (song, show) the musician played on count_for_stats=true shows —
      // the same "a song twice in one show counts once" math as Song.timesPlayed
      // and the /musicians index, so the profile's "Songs Played" stays consistent.
      this.db.$queryRaw<[{ song_count: bigint }]>`
        WITH appearances AS (
          SELECT t.show_id, t.song_id
          FROM show_musicians sm
          JOIN tracks t ON t.show_id = sm.show_id
          WHERE sm.musician_id = ${musicianId}::uuid
            AND NOT EXISTS (
              SELECT 1 FROM track_musicians tm
              WHERE tm.track_id = t.id AND tm.musician_id = ${musicianId}::uuid AND tm.present = false
            )
          UNION
          SELECT t.show_id, t.song_id
          FROM track_musicians tm
          JOIN tracks t ON t.id = tm.track_id
          WHERE tm.musician_id = ${musicianId}::uuid AND tm.present = true
        )
        SELECT COUNT(DISTINCT (a.song_id, a.show_id)) FILTER (WHERE s.count_for_stats) AS song_count
        FROM appearances a
        JOIN shows s ON s.id = a.show_id
      `,
    ]);

    const lineupShowIds = lineupRows.map((row) => row.showId);
    const sitInShowIds = presentDeltas.map((delta) => delta.track.showId);
    const showIds = Array.from(new Set([...lineupShowIds, ...sitInShowIds]));
    const songCount = Number(songCountRows[0]?.song_count ?? 0);

    const [firstShow, lastShow] = showIds.length
      ? await Promise.all([this.findAppearanceShow(showIds, "asc"), this.findAppearanceShow(showIds, "desc")])
      : [null, null];

    return { showIds, songCount, firstShow, lastShow };
  }

  /** Earliest/latest appearance show (with venue) for the first/last cards. */
  private async findAppearanceShow(
    showIds: string[],
    direction: "asc" | "desc",
  ): Promise<MusicianAppearanceShow | null> {
    const show = await this.db.show.findFirst({
      where: { id: { in: showIds } },
      orderBy: { date: direction },
      select: { date: true, slug: true, venue: { select: { name: true, city: true, state: true } } },
    });
    if (!show) return null;
    return {
      date: show.date,
      slug: show.slug,
      venue: show.venue ? { name: show.venue.name, city: show.venue.city, state: show.venue.state } : null,
    };
  }

  /**
   * Every musician with their appearance aggregates in one query, for the
   * /musicians index table. A musician "plays" a track when they are in that
   * show's lineup and have no sat-out delta for the track, OR they have a
   * present=true sit-in delta for it. The song count counts distinct
   * (song, show) pairs on count_for_stats=true shows — the same "a song played
   * twice in one show counts once" math as Song.timesPlayed — so it never
   * exceeds the per-song totals. Distinct show count and first/last dates span
   * all of the musician's appearance shows.
   */
  async findAllWithStats(): Promise<MusicianWithStats[]> {
    const rows = await this.db.$queryRaw<
      Array<{
        id: string;
        name: string;
        slug: string;
        known_from: string | null;
        default_instrument_id: string | null;
        default_instrument_name: string | null;
        song_count: bigint;
        show_count: bigint;
        first_show_date: string | null;
        last_show_date: string | null;
      }>
    >`
      WITH appearances AS (
        SELECT t.show_id, t.song_id, sm.musician_id
        FROM show_musicians sm
        JOIN tracks t ON t.show_id = sm.show_id
        WHERE NOT EXISTS (
          SELECT 1 FROM track_musicians tm
          WHERE tm.track_id = t.id AND tm.musician_id = sm.musician_id AND tm.present = false
        )
        UNION
        SELECT t.show_id, t.song_id, tm.musician_id
        FROM track_musicians tm
        JOIN tracks t ON t.id = tm.track_id
        WHERE tm.present = true
      ),
      stats AS (
        SELECT
          a.musician_id,
          COUNT(DISTINCT (a.song_id, a.show_id)) FILTER (WHERE s.count_for_stats) AS song_count,
          COUNT(DISTINCT a.show_id) AS show_count,
          to_char(MIN(s.date::date), 'YYYY-MM-DD') AS first_show_date,
          to_char(MAX(s.date::date), 'YYYY-MM-DD') AS last_show_date
        FROM appearances a
        JOIN shows s ON s.id = a.show_id
        GROUP BY a.musician_id
      )
      SELECT
        m.id,
        m.name,
        m.slug,
        m.known_from,
        m.default_instrument_id,
        i.name AS default_instrument_name,
        COALESCE(stats.song_count, 0) AS song_count,
        COALESCE(stats.show_count, 0) AS show_count,
        stats.first_show_date,
        stats.last_show_date
      FROM musicians m
      LEFT JOIN instruments i ON i.id = m.default_instrument_id
      LEFT JOIN stats ON stats.musician_id = m.id
      ORDER BY m.name ASC
    `;

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      knownFrom: row.known_from ?? null,
      defaultInstrumentName: row.default_instrument_name ?? null,
      songCount: Number(row.song_count),
      showCount: Number(row.show_count),
      firstShowDate: row.first_show_date,
      lastShowDate: row.last_show_date,
    }));
  }

  /**
   * The most-played musicians first (song count desc, ties alphabetical), for
   * the picker's default list — surfacing the core lineup and frequent guests
   * ahead of one-off sit-ins. Reuses the findAllWithStats song-count metric so
   * "how much a musician played" stays defined in one place.
   */
  async findTopBySongCount(limit: number): Promise<MusicianWithStats[]> {
    const all = await this.findAllWithStats();
    return all.sort((a, b) => b.songCount - a.songCount || a.name.localeCompare(b.name)).slice(0, limit);
  }

  /**
   * Songs a musician has played, with their per-song play count and first/last
   * date, for the songs table on a profile page. Uses the same "plays this
   * track" predicate as findAllWithStats: a lineup track with no sat-out, or a
   * present=true sit-in.
   */
  async findSongsPlayed(musicianId: string): Promise<MusicianSongPlay[]> {
    const rows = await this.db.$queryRaw<
      Array<{
        song_id: string;
        title: string;
        slug: string;
        play_count: bigint;
        first_show_date: string;
        first_show_slug: string | null;
        first_venue_name: string | null;
        first_venue_city: string | null;
        first_venue_state: string | null;
        last_show_date: string;
        last_show_slug: string | null;
        last_venue_name: string | null;
        last_venue_city: string | null;
        last_venue_state: string | null;
      }>
    >`
      WITH appearances AS (
        SELECT t.show_id, t.song_id
        FROM show_musicians sm
        JOIN tracks t ON t.show_id = sm.show_id
        WHERE sm.musician_id = ${musicianId}::uuid
          AND NOT EXISTS (
            SELECT 1 FROM track_musicians tm
            WHERE tm.track_id = t.id AND tm.musician_id = sm.musician_id AND tm.present = false
          )
        UNION
        SELECT t.show_id, t.song_id
        FROM track_musicians tm
        JOIN tracks t ON t.id = tm.track_id
        WHERE tm.musician_id = ${musicianId}::uuid AND tm.present = true
      )
      SELECT
        a.song_id,
        songs.title,
        songs.slug,
        COUNT(*) AS play_count,
        to_char(MIN(s.date::date), 'YYYY-MM-DD') AS first_show_date,
        (array_agg(s.slug ORDER BY s.date ASC))[1] AS first_show_slug,
        (array_agg(v.name ORDER BY s.date ASC))[1] AS first_venue_name,
        (array_agg(v.city ORDER BY s.date ASC))[1] AS first_venue_city,
        (array_agg(v.state ORDER BY s.date ASC))[1] AS first_venue_state,
        to_char(MAX(s.date::date), 'YYYY-MM-DD') AS last_show_date,
        (array_agg(s.slug ORDER BY s.date DESC))[1] AS last_show_slug,
        (array_agg(v.name ORDER BY s.date DESC))[1] AS last_venue_name,
        (array_agg(v.city ORDER BY s.date DESC))[1] AS last_venue_city,
        (array_agg(v.state ORDER BY s.date DESC))[1] AS last_venue_state
      FROM appearances a
      JOIN shows s ON s.id = a.show_id
      JOIN songs ON songs.id = a.song_id
      LEFT JOIN venues v ON v.id = s.venue_id
      GROUP BY a.song_id, songs.title, songs.slug
      ORDER BY songs.title ASC
    `;

    return rows.map((row) => ({
      songId: row.song_id,
      title: row.title,
      slug: row.slug,
      playCount: Number(row.play_count),
      firstShow: {
        date: row.first_show_date,
        slug: row.first_show_slug,
        venue: { name: row.first_venue_name, city: row.first_venue_city, state: row.first_venue_state },
      },
      lastShow: {
        date: row.last_show_date,
        slug: row.last_show_slug,
        venue: { name: row.last_venue_name, city: row.last_venue_city, state: row.last_venue_state },
      },
    }));
  }

  /**
   * Every individual performance (one row per show+song) a musician played, for
   * the "All Performances" list on a profile. Same "plays this track" predicate
   * as findSongsPlayed, but un-aggregated.
   */
  async findPerformances(musicianId: string): Promise<MusicianPerformance[]> {
    const rows = await this.db.$queryRaw<
      Array<{
        track_id: string;
        date: string;
        show_slug: string | null;
        song_title: string;
        song_slug: string;
        venue_name: string | null;
        venue_city: string | null;
        venue_state: string | null;
      }>
    >`
      WITH appearances AS (
        SELECT t.id AS track_id
        FROM show_musicians sm
        JOIN tracks t ON t.show_id = sm.show_id
        WHERE sm.musician_id = ${musicianId}::uuid
          AND NOT EXISTS (
            SELECT 1 FROM track_musicians tm
            WHERE tm.track_id = t.id AND tm.musician_id = sm.musician_id AND tm.present = false
          )
        UNION
        SELECT tm.track_id
        FROM track_musicians tm
        WHERE tm.musician_id = ${musicianId}::uuid AND tm.present = true
      )
      SELECT
        t.id AS track_id,
        to_char(s.date::date, 'YYYY-MM-DD') AS date,
        s.slug AS show_slug,
        songs.title AS song_title,
        songs.slug AS song_slug,
        v.name AS venue_name,
        v.city AS venue_city,
        v.state AS venue_state
      FROM appearances a
      JOIN tracks t ON t.id = a.track_id
      JOIN shows s ON s.id = t.show_id
      JOIN songs ON songs.id = t.song_id
      LEFT JOIN venues v ON v.id = s.venue_id
      ORDER BY s.date DESC, t.position ASC
    `;

    return rows.map((row) => ({
      trackId: row.track_id,
      date: row.date,
      showSlug: row.show_slug,
      songTitle: row.song_title,
      songSlug: row.song_slug,
      venue: { name: row.venue_name, city: row.venue_city, state: row.venue_state },
    }));
  }

  async create(data: CreateMusicianInput): Promise<Musician> {
    const name = data.name?.trim();
    if (!name) {
      throw new Error("Musician name is required");
    }

    const slug = slugify(name);
    const existing = await this.db.musician.findUnique({ where: { slug } });
    if (existing) {
      return mapMusicianToDomainEntity(existing);
    }

    const result = await this.db.musician.create({
      data: {
        name,
        slug,
        knownFrom: data.knownFrom ?? null,
        defaultInstrumentId: data.defaultInstrumentId ?? null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return mapMusicianToDomainEntity(result);
  }

  // A rename can collide with another musician's slug, so append a suffix
  // (mirrors InstrumentService). create() still dedupes on slug; see its doc.
  private async generateMusicianSlug(name: string, excludeId?: string): Promise<string> {
    const baseSlug = slugify(name);
    let slug = baseSlug;
    let counter = 2;

    while (true) {
      const existing = await this.db.musician.findFirst({
        where: { slug, ...(excludeId && { id: { not: excludeId } }) },
      });
      if (!existing) {
        return slug;
      }
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  async update(slug: string, data: UpdateMusicianInput): Promise<Musician> {
    // Resolve by slug, which is what the admin edit route and API pass in.
    const current = await this.db.musician.findFirst({
      where: { slug },
      select: { id: true },
    });
    if (!current) {
      throw new Error(`Musician with slug "${slug}" not found`);
    }

    const updateData: {
      name?: string;
      slug?: string;
      knownFrom?: string | null;
      defaultInstrumentId?: string | null;
      updatedAt: Date;
    } = { updatedAt: new Date() };

    if (data.name !== undefined) {
      const name = data.name?.trim();
      if (!name) {
        throw new Error("Musician name is required");
      }
      updateData.name = name;
      updateData.slug = await this.generateMusicianSlug(name, current.id);
    }
    // `!== undefined` (not truthiness) so the form can clear these to null.
    if (data.knownFrom !== undefined) {
      updateData.knownFrom = data.knownFrom ?? null;
    }
    if (data.defaultInstrumentId !== undefined) {
      updateData.defaultInstrumentId = data.defaultInstrumentId ?? null;
    }

    const result = await this.db.musician.update({
      where: { id: current.id },
      data: updateData,
    });
    return mapMusicianToDomainEntity(result);
  }

  // Total references to a musician across show lineups and per-track deltas;
  // drives both the delete guard and the UI's decision to hide the affordance.
  async countReferences(id: string): Promise<number> {
    const [showUses, trackUses] = await Promise.all([
      this.db.showMusician.count({ where: { musicianId: id } }),
      this.db.trackMusician.count({ where: { musicianId: id } }),
    ]);
    return showUses + trackUses;
  }

  async delete(id: string): Promise<boolean> {
    // The schema would cascade lineup and delta rows, so guard against deleting
    // a musician who still appears anywhere.
    const references = await this.countReferences(id);
    if (references > 0) {
      throw new Error(`Cannot delete musician with ${references} reference(s)`);
    }

    try {
      await this.db.musician.delete({ where: { id } });
      return true;
    } catch (_error) {
      return false;
    }
  }
}
