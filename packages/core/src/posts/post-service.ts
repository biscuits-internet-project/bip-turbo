import type { Post, PostFeedItem, PostWithUser } from "@bip/domain";
import { Prisma } from "@prisma/client";
import type { DbClient } from "../_shared/database/models";
import type { NotificationService } from "../notifications/notification-service";
import { mapToUserMinimal } from "../users/user-service";

// DB types
export type DbPost = Prisma.PostGetPayload<object>;
export type DbPostWithUser = Prisma.PostGetPayload<{
  include: { user: true; moderator: true; quotedPost: true };
}>;

// Mapper functions
export function mapPostToDomainEntity(dbPost: DbPost): Post {
  // Helper to ensure valid Date objects (handles both Date objects and strings from raw queries)
  const ensureDate = (value: Date | string | null | undefined): Date => {
    if (!value) return new Date();
    if (value instanceof Date) return value;
    return new Date(value);
  };

  const ensureDateOrNull = (value: Date | string | null | undefined): Date | null => {
    if (!value) return null;
    if (value instanceof Date) return value;
    return new Date(value);
  };

  return {
    id: dbPost.id,
    userId: dbPost.userId,
    title: dbPost.title,
    content: dbPost.content,
    parentId: dbPost.parentId,
    quotedPostId: dbPost.quotedPostId,
    quotedContentSnapshot: dbPost.quotedContentSnapshot,
    mediaUrl: dbPost.mediaUrl,
    mediaType: dbPost.mediaType as "cloudflare_image" | "giphy" | null,
    isDeleted: dbPost.isDeleted,
    editedAt: ensureDateOrNull(dbPost.editedAt),
    replyCount: dbPost.replyCount,
    voteScore: dbPost.voteScore,
    upvoteCount: dbPost.upvoteCount,
    downvoteCount: dbPost.downvoteCount,
    flagCount: dbPost.flagCount,
    moderationStatus: dbPost.moderationStatus as "clean" | "flagged" | "hidden" | "removed",
    moderatedAt: ensureDateOrNull(dbPost.moderatedAt),
    moderatedBy: dbPost.moderatedBy,
    createdAt: ensureDate(dbPost.createdAt),
    updatedAt: ensureDate(dbPost.updatedAt),
  };
}

export function mapPostWithUserToDomainEntity(dbPost: DbPostWithUser): PostWithUser {
  const post = mapPostToDomainEntity(dbPost);
  return {
    ...post,
    user: mapToUserMinimal(dbPost.user),
    moderator: dbPost.moderator ? mapToUserMinimal(dbPost.moderator) : null,
    quotedPost: dbPost.quotedPost ? mapPostToDomainEntity(dbPost.quotedPost) : null,
  };
}

// Service input types
export interface FeedOptions {
  sort: "chronological" | "hot";
  cursor?: string;
  limit: number;
  userId?: string;
}

export interface CreatePostServiceInput {
  userId: string;
  content: string;
  mediaUrl?: string;
  mediaType?: "cloudflare_image" | "giphy";
}

export interface ReplyToPostInput {
  parentId: string;
  userId: string;
  content: string;
  mediaUrl?: string;
  mediaType?: "cloudflare_image" | "giphy";
}

export interface QuotePostInput {
  quotedPostId: string;
  userId: string;
  content: string;
  mediaUrl?: string;
  mediaType?: "cloudflare_image" | "giphy";
}

interface CreatePostInput {
  userId: string;
  title?: string;
  content?: string;
  parentId?: string;
  quotedPostId?: string;
  quotedContentSnapshot?: string;
  mediaUrl?: string;
  mediaType?: "cloudflare_image" | "giphy";
}

export class PostService {
  constructor(
    private readonly db: DbClient,
    private readonly notificationService: NotificationService,
  ) {}

  // Data access methods
  private async findById(id: string, userId?: string): Promise<PostWithUser | null> {
    const result = await this.db.post.findUnique({
      where: { id },
      include: {
        user: true,
        moderator: true,
        quotedPost: true,
        votes: userId
          ? {
              where: { userId },
              select: { voteType: true },
            }
          : false,
      },
    });

    if (!result) {
      return null;
    }

    const post = mapPostWithUserToDomainEntity(result);

    // Add user vote if requested
    if (userId && "votes" in result) {
      const userVote = (result.votes as Array<{ voteType: string }>)[0];
      return {
        ...post,
        userVote: userVote?.voteType as "upvote" | "downvote" | null | undefined,
      };
    }

    return post;
  }

  private async findFeed(options: FeedOptions): Promise<PostFeedItem[]> {
    if (options.sort === "hot") {
      return this.findHotFeed(options);
    }
    return this.findChronologicalFeed(options);
  }

