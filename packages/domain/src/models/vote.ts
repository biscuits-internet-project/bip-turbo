import { z } from "zod";

export const voteSchema = z.object({
  id: z.uuid(),
  postId: z.uuid(),
  userId: z.uuid(),
  voteType: z.enum(["upvote", "downvote"]),
  createdAt: z.date(),
});

export type Vote = z.infer<typeof voteSchema>;
