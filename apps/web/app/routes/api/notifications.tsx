import { z } from "zod";
import { protectedAction, protectedLoader } from "~/lib/base-loaders";
import { badRequest, methodNotAllowed } from "~/lib/errors";
import { logger } from "~/lib/logger";
import { services } from "~/server/services";

const getNotificationsSchema = z.object({
  unread: z.coerce.boolean().optional(),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
});

const markAsReadSchema = z.object({
  notificationIds: z.array(z.string().uuid()).optional(),
  markAllAsRead: z.boolean().optional(),
});

export const loader = protectedLoader(async ({ request, context }) => {
  const { currentUser } = context;
  const url = new URL(request.url);
  const params = {
    unread: url.searchParams.get("unread") || undefined,
    limit: url.searchParams.get("limit") || "20",
  };

  try {
    const validated = getNotificationsSchema.parse(params);
    const user = await services.users.findByEmail(currentUser.email);

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // If unread is true, return just the count
    if (validated.unread) {
      const count = await services.notifications.getUnreadCount(user.id);
      return new Response(JSON.stringify({ unreadCount: count }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Otherwise return the notifications
    const notifications = await services.notifications.getNotifications(user.id, validated.limit);

    return new Response(JSON.stringify({ notifications }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    logger.error("Error fetching notifications", { error });

    if (error instanceof z.ZodError) {
      return badRequest("Invalid query parameters");
    }

    return new Response(JSON.stringify({ error: "Failed to fetch notifications" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

export const action = protectedAction(async ({ request, context }) => {
  if (request.method !== "PATCH") {
    return methodNotAllowed();
  }

  const { currentUser } = context;

  try {
    // Get the actual user from the database
    const user = await services.users.findByEmail(currentUser.email);
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await request.json();
    const validated = markAsReadSchema.parse(body);

    let count: number;
    if (validated.markAllAsRead) {
      count = await services.notifications.markAllAsRead(user.id);
    } else if (validated.notificationIds && validated.notificationIds.length > 0) {
      count = await services.notifications.markAsRead(user.id, validated.notificationIds);
    } else {
      return badRequest("Must provide either notificationIds or markAllAsRead");
    }

    return new Response(JSON.stringify({ success: true, markedCount: count }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    logger.error("Notifications API error", { error });

    if (error instanceof z.ZodError) {
      return badRequest("Invalid request data");
    }

    return new Response(JSON.stringify({ error: "Failed to mark notifications as read" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
