import type { Logger, Review, ReviewMinimal } from "@bip/domain";
import { BaseService } from "../_shared/base-service";
import type { DbReview } from "../_shared/database/models";
import type { QueryOptions } from "../_shared/database/types";
import type { ReviewRepository } from "./review-repository";

export class ReviewService extends BaseService<Review, DbReview> {
  constructor(
    protected readonly repository: ReviewRepository,
    logger: Logger,
  ) {
    super(repository, logger);
  }

  async findById(id: string) {
    return this.repository.findById(id);
  }

  async findByShowId(showId: string) {
    return await this.repository.findByShowId(showId);
  }

  async findByUserId(userId: string, options?: QueryOptions<Review>) {
    return this.repository.findByUserId(userId, options);
  }

  async findMany(options?: QueryOptions<Review>) {
    return this.repository.findMany(options);
  }

  async delete(id: string) {
    return this.repository.delete(id);
  }
}
