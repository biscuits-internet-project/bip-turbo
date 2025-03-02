import type { User, UserMinimal } from "@bip/domain";
import { BaseRepository } from "../_shared/database/base-repository";
import type { DbUser } from "../_shared/database/models";
import type { QueryOptions } from "../_shared/database/types";

export function mapUserToDomainEntity(dbUser: DbUser): User {
  return {
    id: dbUser.id,
    username: dbUser.username ?? "",
    email: dbUser.email ?? "",
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
    avatarUrl: "",
  };
}

export class UserRepository extends BaseRepository<User, DbUser> {
  protected modelName = "user" as const;

  protected mapToDomainEntity(dbUser: DbUser): User {
    return mapUserToDomainEntity(dbUser);
  }

  protected mapToDbModel(entity: Partial<User>): Partial<DbUser> {
    return mapUserToDbModel(entity);
  }

  async findById(id: string): Promise<User | null> {
    const result = await this.db.user.findUnique({
      where: { id },
    });
    return result ? this.mapToDomainEntity(result) : null;
  }

  async findBySlug(username: string): Promise<User | null> {
    const result = await this.db.user.findUnique({
      where: { username },
    });
    return result ? this.mapToDomainEntity(result) : null;
  }

  async findMany(options?: QueryOptions<User>): Promise<User[]> {
    const where = options?.filters ? this.buildWhereClause(options.filters) : {};
    const orderBy = options?.sort ? this.buildOrderByClause(options.sort) : [{ createdAt: "desc" }];
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

    return results.map((result: DbUser) => this.mapToDomainEntity(result));
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
