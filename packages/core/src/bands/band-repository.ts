import type { Band } from "@bip/domain";
import type { SQL } from "drizzle-orm";
import { and, eq } from "drizzle-orm";
import { type BandFilter, transformBand } from "..";
import { bands } from "../_shared/drizzle/schema";
import type { NewBand } from "../_shared/drizzle/types";
import { BaseRepository } from "../_shared/repository/base";

export class BandRepository extends BaseRepository<Band, NewBand> {
  async findById(id: string): Promise<Band | null> {
    const result = await this.db.select().from(bands).where(eq(bands.id, id));
    return result[0] ? transformBand(result[0]) : null;
  }

  async findMany(filter: BandFilter): Promise<Band[]> {
    const conditions: SQL<unknown>[] = [];

    if (filter.name) {
      conditions.push(eq(bands.name, filter.name));
    }

    const result = await this.db
      .select()
      .from(bands)
      .where(conditions.length > 0 ? and(...conditions) : undefined);
    return result.map(transformBand);
  }

  async create(data: NewBand): Promise<Band> {
    const result = await this.db.insert(bands).values(data).returning();
    return transformBand(result[0]);
  }

  async update(id: string, data: Partial<NewBand>): Promise<Band> {
    const result = await this.db.update(bands).set(data).where(eq(bands.id, id)).returning();
    return transformBand(result[0]);
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(bands).where(eq(bands.id, id));
  }
}
