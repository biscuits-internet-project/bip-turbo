import type { Logger, Show, Venue } from "@bip/domain";
import { Prisma } from "@prisma/client";
import { type CacheInvalidationService, yearFromShowDate } from "../_shared/cache";
import type { DbClient, DbShow, DbVenue } from "../_shared/database/models";
import { buildIncludeClause, buildWhereClause } from "../_shared/database/query-utils";
import type { FilterCondition, QueryOptions } from "../_shared/database/types";
import {
  DAY_ORDER_NULL_SENTINEL,
  NON_STUB_SHOWS_WHERE,
  resolveShowOrderBy,
  SHOW_ORDER_ASC,
  SHOW_ORDER_DESC,
  showOrderBySql,
  showOrderTuple,
} from "../_shared/show-ordering";
import { slugify } from "../_shared/utils/slugify";
import { MARLON_LINEUP_SLUGS } from "../musicians/musician-constants";
import type { StatsService } from "../stats/stats-service";

export interface ShowFilter {
  year?: number;
  songId?: string;
}

export interface ShowNavItem {
  slug: string;
  date: string;
  venueName: string | null;
  venueCity: string | null;
}

export interface ShowServiceCreateInput {
  date: string;
  venueId?: string;
  bandId?: string;
  notes?: string | null;
  relistenUrl?: string | null;
  countForStats?: boolean;
  /**
   * Full-set semantics: the show ends up tagged with exactly these rock
   * opera ids. Caller passes the complete list (including unchanged ones);
   * update() diffs against current rows. Omit to leave tags untouched;
   * pass `[]` to clear all tags.
   */
  rockOperaIds?: string[];
}

export type ShowCreateInput = Prisma.ShowCreateInput;

export interface LineupEntry {
  musicianId: string;
  /** Instruments this musician played in the show's lineup (e.g. guitar + vocals). */
  instrumentIds?: string[];
}

// Mapper functions
function mapShowToDomainEntity(show: DbShow): Show {
  const { venueId, bandId, ...rest } = show;
  return {
    ...rest,
    date: String(show.date),
    createdAt: new Date(show.createdAt),
    updatedAt: new Date(show.updatedAt),
    slug: show.slug ?? "",
    venueId: venueId ?? "",
    bandId: bandId ?? "",
  };
}

function mapVenueToDomainEntity(dbVenue: DbVenue): Venue {
  const { createdAt, updatedAt, name, slug, city, country, ...rest } = dbVenue;
  return {
    ...rest,
    name: name ?? "",
    slug: slug ?? "",
    city: city ?? "",
    country: country ?? "",
    createdAt: new Date(createdAt),
    updatedAt: new Date(updatedAt),
  };
}

export class ShowService {
  constructor(
    protected readonly db: DbClient,
    protected readonly logger: Logger,
    protected readonly cacheInvalidation: CacheInvalidationService,
    /**
     * Triggered after every show mutation (create/update/delete) to keep
     * Track.gap and Song.* aggregates consistent — the universe of
     * count_for_stats=true shows changes whenever a show is mutated, which
     * ripples to chains spanning the affected date.
     */
    protected readonly stats: StatsService,
  ) {}

  private async generateShowSlug(date: string, venueId?: string): Promise<string> {
    let slug = slugify(String(date));

    if (venueId) {
      const venue = await this.db.venue.findUnique({
        where: { id: venueId },
        select: { name: true, city: true, state: true },
      });

      if (venue) {
        const venueParts = [String(date), venue.name, venue.city, venue.state].filter(Boolean).join("-");
        slug = slugify(venueParts);
      }
    }

    return slug;
  }

  /**
   * Return `{ date, hasPhotos, hasYoutube }` for every show. Feeds per-year
   * count bucketing on list pages: the loader joins this against the
   * date-keyed nugs/archive catalogs to produce filter-aware counts without
   * resolving external sources per show.
   */
  async getShowDatesWithFlags(): Promise<Array<{ date: string; hasPhotos: boolean; hasYoutube: boolean }>> {
    const results = await this.db.show.findMany({
      where: NON_STUB_SHOWS_WHERE,
      select: {
        date: true,
        showPhotosCount: true,
        showYoutubesCount: true,
      },
    });

    return results.map((row: { date: string | Date; showPhotosCount: number; showYoutubesCount: number }) => ({
      date: String(row.date),
      hasPhotos: row.showPhotosCount > 0,
      hasYoutube: row.showYoutubesCount > 0,
    }));
  }

  async findById(id: string): Promise<Show | null> {
    const result = await this.db.show.findUnique({ where: { id } });
    return result ? mapShowToDomainEntity(result) : null;
  }

