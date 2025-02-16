import type { Venue } from "@bip/domain";
import type { SQL } from "drizzle-orm";
import type { NewVenue, VenueRow } from "../_shared/drizzle/types";
import type { VenueRepository } from "./venue-repository";

export interface VenueFilter {
  name?: string;
}

export class VenueService {
  constructor(private readonly repository: VenueRepository) {}

  async find(id: string) {
    return this.repository.findById(id);
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
