import type { Rating } from "@bip/domain";
import type { DbClient, DbRating } from "../_shared/database/models";

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
}
