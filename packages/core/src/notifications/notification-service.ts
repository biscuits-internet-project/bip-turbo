import type { NotificationWithDetails } from "@bip/domain";
import type { NotificationRepository } from "./notification-repository";

export class NotificationService {
  constructor(private readonly repository: NotificationRepository) {}

  async getNotifications(userId: string, limit?: number): Promise<NotificationWithDetails[]> {
    return this.repository.findByUserId(userId, { limit });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.repository.getUnreadCount(userId);
  }

  async markAsRead(userId: string, notificationIds: string[]): Promise<number> {
    return this.repository.markAsRead(userId, notificationIds);
  }

  async markAllAsRead(userId: string): Promise<number> {
    return this.repository.markAllAsRead(userId);
  }

  async createReplyNotification(postId: string, replyAuthorId: string, parentAuthorId: string): Promise<void> {
    // Skip if user replies to their own post
    if (replyAuthorId === parentAuthorId) {
      return;
    }

    await this.repository.create({
      userId: parentAuthorId,
      actorId: replyAuthorId,
      postId,
      type: "reply",
    });
  }

  async createReactionNotification(postId: string, reactorId: string, postAuthorId: string): Promise<void> {
    // Skip if user reacts to their own post
    if (reactorId === postAuthorId) {
      return;
    }

    await this.repository.create({
      userId: postAuthorId,
      actorId: reactorId,
      postId,
      type: "reaction",
    });
  }

  async createQuoteNotification(postId: string, quoterId: string, quotedAuthorId: string): Promise<void> {
    // Skip if user quotes their own post
    if (quoterId === quotedAuthorId) {
      return;
    }

    await this.repository.create({
      userId: quotedAuthorId,
      actorId: quoterId,
      postId,
      type: "quote",
    });
  }
}
