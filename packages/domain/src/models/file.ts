import { z } from "zod";

export const cloudflareVariantsSchema = z.record(z.string(), z.string()).optional();

export const fileSchema = z.object({
  id: z.string().uuid("ID must be a valid UUID"),
  path: z.string().min(1, "Path is required"),
  filename: z.string().min(1, "Filename is required"),
  type: z.string().min(1, "Type is required"),
  size: z.number().min(0, "Size must be a positive number"),
  userId: z.string().uuid("User ID must be a valid UUID"),
  createdAt: z.date(),
  updatedAt: z.date(),
  cloudflareId: z.string().optional(),
  variants: cloudflareVariantsSchema,
  url: z.string().optional(),
  isCover: z.boolean().optional(),
});

export type File = z.infer<typeof fileSchema>;
export type CloudflareVariants = z.infer<typeof cloudflareVariantsSchema>;

// Input types for file operations
export const fileCreateInputSchema = z.object({
  path: z.string().min(1),
  filename: z.string().min(1),
  type: z.string().min(1),
  size: z.number().min(0),
  userId: z.string().uuid(),
  cloudflareId: z.string().optional(),
  variants: cloudflareVariantsSchema,
});

export type FileCreateInput = z.infer<typeof fileCreateInputSchema>;

export const blogPostFileAssociationSchema = z.object({
  path: z.string().min(1),
  blogPostId: z.string().uuid(),
  isCover: z.boolean(),
});

export type BlogPostFileAssociation = z.infer<typeof blogPostFileAssociationSchema>;

export const blogPostFileSchema = z.object({
  path: z.string().min(1),
  url: z.string().min(1),
  isCover: z.boolean().optional(),
});

export type BlogPostFile = z.infer<typeof blogPostFileSchema>;

// Extended input for file creation with blog post association
export const fileCreateWithBlogPostInputSchema = fileCreateInputSchema.extend({
  blogPostId: z.string().uuid().optional(),
  isCover: z.boolean().optional(),
});

export type FileCreateWithBlogPostInput = z.infer<typeof fileCreateWithBlogPostInputSchema>;

export const imageUploadResultSchema = z.object({
  file: fileSchema,
  variants: z.record(z.string(), z.string()),
});

export type ImageUploadResult = z.infer<typeof imageUploadResultSchema>;

// Show photo type for displaying on show pages
export const showFileSchema = z.object({
  id: z.string().uuid(),
  url: z.string().min(1),
  thumbnailUrl: z.string().optional(),
  label: z.string().nullable().optional(),
  source: z.string().nullable().optional(),
});

export type ShowFile = z.infer<typeof showFileSchema>;
