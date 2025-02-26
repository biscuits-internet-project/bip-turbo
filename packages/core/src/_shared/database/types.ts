/**
 * Common types for the repository pattern
 */

// Base entity interface that all domain entities should extend
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Generic pagination options
export interface PaginationOptions {
  page?: number;
  limit?: number;
}

// Generic sort options
export interface SortOptions<T> {
  field: keyof T;
  direction: "asc" | "desc";
}

// Generic filter options
export type FilterOperator =
  | "eq"
  | "neq"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "contains"
  | "startsWith"
  | "endsWith"
  | "in"
  | "notIn";

export interface FilterCondition<T> {
  field: keyof T;
  operator: FilterOperator;
  value: unknown;
}

// Generic query options
export interface QueryOptions<T> {
  pagination?: PaginationOptions;
  sort?: SortOptions<T>[];
  filters?: FilterCondition<T>[];
  includes?: (keyof T)[];
}

// Pagination result
export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Base repository interface
export interface Repository<T extends BaseEntity> {
  findById(id: string, options?: Partial<QueryOptions<T>>): Promise<T | null>;
  findOne(options: QueryOptions<T>): Promise<T | null>;
  findMany(options?: QueryOptions<T>): Promise<T[]>;
  findManyPaginated(options?: QueryOptions<T>): Promise<PaginatedResult<T>>;
  count(options?: Pick<QueryOptions<T>, "filters">): Promise<number>;
  create(data: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T>;
  update(id: string, data: Partial<Omit<T, "id" | "createdAt" | "updatedAt">>): Promise<T>;
  delete(id: string): Promise<boolean>;
}
