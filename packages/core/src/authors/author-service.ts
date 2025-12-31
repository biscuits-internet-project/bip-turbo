import type { Author, Logger } from "@bip/domain";
import type { FilterCondition } from "../_shared/database/types";
import type { QueryOptions } from "../_shared/database/types";
import type { AuthorRepository } from "./author-repository";

export interface CreateAuthorInput {
  name: string;
}

export type UpdateAuthorInput = Partial<CreateAuthorInput>;

export class AuthorService {
  constructor(
    protected readonly repository: AuthorRepository,
    protected readonly logger: Logger,
  ) {}

  async findById(id: string) {
    return this.repository.findById(id);
  }

  async findBySlug(slug: string) {
    return this.repository.findBySlug(slug);
  }

  // Alias for findBySlug to match the naming in the routes
  async getBySlug(slug: string) {
    return this.findBySlug(slug);
  }

  async findMany(filter: QueryOptions<Author>) {
    return this.repository.findMany(filter);
  }

  async findManyWithSongCount() {
    return this.repository.findManyWithSongCount();
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

    const results = await this.repository.findMany(queryOptions);

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

  async create(data: CreateAuthorInput) {
    return this.repository.create(data);
  }

  async update(slug: string, data: UpdateAuthorInput) {
    const author = await this.findBySlug(slug);
    if (!author) {
      throw new Error(`Author with slug "${slug}" not found`);
    }

    return this.repository.update(author.id, data);
  }

  async delete(id: string) {
    return this.repository.delete(id);
  }
}
