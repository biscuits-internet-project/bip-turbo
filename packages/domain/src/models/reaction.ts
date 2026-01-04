import { z } from "zod";
import { userMinimalSchema } from "./user";

export const reactionSchema = z.object({
  id: z.uuid(),
  postId: z.uuid(),
  userId: z.uuid(),
  emojiCode: z.string(),
  createdAt: z.date(),
});

export const reactionWithUserSchema = reactionSchema.extend({
  user: userMinimalSchema,
});

export type Reaction = z.infer<typeof reactionSchema>;
export type ReactionWithUser = z.infer<typeof reactionWithUserSchema>;
