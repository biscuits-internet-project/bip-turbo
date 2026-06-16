import type { Rating } from "@bip/domain";
import { Prisma } from "@prisma/client";
import { type CacheInvalidationService, yearFromShowSlug } from "../_shared/cache";
import type { DbClient, DbRating } from "../_shared/database/models";
import { setSortKeySql, showOrderBySql } from "../_shared/show-ordering";

export type ShowRatingsSort = "date" | "rating" | "modified";
export type TrackRatingsSort = "date" | "set" | "track" | "song" | "rating" | "modified";
export type SortDirection = "asc" | "desc";

function sqlDirection(direction: SortDirection): Prisma.Sql {
  return direction === "asc" ? Prisma.raw("ASC") : Prisma.raw("DESC");
}

// Tiebreakers always share the primary sort's direction. Asking for date
// DESC means same-day rows further sort set DESC + position DESC, so an
// "encore-first" reading within each show. Asking for date ASC reverses
// it (set/position ASC) so the typical chronological top-down reading.
function showRatingsOrderBy(sort: ShowRatingsSort, direction: SortDirection): Prisma.Sql {
  const dir = sqlDirection(direction);
  const showOrder = showOrderBySql("s", direction === "asc" ? "ASC" : "DESC");
  switch (sort) {
    case "rating":
      return Prisma.sql`r.value ${dir}, ${showOrder}, r.created_at ${dir}`;
    case "modified":
      return Prisma.sql`r.created_at ${dir}, ${showOrder}`;
    default:
      return Prisma.sql`${showOrder}, r.created_at ${dir}`;
  }
}

function trackRatingsOrderBy(sort: TrackRatingsSort, direction: SortDirection): Prisma.Sql {
  const dir = sqlDirection(direction);
  const setKey = setSortKeySql("t");
  const showOrder = showOrderBySql("s", direction === "asc" ? "ASC" : "DESC");
  switch (sort) {
    case "set":
      return Prisma.sql`${setKey} ${dir}, t.position ${dir}, ${showOrder}`;
    case "track":
      return Prisma.sql`t.position ${dir}, ${setKey} ${dir}, ${showOrder}`;
    case "song":
      return Prisma.sql`LOWER(sg.title) ${dir}, ${showOrder}, ${setKey} ${dir}, t.position ${dir}`;
    case "rating":
      return Prisma.sql`r.value ${dir}, ${showOrder}, ${setKey} ${dir}, t.position ${dir}`;
    case "modified":
      return Prisma.sql`r.created_at ${dir}, ${showOrder}`;
    default:
      return Prisma.sql`${showOrder}, ${setKey} ${dir}, t.position ${dir}`;
  }
}

/**
 * Slim show-rating row for list views — only fields the user-profile page
 * actually renders. UUIDs, rateable_id/type, userId, and updatedAt are
 * omitted because heavy users have 1000+ ratings and the unused fields
 * dominate the JSON payload.
 */
export interface RatingWithShow {
  id: string;
  value: number;
  createdAt: Date;
  show: {
    slug: string | null;
    date: string;
    venue: {
      name: string | null;
      city: string | null;
      state: string | null;
      country: string | null;
    } | null;
  };
}

/**
 * Slim track-rating row for list views. Same motivation as RatingWithShow —
 * we additionally drop venue.city/state on the nested show because the
 * track-rating row doesn't display them (the show-rating row does).
 */
export interface RatingWithTrack {
  id: string;
  value: number;
  createdAt: Date;
  track: {
    slug: string | null;
    position: number;
    set: string;
    /**
     * Number of distinct encore labels (E1, E2, ...) in the same show.
     * Surfaced so the cell renderer can collapse "E1" → "E" via
     * `formatSetLabel({ encoresInSet })` when the show has only one
     * encore — the rest of the time, the numeral disambiguates.
     */
    encoresInSet: number;
    show: {
      slug: string | null;
      date: string;
      venue: { name: string | null } | null;
    };
    song: {
      slug: string;
      title: string;
    };
  };
}