  async findBySlug(slug: string): Promise<Show | null> {
    const result = await this.db.show.findUnique({ where: { slug } });
    return result ? mapShowToDomainEntity(result) : null;
  }

  async findMany(filterOrOptions: ShowFilter | QueryOptions<Show> = {}): Promise<Show[]> {
    let options: QueryOptions<Show>;

    // Check if it's QueryOptions (has filters, sort, pagination, or includes)
    if (
      "filters" in filterOrOptions ||
      "sort" in filterOrOptions ||
      "pagination" in filterOrOptions ||
      "includes" in filterOrOptions
    ) {
      options = filterOrOptions as QueryOptions<Show>;
    } else {
      // Legacy ShowFilter support
      const filter = filterOrOptions as ShowFilter;
      options = {
        filters: Object.entries(filter).map(([field, value]) => ({
          field: field as keyof Show,
          operator: "eq",
          value,
        })) as FilterCondition<Show>[],
      };
    }

    this.logger?.info("findMany options", { options });
    const include = options?.includes ? buildIncludeClause(options.includes) : {};
    const where = options?.filters ? buildWhereClause(options.filters) : {};
    const orderBy = resolveShowOrderBy(options?.sort, SHOW_ORDER_DESC);
    const skip =
      options?.pagination?.page && options?.pagination?.limit
        ? (options.pagination.page - 1) * options.pagination.limit
        : undefined;
    const take = options?.pagination?.limit;

    const results = await this.db.show.findMany({
      where,
      orderBy,
      skip,
      take,
      include,
    });

    return results.map((result: DbShow) => mapShowToDomainEntity(result));
  }

  async findManyByDates(dates: string[]): Promise<Show[]> {
    // Ensure dates are strings and properly formatted
    const stringDates = dates.map((date) => String(date));

    const results = await this.db.show.findMany({
      where: {
        date: {
          in: stringDates,
        },
      },
      include: {
        venue: true,
      },
      orderBy: SHOW_ORDER_ASC,
    });

    return results.map((result) => {
      const show = mapShowToDomainEntity(result);
      if (result.venue) {
        show.venue = mapVenueToDomainEntity(result.venue);
      }
      return show;
    });
  }

  async findByDate(date: string): Promise<Show[]> {
    return this.findManyByDates([date]);
  }

  async findAdjacentShows(
    date: string,
    slug: string,
  ): Promise<{ previous: ShowNavItem | null; next: ShowNavItem | null }> {
    // Adjacency uses (date, dayOrder NULLS LAST, id) so prev/next on same-date
    // pairs respects the user-set ordering; falls back to id for unset pairs.
    // Resolve the current row's dayOrder/id so the comparison is exact.
    const current = await this.db.show.findUnique({
      where: { slug },
      select: { id: true, dayOrder: true },
    });
    const currentDayOrder = current?.dayOrder ?? DAY_ORDER_NULL_SENTINEL;
    const currentId = current?.id ?? "00000000-0000-0000-0000-000000000000";
    const hereTuple = Prisma.sql`(${date}, ${currentDayOrder}, ${currentId}::text)`;

    const [previousResults, nextResults] = await Promise.all([
      this.db.$queryRaw<Array<{ slug: string; date: string; venue_name: string | null; venue_city: string | null }>>`
        SELECT s.slug, s.date, v.name as venue_name, v.city as venue_city
        FROM shows s
        LEFT JOIN venues v ON s.venue_id = v.id
        WHERE s.slug IS NOT NULL
          AND ${showOrderTuple("s")} < ${hereTuple}
        ORDER BY ${showOrderBySql("s", "DESC")}
        LIMIT 1
      `,
      this.db.$queryRaw<Array<{ slug: string; date: string; venue_name: string | null; venue_city: string | null }>>`
        SELECT s.slug, s.date, v.name as venue_name, v.city as venue_city
        FROM shows s
        LEFT JOIN venues v ON s.venue_id = v.id
        WHERE s.slug IS NOT NULL
          AND ${showOrderTuple("s")} > ${hereTuple}
        ORDER BY ${showOrderBySql("s", "ASC")}
        LIMIT 1
      `,
    ]);

    const previous = previousResults[0]
      ? {
          slug: previousResults[0].slug,
          date: previousResults[0].date,
          venueName: previousResults[0].venue_name,
          venueCity: previousResults[0].venue_city,
        }
      : null;
    const next = nextResults[0]
      ? {
          slug: nextResults[0].slug,
          date: nextResults[0].date,
          venueName: nextResults[0].venue_name,
          venueCity: nextResults[0].venue_city,
        }
      : null;

    return { previous, next };
  }

