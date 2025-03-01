import type { BlogPost, Logger } from "@bip/domain";
import { BaseService } from "../_shared/base-service";
import type { DbBlogPost } from "../_shared/database/models";
import type { QueryOptions } from "../_shared/database/types";
import type { BlogPostRepository } from "./blog-post-repository";

export class BlogPostService extends BaseService<BlogPost, DbBlogPost> {
  constructor(
    protected readonly repository: BlogPostRepository,
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
    return this.repository.findMany(filter);
  }

  async delete(id: string) {
    return this.repository.delete(id);
  }
}