/**
 * One cell of a user's rating distribution: how many ratings of a given
 * star value land on shows from a given concert year. The user-profile
 * charts derive every view (all-time histogram, per-year compare,
 * average/median line) from this single grouped shape, so we never ship
 * the thousands of individual rating rows the table query paginates.
 */
export interface RatingYearBucket {
  year: number;
  value: number;
  count: number;
}

/**
 * One bar of a single rateable's rating distribution: how many ratings
 * landed on a given star value. Drives the per-show and per-track
 * histograms, which (unlike the profile charts) need no year axis since a
 * show or track is a single date.
 */
export interface RatingValueBucket {
  value: number;
  count: number;
}

// Mapper functions
function mapRatingToDomainEntity(dbRating: DbRating): Rating {
  return {
    id: dbRating.id,
    rateableId: dbRating.rateableId,
    rateableType: dbRating.rateableType,
    userId: dbRating.userId,
    value: dbRating.value,
    createdAt: dbRating.createdAt,
    updatedAt: dbRating.updatedAt,
  };
}

export class RatingService {
  constructor(
    protected readonly db: DbClient,
    protected readonly cacheInvalidation: CacheInvalidationService,
  ) {}

  private async updateRateableAverageRating(
    rateableId: string,
    rateableType: string,
  ): Promise<{ averageRating: number; ratingsCount: number }> {
    // Calculate the new average rating and count
    const stats = await this.db.rating.aggregate({
      where: { rateableId, rateableType },
      _avg: { value: true },
      _count: { id: true },
    });

    const averageRating = stats._avg.value ?? 0;
    const ratingsCount = stats._count.id;

    // Update the appropriate table based on rateable type
    if (rateableType === "Show") {
      await this.db.show.update({
        where: { id: rateableId },
        data: {
          averageRating,
          ratingsCount,
          updatedAt: new Date(),
        },
      });
    } else if (rateableType === "Track") {
      await this.db.track.update({
        where: { id: rateableId },
        data: {
          averageRating,
          ratingsCount,
          updatedAt: new Date(),
        },
      });
    }

    return { averageRating, ratingsCount };
  }

  /**
   * Bulk-recompute denormalized averageRating/ratingsCount for a set of
   * rateables in one pass. Used by the sync script after importing or
   * deleting many ratings at once — single-row callers (upsert, clearForUser)
   * keep using updateRateableAverageRating. Pairs whose ratings dropped to
   * zero are zeroed out on the rateable row.
   */
  async rebuildAggregatesFor(pairs: Array<{ rateableId: string; rateableType: string }>): Promise<void> {
    if (pairs.length === 0) return;
    const showIds = new Set<string>();
    const trackIds = new Set<string>();
    for (const { rateableId, rateableType } of pairs) {
      if (rateableType === "Show") showIds.add(rateableId);
      else if (rateableType === "Track") trackIds.add(rateableId);
    }

    const now = new Date();

    if (showIds.size > 0) {
      const rows = await this.db.rating.groupBy({
        by: ["rateableId"],
        where: { rateableType: "Show", rateableId: { in: Array.from(showIds) } },
        _avg: { value: true },
        _count: { id: true },
      });
      const statsById = new Map(rows.map((r) => [r.rateableId, r]));
      for (const id of showIds) {
        const stats = statsById.get(id);
        const averageRating = stats?._avg.value ?? 0;
        const ratingsCount = stats?._count.id ?? 0;
        await this.db.show.update({
          where: { id },
          data: { averageRating, ratingsCount, updatedAt: now },
        });
      }
    }

    if (trackIds.size > 0) {
      const rows = await this.db.rating.groupBy({
        by: ["rateableId"],
        where: { rateableType: "Track", rateableId: { in: Array.from(trackIds) } },
        _avg: { value: true },
        _count: { id: true },
      });
      const statsById = new Map(rows.map((r) => [r.rateableId, r]));
      for (const id of trackIds) {
        const stats = statsById.get(id);
        const averageRating = stats?._avg.value ?? 0;
        const ratingsCount = stats?._count.id ?? 0;
        await this.db.track.update({
          where: { id },
          data: { averageRating, ratingsCount, updatedAt: now },
        });
      }
    }
  }

