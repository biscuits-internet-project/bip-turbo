import type { Author, Logger } from "@bip/domain";
import type { DbAuthor, DbClient } from "../_shared/database/models";
import { buildOrderByClause, buildWhereClause } from "../_shared/database/query-utils";
import type { FilterCondition, QueryOptions } from "../_shared/database/types";
import { slugify } from "../_shared/utils/slugify";

export interface CreateAuthorInput {
  name: string;
}

export type UpdateAuthorInput = Partial<CreateAuthorInput>;

// Mapper functions
function mapAuthorToDomainEntity(dbAuthor: DbAuthor): Author {
  const { slug, createdAt, updatedAt, name, ...rest } = dbAuthor;

  return {
    ...rest,
    slug: slug || "",
    createdAt: new Date(createdAt),
    updatedAt: new Date(updatedAt),
    name: name || "",
  };
}

export class AuthorService {
  constructor(
    protected readonly db: DbClient,
    protected readonly logger: Logger,
  ) {}

  private async generateAuthorSlug(name: string, excludeId?: string): Promise<string> {
    const baseSlug = slugify(name);
    let slug = baseSlug;
    let counter = 2;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      // Check if slug already exists (excluding current author if updating)
      const existing = await this.db.author.findFirst({
        where: {
          slug,
          ...(excludeId && { id: { not: excludeId } }),
        },
      });

      // If no collision, use this slug
      if (!existing) {
        return slug;
      }

      // Collision detected, add suffix
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  async findById(id: string): Promise<Author | null> {
    const result = await this.db.author.findUnique({
      where: { id },
    });
    return result ? mapAuthorToDomainEntity(result) : null;
  }

  async findBySlug(slug: string): Promise<Author | null> {
    const result = await this.db.author.findFirst({
      where: { slug },
    });
    return result ? mapAuthorToDomainEntity(result) : null;
  }

  // Alias for findBySlug to match the naming in the routes
  async getBySlug(slug: string) {
    return this.findBySlug(slug);
  }

  async findMany(options?: QueryOptions<Author>): Promise<Author[]> {
    const where = options?.filters ? buildWhereClause(options.filters) : {};
    const orderBy = options?.sort ? buildOrderByClause(options.sort) : [{ name: "asc" }];
    const skip =
      options?.pagination?.page && options?.pagination?.limit
        ? (options.pagination.page - 1) * options.pagination.limit
        : undefined;
    const take = options?.pagination?.limit;

    const results = await this.db.author.findMany({
      where,
      orderBy,
      skip,
      take,
    });

    return results.map((result: DbAuthor) => mapAuthorToDomainEntity(result));
  }

  async findManyWithSongCount(): Promise<Array<Author & { songCount: number }>> {
    const results = await this.db.author.findMany({
      include: {
        _count: {
          select: { songs: true },
        },
      },
      orderBy: {
        songs: { _count: "desc" },
      },
    });

    return results.map((result) => ({
      ...mapAuthorToDomainEntity(result),
      songCount: result._count.songs,
    }));
  }

  async search(query: string, limit = 10): Promise<Author[]> {
    const queryOptions: QueryOptions<Author> = {
      filters: [
        {
          field: "name",
          operator: "contains",
          value: query,
        },
      ] as FilterCondition<Author>[],
      pagination: {
        limit: limit * 3, // Fetch more results to ensure we have enough after sorting
      },
    };

    const results = await this.findMany(queryOptions);

    // Sort results by match quality: exact match > starts with > contains
    const queryLower = query.toLowerCase();
    const sorted = results.sort((a, b) => {
      const aNameLower = a.name.toLowerCase();
      const bNameLower = b.name.toLowerCase();

      // Exact match priority
      const aExact = aNameLower === queryLower ? 0 : 1;
      const bExact = bNameLower === queryLower ? 0 : 1;
      if (aExact !== bExact) return aExact - bExact;

      // Starts with priority
      const aStartsWith = aNameLower.startsWith(queryLower) ? 0 : 1;
      const bStartsWith = bNameLower.startsWith(queryLower) ? 0 : 1;
      if (aStartsWith !== bStartsWith) return aStartsWith - bStartsWith;

      // Alphabetical for same match type
      return aNameLower.localeCompare(bNameLower);
    });

    return sorted.slice(0, limit);
  }

  async create(data: CreateAuthorInput): Promise<Author> {
    // Validate required fields
    if (!data.name?.trim()) {
      throw new Error("Author name is required");
    }

    const trimmedData = {
      name: data.name.trim(),
    };

    const slug = await this.generateAuthorSlug(trimmedData.name);
    const result = await this.db.author.create({
      data: {
        ...trimmedData,
        slug,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return mapAuthorToDomainEntity(result);
  }

  async update(id: string, data: UpdateAuthorInput): Promise<Author> {
    // Get current author for validation
    const current = await this.db.author.findUnique({
      where: { id },
      select: { name: true },
    });

    if (!current) {
      throw new Error(`Author with id "${id}" not found`);
    }

    // Validate required fields
    if (data.name !== undefined && !data.name?.trim()) {
      throw new Error("Author name is required");
    }

    // Trim the update data
    const cleanData: Partial<Author> = {};
    if (data.name !== undefined) {
      cleanData.name = data.name.trim();
    }

    const updateData: Partial<DbAuthor> & { updatedAt: Date; slug?: string } = {
      ...cleanData,
      updatedAt: new Date(),
    };

    // Regenerate slug if name changes
    if (data.name) {
      updateData.slug = await this.generateAuthorSlug(cleanData.name || "", id);
    }

    const result = await this.db.author.update({
      where: { id },
      data: updateData,
    });
    return mapAuthorToDomainEntity(result);
  }

  async delete(id: string): Promise<boolean> {
    // Check if author has any songs
    const songsCount = await this.db.song.count({
      where: { authorId: id },
    });

    if (songsCount > 0) {
      throw new Error(`Cannot delete author with ${songsCount} associated song(s)`);
    }

    try {
      await this.db.author.delete({
        where: { id },
      });
      return true;
    } catch (_error) {
      return false;
    }
  }
}
