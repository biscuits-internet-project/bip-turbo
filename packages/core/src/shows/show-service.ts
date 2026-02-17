import type { Logger, Show, Venue } from "@bip/domain";
import type { Prisma } from "@prisma/client";
import type { CacheInvalidationService } from "../_shared/cache";
import type { DbClient, DbShow, DbVenue } from "../_shared/database/models";
import { buildIncludeClause, buildOrderByClause, buildWhereClause } from "../_shared/database/query-utils";
import type { FilterCondition, QueryOptions } from "../_shared/database/types";
import { slugify } from "../_shared/utils/slugify";

export interface ShowFilter {
  year?: number;
  songId?: string;
}

export interface ShowNavItem {
  slug: string;
  date: string;
  venueName: string | null;
  venueCity: string | null;
}

export interface ShowServiceCreateInput {
  date: string;
  venueId?: string;
  bandId?: string;
  notes?: string | null;
  relistenUrl?: string | null;
}

export type ShowCreateInput = Prisma.ShowCreateInput;

// Mapper functions
function mapShowToDomainEntity(show: DbShow): Show {
  const { venueId, bandId, ...rest } = show;
  return {
    ...rest,
    date: String(show.date),
    createdAt: new Date(show.createdAt),
    updatedAt: new Date(show.updatedAt),
    slug: show.slug ?? "",
    venueId: venueId ?? "",
    bandId: bandId ?? "",
  };
}

function mapVenueToDomainEntity(dbVenue: DbVenue): Venue {
  const { createdAt, updatedAt, name, slug, city, country, ...rest } = dbVenue;
  return {
    ...rest,
    name: name ?? "",
    slug: slug ?? "",
    city: city ?? "",
    country: country ?? "",
    createdAt: new Date(createdAt),
    updatedAt: new Date(updatedAt),
  };
}

export class ShowService {
  constructor(
    protected readonly db: DbClient,
    protected readonly logger: Logger,
    protected readonly cacheInvalidation?: CacheInvalidationService,
  ) {}

  private async generateShowSlug(date: string, venueId?: string): Promise<string> {
    let slug = slugify(String(date));

    if (venueId) {
      const venue = await this.db.venue.findUnique({
        where: { id: venueId },
        select: { name: true, city: true, state: true },
      });

      if (venue) {
        const venueParts = [String(date), venue.name, venue.city, venue.state].filter(Boolean).join("-");
        slug = slugify(venueParts);
      }
    }

    return slug;
  }

  async findById(id: string): Promise<Show | null> {
    const result = await this.db.show.findUnique({ where: { id } });
    return result ? mapShowToDomainEntity(result) : null;
  }

  async findBySlug(slug: string): Promise<Show | null> {
    const result = await this.db.show.findUnique({ where: { slug } });
    return result ? mapShowToDomainEntity(result) : null;
  }

  async findMany(filterOrOptions: ShowFilter | QueryOptions<Show> = {}): Promise<Show[]> {
    let options: QueryOptions<Show>;

    // Check if it's QueryOptions (has filters, sort, pagination, or includes)
    if (
      "filters" in filterOrOptions ||
      "sort" in filterOrOptions ||
      "pagination" in filterOrOptions ||
      "includes" in filterOrOptions
    ) {
      options = filterOrOptions as QueryOptions<Show>;
    } else {
      // Legacy ShowFilter support
      const filter = filterOrOptions as ShowFilter;
      options = {
        filters: Object.entries(filter).map(([field, value]) => ({
          field: field as keyof Show,
          operator: "eq",
          value,
        })) as FilterCondition<Show>[],
      };
    }

    this.logger?.info("findMany options", { options });
    const include = options?.includes ? buildIncludeClause(options.includes) : {};
    const where = options?.filters ? buildWhereClause(options.filters) : {};
    const orderBy = options?.sort ? buildOrderByClause(options.sort) : [{ date: "desc" }];
    const skip =
      options?.pagination?.page && options?.pagination?.limit
        ? (options.pagination.page - 1) * options.pagination.limit
        : undefined;
    const take = options?.pagination?.limit;

    const results = await this.db.show.findMany({
      where,
      orderBy,
      skip,
      take,
      include,
    });

    return results.map((result: DbShow) => mapShowToDomainEntity(result));
  }

