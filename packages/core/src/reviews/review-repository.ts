import type { Review, ReviewMinimal } from "@bip/domain";
import invariant from "tiny-invariant";
import { BaseRepository } from "../_shared/database/base-repository";
import type { DbClient, DbReview, DbUser } from "../_shared/database/models";
import type { QueryOptions } from "../_shared/database/types";
import { mapToUserMinimal } from "../users/user-repository";

export function mapReviewToDomainEntity(dbReview: DbReview): Review {
  const { createdAt, updatedAt, ...rest } = dbReview;

  return {
    ...rest,
    createdAt: new Date(createdAt),
    updatedAt: new Date(updatedAt),
  };
}

export function mapReviewToDbModel(entity: Partial<Review>): Partial<DbReview> {
  return entity as Partial<DbReview>;
}

export function mapReviewToMinimal(entity: DbReview, user: DbUser): ReviewMinimal {
  return {
    id: entity.id,
    content: entity.content,
    userId: entity.userId,
    showId: entity.showId,
    createdAt: entity.createdAt,
    user: mapToUserMinimal(user),
  };
}

export class ReviewRepository extends BaseRepository<Review, DbReview> {
  protected modelName = "review" as const;

  protected mapToDomainEntity(dbReview: DbReview): Review {
    return mapReviewToDomainEntity(dbReview);
  }

  protected mapToDbModel(entity: Partial<Review>): Partial<DbReview> {
    return mapReviewToDbModel(entity);
  }

  async findById(id: string): Promise<Review | null> {
    const result = await this.db.review.findUnique({
      where: { id },
    });
    return result ? this.mapToDomainEntity(result) : null;
  }

  async findByShowId(showId: string): Promise<ReviewMinimal[]> {
    const results = await this.db.review.findMany({
      where: { showId },
      orderBy: [{ createdAt: "desc" }],
      include: {
        user: true,
      },
    });

    return results.map((result) => mapReviewToMinimal(result, result.user));
  }

  async findForTracksByShowId(showId: string): Promise<ReviewMinimal[]> {
    const results = await this.db.review.findMany({
      where: { showId },
      orderBy: [{ createdAt: "desc" }],
      include: {
        user: true,
      },
    });

    return results.map((result) => mapReviewToMinimal(result, result.user));
  }

  async findByUserId(userId: string, options?: QueryOptions<Review>): Promise<Review[]> {
    const orderBy = options?.sort ? this.buildOrderByClause(options.sort) : [{ createdAt: "desc" }];
    const skip =
      options?.pagination?.page && options?.pagination?.limit
        ? (options.pagination.page - 1) * options.pagination.limit
        : undefined;
    const take = options?.pagination?.limit;

    const results = await this.db.review.findMany({
      where: { userId },
      orderBy,
      skip,
      take,
    });

    return results.map((result: DbReview) => this.mapToDomainEntity(result));
  }

  async findMany(options?: QueryOptions<Review>): Promise<Review[]> {
    const where = options?.filters ? this.buildWhereClause(options.filters) : {};
    const orderBy = options?.sort ? this.buildOrderByClause(options.sort) : [{ createdAt: "desc" }];
    const skip =
      options?.pagination?.page && options?.pagination?.limit
        ? (options.pagination.page - 1) * options.pagination.limit
        : undefined;
    const take = options?.pagination?.limit;

    const results = await this.db.review.findMany({
      where,
      orderBy,
      skip,
      take,
    });

    return results.map((result: DbReview) => this.mapToDomainEntity(result));
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.db.review.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
