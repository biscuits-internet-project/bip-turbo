import type {
  Instrument,
  Logger,
  Musician,
  MusicianAppearanceShow,
  MusicianAppearances,
  MusicianWithStats,
} from "@bip/domain";
import type { DbClient, DbInstrument, DbMusician } from "../_shared/database/models";
import { buildOrderByClause, buildWhereClause } from "../_shared/database/query-utils";
import type { FilterCondition, QueryOptions } from "../_shared/database/types";
import { SHOW_ORDER_ASC, SHOW_ORDER_DESC } from "../_shared/show-ordering";
import { slugify } from "../_shared/utils/slugify";
import {
  MUSICIAN_SONG_PLAY_COUNTS_SQL,
  type MusicianSongPlayCountsRow,
  musicianAppearanceShowsSql,
  musicianSongPlaysSql,
} from "./musician-appearances";

export interface CreateInstrumentInput {
  name: string;
}

export type UpdateInstrumentInput = Partial<CreateInstrumentInput>;

export interface CreateMusicianInput {
  name: string;
  knownFrom?: string | null;
  defaultInstrumentId?: string | null;
  authorId?: string | null;
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
    authorId: db.authorId ?? null,
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

  /** The musician linked to an author, if any — lets the author page redirect to
   *  the canonical musician page when one exists. */
  async findByAuthorId(authorId: string): Promise<Musician | null> {
    const result = await this.db.musician.findFirst({ where: { authorId } });
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
   * Shows, repertoire, and plays for a musician's profile page, off the shared
   * appearance definitions so every figure here matches the /musicians index.
   * `showIds` also drives the profile's shows table and first/last cards, so
   * the listed shows are exactly the ones the count reports.
   */
  async findAppearances(musicianId: string): Promise<MusicianAppearances> {
    const [showRows, countRows] = await Promise.all([
      this.db.$queryRaw<Array<{ show_id: string }>>`
        SELECT DISTINCT a.show_id FROM (${musicianAppearanceShowsSql(musicianId)}) a
      `,
      this.db.$queryRaw<[MusicianSongPlayCountsRow]>`
        SELECT ${MUSICIAN_SONG_PLAY_COUNTS_SQL} FROM (${musicianSongPlaysSql(musicianId)}) p
      `,
    ]);

    const showIds = showRows.map((row) => row.show_id);
    const songCount = Number(countRows[0]?.song_count ?? 0);
    const playCount = Number(countRows[0]?.play_count ?? 0);

    const [firstShow, lastShow] = showIds.length
      ? await Promise.all([this.findAppearanceShow(showIds, "asc"), this.findAppearanceShow(showIds, "desc")])
      : [null, null];

    return { showIds, showCount: showIds.length, songCount, playCount, firstShow, lastShow };
  }

  /** Earliest/latest appearance show (with venue) for the first/last cards. */
  private async findAppearanceShow(
    showIds: string[],
    direction: "asc" | "desc",
  ): Promise<MusicianAppearanceShow | null> {
    const show = await this.db.show.findFirst({
      where: { id: { in: showIds } },
      orderBy: direction === "asc" ? SHOW_ORDER_ASC : SHOW_ORDER_DESC,
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
   * /musicians index table, off the same shared appearance definitions the
   * profile page uses. Show count and first/last dates span every appearance
   * show (including early ones with no setlist entered); song and play counts
   * come from the tracks those shows do have.
   */
  async findAllWithStats(): Promise<MusicianWithStats[]> {
    const rows = await this.db.$queryRaw<
      Array<
        MusicianSongPlayCountsRow & {
          id: string;
          name: string;
          slug: string;
          known_from: string | null;
          default_instrument_id: string | null;
          default_instrument_name: string | null;
          show_count: bigint;
          first_show_date: string | null;
          last_show_date: string | null;
        }
      >
    >`
      WITH show_stats AS (
        SELECT
          a.musician_id,
          COUNT(DISTINCT a.show_id) AS show_count,
          to_char(MIN(s.date::date), 'YYYY-MM-DD') AS first_show_date,
          to_char(MAX(s.date::date), 'YYYY-MM-DD') AS last_show_date
        FROM (${musicianAppearanceShowsSql()}) a
        JOIN shows s ON s.id = a.show_id
        GROUP BY a.musician_id
      ),
      play_stats AS (
        SELECT p.musician_id, ${MUSICIAN_SONG_PLAY_COUNTS_SQL}
        FROM (${musicianSongPlaysSql()}) p
        GROUP BY p.musician_id
      )
      SELECT
        m.id,
        m.name,
        m.slug,
        m.known_from,
        m.default_instrument_id,
        i.name AS default_instrument_name,
        COALESCE(show_stats.show_count, 0) AS show_count,
        COALESCE(play_stats.song_count, 0) AS song_count,
        COALESCE(play_stats.play_count, 0) AS play_count,
        show_stats.first_show_date,
        show_stats.last_show_date
      FROM musicians m
      LEFT JOIN instruments i ON i.id = m.default_instrument_id
      LEFT JOIN show_stats ON show_stats.musician_id = m.id
      LEFT JOIN play_stats ON play_stats.musician_id = m.id
      ORDER BY m.name ASC
    `;

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      knownFrom: row.known_from ?? null,
      defaultInstrumentName: row.default_instrument_name ?? null,
      showCount: Number(row.show_count),
      songCount: Number(row.song_count),
      playCount: Number(row.play_count),
      firstShowDate: row.first_show_date,
      lastShowDate: row.last_show_date,
    }));
  }

  /**
   * The most-played musicians first (play count desc, ties alphabetical), for
   * the picker's default list — surfacing the core lineup and frequent guests
   * ahead of one-off sit-ins. Reuses the findAllWithStats play-count metric so
   * "how much a musician played" stays defined in one place.
   */
  async findTopByPlayCount(limit: number): Promise<MusicianWithStats[]> {
    const all = await this.findAllWithStats();
    return all.sort((a, b) => b.playCount - a.playCount || a.name.localeCompare(b.name)).slice(0, limit);
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
      authorId?: string | null;
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
    if (data.authorId !== undefined) {
      updateData.authorId = data.authorId ?? null;
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
