import type { User, UserMinimal } from "@bip/domain";
import type { DbClient, DbUser } from "../_shared/database/models";
import { buildOrderByClause, buildWhereClause } from "../_shared/database/query-utils";
import type { QueryOptions } from "../_shared/database/types";

export function mapUserToDomainEntity(dbUser: DbUser): User {
  return {
    id: dbUser.id,
    username: dbUser.username ?? "",
    email: dbUser.email ?? "",
    avatarUrl: null, // TODO: Implement avatar storage
    createdAt: dbUser.createdAt,
    updatedAt: dbUser.updatedAt,
  };
}

export function mapUserToDbModel(entity: Partial<User>): Partial<DbUser> {
  return entity as Partial<DbUser>;
}

export function mapToUserMinimal(dbUser: DbUser): UserMinimal {
  return {
    id: dbUser.id,
    username: dbUser.username ?? "",
    avatarUrl: null, // TODO: Implement avatar storage
  };
}

export class UserRepository {
  constructor(private readonly db: DbClient) {}

  async findById(id: string): Promise<User | null> {
    const result = await this.db.user.findUnique({
      where: { id },
    });
    return result ? mapUserToDomainEntity(result) : null;
  }

  async findBySlug(username: string): Promise<User | null> {
    const result = await this.db.user.findUnique({
      where: { username },
    });
    return result ? mapUserToDomainEntity(result) : null;
  }

  async findMany(options?: QueryOptions<User>): Promise<User[]> {
    const where = options?.filters ? buildWhereClause(options.filters) : {};
    const orderBy = options?.sort ? buildOrderByClause(options.sort) : [{ createdAt: "desc" }];
    const skip =
      options?.pagination?.page && options?.pagination?.limit
        ? (options.pagination.page - 1) * options.pagination.limit
        : undefined;
    const take = options?.pagination?.limit;

    const results = await this.db.user.findMany({
      where,
      orderBy,
      skip,
      take,
    });

    return results.map((result: DbUser) => mapUserToDomainEntity(result));
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    try {
      const dbData = mapUserToDbModel(data);
      const result = await this.db.user.update({
        where: { id },
        data: dbData,
      });
      return mapUserToDomainEntity(result);
    } catch (error) {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.db.user.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
