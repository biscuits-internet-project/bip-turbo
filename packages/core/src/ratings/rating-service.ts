import type { Rating } from "@bip/domain";
import { type CacheInvalidationService, yearFromShowSlug } from "../_shared/cache";
import type { DbClient, DbRating } from "../_shared/database/models";

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

  async findShowRatingsByUserId(userId: string, options?: { skip?: number; take?: number }): Promise<RatingWithShow[]> {
    const results = await this.db.rating.findMany({
      where: {
        userId,
        rateableType: "Show",
        value: { gte: 1, lte: 5 }, // Only valid ratings
      },
      orderBy: { createdAt: "desc" },
      skip: options?.skip,
      take: options?.take,
    });

    // Get show data for all ratings — narrow projection (slug/date/venue
    // trio) since the user-profile list cards don't use any other field.
    const showIds = results.map((r) => r.rateableId);
    const shows = await this.db.show.findMany({
      where: { id: { in: showIds } },
      select: {
        id: true,
        slug: true,
        date: true,
        venue: { select: { name: true, city: true, state: true } },
      },
    });

    const showMap = new Map(shows.map((show) => [show.id, show]));

    return results
      .map((rating): RatingWithShow | null => {
        const show = showMap.get(rating.rateableId);
        if (!show) return null;

        return {
          id: rating.id,
          value: rating.value,
          createdAt: rating.createdAt,
          show: {
            slug: show.slug,
            date: show.date,
            venue: show.venue
              ? {
                  name: show.venue.name,
                  city: show.venue.city,
                  state: show.venue.state,
                }
              : null,
          },
        };
      })
      .filter((rating): rating is RatingWithShow => rating !== null);
  }

  async findTrackRatingsByUserId(
    userId: string,
    options?: { skip?: number; take?: number },
  ): Promise<RatingWithTrack[]> {
    const results = await this.db.rating.findMany({
      where: {
        userId,
        rateableType: "Track",
        value: { gte: 1, lte: 5 }, // Only valid ratings
      },
      orderBy: { createdAt: "desc" },
      skip: options?.skip,
      take: options?.take,
    });

    // Get track data with show and song info — narrow projection: the
    // user-profile track-rating cards only display set/position + nested
    // slug/date/venue.name + song.slug/title.
    const trackIds = results.map((r) => r.rateableId);
    const tracks = await this.db.track.findMany({
      where: { id: { in: trackIds } },
      select: {
        id: true,
        slug: true,
        position: true,
        set: true,
        show: {
          select: {
            slug: true,
            date: true,
            venue: { select: { name: true } },
          },
        },
        song: { select: { slug: true, title: true } },
      },
    });

    const trackMap = new Map(tracks.map((track) => [track.id, track]));

    return results
      .map((rating): RatingWithTrack | null => {
        const track = trackMap.get(rating.rateableId);
        if (!track) return null;

        return {
          id: rating.id,
          value: rating.value,
          createdAt: rating.createdAt,
          track: {
            slug: track.slug,
            position: track.position,
            set: track.set,
            show: {
              slug: track.show.slug,
              date: track.show.date,
              venue: track.show.venue ? { name: track.show.venue.name } : null,
            },
            song: {
              slug: track.song.slug,
              title: track.song.title,
            },
          },
        };
      })
      .filter((rating): rating is RatingWithTrack => rating !== null);
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
