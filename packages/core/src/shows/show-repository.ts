import type { Show } from "@bip/domain";
import { BaseRepository } from "../_shared/database/base-repository";
import type { DbShow } from "../_shared/database/models";
import type { QueryOptions } from "../_shared/database/types";

export function mapShowToDomainEntity(show: DbShow): Show {
  const { venueId, bandId, ...rest } = show;
  return {
    ...rest,
    date: new Date(show.date),
    createdAt: new Date(show.createdAt),
    updatedAt: new Date(show.updatedAt),
    slug: show.slug ?? "",
    venueId: venueId ?? "",
    bandId: bandId ?? "",
  };
}

export function mapShowToDbModel(show: Partial<Show>): Partial<DbShow> {
  return show as Partial<DbShow>;
}

export class ShowRepository extends BaseRepository<Show, DbShow> {
  protected modelName = "show" as const;

  protected mapToDomainEntity(show: DbShow): Show {
    return mapShowToDomainEntity(show);
  }

  protected mapToDbModel(show: Partial<Show>): Partial<DbShow> {
    return mapShowToDbModel(show);
  }

  async findById(id: string): Promise<Show | null> {
    const result = await this.db.show.findUnique({ where: { id } });
    return result ? this.mapToDomainEntity(result) : null;
  }

  async findBySlug(slug: string): Promise<Show | null> {
    const result = await this.db.show.findUnique({ where: { slug } });
    return result ? this.mapToDomainEntity(result) : null;
  }

  async findMany(options?: QueryOptions<Show>): Promise<Show[]> {
    const where = options?.filters ? this.buildWhereClause(options.filters) : {};
    const orderBy = options?.sort ? this.buildOrderByClause(options.sort) : [{ date: "desc" }];
    const skip =
      options?.pagination?.page && options?.pagination?.limit
        ? (options.pagination.page - 1) * options.pagination.limit
        : undefined;
    const take = options?.pagination?.limit;

    const results = await this.db.show.findMany({
      where,
      orderBy,
      skip,
      take,
    });

    return results.map((result: DbShow) => this.mapToDomainEntity(result));
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.db.show.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
