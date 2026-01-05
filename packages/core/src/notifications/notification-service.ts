import type { Notification, NotificationWithDetails } from "@bip/domain";
import type { Prisma } from "@prisma/client";
import type { DbClient } from "../_shared/database/models";
import { mapToUserMinimal } from "../users/user-service";

// DB types
export type DbNotification = Prisma.NotificationGetPayload<object>;
export type DbNotificationWithDetails = Prisma.NotificationGetPayload<{
  include: { actor: true; post: true };
}>;

// Mapper functions
export function mapNotificationToDomainEntity(dbNotification: DbNotification): Notification {
  return {
    id: dbNotification.id,
    userId: dbNotification.userId,
    actorId: dbNotification.actorId,
    postId: dbNotification.postId,
    type: dbNotification.type as "reply" | "reaction" | "quote",
    read: dbNotification.read,
    createdAt: new Date(dbNotification.createdAt),
  };
}

export function mapNotificationWithDetailsToDomainEntity(
  dbNotification: DbNotificationWithDetails,
): NotificationWithDetails {
  return {
    ...mapNotificationToDomainEntity(dbNotification),
    actor: mapToUserMinimal(dbNotification.actor),
    post: {
      id: dbNotification.post.id,
      content: dbNotification.post.content,
      isDeleted: dbNotification.post.isDeleted,
    },
  };
}

export interface FindNotificationsOptions {
  unreadOnly?: boolean;
  limit?: number;
}

interface CreateNotificationInput {
  userId: string;
  actorId: string;
  postId: string;
  type: "reply" | "reaction" | "quote";
}

export class NotificationService {
  constructor(private readonly db: DbClient) {}

  // Data access methods
  private async findByUserId(userId: string, options?: FindNotificationsOptions): Promise<NotificationWithDetails[]> {
    const where: Prisma.NotificationWhereInput = { userId };

    if (options?.unreadOnly) {
      where.read = false;
    }

    const results = await this.db.notification.findMany({
      where,
      include: {
        actor: true,
        post: true,
      },
      orderBy: { createdAt: "desc" },
      take: options?.limit,
    });

    return results.map(mapNotificationWithDetailsToDomainEntity);
  }

  private async getUnreadCountInternal(userId: string): Promise<number> {
    return await this.db.notification.count({
      where: {
        userId,
        read: false,
      },
    });
  }

  private async create(data: CreateNotificationInput): Promise<Notification> {
    // Skip if user acts on own post
    if (data.userId === data.actorId) {
      throw new Error("Cannot create notification for own action");
    }

    const result = await this.db.notification.create({
      data: {
        userId: data.userId,
        actorId: data.actorId,
        postId: data.postId,
        type: data.type,
        read: false,
        createdAt: new Date(),
      },
    });

    return mapNotificationToDomainEntity(result);
  }

  private async markAsReadInternal(userId: string, notificationIds: string[]): Promise<number> {
    const result = await this.db.notification.updateMany({
      where: {
        userId,
        id: { in: notificationIds },
      },
      data: {
        read: true,
      },
    });

    return result.count;
  }

  private async markAllAsReadInternal(userId: string): Promise<number> {
    const result = await this.db.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: {
        read: true,
      },
    });

    return result.count;
  }

  // Public service methods
  async getNotifications(userId: string, limit?: number): Promise<NotificationWithDetails[]> {
    return this.findByUserId(userId, { limit });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.getUnreadCountInternal(userId);
  }

  async markAsRead(userId: string, notificationIds: string[]): Promise<number> {
    return this.markAsReadInternal(userId, notificationIds);
  }

  async markAllAsRead(userId: string): Promise<number> {
    return this.markAllAsReadInternal(userId);
  }

  async createReplyNotification(postId: string, replyAuthorId: string, parentAuthorId: string): Promise<void> {
    // Skip if user replies to their own post
    if (replyAuthorId === parentAuthorId) {
      return;
    }

    await this.create({
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

    await this.create({
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

    await this.create({
      userId: quotedAuthorId,
      actorId: quoterId,
      postId,
      type: "quote",
    });
  }
}
