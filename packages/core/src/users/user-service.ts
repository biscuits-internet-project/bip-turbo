import type { Logger, User } from "@bip/domain";
import type { UserRepository, UserStats } from "./user-repository";

export class UserService {
  constructor(
    protected readonly repository: UserRepository,
    protected readonly logger: Logger,
  ) {}

  async find(id: string): Promise<User | null> {
    return this.repository.findById(id);
  }

  async findMany(): Promise<User[]> {
    return this.repository.findMany();
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.repository.findBySlug(username);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findByEmail(email);
  }

  async create(data: { id?: string; email: string; username: string }): Promise<User> {
    return this.repository.create(data);
  }

  async findOrCreate(data: { id?: string; email: string; username: string }): Promise<User> {
    return this.repository.findOrCreate(data);
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    return this.repository.update(id, data);
  }

  async getUserStats(userId?: string): Promise<UserStats[]> {
    console.log("DEBUG: UserService.getUserStats called");
    try {
      const result = await this.repository.getUserStats(userId);
      console.log("DEBUG: Repository call succeeded, result length:", result.length);
      return result;
    } catch (error) {
      console.error("DEBUG: Repository call failed:", error);
      throw error;
    }
  }

  async getTopUsersByMetric(
    metric: "reviews" | "attendance" | "ratings" | "blogPostCount",
    limit: number = 10,
  ): Promise<UserStats[]> {
    return this.repository.getTopUsersByMetric(metric, limit);
  }

  async getCommunityTotals() {
    return this.repository.getCommunityTotals();
  }
}
