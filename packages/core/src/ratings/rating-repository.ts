import type { Rating } from "@bip/domain";
import type { DbClient, DbRating } from "../_shared/database/models";

export interface RatingWithShow extends Rating {
  show: {
    id: string;
    slug: string | null;
    date: string;
    venue: {
      name: string | null;
      city: string | null;
      state: string | null;
    } | null;
  };
}

export interface RatingWithTrack extends Rating {
  track: {
    id: string;
    slug: string | null;
    position: number;
    set: string;
    show: {
      id: string;
      slug: string | null;
      date: string;
      venue: {
        name: string | null;
        city: string | null;
        state: string | null;
      } | null;
    };
    song: {
      id: string;
      slug: string;
      title: string;
    };
  };
}

export function mapRatingToDomainEntity(dbRating: DbRating): Rating {
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

export function mapRatingToDbModel(entity: Partial<Rating>): Partial<DbRating> {
  return {
    id: entity.id,
    rateableId: entity.rateableId,
    rateableType: entity.rateableType,
    userId: entity.userId,
    value: entity.value,
  };
}

export class RatingRepository {
  constructor(protected db: DbClient) {}

  async findManyByUserIdAndRateableIds(userId: string, rateableIds: string[], rateableType: string): Promise<Rating[]> {
    const results = await this.db.rating.findMany({
      where: { userId, rateableId: { in: rateableIds }, rateableType },
    });
    return results.map((result) => mapRatingToDomainEntity(result));
  }

  async upsert(data: { rateableId: string; rateableType: string; userId: string; value: number }): Promise<Rating> {
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

  async findShowRatingsByUserId(userId: string): Promise<RatingWithShow[]> {
    const results = await this.db.rating.findMany({
      where: {
        userId,
        rateableType: "Show",
        value: { gte: 1, lte: 5 }, // Only valid ratings
      },
      orderBy: { createdAt: "desc" },
    });

    // Get show data for all ratings
    const showIds = results.map((r) => r.rateableId);
    const shows = await this.db.show.findMany({
      where: { id: { in: showIds } },
      include: { venue: true },
    });

    const showMap = new Map(shows.map((show) => [show.id, show]));

    return results
      .map((rating) => {
        const show = showMap.get(rating.rateableId);
        if (!show) return null;

        return {
          ...mapRatingToDomainEntity(rating),
          show: {
            id: show.id,
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

  async findTrackRatingsByUserId(userId: string): Promise<RatingWithTrack[]> {
    const results = await this.db.rating.findMany({
      where: {
        userId,
        rateableType: "Track",
        value: { gte: 1, lte: 5 }, // Only valid ratings
      },
      orderBy: { createdAt: "desc" },
    });

    // Get track data with show and song info
    const trackIds = results.map((r) => r.rateableId);
    const tracks = await this.db.track.findMany({
      where: { id: { in: trackIds } },
      include: {
        show: { include: { venue: true } },
        song: true,
      },
    });

    const trackMap = new Map(tracks.map((track) => [track.id, track]));

    return results
      .map((rating) => {
        const track = trackMap.get(rating.rateableId);
        if (!track) return null;

        return {
          ...mapRatingToDomainEntity(rating),
          track: {
            id: track.id,
            slug: track.slug,
            position: track.position,
            set: track.set,
            show: {
              id: track.show.id,
              slug: track.show.slug,
              date: track.show.date,
              venue: track.show.venue
                ? {
                    name: track.show.venue.name,
                    city: track.show.venue.city,
                    state: track.show.venue.state,
                  }
                : null,
            },
            song: {
              id: track.song.id,
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

  private async updateRateableAverageRating(rateableId: string, rateableType: string): Promise<void> {
    // Calculate the new average rating and count
    const stats = await this.db.rating.aggregate({
      where: { rateableId, rateableType },
      _avg: { value: true },
      _count: { id: true },
    });

    const averageRating = stats._avg.value || 0;
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
  }
}
