import type { BlogPost, BlogPostState, BlogPostType } from "@bip/domain";
import { BaseRepository } from "../_shared/database/base-repository";
import type { DbBlogPost } from "../_shared/database/models";
import type { QueryOptions } from "../_shared/database/types";

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
  return entity as Partial<DbBlogPost>;
}

export class BlogPostRepository extends BaseRepository<BlogPost, DbBlogPost> {
  protected modelName = "blogPost" as const;

  protected mapToDomainEntity(dbBlogPost: DbBlogPost): BlogPost {
    return mapBlogPostToDomainEntity(dbBlogPost);
  }

  protected mapToDbModel(entity: Partial<BlogPost>): Partial<DbBlogPost> {
    return mapBlogPostToDbModel(entity);
  }

  async findById(id: string): Promise<BlogPost | null> {
    const result = await this.db.blogPost.findUnique({
      where: { id },
    });
    return result ? this.mapToDomainEntity(result) : null;
  }

  async findBySlug(slug: string): Promise<BlogPost | null> {
    const result = await this.db.blogPost.findFirst({
      where: { slug },
    });
    return result ? this.mapToDomainEntity(result) : null;
  }

  async findMany(options?: QueryOptions<BlogPost>): Promise<BlogPost[]> {
    const where = options?.filters ? this.buildWhereClause(options.filters) : {};
    const orderBy = options?.sort ? this.buildOrderByClause(options.sort) : [{ publishedAt: "desc" }];
    const skip =
      options?.pagination?.page && options?.pagination?.limit
        ? (options.pagination.page - 1) * options.pagination.limit
        : undefined;
    const take = options?.pagination?.limit;

    const results = await this.db.blogPost.findMany({
      where,
      orderBy,
      skip,
      take,
    });

    return results.map((result: DbBlogPost) => this.mapToDomainEntity(result));
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.db.blogPost.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