  /**
   * Search for shows using the pg_search_documents table
   * @param query The search query
   * @param options Optional query options for pagination, sorting, etc.
   * @returns An array of shows matching the search query
   */
  async search(query: string, options?: QueryOptions<Show>): Promise<Show[]> {
    if (!query.trim()) {
      return this.findMany(options);
    }

    this.logger?.info("Searching for", { query });

    // First, let's see what the tokenization looks like
    const tokenDebug = await this.db.$queryRaw<Array<{ tokens: string }>>`
      SELECT to_tsvector('english', ${query})::text as tokens;
    `;
    this.logger?.info("Query tokens", { tokens: tokenDebug[0]?.tokens });

    // Let's also check what's in the pg_search_documents table
    const sampleContent = await this.db.$queryRaw<Array<{ content: string }>>`
      SELECT content
      FROM pg_search_documents
      WHERE content ILIKE ${`%${query}%`}
      LIMIT 1;
    `;
    this.logger?.info("Matching content sample", { content: sampleContent[0]?.content });

    const searchResults = await this.db.$queryRaw<Array<{ searchable_id: string; rank: number }>>`
      SELECT
        searchable_id,
        ts_rank_cd(to_tsvector('english', content)::tsvector, websearch_to_tsquery('english', ${query})) as rank
      FROM pg_search_documents
      WHERE
        searchable_type = 'Show'
        AND to_tsvector('english', content)::tsvector @@ websearch_to_tsquery('english', ${query})
      ORDER BY rank DESC
    `;

    this.logger?.info("Search results count", { count: searchResults.length });

    // Get the show IDs from the search results
    const showIds = searchResults.map((result) => result.searchable_id);

    // Fetch shows using Prisma's findMany
    const shows = await this.db.show.findMany({
      where: {
        id: {
          in: showIds,
        },
      },
      orderBy: resolveShowOrderBy(options?.sort, SHOW_ORDER_DESC),
      skip:
        options?.pagination?.page && options?.pagination?.limit
          ? (options.pagination.page - 1) * options.pagination.limit
          : undefined,
      take: options?.pagination?.limit,
    });

    return shows.map((show) => mapShowToDomainEntity(show));
  }

