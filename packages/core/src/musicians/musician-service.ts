import type { Instrument, Logger, Musician } from "@bip/domain";
import type { DbClient, DbInstrument, DbMusician } from "../_shared/database/models";
import { buildOrderByClause, buildWhereClause } from "../_shared/database/query-utils";
import type { FilterCondition, QueryOptions } from "../_shared/database/types";
import { slugify } from "../_shared/utils/slugify";

export interface CreateInstrumentInput {
  name: string;
}

export interface CreateMusicianInput {
  name: string;
  defaultInstrumentId?: string | null;
}

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
        defaultInstrumentId: data.defaultInstrumentId ?? null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return mapMusicianToDomainEntity(result);
  }
}
