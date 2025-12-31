import { z } from "zod";

export const authorSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Author = z.infer<typeof authorSchema>;
