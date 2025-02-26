import type { DbClient, DbModel, ModelName } from "./models";
import { dbClient } from "./models";
import type { BaseEntity, FilterCondition, PaginatedResult, QueryOptions, Repository } from "./types";

// Define a type for common Prisma model operations
type PrismaModelOperations<T> = {
  findUnique: (args: { where: Record<string, unknown>; include?: Record<string, boolean> }) => Promise<T | null>;
  findFirst: (args: {
    where: Record<string, unknown>;
    orderBy?: Record<string, string>;
    include?: Record<string, boolean>;
  }) => Promise<T | null>;
  findMany: (args: {
    where: Record<string, unknown>;
    orderBy?: Record<string, string>[];
    skip?: number;
    take?: number;
    include?: Record<string, boolean>;
  }) => Promise<T[]>;
  create: (args: { data: Record<string, unknown> }) => Promise<T>;
  update: (args: { where: Record<string, unknown>; data: Record<string, unknown> }) => Promise<T>;
  delete: (args: { where: Record<string, unknown> }) => Promise<T>;
  count: (args: { where: Record<string, unknown> }) => Promise<number>;
};

/**
 * Base repository implementation using the database client
 * This class abstracts away database-specific details and provides a common interface
 * for all repositories to implement.
 */
export abstract class BaseRepository<T extends BaseEntity, M extends DbModel> implements Repository<T> {
  protected db: DbClient;
  protected abstract modelName: ModelName;

  constructor(client = dbClient) {
    this.db = client;
  }

  /**
   * Get the database model instance
   * We use a type assertion to unknown to allow for flexible usage in methods
   */
  protected get model(): unknown {
    return this.db[this.modelName];
  }

  /**
   * Convert our generic filter conditions to database-specific where conditions
   */
  protected buildWhereClause(filters?: FilterCondition<T>[]): Record<string, unknown> {
    if (!filters || filters.length === 0) {
      return {};
    }

    const whereConditions: Record<string, unknown> = {};

    for (const filter of filters) {
      const { field, operator, value } = filter;
      const fieldName = String(field);

      switch (operator) {
        case "eq":
          whereConditions[fieldName] = { equals: value };
          break;
        case "neq":
          whereConditions[fieldName] = { not: value };
          break;
        case "gt":
          whereConditions[fieldName] = { gt: value };
          break;
        case "gte":
          whereConditions[fieldName] = { gte: value };
          break;
        case "lt":
          whereConditions[fieldName] = { lt: value };
          break;
        case "lte":
          whereConditions[fieldName] = { lte: value };
          break;
        case "contains":
          whereConditions[fieldName] = { contains: value, mode: "insensitive" };
          break;
        case "startsWith":
          whereConditions[fieldName] = { startsWith: value };
          break;
        case "endsWith":
          whereConditions[fieldName] = { endsWith: value };
          break;
        case "in":
          whereConditions[fieldName] = { in: value };
          break;
        case "notIn":
          whereConditions[fieldName] = { notIn: value };
          break;
        default:
          break;
      }
    }

    return whereConditions;
  }

  /**
   * Convert our generic sort options to database-specific orderBy
   */
  protected buildOrderByClause<Entity>(sort?: QueryOptions<Entity>["sort"]): Record<string, string>[] {
    if (!sort || sort.length === 0) {
      return [{ createdAt: "desc" }]; // Default sort
    }

    return sort.map((sortOption) => ({
      [String(sortOption.field)]: sortOption.direction,
    }));
  }

  /**
   * Convert our generic includes to database-specific include object
   */
  protected buildIncludeClause<Entity>(includes?: QueryOptions<Entity>["includes"]): Record<string, boolean> {
    if (!includes || includes.length === 0) {
      return {};
    }

    const includeObject: Record<string, boolean> = {};
    for (const include of includes) {
      includeObject[String(include)] = true;
    }

    return includeObject;
  }

  /**
   * Find an entity by its ID
   */
  async findById(id: string, options?: Partial<QueryOptions<T>>): Promise<T | null> {
    const include = this.buildIncludeClause(options?.includes);
    const model = this.model as PrismaModelOperations<M>;

    // Type assertion for the specific operation
    // biome-ignore lint/suspicious/noExplicitAny: Prisma operations require flexible args
    const result = await (model as { findUnique: (args: any) => Promise<M | null> }).findUnique({
      where: { id },
      include: Object.keys(include).length > 0 ? include : undefined,
    });

    if (!result) return null;
    return this.mapToDomainEntity(result as M);
  }

