import type { Database } from "../drizzle/client";

export interface Repository<T, TNew, TFilter = unknown> {
  findById(id: string): Promise<T | null>;
  findBySlug(slug: string): Promise<T | null>;
  findMany(filter?: TFilter): Promise<T[]>;
  create(data: TNew): Promise<T>;
  update(id: string, data: Partial<TNew>): Promise<T>;
  delete(id: string): Promise<void>;
}

export abstract class BaseRepository<T, TNew, TFilter = unknown> implements Repository<T, TNew, TFilter> {
  constructor(protected readonly db: Database) {}
  abstract findById(id: string): Promise<T | null>;
  abstract findBySlug(slug: string): Promise<T | null>;
  abstract findMany(filter?: TFilter): Promise<T[]>;
  abstract create(data: TNew): Promise<T>;
  abstract update(id: string, data: Partial<TNew>): Promise<T>;
  abstract delete(id: string): Promise<void>;
}
