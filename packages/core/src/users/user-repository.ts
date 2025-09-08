import type { User, UserMinimal } from "@bip/domain";
import type { DbClient, DbUser } from "../_shared/database/models";
import { buildOrderByClause, buildWhereClause } from "../_shared/database/query-utils";
import type { QueryOptions } from "../_shared/database/types";

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  category: string;
  threshold: number;
}

export interface UserStats {
  user: User;
  reviewCount: number;
  attendanceCount: number;
  ratingCount: number;
  averageRating: number | null;
  badges: Badge[];
  communityScore: number;
  blogPostCount: number;
}

export function mapUserToDomainEntity(dbUser: DbUser): User {
  return {
    id: dbUser.id,
    username: dbUser.username ?? "",
    email: dbUser.email ?? "",
    avatarUrl: null, // TODO: Implement avatar storage
    createdAt: dbUser.createdAt,
    updatedAt: dbUser.updatedAt,
  };
}

export function mapUserToDbModel(entity: Partial<User>): Partial<DbUser> {
  return entity as Partial<DbUser>;
}

export function mapToUserMinimal(dbUser: DbUser): UserMinimal {
  return {
    id: dbUser.id,
    username: dbUser.username ?? "",
    avatarUrl: null, // TODO: Implement avatar storage
  };
}

export class UserRepository {
  constructor(private readonly db: DbClient) {}

  private calculateCommunityScore(
    reviewCount: number,
    attendanceCount: number,
    ratingCount: number,
    blogPostCount: number,
  ): number {
    // Purely activity-based scoring system (no base score, no caps)

    // Blog posts have the highest value (20 points each)
    const blogPostWeight = blogPostCount * 20;

    // Reviews are second highest (5 points each)
    const reviewWeight = reviewCount * 5;

    // Attendance is moderate (1 point each)
    const attendanceWeight = attendanceCount * 1;

    // Ratings are lower value (0.5 points each)
    const ratingWeight = ratingCount * 0.5;

    const totalScore = blogPostWeight + reviewWeight + attendanceWeight + ratingWeight;

    // No maximum cap - let scores grow indefinitely based on activity
    return Math.round(totalScore);
  }

  private calculateBadges(reviewCount: number, attendanceCount: number, ratingCount: number): Badge[] {
    console.log(`calculateBadges called with: ${reviewCount}, ${attendanceCount}, ${ratingCount}`);
    const badges: Badge[] = [];

    // Review badges - users can earn multiple badges in each category
    if (reviewCount >= 100)
      badges.push({ id: "top-reviewer", name: "Top Reviewer", emoji: "👑", category: "reviews", threshold: 100 });
    if (reviewCount >= 50)
      badges.push({ id: "review-machine", name: "Review Machine", emoji: "🎯", category: "reviews", threshold: 50 });
    if (reviewCount >= 25)
      badges.push({ id: "super-reviewer", name: "Super Reviewer", emoji: "📖", category: "reviews", threshold: 25 });
    if (reviewCount >= 10)
      badges.push({ id: "reviewer", name: "Reviewer", emoji: "🔍", category: "reviews", threshold: 10 });

    // Rating badges
    if (ratingCount >= 2500)
      badges.push({ id: "top-rater", name: "Top Rater", emoji: "💎", category: "ratings", threshold: 2500 });
    if (ratingCount >= 1000)
      badges.push({ id: "rating-expert", name: "Rating Expert", emoji: "⚡", category: "ratings", threshold: 1000 });
    if (ratingCount >= 500)
      badges.push({ id: "star-giver", name: "Star Giver", emoji: "🔥", category: "ratings", threshold: 500 });
    if (ratingCount >= 100)
      badges.push({ id: "rater", name: "Rater", emoji: "🎲", category: "ratings", threshold: 100 });

    // Attendance badges
    if (attendanceCount >= 75)
      badges.push({ id: "top-attender", name: "Top Attender", emoji: "👑", category: "attendance", threshold: 75 });
    if (attendanceCount >= 35)
      badges.push({ id: "veteran", name: "Veteran", emoji: "🔊", category: "attendance", threshold: 35 });
    if (attendanceCount >= 15)
      badges.push({ id: "regular", name: "Regular", emoji: "🎤", category: "attendance", threshold: 15 });
    if (attendanceCount >= 5)
      badges.push({ id: "noob", name: "Noob", emoji: "🎧", category: "attendance", threshold: 5 });

    // Sort badges by threshold descending (highest achievements first)
    return badges.sort((a, b) => b.threshold - a.threshold);
  }

  async findById(id: string): Promise<User | null> {
    const result = await this.db.user.findUnique({
      where: { id },
    });
    return result ? mapUserToDomainEntity(result) : null;
  }

