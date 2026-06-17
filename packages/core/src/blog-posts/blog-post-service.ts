import type { BlogPost, BlogPostState, BlogPostType, Logger } from "@bip/domain";
import type { DbBlogPost, DbClient } from "../_shared/database/models";
import { buildOrderByClause, buildWhereClause } from "../_shared/database/query-utils";
import type { QueryOptions } from "../_shared/database/types";
import type { RedisService } from "../_shared/redis";
import { slugify } from "../_shared/utils/slugify";

const BLOG_POSTS_CACHE_KEY = "blog-posts";

// Mapper function
function mapBlogPostToDomainEntity(dbBlogPost: DbBlogPost): BlogPost {
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

export class BlogPostService {
  constructor(
    protected readonly db: DbClient,
    protected readonly redis: RedisService,
    protected readonly logger: Logger,
  ) {}

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

  async findBySlugWithFiles(slug: string) {
    const result = await this.db.blogPost.findFirst({
      where: { slug },
      include: {
        files: {
          include: {
            file: true,
          },
        },
      },
    });

    if (!result) return null;

    const files = result.files || [];
    const coverFile = files.find((f: Record<string, unknown>) => f.isCover);

    const getCloudflareUrl = (file: Record<string, unknown>): string => {
      const variants = file.variants as Record<string, string> | null;
      return variants?.public || Object.values(variants || {})[0] || "";
    };

    const coverImage = coverFile ? getCloudflareUrl(coverFile.file as Record<string, unknown>) : undefined;

    const imageUrls = files
      .map((f: Record<string, unknown>) => getCloudflareUrl(f.file as Record<string, unknown>))
      .filter(Boolean);

    return {
      ...mapBlogPostToDomainEntity(result),
      coverImage,
      imageUrls,
    };
  }

  async findMany(options: QueryOptions<BlogPost>): Promise<BlogPost[]> {
    // const cachedBlogPosts = await this.redis.get<BlogPost[]>(BLOG_POSTS_CACHE_KEY);
    // if (cachedBlogPosts) {
    //   return cachedBlogPosts;
    // }

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
      include: {
        files: {
          include: {
            file: true,
          },
        },
      },
    });

    const getCloudflareUrl = (file: Record<string, unknown>): string => {
      const variants = file.variants as Record<string, string> | null;
      return variants?.public || Object.values(variants || {})[0] || "";
    };

    const domainBlogPosts = blogPosts.map((blogPost) => {
      const files = (blogPost.files as Record<string, unknown>[]) || [];
      const imageUrls = files
        .map((f: Record<string, unknown>) => getCloudflareUrl(f.file as Record<string, unknown>))
        .filter(Boolean);

      return {
        ...mapBlogPostToDomainEntity(blogPost),
        imageUrls,
      };
    });

    await this.redis.set<BlogPost[]>(BLOG_POSTS_CACHE_KEY, domainBlogPosts, { EX: 60 * 60 * 24 });
    return domainBlogPosts;
  }

  async findManyWithUser(options: QueryOptions<BlogPost>) {
    // For now, skip caching when we need user data
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
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        files: {
          include: {
            file: true,
          },
        },
      },
    });

    const domainBlogPosts = blogPosts.map((blogPost: Record<string, unknown>) => {
      const files = (blogPost.files as Record<string, unknown>[]) || [];
      const coverFile = files.find((f: Record<string, unknown>) => f.isCover);

      const getCloudflareUrl = (file: Record<string, unknown>): string => {
        const variants = file.variants as Record<string, string> | null;
        return variants?.public || Object.values(variants || {})[0] || "";
      };

      const coverImage = coverFile ? getCloudflareUrl(coverFile.file as Record<string, unknown>) : undefined;

      const imageUrls = files
        .map((f: Record<string, unknown>) => getCloudflareUrl(f.file as Record<string, unknown>))
        .filter(Boolean);

      return {
        ...mapBlogPostToDomainEntity(blogPost as DbBlogPost),
        user: blogPost.user as { id: string; username: string; avatarUrl: string | null },
        coverImage,
        imageUrls,
      };
    });

    return domainBlogPosts;
  }

  async create(data: Omit<BlogPost, "id" | "createdAt" | "updatedAt">): Promise<BlogPost> {
    const slug = slugify(data.title);
    this.logger?.info("Creating blog post", { data, userId: data.userId });
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

    await this.redis.del(BLOG_POSTS_CACHE_KEY);
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

    await this.redis.del(BLOG_POSTS_CACHE_KEY);
    return mapBlogPostToDomainEntity(result);
  }

  async delete(id: string): Promise<boolean> {
    await this.db.blogPost.delete({
      where: { id },
    });

    await this.redis.del(BLOG_POSTS_CACHE_KEY);
    return true;
  }

  /**
   * Sync export: page through PUBLISHED blog posts for the local sync script,
   * with the cover image embedded so the sync can mirror the File +
   * BlogPostToFile rows the `/blog` cards render. Only published posts travel
   * (drafts aren't shown publicly). PII-free — `userId` resolves to a stub
   * locally; the cover File carries only its Cloudflare variants/filename/type.
   * Cursor + ordering match the rating/review sync: (updatedAt ASC, id ASC).
   */
  async listForSync(opts: {
    since: Date;
    cursorId?: string;
    cursorUpdatedAt?: Date;
    limit: number;
  }): Promise<BlogPostForSync[]> {
    const { since, cursorId, cursorUpdatedAt, limit } = opts;
    const cursorWhere = cursorUpdatedAt
      ? {
          OR: [
            { updatedAt: { gt: cursorUpdatedAt } },
            { AND: [{ updatedAt: cursorUpdatedAt }, { id: { gt: cursorId ?? "" } }] },
          ],
        }
      : { updatedAt: { gt: since } };
    const rows = await this.db.blogPost.findMany({
      where: { AND: [{ state: "published" }, cursorWhere] },
      orderBy: [{ updatedAt: "asc" }, { id: "asc" }],
      take: limit,
      select: {
        id: true,
        slug: true,
        title: true,
        blurb: true,
        content: true,
        state: true,
        postType: true,
        publishedAt: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        files: {
          where: { isCover: true },
          select: {
            file: {
              select: {
                cloudflareId: true,
                path: true,
                filename: true,
                size: true,
                type: true,
                variants: true,
                metadata: true,
              },
            },
          },
        },
      },
    });
    return rows.map((row) => {
      const { files, ...rest } = row;
      // Only a cover with a Cloudflare id is mirrorable (cloudflareId is the
      // stable cross-env file key); legacy files without one are dropped.
      const cover = files.map((f) => f.file).find((f) => f.cloudflareId !== null) ?? null;
      return {
        ...rest,
        coverFile: cover
          ? {
              cloudflareId: cover.cloudflareId as string,
              path: cover.path,
              filename: cover.filename,
              size: cover.size,
              type: cover.type,
              variants: cover.variants,
              metadata: cover.metadata,
            }
          : null,
      };
    });
  }

  async listAllIdsForSync(): Promise<string[]> {
    const rows = await this.db.blogPost.findMany({ where: { state: "published" }, select: { id: true } });
    return rows.map((r) => r.id);
  }
}

export interface BlogPostForSyncFile {
  cloudflareId: string;
  path: string;
  filename: string;
  size: number;
  type: string;
  variants: unknown;
  metadata: unknown;
}

export interface BlogPostForSync {
  id: string;
  slug: string;
  title: string;
  blurb: string | null;
  content: string | null;
  state: string;
  postType: string;
  publishedAt: Date | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  coverFile: BlogPostForSyncFile | null;
}
