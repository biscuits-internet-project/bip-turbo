import type { Show } from "@bip/domain";
import type { SQL } from "drizzle-orm";
import { and, between, eq } from "drizzle-orm";
import { transformShow } from "..";
import { shows, songs, tracks, venues } from "../_shared/drizzle/schema";
import type { NewShow } from "../_shared/drizzle/types";
import { BaseRepository } from "../_shared/repository/base";
import type { ShowFilter } from "./show-service";

export class ShowRepository extends BaseRepository<Show, NewShow, ShowFilter> {
  async findById(id: string): Promise<Show | null> {
    const result = await this.db.select().from(shows).where(eq(shows.id, id));
    return result[0] ? transformShow(result[0]) : null;
  }

  async findMany(filter?: ShowFilter): Promise<Show[]> {
    const conditions: SQL<unknown>[] = [];

    if (filter?.year) {
      const startDate = new Date(filter.year, 0, 1);
      const endDate = new Date(filter.year + 1, 0, 1);
      conditions.push(between(shows.date, startDate.toISOString(), endDate.toISOString()));
    }

    const result = await this.db
      .select()
      .from(shows)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    return result.map(transformShow);
  }

  async create(data: NewShow): Promise<Show> {
    const result = await this.db.insert(shows).values(data).returning();
    return transformShow(result[0]);
  }

  async update(id: string, data: Partial<NewShow>): Promise<Show> {
    const result = await this.db.update(shows).set(data).where(eq(shows.id, id)).returning();
    return transformShow(result[0]);
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(shows).where(eq(shows.id, id));
  }
}
