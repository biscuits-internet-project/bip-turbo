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

  // Alias for findBySlug to match the naming in the routes
  async getBySlug(slug: string) {
    return this.findBySlug(slug);
  }

  async findMany(filter: QueryOptions<Venue>) {
    return this.repository.findMany(filter);
  }

  async delete(id: string) {
    return this.repository.delete(id);
  }

  async create(data: Omit<Venue, "id" | "slug" | "createdAt" | "updatedAt" | "timesPlayed">) {
    const slug = this.generateSlug(data.name);
    return this.repository.create({
      ...data,
      slug,
      timesPlayed: 0,
    });
  }

  async update(slug: string, data: Partial<Omit<Venue, "id" | "slug" | "createdAt" | "updatedAt" | "timesPlayed">>) {
    const venue = await this.findBySlug(slug);
    if (!venue) {
      throw new Error(`Venue with slug "${slug}" not found`);
    }

    return this.repository.update(venue.id, data);
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
}
