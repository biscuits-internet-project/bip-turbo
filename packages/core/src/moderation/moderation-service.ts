import type { NotificationService } from "../notifications/notification-service";
import type { PostRepository } from "../posts/post-repository";
import type { ContentFlagRepository, ContentFlagWithDetails, FindPendingOptions } from "./content-flag-repository";

export class ModerationService {
  constructor(
    private readonly contentFlagRepository: ContentFlagRepository,
    private readonly postRepository: PostRepository,
    private readonly notificationService: NotificationService,
  ) {
    // Placeholder until moderation notifications are implemented
    void this.notificationService;
  }

  async flagPost(
    postId: string,
    userId: string,
    reason: "spam" | "harassment" | "inappropriate" | "misinformation" | "other",
    description?: string,
  ): Promise<void> {
    await this.contentFlagRepository.create({
      postId,
      userId,
      reason,
      description,
    });

    // Check if post should be auto-hidden (flag count >= 3)
    const flagCount = await this.contentFlagRepository.getFlagCountByPostId(postId);
    if (flagCount >= 3) {
      await this.autoHidePost(postId);
    }
  }

  async getPendingFlags(limit?: number, offset?: number): Promise<ContentFlagWithDetails[]> {
    const options: FindPendingOptions = { limit, offset };
    return this.contentFlagRepository.findPending(options);
  }

  async reviewFlag(flagId: string, action: "dismiss" | "hide" | "remove", reviewerId: string): Promise<void> {
    const flag = await this.contentFlagRepository.findByIdWithDetails(flagId);

    if (!flag || flag.status !== "pending") {
      throw new Error("Flag not found");
    }

    // Update flag status based on action
    const status = action === "dismiss" ? "dismissed" : "actioned";
    await this.contentFlagRepository.updateStatus(flagId, status, reviewerId);

    // Take action on the post
    if (action === "hide") {
      await this.hidePost(flag.postId, reviewerId);
    } else if (action === "remove") {
      await this.removePost(flag.postId, reviewerId);
    }
  }

  async hidePost(postId: string, moderatorId: string): Promise<void> {
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    await this.postRepository.updateModerationState(postId, {
      moderationStatus: "hidden",
      moderatedBy: moderatorId,
      moderatedAt: new Date(),
    });
  }

  async removePost(postId: string, moderatorId: string): Promise<void> {
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    await this.postRepository.updateModerationState(postId, {
      moderationStatus: "removed",
      moderatedBy: moderatorId,
      moderatedAt: new Date(),
    });
  }

  async restorePost(postId: string, moderatorId: string): Promise<void> {
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    await this.postRepository.updateModerationState(postId, {
      moderationStatus: "clean",
      moderatedBy: moderatorId,
      moderatedAt: new Date(),
    });
  }

  async autoHidePost(postId: string): Promise<void> {
    await this.postRepository.updateModerationState(postId, {
      moderationStatus: "hidden",
      moderatedBy: null,
      moderatedAt: new Date(),
    });
  }
}
