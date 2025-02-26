import type { Logger, Venue } from "@bip/domain";
import { BaseService } from "../_shared/base-service";
import type { DbVenue } from "../_shared/database/models";
import type { QueryOptions } from "../_shared/database/types";
import type { VenueRepository } from "./venue-repository";

export class VenueService extends BaseService<Venue, DbVenue> {
  constructor(
    protected readonly repository: VenueRepository,
    logger: Logger,
  ) {
    super(repository, logger);
  }

  async findById(id: string) {
    return this.repository.findById(id);
  }

  async findBySlug(slug: string) {
    return this.repository.findBySlug(slug);
  }

  async findMany(filter: QueryOptions<Venue>) {
    return this.repository.findMany(filter);
  }

  async delete(id: string) {
    return this.repository.delete(id);
  }
}
