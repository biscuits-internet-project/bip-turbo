import type { Logger, Venue } from "@bip/domain";
import type { QueryOptions } from "../_shared/database/types";
import type { VenueRepository } from "./venue-repository";

export class VenueService {
  constructor(
    protected readonly repository: VenueRepository,
    protected readonly logger: Logger,
  ) {}

  async findById(id: string) {
    return this.repository.findById(id);
  }

  async findBySlug(slug: string) {
    return this.repository.findBySlug(slug);
  }

  // Alias for findBySlug to match the naming in the routes
  async getBySlug(slug: string) {
    return this.findBySlug(slug);
  }

  async findMany(filter: QueryOptions<Venue>) {
    return this.repository.findMany(filter);
  }

  async create(data: Omit<Venue, "id" | "slug" | "createdAt" | "updatedAt" | "timesPlayed">) {
    return this.repository.create(data);
  }

  async update(slug: string, data: Partial<Omit<Venue, "id" | "slug" | "createdAt" | "updatedAt" | "timesPlayed">>) {
    const venue = await this.findBySlug(slug);
    if (!venue) {
      throw new Error(`Venue with slug "${slug}" not found`);
    }

    return this.repository.update(venue.id, data);
  }

  async delete(id: string) {
    return this.repository.delete(id);
  }
}