  async create(data: ShowServiceCreateInput): Promise<Show> {
    const createInput: ShowCreateInput = {
      date: data.date,
      venue: data.venueId ? { connect: { id: data.venueId } } : undefined,
      band: data.bandId ? { connect: { id: data.bandId } } : undefined,
      notes: data.notes,
      relistenUrl: data.relistenUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const venueId = createInput.venue?.connect?.id;
    const slug = await this.generateShowSlug(String(createInput.date), venueId);

    const result = await this.db.show.create({
      data: {
        date: createInput.date,
        slug,
        venue: createInput.venue,
        band: createInput.band,
        notes: createInput.notes,
        relistenUrl: createInput.relistenUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const show = mapShowToDomainEntity(result);

    // New shows default to the current band makeup. Resolve the seeded
    // musicians lazily so an unseeded environment degrades to an empty lineup
    // (logged) rather than failing show creation.
    await this.applyDefaultLineup(result.id);

    // Invalidate show listing caches (new show affects listings)
    await this.cacheInvalidation.invalidateShowListings([yearFromShowDate(createInput.date)]);

    // Adding a count_for_stats=true show changes the "shows between"
    // denominator for songs whose chains span this date — rebuild gaps
    // for tracks at or after this show. A brand-new show has no tracks
    // yet (tracks come later via TrackService) so this is typically a
    // no-op; the cost only kicks in if the new show is in the past and
    // tracks already exist there (rare).
    await this.stats.rebuildGapsAndSongStatsSince(String(data.date));

    return show;
  }

  /**
   * Resolve the Marlon-era default lineup from its seed slugs and write the
   * ShowMusician rows. Never throws: if the seeds are missing (fresh DB, or a
   * sync that ran before the seed), it logs a warning and leaves the lineup
   * empty so show creation still succeeds. Stats are untouched — lineup data
   * does not feed gap/play math.
   */
  private async applyDefaultLineup(showId: string): Promise<void> {
    const musicians = await this.db.musician.findMany({
      where: { slug: { in: [...MARLON_LINEUP_SLUGS] } },
      select: { id: true, slug: true, defaultInstrumentId: true },
    });

    if (musicians.length < MARLON_LINEUP_SLUGS.length) {
      this.logger.warn(
        `Default lineup seeds missing (found ${musicians.length}/${MARLON_LINEUP_SLUGS.length}); show ${showId} created with an empty lineup`,
      );
    }

    if (musicians.length === 0) return;

    const entries: LineupEntry[] = musicians.map((musician) => ({
      musicianId: musician.id,
      instrumentIds: musician.defaultInstrumentId ? [musician.defaultInstrumentId] : [],
    }));

    // No cache invalidation here: the caller (create) is about to run its own
    // listing invalidation, and a just-created show has nothing comprehensively
    // cached yet.
    await this.replaceLineupRows(showId, entries);
  }

  /** Diff-replace the ShowMusician rows for a show in a single transaction. */
  private async replaceLineupRows(showId: string, entries: LineupEntry[]): Promise<void> {
    await this.db.$transaction([
      this.db.showMusician.deleteMany({ where: { showId } }),
      ...entries.map((entry) =>
        this.db.showMusician.create({
          data: {
            showId,
            musicianId: entry.musicianId,
            createdAt: new Date(),
            updatedAt: new Date(),
            instruments: {
              create: (entry.instrumentIds ?? []).map((instrumentId) => ({
                instrumentId,
                createdAt: new Date(),
                updatedAt: new Date(),
              })),
            },
          },
        }),
      ),
    ]);
  }

  /**
   * Full-set replace of a show's lineup, then a comprehensive cache bust.
   * Used by the admin lineup editor where the show already exists and its
   * pages may be cached.
   */
  async setLineup(showId: string, entries: LineupEntry[]): Promise<void> {
    await this.replaceLineupRows(showId, entries);

    const show = await this.db.show.findUnique({ where: { id: showId }, select: { slug: true, date: true } });
    if (show?.slug) {
      await this.cacheInvalidation.invalidateShowComprehensive(showId, show.slug, [
        yearFromShowDate(String(show.date)),
      ]);
    }
  }

  async update(slug: string, data: ShowServiceCreateInput): Promise<Show> {
    let newSlug: string | undefined;

    // Get current show data for cache invalidation
    const currentShow = await this.db.show.findUnique({
      where: { slug },
      select: { id: true, date: true, venueId: true, countForStats: true },
    });

    if (!currentShow) {
      throw new Error(`Show with slug ${slug} not found`);
    }

    // If date or venue is being updated, regenerate the slug
    if (data.date || data.venueId) {
      const date = data.date || currentShow.date;
      const venueId = data.venueId || currentShow.venueId || undefined;
      newSlug = await this.generateShowSlug(String(date), venueId);
    }

    const updateInput: Partial<ShowCreateInput> = {
      date: data.date,
      venue: data.venueId ? { connect: { id: data.venueId } } : undefined,
      band: data.bandId ? { connect: { id: data.bandId } } : undefined,
      notes: data.notes,
      relistenUrl: data.relistenUrl,
      countForStats: data.countForStats,
    };

    const result = await this.db.show.update({
      where: { slug },
      data: {
        ...updateInput,
        ...(newSlug && { slug: newSlug }),
        updatedAt: new Date(),
      },
    });

    const show = mapShowToDomainEntity(result);

    // Year-tag purges cover both the old date (so its listing evicts) and
    // the new date (so its listing picks the row up). `||` not `??` so an
    // empty-string date falls through to currentShow.date, matching the
    // slug-regen guard above.
    const affectedYears = Array.from(
      new Set([yearFromShowDate(currentShow.date), yearFromShowDate(data.date || currentShow.date)]),
    );

    if (newSlug && newSlug !== slug) {
      // Slug changed - invalidate both old and new
      await Promise.all([
        this.cacheInvalidation.invalidateShow(slug), // old slug
        this.cacheInvalidation.invalidateShow(newSlug), // new slug
        this.cacheInvalidation.invalidateShowListings(affectedYears),
      ]);
    } else {
      await this.cacheInvalidation.invalidateShowComprehensive(currentShow.id, slug, affectedYears);
    }

    if (data.rockOperaIds !== undefined) {
      await this.syncRockOperaAssignments(currentShow.id, data.rockOperaIds);
    }

    // A date move or a count_for_stats flip both change the gap denominator (the
    // universe of stats-eligible shows whose dates "shows between" counts). Rebuild
    // from the earliest affected date so chains spanning either side are recomputed.
    // Notes / relistenUrl / venue edits don't affect gap, so they skip the rebuild.
    const dateChanged = !!data.date && String(data.date) !== currentShow.date;
    const statsFlagChanged = data.countForStats != null && data.countForStats !== currentShow.countForStats;
    if (dateChanged || statsFlagChanged) {
      const sinceDate = dateChanged && String(data.date) < currentShow.date ? String(data.date) : currentShow.date;
      await this.stats.rebuildGapsAndSongStatsSince(sinceDate);
    }

    return show;
  }

  /**
   * Apply full-set rock opera assignments to a show. Reads current tags,
   * computes the diff against `nextRockOperaIds`, and runs delete + insert
   * in one transaction. Targets the resource-page cache for every opera
   * whose performance list changed; neighbor invalidation (show.data
   * entries whose annotations shifted) is handled by the broader
   * invalidateShowListings called from the outer update path.
   */
  private async syncRockOperaAssignments(showId: string, nextRockOperaIds: string[]): Promise<void> {
    const current = await this.db.rockOperaPerformance.findMany({
      where: { showId },
      include: { rockOpera: { select: { id: true, slug: true } } },
    });
    const currentIds = new Set(current.map((row) => row.rockOperaId));
    const nextIds = new Set(nextRockOperaIds);

    const toRemove = current.filter((row) => !nextIds.has(row.rockOperaId));
    const toAdd = nextRockOperaIds.filter((id) => !currentIds.has(id));

    if (toRemove.length === 0 && toAdd.length === 0) return;

    await this.db.$transaction(async (tx) => {
      if (toRemove.length > 0) {
        await tx.rockOperaPerformance.deleteMany({
          where: { showId, rockOperaId: { in: toRemove.map((row) => row.rockOperaId) } },
        });
      }
      if (toAdd.length > 0) {
        await tx.rockOperaPerformance.createMany({
          data: toAdd.map((rockOperaId) => ({ showId, rockOperaId })),
        });
      }
    });

    // Resolve added-id slugs (we already have removed-id slugs from `current`)
    // so cache invalidation can target the affected resource pages.
    const addedSlugs =
      toAdd.length === 0
        ? []
        : (await this.db.rockOpera.findMany({ where: { id: { in: toAdd } }, select: { slug: true } })).map(
            (r) => r.slug,
          );
    const removedSlugs = toRemove.map((row) => row.rockOpera.slug);
    const affectedSlugs = Array.from(new Set([...removedSlugs, ...addedSlugs]));

    await this.cacheInvalidation.invalidateRockOperaAssignment(affectedSlugs);
  }

  /**
   * Rewrites `dayOrder` to 1..N for the supplied id sequence inside a single
   * transaction. Used by the admin reorder widget when multiple shows share a
   * date and need an explicit tiebreaker for listings/adjacency.
   *
   * Fails closed if any id is unknown or attached to a different date — that
   * would silently move a show off its real date in listing order.
   */
  async reorderByDate(date: string, orderedIds: string[]): Promise<void> {
    if (orderedIds.length === 0) return;

    const existing = await this.db.show.findMany({
      where: { id: { in: orderedIds } },
      select: { id: true, date: true },
    });

    if (existing.length !== orderedIds.length) {
      const found = new Set(existing.map((row) => row.id));
      const missing = orderedIds.filter((id) => !found.has(id));
      throw new Error(`Shows not found: ${missing.join(", ")}`);
    }
    for (const row of existing) {
      if (String(row.date) !== date) {
        throw new Error(`Show ${row.id} is not on date ${date}`);
      }
    }

    const now = new Date();
    await this.db.$transaction(
      orderedIds.map((id, index) =>
        this.db.show.update({
          where: { id },
          data: { dayOrder: index + 1, updatedAt: now },
        }),
      ),
    );

    await this.cacheInvalidation.invalidateShowListings([yearFromShowDate(date)]);

    // day_order is a same-date tiebreaker in the gap walk, so reordering can flip
    // which of two same-day performances of a song comes first — rebuild from this
    // date forward to keep Track.gap / previousPerformanceShowId consistent.
    await this.stats.rebuildGapsAndSongStatsSince(date);
  }

  async delete(id: string): Promise<boolean> {
    try {
      // Capture slug + date before deletion — slug for cache invalidation,
      // date for the stats rebuild scope.
      const show = await this.db.show.findUnique({
        where: { id },
        select: { slug: true, date: true },
      });

      await this.db.show.delete({
        where: { id },
      });

      if (show?.slug) {
        const years = show.date ? [yearFromShowDate(show.date)] : [];
        await this.cacheInvalidation.invalidateShowComprehensive(id, show.slug, years);
      }

      // Removing a stats-show shrinks the "shows between" denominator for
      // chains that span its date. Rebuild from the deleted show's date
      // forward — earlier chains are unaffected.
      if (show?.date) {
        await this.stats.rebuildGapsAndSongStatsSince(show.date);
      }

      return true;
    } catch (_error) {
      return false;
    }
  }
}
