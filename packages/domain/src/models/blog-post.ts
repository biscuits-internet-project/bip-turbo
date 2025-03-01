import { z } from "zod";

export const BlogPostState = {
  DRAFT: "draft",
  PUBLISHED: "published",
} as const;

export type BlogPostState = (typeof BlogPostState)[keyof typeof BlogPostState];

export const BlogPostType = {
  BLOG: "blog",
} as const;

export type BlogPostType = (typeof BlogPostType)[keyof typeof BlogPostType];

export const blogPostSchema = z.object({
  id: z.string().uuid("ID must be a valid UUID"),
  title: z.string().min(1, "Title is required"),
  blurb: z.string().nullable().optional(),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().nullable().optional(),
  state: z.enum([BlogPostState.DRAFT, BlogPostState.PUBLISHED]).default(BlogPostState.DRAFT),
  publishedAt: z.date().optional(),
  userId: z.string().uuid("User ID must be a valid UUID"),
  postType: z.enum([BlogPostType.BLOG]).default(BlogPostType.BLOG),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const blogPostCreateSchema = blogPostSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const blogPostUpdateSchema = blogPostCreateSchema.partial();

export type BlogPost = z.infer<typeof blogPostSchema>;
export type BlogPostCreate = z.infer<typeof blogPostCreateSchema>;
export type BlogPostUpdate = z.infer<typeof blogPostUpdateSchema>;