  async findByIdWithRoles(id: string) {
    return this.db.user.findUnique({
      where: { id },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  async findBySlug(username: string): Promise<User | null> {
    const result = await this.db.user.findUnique({
      where: { username },
    });
    return result ? mapUserToDomainEntity(result) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.db.user.findUnique({
      where: { email },
    });
    return result ? mapUserToDomainEntity(result) : null;
  }

  async findMany(options?: QueryOptions<User>): Promise<User[]> {
    const where = options?.filters ? buildWhereClause(options.filters) : {};
    const orderBy = options?.sort ? buildOrderByClause(options.sort) : [{ createdAt: "desc" }];
    const skip =
      options?.pagination?.page && options?.pagination?.limit
        ? (options.pagination.page - 1) * options.pagination.limit
        : undefined;
    const take = options?.pagination?.limit;

    const results = await this.db.user.findMany({
      where,
      orderBy,
      skip,
      take,
    });

    return results.map((result: DbUser) => mapUserToDomainEntity(result));
  }

  private sanitizeUsername(username: string): string {
    // Remove special characters, spaces, and ensure lowercase
    return username
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, "")
      .substring(0, 50); // Limit length
  }

  async ensureUniqueUsername(baseUsername: string): Promise<string> {
    const sanitizedBase = this.sanitizeUsername(baseUsername);
    let username = sanitizedBase;
    let counter = 1;

    while (await this.findBySlug(username)) {
      username = `${sanitizedBase}${counter}`;
      counter++;
    }

    return username;
  }

  async create(data: { id?: string; email: string; username: string }): Promise<User> {
    // Ensure username is unique before creating
    const uniqueUsername = await this.ensureUniqueUsername(data.username);

    const result = await this.db.user.create({
      data: {
        id: data.id, // Use provided ID (from Supabase) or let Prisma generate one
        email: data.email,
        username: uniqueUsername,
        passwordDigest: "supabase_auth", // Placeholder for Supabase-managed users
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return mapUserToDomainEntity(result);
  }

  async findOrCreate(data: { id?: string; email: string; username: string }): Promise<User> {
    // First try to find by email
    const existing = await this.findByEmail(data.email);
    if (existing) {
      return existing;
    }

    // If not found, create new user
    return this.create(data);
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    try {
      const dbData = mapUserToDbModel(data);
      const result = await this.db.user.update({
        where: { id },
        data: dbData,
      });
      return mapUserToDomainEntity(result);
    } catch (_error) {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.db.user.delete({
        where: { id },
      });
      return true;
    } catch (_error) {
      return false;
    }
  }

  async getUserStats(userId?: string): Promise<UserStats[]> {
    console.log("DEBUG: getUserStats called with userId:", userId);
    const whereClause = userId ? { id: userId } : {};

    const users = await this.db.user.findMany({
      where: whereClause,
      include: {
        _count: {
          select: {
            reviews: true, // Count all reviews regardless of status
            attendances: true, // Attendances are binary, so all are valid
            ratings: {
              where: {
                value: {
                  gte: 1, // Only count ratings >= 1 (valid ratings)
                  lte: 5, // Only count ratings <= 5 (valid ratings)
                },
              },
            },
            blogPosts: {
              where: {
                state: "published", // Only count published blog posts
              },
            },
          },
        },
        ratings: {
          select: {
            value: true,
          },
          where: {
            value: {
              gte: 1,
              lte: 5,
            },
          },
        },
      },
    });

    return users.map((user) => {
      const averageRating =
        user.ratings.length > 0
          ? user.ratings.reduce((sum, rating) => sum + rating.value, 0) / user.ratings.length
          : null;

      const badges = this.calculateBadges(user._count.reviews, user._count.attendances, user._count.ratings);

      const communityScore = this.calculateCommunityScore(
        user._count.reviews,
        user._count.attendances,
        user._count.ratings,
        user._count.blogPosts,
      );

      // Debug: Check if methods are returning undefined
      console.log(`DEBUG: ${user.username} - badges result:`, badges);
      console.log(`DEBUG: ${user.username} - communityScore result:`, communityScore);
      console.log(`DEBUG: ${user.username} - blogPostCount:`, user._count.blogPosts);

      return {
        user: mapUserToDomainEntity(user),
        reviewCount: user._count.reviews,
        attendanceCount: user._count.attendances,
        ratingCount: user._count.ratings,
        averageRating,
        badges,
        communityScore,
        blogPostCount: user._count.blogPosts,
      };
    });
  }

  async getTopUsersByMetric(
    metric: "reviews" | "attendance" | "ratings" | "blogPostCount",
    limit: number = 10,
  ): Promise<UserStats[]> {
    const userStats = await this.getUserStats();

    // Filter out users with 0 count for the specific metric
    const filteredStats = userStats.filter((stats) => {
      switch (metric) {
        case "reviews":
          return stats.reviewCount > 0;
        case "attendance":
          return stats.attendanceCount > 0;
        case "ratings":
          return stats.ratingCount > 0;
        case "blogPostCount": {
          const hasBlogs = stats.blogPostCount > 0;
          console.log(`DEBUG: ${stats.user.username} - blogPostCount: ${stats.blogPostCount}, hasBlogs: ${hasBlogs}`);
          return hasBlogs;
        }
        default:
          return true;
      }
    });

    console.log(`DEBUG: For metric "${metric}", filtered ${userStats.length} users down to ${filteredStats.length}`);

    if (metric === "blogPostCount") {
      console.log(
        `DEBUG: Top bloggers after filter:`,
        filteredStats.slice(0, 3).map((s) => `${s.user.username}: ${s.blogPostCount}`),
      );
    }

    const sortedStats = filteredStats.sort((a, b) => {
      switch (metric) {
        case "reviews":
          return b.reviewCount - a.reviewCount;
        case "attendance":
          return b.attendanceCount - a.attendanceCount;
        case "ratings":
          return b.ratingCount - a.ratingCount;
        case "blogPostCount":
          return b.blogPostCount - a.blogPostCount;
        default:
          return 0;
      }
    });

    return sortedStats.slice(0, limit);
  }

  async getCommunityTotals(): Promise<{
    totalUsers: number;
    totalReviews: number;
    totalAttendances: number;
    totalRatings: number;
  }> {
    // Get total counts across all users with same filtering as user stats
    const [totalUsers, totalReviews, totalAttendances, totalRatings] = await Promise.all([
      this.db.user.count(),
      this.db.review.count(), // Count all reviews regardless of status
      this.db.attendance.count(),
      this.db.rating.count({
        where: {
          value: {
            gte: 1, // Only count valid ratings
            lte: 5,
          },
        },
      }),
    ]);

    return {
      totalUsers,
      totalReviews,
      totalAttendances,
      totalRatings,
    };
  }
}
