import { z } from "zod";

export const userSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  email: z.string().email(),
  username: z.string(),
  avatarFileId: z.string().uuid().nullable(),
  avatarUrl: z.string().url().nullable(),
  // Rating-display prefs (tri-state: null = no explicit choice → app default).
  showCalibratedRatings: z.boolean().nullable(),
  showRatingComparisonDebug: z.boolean().nullable(),
});

export const userMinimalSchema = userSchema
  .pick({
    id: true,
    username: true,
  })
  .extend({
    avatarUrl: z.string().url().nullable(),
  });

export type User = z.infer<typeof userSchema>;
export type UserMinimal = z.infer<typeof userMinimalSchema>;
