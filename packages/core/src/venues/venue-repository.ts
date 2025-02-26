import type { Venue } from "@bip/domain";
import { BaseRepository } from "../_shared/database/base-repository";
import type { DbVenue } from "../_shared/database/models";
import type { QueryOptions } from "../_shared/database/types";

export function mapVenueToDomainEntity(dbVenue: DbVenue): Venue {
  const { slug, createdAt, updatedAt, name, ...rest } = dbVenue;

  return {
    ...rest,
    slug: slug || "",
    createdAt: new Date(createdAt),
    updatedAt: new Date(updatedAt),
    name: name || "",
  };
}

export function mapVenueToDbModel(entity: Partial<Venue>): Partial<DbVenue> {
  return entity as Partial<DbVenue>;
}

export class VenueRepository extends BaseRepository<Venue, DbVenue> {
  protected modelName = "venue" as const;

  protected mapToDomainEntity(dbVenue: DbVenue): Venue {
    return mapVenueToDomainEntity(dbVenue);
  }

  protected mapToDbModel(entity: Partial<Venue>): Partial<DbVenue> {
    return mapVenueToDbModel(entity);
  }

  async findById(id: string): Promise<Venue | null> {
    const result = await this.db.venue.findUnique({
      where: { id },
    });
    return result ? this.mapToDomainEntity(result) : null;
  }

  async findBySlug(slug: string): Promise<Venue | null> {
    const result = await this.db.venue.findFirst({
      where: { slug },
    });
    return result ? this.mapToDomainEntity(result) : null;
  }

  async findMany(options?: QueryOptions<Venue>): Promise<Venue[]> {
    const where = options?.filters ? this.buildWhereClause(options.filters) : {};
    const orderBy = options?.sort ? this.buildOrderByClause(options.sort) : [{ timesPlayed: "desc" }];
    const skip =
      options?.pagination?.page && options?.pagination?.limit
        ? (options.pagination.page - 1) * options.pagination.limit
        : undefined;
    const take = options?.pagination?.limit;

    const results = await this.db.venue.findMany({
      where,
      orderBy,
      skip,
      take,
    });

    return results.map((result: DbVenue) => this.mapToDomainEntity(result));
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.db.venue.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