  /**
   * Find a single entity matching the given options
   */
  async findOne(options: QueryOptions<T>): Promise<T | null> {
    const where = this.buildWhereClause(options.filters);
    const orderBy = this.buildOrderByClause(options.sort);
    const include = this.buildIncludeClause(options.includes);
    const model = this.model as PrismaModelOperations<M>;

    // Type assertion for the specific operation
    // biome-ignore lint/suspicious/noExplicitAny: Prisma operations require flexible args
    const result = await (model as { findFirst: (args: any) => Promise<M | null> }).findFirst({
      where,
      orderBy: orderBy.length > 0 ? orderBy[0] : undefined,
      include: Object.keys(include).length > 0 ? include : undefined,
    });

    if (!result) return null;
    return this.mapToDomainEntity(result as M);
  }

  /**
   * Find multiple entities matching the given options
   */
  async findMany(options?: QueryOptions<T>): Promise<T[]> {
    const where = this.buildWhereClause(options?.filters);
    const orderBy = this.buildOrderByClause(options?.sort);
    const include = this.buildIncludeClause(options?.includes);
    const model = this.model as PrismaModelOperations<M>;

    const skip =
      options?.pagination?.page && options?.pagination?.limit
        ? (options.pagination.page - 1) * options.pagination.limit
        : undefined;

    const take = options?.pagination?.limit;

    // Type assertion for the specific operation
    // biome-ignore lint/suspicious/noExplicitAny: Prisma operations require flexible args
    const results = await (model as { findMany: (args: any) => Promise<M[]> }).findMany({
      where,
      orderBy,
      skip,
      take,
      include: Object.keys(include).length > 0 ? include : undefined,
    });

    return results.map((result: M) => this.mapToDomainEntity(result));
  }

  /**
   * Find multiple entities with pagination
   */
  async findManyPaginated(options?: QueryOptions<T>): Promise<PaginatedResult<T>> {
    const where = this.buildWhereClause(options?.filters);
    const orderBy = this.buildOrderByClause(options?.sort);
    const include = this.buildIncludeClause(options?.includes);
    const model = this.model as PrismaModelOperations<M>;

    const page = options?.pagination?.page || 1;
    const limit = options?.pagination?.limit || 10;
    const skip = (page - 1) * limit;

    const [results, total] = await Promise.all([
      // biome-ignore lint/suspicious/noExplicitAny: Prisma operations require flexible args
      (model as { findMany: (args: any) => Promise<M[]> }).findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: Object.keys(include).length > 0 ? include : undefined,
      }),
      // biome-ignore lint/suspicious/noExplicitAny: Prisma operations require flexible args
      (model as { count: (args: any) => Promise<number> }).count({ where }),
    ]);

    return {
      data: results.map((result: M) => this.mapToDomainEntity(result)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Count entities matching the given filters
   */
  async count(options?: Pick<QueryOptions<T>, "filters">): Promise<number> {
    const where = this.buildWhereClause(options?.filters);
    const model = this.model as PrismaModelOperations<M>;
    // biome-ignore lint/suspicious/noExplicitAny: Prisma operations require flexible args
    return (model as { count: (args: any) => Promise<number> }).count({ where });
  }

  /**
   * Create a new entity
   */
  async create(data: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T> {
    const model = this.model as PrismaModelOperations<M>;
    const mappedData = this.mapToDbModel(data as Partial<T>);

    // biome-ignore lint/suspicious/noExplicitAny: Prisma operations require flexible args
    const result = await (model as { create: (args: any) => Promise<M> }).create({
      data: {
        ...mappedData,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return this.mapToDomainEntity(result as M);
  }

  /**
   * Update an existing entity
   */
  async update(id: string, data: Partial<Omit<T, "id" | "createdAt" | "updatedAt">>): Promise<T> {
    const model = this.model as PrismaModelOperations<M>;
    const mappedData = this.mapToDbModel(data as Partial<T>);

    // biome-ignore lint/suspicious/noExplicitAny: Prisma operations require flexible args
    const result = await (model as { update: (args: any) => Promise<M> }).update({
      where: { id },
      data: {
        ...mappedData,
        updatedAt: new Date(),
      },
    });

    return this.mapToDomainEntity(result as M);
  }

  /**
   * Delete an entity
   */
  async delete(id: string): Promise<boolean> {
    try {
      const model = this.model as PrismaModelOperations<M>;
      // biome-ignore lint/suspicious/noExplicitAny: Prisma operations require flexible args
      await (model as { delete: (args: any) => Promise<M> }).delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Map a database model to our domain entity
   * This method should be implemented by each repository to handle
   * the mapping between database models and domain entities
   */
  protected abstract mapToDomainEntity(model: M): T;

  /**
   * Map a domain entity to a database model
   * This method should be implemented by each repository to handle
   * the mapping between domain entities and database models
   */
  protected abstract mapToDbModel(entity: Partial<T>): Partial<M>;
}
