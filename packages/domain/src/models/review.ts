import { z } from "zod";
import { userMinimalSchema } from "./user";

export const reviewSchema = z.object({
  id: z.string().uuid(),
  content: z.string(),
  status: z.string(),
  userId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  showId: z.string().uuid().nullable(),
});

export const reviewMinimalSchema = reviewSchema
  .pick({
    id: true,
    content: true,
    userId: true,
    showId: true,
    createdAt: true,
  })
  .extend({
    user: userMinimalSchema,
  });

export type Review = z.infer<typeof reviewSchema>;
export type ReviewMinimal = z.infer<typeof reviewMinimalSchema>;
