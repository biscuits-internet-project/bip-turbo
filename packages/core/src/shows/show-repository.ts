import type { Show } from "@bip/domain";
import { Prisma } from "@prisma/client";
import { BaseRepository } from "../_shared/database/base-repository";
import type { DbShow } from "../_shared/database/models";
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

export class ShowRepository extends BaseRepository<Show, DbShow> {
  protected modelName = "show" as const;

  protected mapToDomainEntity(show: DbShow): Show {
    return mapShowToDomainEntity(show);
  }

  protected mapToDbModel(show: Partial<Show>): Partial<DbShow> {
    return mapShowToDbModel(show);
  }

  async findById(id: string): Promise<Show | null> {
    const result = await this.db.show.findUnique({ where: { id } });
    return result ? this.mapToDomainEntity(result) : null;
  }

  async findBySlug(slug: string): Promise<Show | null> {
    const result = await this.db.show.findUnique({ where: { slug } });
    return result ? this.mapToDomainEntity(result) : null;
  }

  async findMany(options?: QueryOptions<Show>): Promise<Show[]> {
    const where = options?.filters ? this.buildWhereClause(options.filters) : {};
    const orderBy = options?.sort ? this.buildOrderByClause(options.sort) : [{ date: "desc" }];
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
    });

    return results.map((result: DbShow) => this.mapToDomainEntity(result));
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
      orderBy: options?.sort ? this.buildOrderByClause(options.sort) : [{ date: "desc" }],
      skip:
        options?.pagination?.page && options?.pagination?.limit
          ? (options.pagination.page - 1) * options.pagination.limit
          : undefined,
      take: options?.pagination?.limit,
    });

    return shows.map((show) => this.mapToDomainEntity(show));
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
