import type { Logger } from "@bip/domain";
import type { RatingRepository } from "./rating-repository";

export class RatingService {
  constructor(
    private repository: RatingRepository,
    private logger: Logger,
  ) {}

  async findManyByUserIdAndRateableIds(userId: string, rateableIds: string[], rateableType: string) {
    return this.repository.findManyByUserIdAndRateableIds(userId, rateableIds, rateableType);
  }

  async upsert(data: { rateableId: string; rateableType: string; userId: string; value: number }) {
    return this.repository.upsert(data);
  }

  async getAverageForRateable(rateableId: string, rateableType: string): Promise<number | null> {
    return this.repository.getAverageForRateable(rateableId, rateableType);
  }

  async getByRateableIdAndUserId(rateableId: string, rateableType: string, userId: string) {
    return this.repository.getByRateableIdAndUserId(rateableId, rateableType, userId);
  }
}
