import { z } from "zod";
import { userMinimalSchema } from "./user";

export const postSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  title: z.string().max(300).nullable(),
  content: z.string().nullable(),
  parentId: z.uuid().nullable(),
  quotedPostId: z.uuid().nullable(),
  quotedContentSnapshot: z.string().max(1000).nullable(),
  mediaUrl: z.string().nullable(),
  mediaType: z.enum(["cloudflare_image", "giphy"]).nullable(),
  isDeleted: z.boolean().default(false),
  editedAt: z.date().nullable(),
  replyCount: z.number().default(0),
  voteScore: z.number().default(0),
  upvoteCount: z.number().default(0),
  downvoteCount: z.number().default(0),
  flagCount: z.number().default(0),
  moderationStatus: z.enum(["clean", "flagged", "hidden", "removed"]).default("clean"),
  moderatedAt: z.date().nullable(),
  moderatedBy: z.uuid().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const postWithUserSchema = postSchema.extend({
  user: userMinimalSchema,
  moderator: userMinimalSchema.nullable().optional(),
  quotedPost: postSchema.nullable().optional(),
  userVote: z.enum(["upvote", "downvote"]).nullable().optional(), // Current user's vote
});

export const postFeedItemSchema = postWithUserSchema.extend({
  // Additional computed fields for feed display
  isEdited: z.boolean().optional(),
});

export type Post = z.infer<typeof postSchema>;
export type PostWithUser = z.infer<typeof postWithUserSchema>;
export type PostFeedItem = z.infer<typeof postFeedItemSchema>;
