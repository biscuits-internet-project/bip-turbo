import type { Post, PostFeedItem, PostWithUser } from "@bip/domain";
import { Prisma } from "@prisma/client";
import type { DbClient } from "../_shared/database/models";
import { mapToUserMinimal } from "../users/user-repository";

export type DbPost = Prisma.PostGetPayload<object>;
export type DbPostWithUser = Prisma.PostGetPayload<{
  include: { user: true; moderator: true; quotedPost: true };
}>;

export function mapPostToDomainEntity(dbPost: DbPost): Post {
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
    editedAt: dbPost.editedAt ? new Date(dbPost.editedAt) : null,
    replyCount: dbPost.replyCount,
    voteScore: dbPost.voteScore,
    upvoteCount: dbPost.upvoteCount,
    downvoteCount: dbPost.downvoteCount,
    flagCount: dbPost.flagCount,
    moderationStatus: dbPost.moderationStatus as "clean" | "flagged" | "hidden" | "removed",
    moderatedAt: dbPost.moderatedAt ? new Date(dbPost.moderatedAt) : null,
    moderatedBy: dbPost.moderatedBy,
    createdAt: new Date(dbPost.createdAt),
    updatedAt: new Date(dbPost.updatedAt),
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

export interface FeedOptions {
  sort: "chronological" | "hot";
  cursor?: string;
  limit: number;
  userId?: string;
}

export interface CreatePostInput {
  userId: string;
  title?: string;
  content?: string;
  parentId?: string;
  quotedPostId?: string;
  quotedContentSnapshot?: string;
  mediaUrl?: string;
  mediaType?: "cloudflare_image" | "giphy";
}

export interface UpdatePostInput {
  title?: string;
  content?: string;
}

export interface UpdateModerationStateInput {
  moderationStatus?: "clean" | "flagged" | "hidden" | "removed";
  moderatedBy?: string | null;
  moderatedAt?: Date | null;
  isDeleted?: boolean;
  content?: string;
}

export class PostRepository {
  constructor(private readonly db: DbClient) {}

  async findById(id: string, userId?: string): Promise<PostWithUser | null> {
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

  async findFeed(options: FeedOptions): Promise<PostFeedItem[]> {
    if (options.sort === "hot") {
      return this.findHotFeed(options);
    }
    return this.findChronologicalFeed(options);
  }

  async findChronologicalFeed(options: Omit<FeedOptions, "sort">): Promise<PostFeedItem[]> {
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

  async findHotFeed(options: Omit<FeedOptions, "sort">): Promise<PostFeedItem[]> {
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

  async findThread(postId: string, userId?: string): Promise<{ post: PostWithUser; replies: PostWithUser[] }> {
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

  async create(input: CreatePostInput): Promise<PostWithUser> {
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

  async update(id: string, input: UpdatePostInput): Promise<PostWithUser> {
    const result = await this.db.post.update({
      where: { id },
      data: {
        content: input.content,
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

  async softDelete(id: string): Promise<void> {
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

  async incrementReplyCount(id: string): Promise<void> {
    await this.db.post.update({
      where: { id },
      data: { replyCount: { increment: 1 } },
    });
  }

  async decrementReplyCount(id: string): Promise<void> {
    await this.db.post.update({
      where: { id },
      data: { replyCount: { decrement: 1 } },
    });
  }

  async updateModerationState(id: string, updates: UpdateModerationStateInput): Promise<void> {
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
