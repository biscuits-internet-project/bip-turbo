import { z } from "zod";
import { userMinimalSchema } from "./user";
import { postSchema } from "./post";

export const notificationSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  actorId: z.uuid(),
  postId: z.uuid(),
  type: z.enum(["reply", "reaction", "quote"]),
  read: z.boolean().default(false),
  createdAt: z.date(),
});

export const notificationWithDetailsSchema = notificationSchema.extend({
  actor: userMinimalSchema,
  post: postSchema.pick({
    id: true,
    content: true,
    isDeleted: true,
  }),
});

export type Notification = z.infer<typeof notificationSchema>;
export type NotificationWithDetails = z.infer<typeof notificationWithDetailsSchema>;
