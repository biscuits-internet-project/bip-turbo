import { z } from "zod";

export const userSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  email: z.string().email(),
  username: z.string(),
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