  /**
   * Sync export: page through ratings for the local sync script. PII-free
   * by construction — no user PII is on the Rating model itself. Order by
   * (updatedAt ASC, id ASC) so the cursor is stable. `since` is exclusive
   * on the (updatedAt, id) tuple to prevent re-fetching the boundary row.
   */
  async listForSync(opts: {
    since: Date;
    cursorId?: string;
    cursorUpdatedAt?: Date;
    limit: number;
  }): Promise<
    Array<Pick<Rating, "id" | "userId" | "value" | "rateableType" | "rateableId" | "createdAt" | "updatedAt">>
  > {
    const { since, cursorId, cursorUpdatedAt, limit } = opts;
    const where = cursorUpdatedAt
      ? {
          OR: [
            { updatedAt: { gt: cursorUpdatedAt } },
            { AND: [{ updatedAt: cursorUpdatedAt }, { id: { gt: cursorId ?? "" } }] },
          ],
        }
      : { updatedAt: { gt: since } };
    const rows = await this.db.rating.findMany({
      where,
      orderBy: [{ updatedAt: "asc" }, { id: "asc" }],
      take: limit,
      select: {
        id: true,
        userId: true,
        value: true,
        rateableType: true,
        rateableId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return rows;
  }

  async listAllIdsForSync(): Promise<string[]> {
    const rows = await this.db.rating.findMany({ select: { id: true } });
    return rows.map((r) => r.id);
  }

  async findManyByUserIdAndRateableIds(userId: string, rateableIds: string[], rateableType: string): Promise<Rating[]> {
    const results = await this.db.rating.findMany({
      where: { userId, rateableId: { in: rateableIds }, rateableType },
    });
    return results.map((result) => mapRatingToDomainEntity(result));
  }

  async upsert(data: {
    rateableId: string;
    rateableType: string;
    userId: string;
    value: number;
    showSlug?: string;
  }): Promise<Rating> {
    const result = await this.db.rating.upsert({
      where: {
        userId_rateableId_rateableType: {
          userId: data.userId,
          rateableId: data.rateableId,
          rateableType: data.rateableType,
        },
      },
      update: {
        value: data.value,
        updatedAt: new Date(),
      },
      create: {
        userId: data.userId,
        rateableId: data.rateableId,
        rateableType: data.rateableType,
        value: data.value,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    if (data.rateableType === "Show" && data.showSlug) {
      const year = yearFromShowSlug(data.showSlug);
      await this.cacheInvalidation.invalidateShowComprehensive(undefined, data.showSlug, year !== null ? [year] : []);
    } else if (data.rateableType === "Track" && data.showSlug) {
      // The show's cached setlist payload at CacheKeys.show.data(slug)
      // embeds Track.averageRating/ratingsCount on each track, so a rating
      // mutation has to bust that cache for subsequent reads to surface the
      // new denormalized values.
      await this.cacheInvalidation.invalidateShow(data.showSlug);
    }

    // Update the related show/track average rating and count
    await this.updateRateableAverageRating(data.rateableId, data.rateableType);

    return mapRatingToDomainEntity(result);
  }

  async getAverageForRateable(rateableId: string, rateableType: string): Promise<number | null> {
    const result = await this.db.rating.aggregate({
      where: { rateableId, rateableType },
      _avg: {
        value: true,
      },
    });

    return result._avg.value;
  }

  async getAveragesForRateables(
    rateableIds: string[],
    rateableType: string,
  ): Promise<Record<string, { average: number; count: number }>> {
    if (rateableIds.length === 0) return {};

    const results = await this.db.rating.groupBy({
      by: ["rateableId"],
      where: {
        rateableId: { in: rateableIds },
        rateableType,
      },
      _avg: { value: true },
      _count: { id: true },
    });

    const averages: Record<string, { average: number; count: number }> = {};
    for (const result of results) {
      averages[result.rateableId] = {
        average: result._avg.value ?? 0,
        count: result._count.id,
      };
    }

    return averages;
  }

  async getByRateableIdAndUserId(rateableId: string, rateableType: string, userId: string): Promise<Rating | null> {
    const result = await this.db.rating.findUnique({
      where: {
        userId_rateableId_rateableType: {
          userId,
          rateableId,
          rateableType,
        },
      },
    });

    return result ? mapRatingToDomainEntity(result) : null;
  }

  async findShowRatingsByUserId(
    userId: string,
    options?: { skip?: number; take?: number; sort?: ShowRatingsSort; direction?: SortDirection },
  ): Promise<RatingWithShow[]> {
    const sort = options?.sort ?? "date";
    const direction = options?.direction ?? "desc";
    const take = options?.take ?? 100;
    const skip = options?.skip ?? 0;
    const orderBy = showRatingsOrderBy(sort, direction);

    const rows = await this.db.$queryRaw<
      Array<{
        id: string;
        value: number;
        created_at: Date;
        show_slug: string | null;
        show_date: string;
        venue_name: string | null;
        venue_city: string | null;
        venue_state: string | null;
        venue_country: string | null;
      }>
    >`
      SELECT
        r.id AS id,
        r.value AS value,
        r.created_at AS created_at,
        s.slug AS show_slug,
        s.date AS show_date,
        v.name AS venue_name,
        v.city AS venue_city,
        v.state AS venue_state,
        v.country AS venue_country
      FROM ratings r
      INNER JOIN shows s ON s.id = r.rateable_id
      LEFT JOIN venues v ON v.id = s.venue_id
      WHERE r.user_id = ${userId}::uuid
        AND r.rateable_type = 'Show'
        AND r.value BETWEEN 1 AND 5
      ORDER BY ${orderBy}
      LIMIT ${take} OFFSET ${skip}
    `;

    return rows.map((row) => ({
      id: row.id,
      value: row.value,
      createdAt: row.created_at,
      show: {
        slug: row.show_slug,
        date: row.show_date,
        venue:
          row.venue_name === null
            ? null
            : { name: row.venue_name, city: row.venue_city, state: row.venue_state, country: row.venue_country },
      },
    }));
  }

  async findTrackRatingsByUserId(
    userId: string,
    options?: { skip?: number; take?: number; sort?: TrackRatingsSort; direction?: SortDirection },
  ): Promise<RatingWithTrack[]> {
    const sort = options?.sort ?? "date";
    const direction = options?.direction ?? "desc";
    const take = options?.take ?? 100;
    const skip = options?.skip ?? 0;
    const orderBy = trackRatingsOrderBy(sort, direction);

    const rows = await this.db.$queryRaw<
      Array<{
        id: string;
        value: number;
        created_at: Date;
        track_slug: string | null;
        track_position: number;
        track_set: string;
        encores_in_set: bigint | number;
        show_slug: string | null;
        show_date: string;
        venue_name: string | null;
        song_slug: string;
        song_title: string;
      }>
    >`
      SELECT
        r.id AS id,
        r.value AS value,
        r.created_at AS created_at,
        t.slug AS track_slug,
        t.position AS track_position,
        t.set AS track_set,
        (
          SELECT COUNT(DISTINCT t2.set)
          FROM tracks t2
          WHERE t2.show_id = t.show_id
            AND t2.set ~* '^E[0-9]+$'
        ) AS encores_in_set,
        s.slug AS show_slug,
        s.date AS show_date,
        v.name AS venue_name,
        sg.slug AS song_slug,
        sg.title AS song_title
      FROM ratings r
      INNER JOIN tracks t ON t.id = r.rateable_id
      INNER JOIN shows s ON s.id = t.show_id
      LEFT JOIN venues v ON v.id = s.venue_id
      INNER JOIN songs sg ON sg.id = t.song_id
      WHERE r.user_id = ${userId}::uuid
        AND r.rateable_type = 'Track'
        AND r.value BETWEEN 1 AND 5
      ORDER BY ${orderBy}
      LIMIT ${take} OFFSET ${skip}
    `;

    return rows.map((row) => ({
      id: row.id,
      value: row.value,
      createdAt: row.created_at,
      track: {
        slug: row.track_slug,
        position: row.track_position,
        set: row.track_set,
        encoresInSet: Number(row.encores_in_set),
        show: {
          slug: row.show_slug,
          date: row.show_date,
          venue: row.venue_name === null ? null : { name: row.venue_name },
        },
        song: { slug: row.song_slug, title: row.song_title },
      },
    }));
  }

  /**
   * Distribution of a user's show ratings by concert year and star value,
   * for the profile charts. Unlike the table queries this includes 0.5
   * ratings (value >= 0.5, not BETWEEN 1 AND 5) so the histogram reflects
   * every rating, and it aggregates server-side: ~250 bucket rows instead
   * of the user's full (often thousands) rating set.
   */
  async getShowRatingDistribution(userId: string): Promise<RatingYearBucket[]> {
    const rows = await this.db.$queryRaw<Array<{ year: number; value: number; count: number }>>`
      SELECT LEFT(s.date, 4)::int AS year, r.value AS value, COUNT(*)::int AS count
      FROM ratings r
      INNER JOIN shows s ON s.id = r.rateable_id
      WHERE r.user_id = ${userId}::uuid
        AND r.rateable_type = 'Show'
        AND r.value >= 0.5
      GROUP BY LEFT(s.date, 4)::int, r.value
    `;
    return rows.map((row) => ({ year: row.year, value: row.value, count: Number(row.count) }));
  }

  /**
   * Distribution of a user's track (song-version) ratings by concert year
   * and star value. Same shape and motivation as getShowRatingDistribution;
   * the concert year comes from the track's show.
   */
  async getTrackRatingDistribution(userId: string): Promise<RatingYearBucket[]> {
    const rows = await this.db.$queryRaw<Array<{ year: number; value: number; count: number }>>`
      SELECT LEFT(s.date, 4)::int AS year, r.value AS value, COUNT(*)::int AS count
      FROM ratings r
      INNER JOIN tracks t ON t.id = r.rateable_id
      INNER JOIN shows s ON s.id = t.show_id
      WHERE r.user_id = ${userId}::uuid
        AND r.rateable_type = 'Track'
        AND r.value >= 0.5
      GROUP BY LEFT(s.date, 4)::int, r.value
    `;
    return rows.map((row) => ({ year: row.year, value: row.value, count: Number(row.count) }));
  }

  /**
   * Distribution of a single rateable's ratings by star value, for the
   * per-show / per-track histograms. Groups by value over the
   * (rateable_type, rateable_id) index and includes 0.5 ratings so the
   * chart reflects every vote.
   */
  async getRatingDistribution(rateableId: string, rateableType: string): Promise<RatingValueBucket[]> {
    const rows = await this.db.rating.groupBy({
      by: ["value"],
      where: { rateableId, rateableType, value: { gte: 0.5 } },
      _count: { id: true },
    });
    return rows.map((row) => ({ value: row.value, count: row._count.id }));
  }

  async deleteByRateableId(rateableId: string, rateableType: string): Promise<void> {
    await this.db.rating.deleteMany({
      where: {
        rateableId,
        rateableType,
      },
    });
  }

  /**
   * Removes a single user's rating for a rateable and recomputes the
   * denormalized averageRating/ratingsCount on the corresponding Show or
   * Track row. Returns the recomputed values so callers can update their
   * caches in one round-trip.
   */
  async clearForUser(data: {
    rateableId: string;
    rateableType: string;
    userId: string;
    showSlug?: string;
  }): Promise<{ averageRating: number; ratingsCount: number }> {
    await this.db.rating.deleteMany({
      where: {
        userId: data.userId,
        rateableId: data.rateableId,
        rateableType: data.rateableType,
      },
    });

    const stats = await this.updateRateableAverageRating(data.rateableId, data.rateableType);

    if (data.rateableType === "Show" && data.showSlug) {
      const year = yearFromShowSlug(data.showSlug);
      await this.cacheInvalidation.invalidateShowComprehensive(undefined, data.showSlug, year !== null ? [year] : []);
    } else if (data.rateableType === "Track" && data.showSlug) {
      // Same reason as the upsert path: Track.averageRating/ratingsCount
      // live inside the cached setlist payload, so a recompute has to bust
      // the show cache.
      await this.cacheInvalidation.invalidateShow(data.showSlug);
    }

    return stats;
  }
}
