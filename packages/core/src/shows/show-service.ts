import type { Logger, Show } from "@bip/domain";
import type { FilterCondition, QueryOptions } from "../_shared/database/types";
import type { ShowRepository } from "./show-repository";
import type { ShowCreateInput } from "./show-repository";

export interface ShowFilter {
  year?: number;
  songId?: string;
}

export interface ShowServiceCreateInput {
  date: string;
  venueId?: string;
  bandId?: string;
  notes?: string | null;
  relistenUrl?: string | null;
}

export class ShowService {
  constructor(
    protected repository: ShowRepository,
    protected logger: Logger,
  ) {}

  async findById(id: string): Promise<Show | null> {
    return this.repository.findById(id);
  }

  async findBySlug(slug: string): Promise<Show | null> {
    return this.repository.findBySlug(slug);
  }

  async findMany(filter: ShowFilter = {}): Promise<Show[]> {
    return this.repository.findMany({
      filters: Object.entries(filter).map(([field, value]) => ({
        field: field as keyof Show,
        operator: "eq",
        value,
      })) as FilterCondition<Show>[],
    });
  }

  /**
   * Search for shows using the pg_search_documents table
   * @param query The search query
   * @param options Optional query options for pagination, sorting, etc.
   * @returns An array of shows matching the search query
   */
  async search(query: string, options?: QueryOptions<Show>): Promise<Show[]> {
    this.logger.info(`Searching for shows with query: ${query}`);
    return (this.repository as ShowRepository).search(query, options);
  }

  async create(data: ShowServiceCreateInput): Promise<Show> {
    return this.repository.create({
      date: data.date,
      venue: data.venueId ? { connect: { id: data.venueId } } : undefined,
      band: data.bandId ? { connect: { id: data.bandId } } : undefined,
      notes: data.notes,
      relistenUrl: data.relistenUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async update(slug: string, data: ShowServiceCreateInput): Promise<Show> {
    return this.repository.update(slug, {
      date: data.date,
      venue: data.venueId ? { connect: { id: data.venueId } } : undefined,
      band: data.bandId ? { connect: { id: data.bandId } } : undefined,
      notes: data.notes,
      relistenUrl: data.relistenUrl,
    });
  }
}
