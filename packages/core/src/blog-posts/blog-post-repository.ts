import type { BlogPost, BlogPostState, BlogPostType } from "@bip/domain";
import type { DbBlogPost } from "../_shared/database/models";
import type { DbClient } from "../_shared/database/models";
import { buildOrderByClause } from "../_shared/database/query-utils";
import { buildWhereClause } from "../_shared/database/query-utils";
import type { QueryOptions } from "../_shared/database/types";
import { slugify } from "../_shared/utils/slugify";

export function mapBlogPostToDomainEntity(dbBlogPost: DbBlogPost): BlogPost {
  const { state, postType, createdAt, updatedAt, publishedAt, ...rest } = dbBlogPost;

  return {
    ...rest,
    createdAt: new Date(createdAt),
    updatedAt: new Date(updatedAt),
    state: state as BlogPostState,
    postType: postType as BlogPostType,
    publishedAt: publishedAt ? new Date(publishedAt) : undefined,
  };
}

export function mapBlogPostToDbModel(entity: Partial<BlogPost>): Partial<DbBlogPost> {
  const { publishedAt, ...rest } = entity;
  return {
    ...rest,
    publishedAt: publishedAt || null,
  };
}

export class BlogPostRepository {
  constructor(protected db: DbClient) {}

  async findById(id: string): Promise<BlogPost | null> {
    const result = await this.db.blogPost.findUnique({
      where: { id },
    });
    return result ? mapBlogPostToDomainEntity(result) : null;
  }

  async findBySlug(slug: string): Promise<BlogPost | null> {
    const result = await this.db.blogPost.findFirst({
      where: { slug },
    });
    return result ? mapBlogPostToDomainEntity(result) : null;
  }

  async findMany(options?: QueryOptions<BlogPost>): Promise<BlogPost[]> {
    const where = options?.filters ? buildWhereClause(options.filters) : {};
    const orderBy = options?.sort ? buildOrderByClause(options.sort) : [{ publishedAt: "desc" }];
    const skip =
      options?.pagination?.page && options?.pagination?.limit
        ? (options.pagination.page - 1) * options.pagination.limit
        : undefined;
    const take = options?.pagination?.limit;

    const blogPosts = await this.db.blogPost.findMany({
      where,
      orderBy,
      skip,
      take,
    });

    const images = await this.db.activeStorageAttachment.findMany({
      where: {
        recordType: "BlogPost",
        recordId: { in: blogPosts.map((blogPost) => blogPost.id) },
      },
      include: {
        blob: true,
      },
    });

    const domainBlogPosts = blogPosts.map((blogPost: DbBlogPost) => mapBlogPostToDomainEntity(blogPost));

    for (const blogPost of domainBlogPosts) {
      const imgUrls = images
        .filter((image) => image.recordId === blogPost.id)
        .map((image) => {
          return `https://bip-prod.s3.us-east-1.amazonaws.com/${image.blob.key}`;
        });
      blogPost.imageUrls = imgUrls;
    }
    return domainBlogPosts;
  }

  async create(data: Omit<BlogPost, "id" | "createdAt" | "updatedAt">): Promise<BlogPost> {
    const slug = slugify(data.title);
    console.log("data", data);
    console.log(data.userId);
    const result = await this.db.blogPost.create({
      data: {
        title: data.title,
        slug,
        state: data.state,
        postType: data.postType,
        blurb: data.blurb || null,
        content: data.content || null,
        publishedAt: data.publishedAt || null,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          connect: {
            id: data.userId,
          },
        },
      },
    });
    return mapBlogPostToDomainEntity(result);
  }

  async update(slug: string, data: Partial<BlogPost>): Promise<BlogPost> {
    const newSlug = data.title ? slugify(data.title) : undefined;
    const result = await this.db.blogPost.update({
      where: { slug },
      data: {
        title: data.title,
        slug: newSlug,
        state: data.state,
        postType: data.postType,
        blurb: data.blurb,
        content: data.content,
        publishedAt: data.publishedAt || null,
        updatedAt: new Date(),
      },
    });
    return mapBlogPostToDomainEntity(result);
  }

  async delete(id: string): Promise<boolean> {
    await this.db.blogPost.delete({
      where: { id },
    });
    return true;
  }
}