  private async findChronologicalFeed(options: Omit<FeedOptions, "sort">): Promise<PostFeedItem[]> {
    const where: Prisma.PostWhereInput = {
      parentId: null, // Only top-level posts
      moderationStatus: { notIn: ["hidden", "removed"] },
      isDeleted: false,
    };

    if (options.cursor) {
      where.createdAt = { lt: new Date(options.cursor) };
    }

    const results = await this.db.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: options.limit,
      include: {
        user: true,
        moderator: true,
        quotedPost: true,
      },
    });

    return results.map((result) => {
      const post = mapPostWithUserToDomainEntity(result);
      return {
        ...post,
        isEdited: !!result.editedAt,
      };
    });
  }

  private async findHotFeed(options: Omit<FeedOptions, "sort">): Promise<PostFeedItem[]> {
    // Hot algorithm: (upvote_count + reply_count * 2) / (age_hours + 2)^1.5
    // This gives more weight to replies and applies time decay
    const results = await this.db.$queryRaw<
      Array<
        DbPost & {
          hot_score: number;
          user: {
            id: string;
            username: string;
            avatarFileUrl: string | null;
          };
        }
      >
    >`
      SELECT
        p.*,
        ((p.upvote_count + p.reply_count * 2)::float / POW(EXTRACT(EPOCH FROM (NOW() - p.created_at)) / 3600 + 2, 1.5)) as hot_score,
        json_build_object(
          'id', u.id,
          'username', u.username,
          'avatarFileUrl', u.avatar_file_url
        ) as user
      FROM posts p
      INNER JOIN users u ON p.user_id = u.id
      WHERE p.parent_id IS NULL
        AND p.moderation_status NOT IN ('hidden', 'removed')
        AND p.is_deleted = false
        ${options.cursor ? Prisma.sql`AND p.created_at < ${new Date(options.cursor)}` : Prisma.empty}
      ORDER BY hot_score DESC, p.created_at DESC
      LIMIT ${options.limit}
    `;

    return results.map((result) => {
      const post = mapPostToDomainEntity(result);
      return {
        ...post,
        user: {
          id: result.user.id,
          username: result.user.username,
          avatarUrl: result.user.avatarFileUrl,
        },
        isEdited: !!result.editedAt,
      };
    });
  }

  private async findThread(postId: string, userId?: string): Promise<{ post: PostWithUser; replies: PostWithUser[] }> {
    const post = await this.findById(postId, userId);
    if (!post) {
      throw new Error(`Post ${postId} not found`);
    }

    const replies = await this.db.post.findMany({
      where: {
        parentId: postId,
        isDeleted: false,
        moderationStatus: { notIn: ["hidden", "removed"] },
      },
      orderBy: { createdAt: "asc" },
      include: {
        user: true,
        moderator: true,
        quotedPost: true,
        votes: userId
          ? {
              where: { userId },
              select: { voteType: true },
            }
          : false,
      },
    });

    const mappedReplies = replies.map((reply) => {
      const mapped = mapPostWithUserToDomainEntity(reply);
      if (userId && "votes" in reply) {
        const userVote = (reply.votes as Array<{ voteType: string }>)[0];
        return {
          ...mapped,
          userVote: userVote?.voteType as "upvote" | "downvote" | null | undefined,
        };
      }
      return mapped;
    });

    return { post, replies: mappedReplies };
  }

  private async create(input: CreatePostInput): Promise<PostWithUser> {
    const result = await this.db.$transaction(async (tx) => {
      // Create the post
      const post = await tx.post.create({
        data: {
          userId: input.userId,
          title: input.title,
          content: input.content,
          parentId: input.parentId,
          quotedPostId: input.quotedPostId,
          quotedContentSnapshot: input.quotedContentSnapshot,
          mediaUrl: input.mediaUrl,
          mediaType: input.mediaType,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        include: {
          user: true,
          moderator: true,
          quotedPost: true,
        },
      });

      // If this is a reply, increment parent's reply count
      if (input.parentId) {
        await tx.post.update({
          where: { id: input.parentId },
          data: { replyCount: { increment: 1 } },
        });
      }

      return post;
    });

    return mapPostWithUserToDomainEntity(result);
  }

  private async update(id: string, content: string): Promise<PostWithUser> {
    const result = await this.db.post.update({
      where: { id },
      data: {
        content,
        editedAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        user: true,
        moderator: true,
        quotedPost: true,
      },
    });

    return mapPostWithUserToDomainEntity(result);
  }

  private async softDelete(id: string): Promise<void> {
    await this.db.$transaction(async (tx) => {
      const post = await tx.post.findUnique({
        where: { id },
        select: { parentId: true },
      });

      await tx.post.update({
        where: { id },
        data: {
          isDeleted: true,
          content: "[deleted]",
          updatedAt: new Date(),
        },
      });

      // If this was a reply, decrement parent's reply count
      if (post?.parentId) {
        await tx.post.update({
          where: { id: post.parentId },
          data: { replyCount: { decrement: 1 } },
        });
      }
    });
  }

  // Public service methods
  async createPost(input: CreatePostServiceInput): Promise<PostWithUser> {
    // Validate content length
    if (input.content.length > 1000) {
      throw new Error("Post content must be 1000 characters or less");
    }

    if (input.content.trim().length === 0) {
      throw new Error("Post content cannot be empty");
    }

    return this.create({
      userId: input.userId,
      content: input.content,
      mediaUrl: input.mediaUrl,
      mediaType: input.mediaType,
    });
  }

  async replyToPost(input: ReplyToPostInput): Promise<PostWithUser> {
    // Validate content length
    if (input.content.length > 1000) {
      throw new Error("Reply content must be 1000 characters or less");
    }

    if (input.content.trim().length === 0) {
      throw new Error("Reply content cannot be empty");
    }

    // Fetch parent post to validate it exists and get author
    const parentPost = await this.findById(input.parentId);
    if (!parentPost) {
      throw new Error("Parent post not found");
    }

    // Validate single-level threading: parent cannot have a parent
    if (parentPost.parentId) {
      throw new Error("Cannot reply to a reply. Please reply to the top-level post.");
    }

    // Create the reply
    const reply = await this.create({
      userId: input.userId,
      content: input.content,
      parentId: input.parentId,
      mediaUrl: input.mediaUrl,
      mediaType: input.mediaType,
    });

    // Trigger notification
    await this.notificationService.createReplyNotification(reply.id, input.userId, parentPost.userId);

    return reply;
  }

  async quotePost(input: QuotePostInput): Promise<PostWithUser> {
    // Validate content length
    if (input.content.length > 1000) {
      throw new Error("Quote content must be 1000 characters or less");
    }

    if (input.content.trim().length === 0) {
      throw new Error("Quote content cannot be empty");
    }

    // Fetch quoted post to get snapshot and author
    const quotedPost = await this.findById(input.quotedPostId);
    if (!quotedPost) {
      throw new Error("Quoted post not found");
    }

    // Create snapshot of quoted content
    const snapshot = quotedPost.isDeleted ? "[deleted]" : quotedPost.content || "";

    // Create the quote post
    const quote = await this.create({
      userId: input.userId,
      content: input.content,
      quotedPostId: input.quotedPostId,
      quotedContentSnapshot: snapshot,
      mediaUrl: input.mediaUrl,
      mediaType: input.mediaType,
    });

    // Trigger notification
    await this.notificationService.createQuoteNotification(quote.id, input.userId, quotedPost.userId);

    return quote;
  }

  async editPost(postId: string, userId: string, content: string): Promise<PostWithUser> {
    // Validate content length
    if (content.length > 1000) {
      throw new Error("Post content must be 1000 characters or less");
    }

    if (content.trim().length === 0) {
      throw new Error("Post content cannot be empty");
    }

    // Fetch post to validate ownership
    const post = await this.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    if (post.userId !== userId) {
      throw new Error("Not authorized to edit this post");
    }

    if (post.isDeleted) {
      throw new Error("Cannot edit a deleted post");
    }

    return this.update(postId, content);
  }

  async deletePost(postId: string, userId: string): Promise<void> {
    // Fetch post to validate ownership
    const post = await this.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    if (post.userId !== userId) {
      throw new Error("Not authorized to delete this post");
    }

    if (post.isDeleted) {
      throw new Error("Post is already deleted");
    }

    await this.softDelete(postId);
  }

  async getFeed(options: FeedOptions): Promise<PostFeedItem[]> {
    return this.findFeed(options);
  }

  async getThread(postId: string, userId?: string): Promise<{ post: PostWithUser; replies: PostWithUser[] }> {
    return this.findThread(postId, userId);
  }

  // Moderation methods
  async updateModerationState(
    id: string,
    updates: {
      moderationStatus?: "clean" | "flagged" | "hidden" | "removed";
      moderatedBy?: string | null;
      moderatedAt?: Date | null;
      isDeleted?: boolean;
      content?: string;
    },
  ): Promise<void> {
    const data: Prisma.PostUncheckedUpdateInput = {
      updatedAt: new Date(),
    };

    if (typeof updates.moderationStatus !== "undefined") {
      data.moderationStatus = updates.moderationStatus;
    }
    if (typeof updates.moderatedBy !== "undefined") {
      data.moderatedBy = updates.moderatedBy;
    }
    if (typeof updates.moderatedAt !== "undefined") {
      data.moderatedAt = updates.moderatedAt;
    }
    if (typeof updates.isDeleted !== "undefined") {
      data.isDeleted = updates.isDeleted;
    }
    if (typeof updates.content !== "undefined") {
      data.content = updates.content;
    }

    await this.db.post.update({
      where: { id },
      data,
    });
  }
}
