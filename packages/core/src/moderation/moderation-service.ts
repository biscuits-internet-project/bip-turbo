import type { Prisma } from "@prisma/client";
import type { DbClient } from "../_shared/database/models";
import type { NotificationService } from "../notifications/notification-service";
import type { PostService } from "../posts/post-service";

// DB Types
export type DbContentFlag = Prisma.ContentFlagGetPayload<object>;
export type DbContentFlagWithDetails = Prisma.ContentFlagGetPayload<{
  include: { user: true; post: true; reviewer: true };
}>;

// Domain types
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

export interface FindPendingOptions {
  limit?: number;
  offset?: number;
}

// Mapper functions
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

export class ModerationService {
  constructor(
    private readonly db: DbClient,
    private readonly postService: PostService,
    private readonly notificationService: NotificationService,
  ) {
    // Placeholder until moderation notifications are implemented
    void this.notificationService;
  }

  // Data access methods
  private async findPendingFlags(options?: FindPendingOptions): Promise<ContentFlagWithDetails[]> {
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

  private async findFlagByIdWithDetails(flagId: string): Promise<ContentFlagWithDetails | null> {
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

  private async createFlag(input: {
    postId: string;
    userId: string;
    reason: "spam" | "harassment" | "inappropriate" | "misinformation" | "other";
    description?: string;
  }): Promise<ContentFlag> {
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

  private async updateFlagStatus(
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

  private async getFlagCountByPostId(postId: string): Promise<number> {
    return await this.db.contentFlag.count({
      where: { postId },
    });
  }

  // Public service methods
  async flagPost(
    postId: string,
    userId: string,
    reason: "spam" | "harassment" | "inappropriate" | "misinformation" | "other",
    description?: string,
  ): Promise<void> {
    await this.createFlag({
      postId,
      userId,
      reason,
      description,
    });

    // Check if post should be auto-hidden (flag count >= 3)
    const flagCount = await this.getFlagCountByPostId(postId);
    if (flagCount >= 3) {
      await this.autoHidePost(postId);
    }
  }

  async getPendingFlags(limit?: number, offset?: number): Promise<ContentFlagWithDetails[]> {
    const options: FindPendingOptions = { limit, offset };
    return this.findPendingFlags(options);
  }

  async reviewFlag(flagId: string, action: "dismiss" | "hide" | "remove", reviewerId: string): Promise<void> {
    const flag = await this.findFlagByIdWithDetails(flagId);

    if (!flag || flag.status !== "pending") {
      throw new Error("Flag not found");
    }

    // Update flag status based on action
    const status = action === "dismiss" ? "dismissed" : "actioned";
    await this.updateFlagStatus(flagId, status, reviewerId);

    // Take action on the post
    if (action === "hide") {
      await this.hidePost(flag.postId, reviewerId);
    } else if (action === "remove") {
      await this.removePost(flag.postId, reviewerId);
    }
  }

  async hidePost(postId: string, moderatorId: string): Promise<void> {
    await this.postService.updateModerationState(postId, {
      moderationStatus: "hidden",
      moderatedBy: moderatorId,
      moderatedAt: new Date(),
    });
  }

  async removePost(postId: string, moderatorId: string): Promise<void> {
    await this.postService.updateModerationState(postId, {
      moderationStatus: "removed",
      moderatedBy: moderatorId,
      moderatedAt: new Date(),
    });
  }

  async restorePost(postId: string, moderatorId: string): Promise<void> {
    await this.postService.updateModerationState(postId, {
      moderationStatus: "clean",
      moderatedBy: moderatorId,
      moderatedAt: new Date(),
    });
  }

  async autoHidePost(postId: string): Promise<void> {
    await this.postService.updateModerationState(postId, {
      moderationStatus: "hidden",
      moderatedBy: null,
      moderatedAt: new Date(),
    });
  }
}
