import type { Show } from "@bip/domain";
import type { Prisma } from "@prisma/client";
import type { CacheInvalidationService } from "../_shared/cache";
import type { DbClient, DbShow } from "../_shared/database/models";
import { buildIncludeClause, buildOrderByClause, buildWhereClause } from "../_shared/database/query-utils";
import type { QueryOptions } from "../_shared/database/types";
import { slugify } from "../_shared/utils/slugify";

export type ShowCreateInput = Prisma.ShowCreateInput;

export function mapShowToDomainEntity(show: DbShow): Show {
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

export function mapShowToDbModel(show: Partial<Show>): Partial<DbShow> {
  return show as Partial<DbShow>;
}

export class ShowRepository {
  constructor(
    protected db: DbClient,
    protected cacheInvalidation?: CacheInvalidationService,
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

  async findMany(options?: QueryOptions<Show>): Promise<Show[]> {
    console.log("🔍 Options:", options);
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

    console.log("🔍 Searching for:", query);

    // First, let's see what the tokenization looks like
    const tokenDebug = await this.db.$queryRaw<Array<{ tokens: string }>>`
      SELECT to_tsvector('english', ${query})::text as tokens;
    `;
    console.log("🔤 Query tokens:", tokenDebug[0]?.tokens);

    // Let's also check what's in the pg_search_documents table
    const sampleContent = await this.db.$queryRaw<Array<{ content: string }>>`
      SELECT content 
      FROM pg_search_documents 
      WHERE content ILIKE ${`%${query}%`}
      LIMIT 1;
    `;
    console.log("📄 Matching content sample:", sampleContent[0]?.content);

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

    console.log("✨ Search results count:", searchResults.length);

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

  async create(data: ShowCreateInput): Promise<Show> {
    const venueId = data.venue?.connect?.id;
    const slug = await this.generateShowSlug(String(data.date), venueId);

    const result = await this.db.show.create({
      data: {
        date: data.date,
        slug,
        venue: data.venue,
        band: data.band,
        notes: data.notes,
        relistenUrl: data.relistenUrl,
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

  async update(slug: string, data: Partial<ShowCreateInput>): Promise<Show> {
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
    if (data.date || data.venue) {
      const date = data.date || currentShow.date;
      const venueId = data.venue?.connect?.id || currentShow.venueId || undefined;
      newSlug = await this.generateShowSlug(String(date), venueId);
    }

    const result = await this.db.show.update({
      where: { slug },
      data: {
        ...data,
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

    return results.map((result: any) => {
      const show = mapShowToDomainEntity(result);
      if (result.venue) {
        show.venue = result.venue;
      }
      return show;
    });
  }
}
