import type { Logger, Show } from "@bip/domain";
import { BaseService } from "../_shared/base-service";
import type { DbShow } from "../_shared/database/models";
import type { FilterCondition, QueryOptions } from "../_shared/database/types";
import type { ShowRepository } from "./show-repository";

export interface ShowFilter {
  year?: number;
  songId?: string;
}

export class ShowService extends BaseService<Show, DbShow> {
  constructor(
    protected override repository: ShowRepository,
    logger: Logger,
  ) {
    super(repository, logger);
  }

  async findById(id: string): Promise<Show | null> {
    return this.repository.findById(id);
  }

  async findBySlug(slug: string): Promise<Show | null> {
    return this.repository.findBySlug(slug);
  }

  async findMany(filter: ShowFilter = {}): Promise<Show[]> {
    return this.repository.findMany({
      filters: Object.entries(filter).map(([field, value]) => ({
        field: field as keyof Show,
        operator: "eq",
        value,
      })) as FilterCondition<Show>[],
    });
  }

  /**
   * Search for shows using the pg_search_documents table
   * @param query The search query
   * @param options Optional query options for pagination, sorting, etc.
   * @returns An array of shows matching the search query
   */
  async search(query: string, options?: QueryOptions<Show>): Promise<Show[]> {
    this.logger.info(`Searching for shows with query: ${query}`);
    return (this.repository as ShowRepository).search(query, options);
  }
}
