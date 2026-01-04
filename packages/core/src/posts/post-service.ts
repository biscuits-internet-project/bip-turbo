import type { PostFeedItem, PostWithUser } from "@bip/domain";
import type { NotificationService } from "../notifications/notification-service";
import type { FeedOptions, PostRepository } from "./post-repository";

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

export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly notificationService: NotificationService,
  ) {}

  async createPost(input: CreatePostServiceInput): Promise<PostWithUser> {
    // Validate content length
    if (input.content.length > 1000) {
      throw new Error("Post content must be 1000 characters or less");
    }

    if (input.content.trim().length === 0) {
      throw new Error("Post content cannot be empty");
    }

    return this.postRepository.create({
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
    const parentPost = await this.postRepository.findById(input.parentId);
    if (!parentPost) {
      throw new Error("Parent post not found");
    }

    // Validate single-level threading: parent cannot have a parent
    if (parentPost.parentId) {
      throw new Error("Cannot reply to a reply. Please reply to the top-level post.");
    }

    // Create the reply
    const reply = await this.postRepository.create({
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
    const quotedPost = await this.postRepository.findById(input.quotedPostId);
    if (!quotedPost) {
      throw new Error("Quoted post not found");
    }

    // Create snapshot of quoted content
    const snapshot = quotedPost.isDeleted ? "[deleted]" : quotedPost.content || "";

    // Create the quote post
    const quote = await this.postRepository.create({
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
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    if (post.userId !== userId) {
      throw new Error("Not authorized to edit this post");
    }

    if (post.isDeleted) {
      throw new Error("Cannot edit a deleted post");
    }

    return this.postRepository.update(postId, { content });
  }

  async deletePost(postId: string, userId: string): Promise<void> {
    // Fetch post to validate ownership
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    if (post.userId !== userId) {
      throw new Error("Not authorized to delete this post");
    }

    if (post.isDeleted) {
      throw new Error("Post is already deleted");
    }

    await this.postRepository.softDelete(postId);
  }

  async getFeed(options: FeedOptions): Promise<PostFeedItem[]> {
    return this.postRepository.findFeed(options);
  }

  async getThread(postId: string, userId?: string): Promise<{ post: PostWithUser; replies: PostWithUser[] }> {
    return this.postRepository.findThread(postId, userId);
  }
}