  async findManyByDates(dates: string[]): Promise<Show[]> {
    // Ensure dates are strings and properly formatted
    const stringDates = dates.map((date) => String(date));

    const results = await this.db.show.findMany({
      where: {
        date: {
          in: stringDates,
        },
      },
      include: {
        venue: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    return results.map((result) => {
      const show = mapShowToDomainEntity(result);
      if (result.venue) {
        show.venue = mapVenueToDomainEntity(result.venue);
      }
      return show;
    });
  }

  async findByDate(date: string): Promise<Show[]> {
    return this.findManyByDates([date]);
  }

  async findAdjacentShows(
    date: string,
    slug: string,
  ): Promise<{ previous: ShowNavItem | null; next: ShowNavItem | null }> {
    const [previousResults, nextResults] = await Promise.all([
      this.db.$queryRaw<Array<{ slug: string; date: string; venue_name: string | null; venue_city: string | null }>>`
        SELECT s.slug, s.date, v.name as venue_name, v.city as venue_city
        FROM shows s
        LEFT JOIN venues v ON s.venue_id = v.id
        WHERE (s.date < ${date} OR (s.date = ${date} AND s.slug < ${slug}))
          AND s.slug IS NOT NULL
        ORDER BY s.date DESC, s.slug DESC
        LIMIT 1
      `,
      this.db.$queryRaw<Array<{ slug: string; date: string; venue_name: string | null; venue_city: string | null }>>`
        SELECT s.slug, s.date, v.name as venue_name, v.city as venue_city
        FROM shows s
        LEFT JOIN venues v ON s.venue_id = v.id
        WHERE (s.date > ${date} OR (s.date = ${date} AND s.slug > ${slug}))
          AND s.slug IS NOT NULL
        ORDER BY s.date ASC, s.slug ASC
        LIMIT 1
      `,
    ]);

    const previous = previousResults[0]
      ? { slug: previousResults[0].slug, date: previousResults[0].date, venueName: previousResults[0].venue_name, venueCity: previousResults[0].venue_city }
      : null;
    const next = nextResults[0]
      ? { slug: nextResults[0].slug, date: nextResults[0].date, venueName: nextResults[0].venue_name, venueCity: nextResults[0].venue_city }
      : null;

    return { previous, next };
  }

  /**
   * Search for shows using the pg_search_documents table
   * @param query The search query
   * @param options Optional query options for pagination, sorting, etc.
   * @returns An array of shows matching the search query
   */
  async search(query: string, options?: QueryOptions<Show>): Promise<Show[]> {
    if (!query.trim()) {
      return this.findMany(options);
    }

    this.logger?.info("Searching for", { query });

    // First, let's see what the tokenization looks like
    const tokenDebug = await this.db.$queryRaw<Array<{ tokens: string }>>`
      SELECT to_tsvector('english', ${query})::text as tokens;
    `;
    this.logger?.info("Query tokens", { tokens: tokenDebug[0]?.tokens });

    // Let's also check what's in the pg_search_documents table
    const sampleContent = await this.db.$queryRaw<Array<{ content: string }>>`
      SELECT content
      FROM pg_search_documents
      WHERE content ILIKE ${`%${query}%`}
      LIMIT 1;
    `;
    this.logger?.info("Matching content sample", { content: sampleContent[0]?.content });

    const searchResults = await this.db.$queryRaw<Array<{ searchable_id: string; rank: number }>>`
      SELECT
        searchable_id,
        ts_rank_cd(to_tsvector('english', content)::tsvector, websearch_to_tsquery('english', ${query})) as rank
      FROM pg_search_documents
      WHERE
        searchable_type = 'Show'
        AND to_tsvector('english', content)::tsvector @@ websearch_to_tsquery('english', ${query})
      ORDER BY rank DESC
    `;

    this.logger?.info("Search results count", { count: searchResults.length });

    // Get the show IDs from the search results
    const showIds = searchResults.map((result) => result.searchable_id);

    // Fetch shows using Prisma's findMany
    const shows = await this.db.show.findMany({
      where: {
        id: {
          in: showIds,
        },
      },
      orderBy: options?.sort ? buildOrderByClause(options.sort) : [{ date: "desc" }],
      skip:
        options?.pagination?.page && options?.pagination?.limit
          ? (options.pagination.page - 1) * options.pagination.limit
          : undefined,
      take: options?.pagination?.limit,
    });

    return shows.map((show) => mapShowToDomainEntity(show));
  }

  async create(data: ShowServiceCreateInput): Promise<Show> {
    const createInput: ShowCreateInput = {
      date: data.date,
      venue: data.venueId ? { connect: { id: data.venueId } } : undefined,
      band: data.bandId ? { connect: { id: data.bandId } } : undefined,
      notes: data.notes,
      relistenUrl: data.relistenUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const venueId = createInput.venue?.connect?.id;
    const slug = await this.generateShowSlug(String(createInput.date), venueId);

    const result = await this.db.show.create({
      data: {
        date: createInput.date,
        slug,
        venue: createInput.venue,
        band: createInput.band,
        notes: createInput.notes,
        relistenUrl: createInput.relistenUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const show = mapShowToDomainEntity(result);

    // Invalidate show listing caches (new show affects listings)
    if (this.cacheInvalidation) {
      await this.cacheInvalidation.invalidateShowListings();
    }

    return show;
  }

  async update(slug: string, data: ShowServiceCreateInput): Promise<Show> {
    let newSlug: string | undefined;

    // Get current show data for cache invalidation
    const currentShow = await this.db.show.findUnique({
      where: { slug },
      select: { id: true, date: true, venueId: true },
    });

    if (!currentShow) {
      throw new Error(`Show with slug ${slug} not found`);
    }

    // If date or venue is being updated, regenerate the slug
    if (data.date || data.venueId) {
      const date = data.date || currentShow.date;
      const venueId = data.venueId || currentShow.venueId || undefined;
      newSlug = await this.generateShowSlug(String(date), venueId);
    }

    const updateInput: Partial<ShowCreateInput> = {
      date: data.date,
      venue: data.venueId ? { connect: { id: data.venueId } } : undefined,
      band: data.bandId ? { connect: { id: data.bandId } } : undefined,
      notes: data.notes,
      relistenUrl: data.relistenUrl,
    };

    const result = await this.db.show.update({
      where: { slug },
      data: {
        ...updateInput,
        ...(newSlug && { slug: newSlug }),
        updatedAt: new Date(),
      },
    });

    const show = mapShowToDomainEntity(result);

    // Invalidate caches
    if (this.cacheInvalidation) {
      if (newSlug && newSlug !== slug) {
        // Slug changed - invalidate both old and new
        await Promise.all([
          this.cacheInvalidation.invalidateShow(slug), // old slug
          this.cacheInvalidation.invalidateShow(newSlug), // new slug
          this.cacheInvalidation.invalidateShowListings(),
        ]);
      } else {
        // Regular update - invalidate current show and listings
        await this.cacheInvalidation.invalidateShowComprehensive(currentShow.id, slug);
      }
    }

    return show;
  }

  async delete(id: string): Promise<boolean> {
    try {
      // Get show data before deletion for cache invalidation
      const show = await this.db.show.findUnique({
        where: { id },
        select: { slug: true },
      });

      await this.db.show.delete({
        where: { id },
      });

      // Invalidate caches
      if (this.cacheInvalidation && show?.slug) {
        await this.cacheInvalidation.invalidateShowComprehensive(id, show.slug);
      }

      return true;
    } catch (_error) {
      return false;
    }
  }
}
