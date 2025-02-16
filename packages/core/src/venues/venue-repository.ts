import type { Venue } from "@bip/domain";
import type { SQL } from "drizzle-orm";
import { and, eq } from "drizzle-orm";
import { venues } from "../_shared/drizzle/schema";
import type { NewVenue } from "../_shared/drizzle/types";
import { BaseRepository } from "../_shared/repository/base";
import type { VenueFilter } from "./venue-service";
import { transformVenue } from "./venue-transformer";

export class VenueRepository extends BaseRepository<Venue, NewVenue> {
  async findById(id: string): Promise<Venue | null> {
    const result = await this.db.select().from(venues).where(eq(venues.id, id));
    return result[0] ? transformVenue(result[0]) : null;
  }

  async findMany(filter: VenueFilter): Promise<Venue[]> {
    const conditions: SQL<unknown>[] = [];

    if (filter.name) {
      conditions.push(eq(venues.name, filter.name));
    }

    const result = await this.db
      .select()
      .from(venues)
      .where(conditions.length > 0 ? and(...conditions) : undefined);
    return result.map(transformVenue);
  }

  async create(data: NewVenue): Promise<Venue> {
    const result = await this.db.insert(venues).values(data).returning();
    return transformVenue(result[0]);
  }

  async update(id: string, data: Partial<NewVenue>): Promise<Venue> {
    const result = await this.db.update(venues).set(data).where(eq(venues.id, id)).returning();
    return transformVenue(result[0]);
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(venues).where(eq(venues.id, id));
  }
}
