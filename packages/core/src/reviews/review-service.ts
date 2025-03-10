import type { Logger, Review, ReviewMinimal } from "@bip/domain";
import type { QueryOptions } from "../_shared/database/types";
import type { ReviewRepository } from "./review-repository";

export class ReviewService {
  constructor(
    protected readonly repository: ReviewRepository,
    protected readonly logger: Logger,
  ) {}

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

  async create(data: Omit<Review, "id" | "createdAt" | "updatedAt">): Promise<ReviewMinimal> {
    return this.repository.create(data);
  }

  async update(id: string, data: Partial<Omit<Review, "id" | "createdAt" | "updatedAt">>): Promise<ReviewMinimal> {
    return this.repository.update(id, data);
  }

  async delete(id: string) {
    return this.repository.delete(id);
  }
}
