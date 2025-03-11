import type { BlogPost, Logger } from "@bip/domain";
import type { QueryOptions } from "../_shared/database/types";
import type { RedisService } from "../_shared/redis";
import type { BlogPostRepository } from "./blog-post-repository";

const BLOG_POSTS_CACHE_KEY = "blog-posts";

export class BlogPostService {
  constructor(
    protected readonly repository: BlogPostRepository,
    protected readonly redis: RedisService,
    protected readonly logger: Logger,
  ) {}

  async findById(id: string) {
    return this.repository.findById(id);
  }

  async findBySlug(slug: string) {
    return this.repository.findBySlug(slug);
  }

  async findMany(filter: QueryOptions<BlogPost>) {
    // const cachedBlogPosts = await this.redis.get<BlogPost[]>(BLOG_POSTS_CACHE_KEY);
    // if (cachedBlogPosts) {
    //   return cachedBlogPosts;
    // }
    const blogPosts = await this.repository.findMany(filter);
    await this.redis.set<BlogPost[]>(BLOG_POSTS_CACHE_KEY, blogPosts, { EX: 60 * 60 * 24 });
    return blogPosts;
  }

  async create(data: Omit<BlogPost, "id" | "createdAt" | "updatedAt">) {
    const blogPost = await this.repository.create(data);
    await this.redis.del(BLOG_POSTS_CACHE_KEY);
    return blogPost;
  }

  async update(slug: string, data: Partial<BlogPost>) {
    const blogPost = await this.repository.update(slug, data);
    await this.redis.del(BLOG_POSTS_CACHE_KEY);
    return blogPost;
  }

  async delete(id: string) {
    const result = await this.repository.delete(id);
    await this.redis.del(BLOG_POSTS_CACHE_KEY);
    return result;
  }
}
