import type { Show, SongPageView } from "@bip/domain";
import { between, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { transformShow } from "..";
import { annotations, shows, songs, tracks, venues } from "../_shared/drizzle";
import type { NewShow } from "../_shared/drizzle/types";
import { BaseRepository } from "../_shared/repository/base";
import type { ShowFilter } from "./show-service";

export class ShowRepository extends BaseRepository<Show, NewShow, ShowFilter> {
  async findById(id: string): Promise<Show | null> {
    const result = await this.db.select().from(shows).where(eq(shows.id, id));
    return result[0] ? transformShow(result[0]) : null;
  }

  async findBySlug(slug: string): Promise<Show | null> {
    const result = await this.db.select().from(shows).where(eq(shows.slug, slug));
    return result[0] ? transformShow(result[0]) : null;
  }

  async findMany(filter?: ShowFilter): Promise<Show[]> {
    let baseQuery = this.db
      .select({
        show: shows,
      })
      .from(shows);

    if (filter?.year) {
      const startDate = new Date(filter.year, 0, 1);
      const endDate = new Date(filter.year + 1, 0, 1);
      baseQuery = baseQuery.where(
        between(shows.date, startDate.toISOString(), endDate.toISOString()),
      ) as unknown as typeof baseQuery;
    }

    const result = await baseQuery;
    return result.map((row) => transformShow(row.show));
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
