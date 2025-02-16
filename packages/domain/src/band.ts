import { z } from "zod";

export const bandSchema = z.object({
  id: z.string().uuid(),
  name: z.string().nullable(),
  slug: z.string(),
  legacyId: z.number().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Band = z.infer<typeof bandSchema>; 