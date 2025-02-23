import type { Logger, Setlist } from "@bip/domain";
import { BaseService } from "../_shared/base-service";
import type { SetlistRepository } from "./setlist-repository";

export interface SetlistFilter {
  year: number;
}

export class SetlistService extends BaseService<Setlist, Setlist, SetlistFilter> {
  constructor(
    protected readonly repository: SetlistRepository,
    logger: Logger,
  ) {
    super(repository, logger);
  }

  async findById(id: string): Promise<Setlist | null> {
    return this.repository.findById(id);
  }

  async findBySlug(slug: string): Promise<Setlist | null> {
    return this.repository.findBySlug(slug);
  }

  async findMany(filter: SetlistFilter): Promise<Setlist[]> {
    return this.repository.findMany(filter);
  }
}
