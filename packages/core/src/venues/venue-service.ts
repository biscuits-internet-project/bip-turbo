import type { Logger } from "@bip/domain";
import { BaseService } from "../_shared/base-service";
import type { NewVenue } from "../_shared/drizzle/types";
import type { VenueRepository } from "./venue-repository";

export interface VenueFilter {
  name?: string;
}

export class VenueService extends BaseService {
  constructor(
    private readonly repository: VenueRepository,
    logger: Logger,
  ) {
    super(logger);
  }

  async findById(id: string) {
    return this.repository.findById(id);
  }

  async findBySlug(slug: string) {
    return this.repository.findBySlug(slug);
  }

  async findMany(filter: VenueFilter) {
    return this.repository.findMany(filter);
  }

  async create(data: NewVenue) {
    return this.repository.create(data);
  }

  async update(id: string, data: Partial<NewVenue>) {
    return this.repository.update(id, data);
  }

  async delete(id: string) {
    return this.repository.delete(id);
  }
}
