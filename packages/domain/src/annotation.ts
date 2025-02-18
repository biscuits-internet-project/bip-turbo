import { z } from "zod";

export const annotationSchema = z.object({
  id: z.string().uuid(),
  trackId: z.string().uuid(),
  desc: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Annotation = z.infer<typeof annotationSchema>;
