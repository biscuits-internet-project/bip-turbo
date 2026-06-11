import type { Logger, Venue } from "@bip/domain";
import type { DbClient, DbVenue } from "../_shared/database/models";
import { buildOrderByClause, buildWhereClause } from "../_shared/database/query-utils";
import type { QueryOptions } from "../_shared/database/types";
import { showOrderBySql } from "../_shared/show-ordering";
import { slugify } from "../_shared/utils/slugify";
import { VALID_CANADIAN_PROVINCES, VALID_COUNTRIES, VALID_US_STATES } from "./venue-constants";

/**
 * Per-venue show stats for the /venues table — first/last show (slug + date
 * for linking) and the distinct years played. Computed in one grouped query
 * rather than denormalized, since the index renders them for every venue.
 */
export interface VenueShowAggregate {
  venueId: string;
  showCount: number;
  years: number[];
  firstSlug: string;
  firstDate: string;
  lastSlug: string;
  lastDate: string;
}

// Mapper functions
function mapVenueToDomainEntity(dbVenue: DbVenue): Venue {
  const { slug, createdAt, updatedAt, name, city, country, ...rest } = dbVenue;

  return {
    ...rest,
    slug: slug || "",
    createdAt: new Date(createdAt),
    updatedAt: new Date(updatedAt),
    name: name || "",
    city: city || "",
    country: country || "",
  };
}

export class VenueService {
  constructor(
    protected readonly db: DbClient,
    protected readonly logger: Logger,
  ) {}

  private async generateVenueSlug(
    name: string,
    city?: string | null,
    state?: string | null,
    excludeId?: string,
  ): Promise<string> {
    let baseSlug = slugify(name);

    // Check if slug already exists (excluding current venue if updating)
    const existing = await this.db.venue.findFirst({
      where: {
        slug: baseSlug,
        ...(excludeId && { id: { not: excludeId } }),
      },
    });

    // If duplicate, add city and state
    if (existing) {
      const parts = [name, city, state].filter(Boolean).join("-");
      baseSlug = slugify(parts);
    }

    return baseSlug;
  }

  async findById(id: string): Promise<Venue | null> {
    const result = await this.db.venue.findUnique({
      where: { id },
    });
    return result ? mapVenueToDomainEntity(result) : null;
  }

  async findBySlug(slug: string): Promise<Venue | null> {
    const result = await this.db.venue.findFirst({
      where: { slug },
    });
    return result ? mapVenueToDomainEntity(result) : null;
  }

  // Alias for findBySlug to match the naming in the routes
  async getBySlug(slug: string) {
    return this.findBySlug(slug);
  }

  async findMany(options?: QueryOptions<Venue>): Promise<Venue[]> {
    const where = options?.filters ? buildWhereClause(options.filters) : {};
    const orderBy = options?.sort ? buildOrderByClause(options.sort) : [{ timesPlayed: "desc" }];
    const skip =
      options?.pagination?.page && options?.pagination?.limit
        ? (options.pagination.page - 1) * options.pagination.limit
        : undefined;
    const take = options?.pagination?.limit;

    const results = await this.db.venue.findMany({
      where,
      orderBy,
      skip,
      take,
    });

    return results.map((result: DbVenue) => mapVenueToDomainEntity(result));
  }

  /**
   * Show counts and first/last/years stats for every venue with shows, in
   * one grouped pass. Counts ALL shows at the venue (not the stats-only
   * subset) so the totals match the venue detail page's `setlists.length`.
   * First/last shows order by the canonical show tiebreak so same-day shows
   * resolve deterministically.
   */
  async getShowAggregates(): Promise<VenueShowAggregate[]> {
    const orderAsc = showOrderBySql("shows", "ASC");
    const orderDesc = showOrderBySql("shows", "DESC");
    const rows = await this.db.$queryRaw<
      Array<{
        venue_id: string;
        show_count: number;
        years: number[];
        first_slug: string;
        first_date: string;
        last_slug: string;
        last_date: string;
      }>
    >`
      SELECT
        shows.venue_id,
        COUNT(*)::int AS show_count,
        array_agg(DISTINCT date_part('year', shows.date::date)::int
                  ORDER BY date_part('year', shows.date::date)::int DESC) AS years,
        (array_agg(shows.slug ORDER BY ${orderAsc}))[1]  AS first_slug,
        (array_agg(shows.date ORDER BY ${orderAsc}))[1]  AS first_date,
        (array_agg(shows.slug ORDER BY ${orderDesc}))[1] AS last_slug,
        (array_agg(shows.date ORDER BY ${orderDesc}))[1] AS last_date
      FROM shows
      WHERE shows.venue_id IS NOT NULL AND shows.date IS NOT NULL
      GROUP BY shows.venue_id
    `;

    return rows.map((row) => ({
      venueId: row.venue_id,
      showCount: row.show_count,
      years: row.years,
      firstSlug: row.first_slug,
      firstDate: row.first_date,
      lastSlug: row.last_slug,
      lastDate: row.last_date,
    }));
  }

