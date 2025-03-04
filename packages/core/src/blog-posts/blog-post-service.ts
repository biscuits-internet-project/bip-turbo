import { type BlogPost, type Logger, blogPostSchema } from "@bip/domain";
import type { RedisClientType } from "redis";
import { BaseService } from "../_shared/base-service";
import type { DbBlogPost } from "../_shared/database/models";
import type { QueryOptions } from "../_shared/database/types";
import type { BlogPostRepository } from "./blog-post-repository";

const BLOG_POSTS_CACHE_KEY = "blog-posts";

export class BlogPostService extends BaseService<BlogPost, DbBlogPost> {
  constructor(
    protected readonly repository: BlogPostRepository,
    protected readonly redis: RedisClientType,
    logger: Logger,
  ) {
    super(repository, logger);
  }

  async findById(id: string) {
    return this.repository.findById(id);
  }

  async findBySlug(slug: string) {
    return this.repository.findBySlug(slug);
  }

  async findMany(filter: QueryOptions<BlogPost>) {
    const cachedBlogPosts = await this.redis.get(BLOG_POSTS_CACHE_KEY);
    if (cachedBlogPosts) {
      return JSON.parse(cachedBlogPosts) as BlogPost[];
    }
    const blogPosts = await this.repository.findMany(filter);
    await this.redis.set(BLOG_POSTS_CACHE_KEY, JSON.stringify(blogPosts), { EX: 60 * 60 * 24 });
    return blogPosts;
  }

  async delete(id: string) {
    return this.repository.delete(id);
  }
}
