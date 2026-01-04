import type { Notification, NotificationWithDetails } from "@bip/domain";
import type { Prisma } from "@prisma/client";
import type { DbClient } from "../_shared/database/models";
import { mapToUserMinimal } from "../users/user-repository";

export type DbNotification = Prisma.NotificationGetPayload<object>;
export type DbNotificationWithDetails = Prisma.NotificationGetPayload<{
  include: { actor: true; post: true };
}>;

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

export interface CreateNotificationInput {
  userId: string;
  actorId: string;
  postId: string;
  type: "reply" | "reaction" | "quote";
}

export class NotificationRepository {
  constructor(private readonly db: DbClient) {}

  async findByUserId(userId: string, options?: FindNotificationsOptions): Promise<NotificationWithDetails[]> {
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

  async getUnreadCount(userId: string): Promise<number> {
    return await this.db.notification.count({
      where: {
        userId,
        read: false,
      },
    });
  }

  async create(data: CreateNotificationInput): Promise<Notification> {
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

  async markAsRead(userId: string, notificationIds: string[]): Promise<number> {
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

  async markAllAsRead(userId: string): Promise<number> {
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
}
