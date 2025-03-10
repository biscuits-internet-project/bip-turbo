import type { Show } from "@bip/domain";
import type { DbClient, DbShow } from "../_shared/database/models";
import { buildIncludeClause, buildOrderByClause, buildWhereClause } from "../_shared/database/query-utils";
import type { QueryOptions } from "../_shared/database/types";

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
  constructor(protected db: DbClient) {}

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
      SELECT to_tsvector('english', ${query}) as tokens;
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
        ts_rank_cd(to_tsvector('english', content), websearch_to_tsquery('english', ${query})) as rank
      FROM pg_search_documents 
      WHERE 
        searchable_type = 'Show'
        AND to_tsvector('english', content) @@ websearch_to_tsquery('english', ${query})
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
      await this.db.show.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
