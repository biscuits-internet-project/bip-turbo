import { z } from "zod";

export const ratingSchema = z.object({
  id: z.string().uuid(),
  rateableId: z.string().uuid(),
  rateableType: z.string(),
  userId: z.string().uuid(),
  value: z.number().min(1).max(5),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Rating = z.infer<typeof ratingSchema>;
