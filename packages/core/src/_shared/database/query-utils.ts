import type { FilterCondition, QueryOptions, SortOptions } from "./types";

const operatorToRecord = (operator: string, value: unknown) => {
  switch (operator) {
    case "eq":
      return { equals: value };
    case "neq":
      return { not: value };
    case "gt":
      return { gt: value };
    case "gte":
      return { gte: value };
    case "lt":
      return { lt: value };
    case "lte":
      return { lte: value };
    case "contains":
      return { contains: value, mode: "insensitive" };
    case "startsWith":
      return { startsWith: value };
    case "endsWith":
      return { endsWith: value };
    case "in":
      return { in: value };
    case "notIn":
      return { notIn: value };
  }
  return {};
};

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

    const newCondition = operatorToRecord(operator, value);
    whereConditions[fieldName] = {
      ...newCondition,
      ...(whereConditions[fieldName] ? whereConditions[fieldName] : {}),
    };
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
