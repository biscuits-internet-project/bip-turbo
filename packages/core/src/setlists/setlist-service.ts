import type { Setlist, Show } from "@bip/domain";
import type { FilterCondition, PaginationOptions, SortOptions } from "../_shared/database/types";
import type { SetlistRepository } from "./setlist-repository";

export class SetlistService {
  constructor(private readonly repository: SetlistRepository) {}

  async findByShowId(id: string): Promise<Setlist | null> {
    return this.repository.findByShowId(id);
  }

  async findByShowSlug(slug: string): Promise<Setlist | null> {
    return this.repository.findByShowSlug(slug);
  }

  async findMany(options?: {
    pagination?: PaginationOptions;
    sort?: SortOptions<Show>[];
    filters?: FilterCondition<Show>[];
  }): Promise<Setlist[]> {
    return this.repository.findMany(options);
  }
}
