import type { FilterCondition, QueryOptions, SortOptions } from "./types";

/**
 * Builds a Prisma-compatible where clause from our generic filter conditions
 */
export function buildWhereClause<T>(filters?: FilterCondition<T>[]): Record<string, unknown> {
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
 * Builds a Prisma-compatible orderBy clause from our generic sort options
 */
export function buildOrderByClause<T>(
  sort?: SortOptions<T>[],
  defaultSort?: Record<string, string>,
): Record<string, string>[] {
  if (!sort || sort.length === 0) {
    return defaultSort ? [defaultSort] : [{ createdAt: "desc" }]; // Default sort
  }

  return sort.map((sortOption) => ({
    [String(sortOption.field)]: sortOption.direction,
  }));
}

/**
 * Convert our generic includes to database-specific include object
 */
export function buildIncludeClause<Entity>(includes?: QueryOptions<Entity>["includes"]): Record<string, boolean> {
  if (!includes || includes.length === 0) {
    return {};
  }

  const includeObject: Record<string, boolean> = {};
  for (const include of includes) {
    includeObject[String(include)] = true;
  }

  return includeObject;
}