  async create(data: Omit<Venue, "id" | "slug" | "createdAt" | "updatedAt" | "timesPlayed">): Promise<Venue> {
    // Validate required fields
    if (!data.name?.trim()) {
      throw new Error("Venue name is required");
    }
    if (!data.city?.trim()) {
      throw new Error("City is required");
    }
    if (data.city?.includes(",")) {
      throw new Error("City name should not contain commas");
    }
    if (!data.country?.trim()) {
      throw new Error("Country is required");
    }

    // Validate country is in allowed list
    const trimmedCountry = data.country.trim();
    if (!VALID_COUNTRIES.has(trimmedCountry)) {
      throw new Error("Invalid country selection");
    }

    // Validate state for US and Canada
    const trimmedState = data.state?.trim();
    if (trimmedCountry === "United States" || trimmedCountry === "Canada") {
      if (!trimmedState) {
        throw new Error("State/Province is required for United States and Canada");
      }

      if (trimmedCountry === "United States" && !VALID_US_STATES.has(trimmedState)) {
        throw new Error("Invalid US state code");
      }

      if (trimmedCountry === "Canada" && !VALID_CANADIAN_PROVINCES.has(trimmedState)) {
        throw new Error("Invalid Canadian province code");
      }
    }

    const cleanData = {
      ...data,
      name: data.name.trim(),
      city: data.city.trim(),
      state: trimmedState || null,
      country: trimmedCountry,
    };

    const slug = await this.generateVenueSlug(cleanData.name, cleanData.city, cleanData.state);
    const result = await this.db.venue.create({
      data: {
        ...cleanData,
        slug,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return mapVenueToDomainEntity(result);
  }

  async update(
    slug: string,
    data: Partial<Omit<Venue, "id" | "slug" | "createdAt" | "updatedAt" | "timesPlayed">>,
  ): Promise<Venue> {
    // Resolve by slug — that's what the admin edit route passes in (the URL param).
    const current = await this.db.venue.findFirst({
      where: { slug },
      select: { id: true, name: true, city: true, state: true, country: true },
    });

    if (!current) {
      throw new Error(`Venue with slug "${slug}" not found`);
    }

    // Validate required fields (using current values as fallback)
    if (data.name !== undefined && !data.name?.trim()) {
      throw new Error("Venue name is required");
    }
    if (data.city !== undefined && !data.city?.trim()) {
      throw new Error("City is required");
    }
    if (data.city?.includes(",")) {
      throw new Error("City name should not contain commas");
    }
    if (data.country !== undefined && !data.country?.trim()) {
      throw new Error("Country is required");
    }

    // Validate country if being updated
    const finalCountry = data.country?.trim() || current.country || "";
    if (data.country !== undefined && !VALID_COUNTRIES.has(finalCountry)) {
      throw new Error("Invalid country selection");
    }

    // Determine final state value
    let finalState: string | null;
    if (data.state !== undefined) {
      // User is explicitly setting the state field
      finalState = data.state?.trim() || null;
    } else {
      // User is not changing the state field, use current value
      finalState = current.state;
    }

    // Validate state for US and Canada
    if (finalCountry === "United States" || finalCountry === "Canada") {
      if (!finalState) {
        throw new Error("State/Province is required for United States and Canada");
      }

      if (finalCountry === "United States" && !VALID_US_STATES.has(finalState)) {
        throw new Error("Invalid US state code");
      }

      if (finalCountry === "Canada" && !VALID_CANADIAN_PROVINCES.has(finalState)) {
        throw new Error("Invalid Canadian province code");
      }
    }

    // Trim the update data
    const cleanData: Partial<Venue> = {};
    if (data.name !== undefined) {
      cleanData.name = data.name.trim();
    }
    if (data.city !== undefined) {
      cleanData.city = data.city.trim();
    }
    if (data.state !== undefined) {
      cleanData.state = data.state?.trim() || null;
    }
    if (data.country !== undefined) {
      cleanData.country = data.country.trim();
    }

    const updateData: Partial<DbVenue> & { updatedAt: Date; slug?: string } = {
      ...cleanData,
      updatedAt: new Date(),
    };

    // Regenerate slug if name, city, or state changes
    if (data.name || data.city || data.state !== undefined) {
      const name = cleanData.name || current.name || "";
      const city = cleanData.city || current.city;
      const state = cleanData.state !== undefined ? cleanData.state : current.state;
      updateData.slug = await this.generateVenueSlug(name, city, state, current.id);
    }

    const result = await this.db.venue.update({
      where: { id: current.id },
      data: updateData,
    });
    return mapVenueToDomainEntity(result);
  }

  /** Number of shows that reference this venue. */
  async countShows(id: string): Promise<number> {
    return this.db.show.count({ where: { venueId: id } });
  }

  /**
   * Delete a venue. Refuses if any show still references it — that's the only
   * FK to venues, and an in-use venue isn't a stale row. The thrown message is
   * surfaced to the admin who attempted the delete.
   */
  async delete(id: string): Promise<boolean> {
    const showCount = await this.countShows(id);
    if (showCount > 0) {
      throw new Error(`Cannot delete venue with ${showCount} show(s)`);
    }

    try {
      await this.db.venue.delete({
        where: { id },
      });
      return true;
    } catch (_error) {
      return false;
    }
  }
}
