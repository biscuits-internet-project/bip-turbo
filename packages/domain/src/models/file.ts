import { z } from "zod";

export const fileSchema = z.object({
  id: z.string().uuid("ID must be a valid UUID"),
  path: z.string().min(1, "Path is required"),
  filename: z.string().min(1, "Filename is required"),
  type: z.string().min(1, "Type is required"),
  size: z.number().min(0, "Size must be a positive number"),
  userId: z.string().uuid("User ID must be a valid UUID"),
  createdAt: z.date(),
  updatedAt: z.date(),
  url: z.string().optional(),
  isCover: z.boolean().optional(),
});

export type File = z.infer<typeof fileSchema>;
