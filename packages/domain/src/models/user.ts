import { z } from "zod";

export const userSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  email: z.string().email(),
  username: z.string(),
});

export type User = z.infer<typeof userSchema>;
