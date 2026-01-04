import type { Prisma } from "@prisma/client";
import type { DbClient } from "../_shared/database/models";

export type DbContentFlag = Prisma.ContentFlagGetPayload<object>;
export type DbContentFlagWithDetails = Prisma.ContentFlagGetPayload<{
  include: { user: true; post: true; reviewer: true };
}>;

export interface ContentFlag {
  id: string;
  postId: string;
  userId: string;
  reason: string;
  description: string | null;
  status: string;
  reviewedBy: string | null;
  reviewedAt: Date | null;
  createdAt: Date;
}

export interface ContentFlagWithDetails extends ContentFlag {
  user: {
    id: string;
    username: string;
  };
  post: {
    id: string;
    content: string;
    userId: string;
  };
  reviewer: {
    id: string;
    username: string;
  } | null;
}

export interface CreateContentFlagInput {
  postId: string;
  userId: string;
  reason: "spam" | "harassment" | "inappropriate" | "misinformation" | "other";
  description?: string;
}

export interface FindPendingOptions {
  limit?: number;
  offset?: number;
}

export function mapContentFlagToDomainEntity(dbFlag: DbContentFlag): ContentFlag {
  return {
    id: dbFlag.id,
    postId: dbFlag.postId,
    userId: dbFlag.userId,
    reason: dbFlag.reason,
    description: dbFlag.description,
    status: dbFlag.status,
    reviewedBy: dbFlag.reviewedBy,
    reviewedAt: dbFlag.reviewedAt ? new Date(dbFlag.reviewedAt) : null,
    createdAt: new Date(dbFlag.createdAt),
  };
}

export function mapContentFlagWithDetailsToDomainEntity(dbFlag: DbContentFlagWithDetails): ContentFlagWithDetails {
  return {
    ...mapContentFlagToDomainEntity(dbFlag),
    user: {
      id: dbFlag.user.id,
      username: dbFlag.user.username || "Unknown",
    },
    post: {
      id: dbFlag.post.id,
      content: dbFlag.post.content || "",
      userId: dbFlag.post.userId,
    },
    reviewer: dbFlag.reviewer
      ? {
          id: dbFlag.reviewer.id,
          username: dbFlag.reviewer.username || "Unknown",
        }
      : null,
  };
}

export class ContentFlagRepository {
  constructor(private readonly db: DbClient) {}

  async findByPostId(postId: string): Promise<ContentFlag[]> {
    const results = await this.db.contentFlag.findMany({
      where: { postId },
      orderBy: { createdAt: "desc" },
    });

    return results.map(mapContentFlagToDomainEntity);
  }

  async findPending(options?: FindPendingOptions): Promise<ContentFlagWithDetails[]> {
    const results = await this.db.contentFlag.findMany({
      where: { status: "pending" },
      include: {
        user: true,
        post: true,
        reviewer: true,
      },
      orderBy: { createdAt: "desc" },
      take: options?.limit,
      skip: options?.offset,
    });

    return results.map(mapContentFlagWithDetailsToDomainEntity);
  }

  async findByIdWithDetails(flagId: string): Promise<ContentFlagWithDetails | null> {
    const result = await this.db.contentFlag.findUnique({
      where: { id: flagId },
      include: {
        user: true,
        post: true,
        reviewer: true,
      },
    });

    return result ? mapContentFlagWithDetailsToDomainEntity(result) : null;
  }

  async create(input: CreateContentFlagInput): Promise<ContentFlag> {
    const result = await this.db.$transaction(async (tx) => {
      // Create the flag
      const flag = await tx.contentFlag.create({
        data: {
          postId: input.postId,
          userId: input.userId,
          reason: input.reason,
          description: input.description,
          status: "pending",
          createdAt: new Date(),
        },
      });

      // Increment flag count on post
      await tx.post.update({
        where: { id: input.postId },
        data: { flagCount: { increment: 1 } },
      });

      // Auto-hide if flag count >= 3
      const post = await tx.post.findUnique({
        where: { id: input.postId },
        select: { flagCount: true },
      });

      if (post && post.flagCount >= 3) {
        await tx.post.update({
          where: { id: input.postId },
          data: {
            moderationStatus: "flagged",
          },
        });
      }

      return flag;
    });

    return mapContentFlagToDomainEntity(result);
  }

  async updateStatus(
    flagId: string,
    status: "reviewed" | "dismissed" | "actioned",
    reviewedBy: string,
  ): Promise<ContentFlag> {
    const result = await this.db.contentFlag.update({
      where: { id: flagId },
      data: {
        status,
        reviewedBy,
        reviewedAt: new Date(),
      },
    });

    return mapContentFlagToDomainEntity(result);
  }

  async getFlagCountByPostId(postId: string): Promise<number> {
    return await this.db.contentFlag.count({
      where: { postId },
    });
  }

  async findByUserId(userId: string): Promise<ContentFlag[]> {
    const results = await this.db.contentFlag.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return results.map(mapContentFlagToDomainEntity);
  }
}
