import type { Logger, Review, ReviewMinimal, UserMinimal } from "@bip/domain";
import type { DbClient, DbReview, DbUser } from "../_shared/database/models";
import { buildOrderByClause, buildWhereClause } from "../_shared/database/query-utils";
import type { QueryOptions } from "../_shared/database/types";

export interface ReviewWithShow extends Omit<Review, "showId"> {
  show: {
    id: string;
    slug: string;
    date: string;
    venue: {
      name: string;
      city: string | null;
      state: string | null;
    };
  } | null;
}

// Mapper functions
function mapToUserMinimal(dbUser: DbUser): UserMinimal {
  return {
    id: dbUser.id,
    username: dbUser.username ?? "",
    avatarUrl: dbUser.avatarFileUrl ?? null,
  };
}

function mapReviewToDomainEntity(dbReview: DbReview): Review {
  const { createdAt, updatedAt, ...rest } = dbReview;

  return {
    ...rest,
    createdAt: new Date(createdAt),
    updatedAt: new Date(updatedAt),
  };
}

function mapReviewToMinimal(entity: DbReview, user: DbUser): ReviewMinimal {
  return {
    id: entity.id,
    content: entity.content,
    userId: entity.userId,
    showId: entity.showId,
    createdAt: entity.createdAt,
    user: mapToUserMinimal(user),
  };
}

export class ReviewService {
  constructor(
    protected readonly db: DbClient,
    protected readonly logger: Logger,
  ) {}

  async findById(id: string): Promise<Review | null> {
    const result = await this.db.review.findUnique({
      where: { id },
    });
    return result ? mapReviewToDomainEntity(result) : null;
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

  async findByUserId(userId: string, options?: QueryOptions<Review>): Promise<Review[]> {
    const orderBy = options?.sort ? buildOrderByClause(options.sort) : [{ createdAt: "desc" }];
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

    return results.map((result: DbReview) => mapReviewToDomainEntity(result));
  }

  async findByUserIdWithShow(userId: string, options?: QueryOptions<Review>): Promise<ReviewWithShow[]> {
    const orderBy = options?.sort ? buildOrderByClause(options.sort) : [{ createdAt: "desc" }];
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
      include: {
        show: {
          include: {
            venue: true,
          },
        },
      },
    });

    return results.map((result: Record<string, unknown>) => ({
      id: result.id as string,
      content: result.content as string,
      status: result.status as string,
      userId: result.userId as string,
      createdAt: new Date(result.createdAt as string),
      updatedAt: new Date(result.updatedAt as string),
      show: result.show
        ? {
            id: (result.show as Record<string, unknown>).id as string,
            slug: (result.show as Record<string, unknown>).slug as string,
            date: (result.show as Record<string, unknown>).date as string,
            venue: {
              name: ((result.show as Record<string, unknown>).venue as Record<string, unknown>).name as string,
              city: ((result.show as Record<string, unknown>).venue as Record<string, unknown>).city as string | null,
              state: ((result.show as Record<string, unknown>).venue as Record<string, unknown>).state as string | null,
            },
          }
        : null,
    }));
  }

  async findMany(options?: QueryOptions<Review>): Promise<Review[]> {
    const where = options?.filters ? buildWhereClause(options.filters) : {};
    const orderBy = options?.sort ? buildOrderByClause(options.sort) : [{ createdAt: "desc" }];
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

    return results.map((result: DbReview) => mapReviewToDomainEntity(result));
  }

  async create(data: Omit<Review, "id" | "createdAt" | "updatedAt">): Promise<ReviewMinimal> {
    const result = await this.db.review.create({
      data: {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        user: true,
      },
    });
    return mapReviewToMinimal(result, result.user);
  }

  async update(id: string, data: Partial<Review>): Promise<ReviewMinimal> {
    const result = await this.db.review.update({
      where: { id },
      data,
      include: {
        user: true,
      },
    });
    return mapReviewToMinimal(result, result.user);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.db.review.delete({
        where: { id },
      });
      return true;
    } catch (_error) {
      return false;
    }
  }
}
