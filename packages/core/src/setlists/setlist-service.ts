import type { Setlist, Show } from "@bip/domain";
import type { PaginationOptions, SortOptions } from "../_shared/database/types";
import type { SetlistRepository } from "./setlist-repository";

export type SetlistFilter = {
  year?: number;
  venueId?: string;
};

export class SetlistService {
  constructor(private readonly repository: SetlistRepository) {}

  async findByShowId(id: string): Promise<Setlist | null> {
    return this.repository.findByShowId(id);
  }

  async findByShowSlug(slug: string): Promise<Setlist | null> {
    return this.repository.findByShowSlug(slug);
  }

  /**
   * Find setlists by an array of show IDs
   * @param showIds Array of show IDs to find setlists for
   * @param options Optional query options for pagination, sorting, etc.
   * @returns An array of setlists for the specified show IDs
   */
  async findManyByShowIds(
    showIds: string[],
    options?: {
      pagination?: PaginationOptions;
      sort?: SortOptions<Show>[];
    },
  ): Promise<Setlist[]> {
    return this.repository.findManyByShowIds(showIds, options);
  }

  async findMany(options?: {
    pagination?: PaginationOptions;
    sort?: SortOptions<Show>[];
    filters?: SetlistFilter;
  }): Promise<Setlist[]> {
    return this.repository.findMany(options);
  }
}
