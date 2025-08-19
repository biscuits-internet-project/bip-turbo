import type { User } from "@bip/domain";
import { UserRound, Trophy, Star, Music, Calendar, Search, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { services } from "~/server/services";
import type { UserStats } from "@bip/core";
import { useState } from "react";

interface LoaderData {
  allUserStats: UserStats[];
  topReviewers: UserStats[];
  topAttenders: UserStats[];
  topRaters: UserStats[];
  topBloggers: UserStats[];
  communityTotals: {
    totalUsers: number;
    totalReviews: number;
    totalAttendances: number;
    totalRatings: number;
  };
  lastUpdated?: string | null;
}

export const loader = publicLoader<LoaderData>(async ({ request, context }) => {
  const cacheKey = "community-page-data";

  // Always try to get from cache first
  try {
    const redis = services.redis;
    const [cached, lastUpdated] = await Promise.all([
      redis.get<Omit<LoaderData, "lastUpdated">>(cacheKey),
      redis.get<string>("community-last-updated"),
    ]);

    if (cached) {
      console.log("Community data served from Redis cache");
      // Debug: Log a sample user to see what we got from cache
      if (cached.allUserStats && cached.allUserStats.length > 0) {
        console.log("Sample cached user stats:", JSON.stringify(cached.allUserStats[0], null, 2));
      }
      return {
        ...cached,
        lastUpdated,
      };
    }
  } catch (error) {
    console.error("Redis cache read failed for community page:", error);
  }

  // If no cache exists, return minimal fallback data
  // The cron job should populate the cache soon
  console.warn("No community cache found - returning minimal fallback data");

  // Still try to get the last updated timestamp even without cached data
  let lastUpdated: string | undefined;
  try {
    const redis = services.redis;
    lastUpdated = await redis.get<string>("community-last-updated") || undefined;
  } catch (error) {
    console.error("Failed to get last updated timestamp:", error);
  }

  return {
    allUserStats: [],
    topReviewers: [],
    topAttenders: [],
    topRaters: [],
    topBloggers: [],
    communityTotals: {
      totalUsers: 0,
      totalReviews: 0,
      totalAttendances: 0,
      totalRatings: 0,
    },
    lastUpdated,
  };
});

export function meta() {
  return [
    { title: "Community | Biscuits Internet Project" },
    {
      name: "description",
      content: "Meet the Disco Biscuits community - our most active reviewers, show-goers, and contributors.",
    },
  ];
}

function UserCard({ userStats }: { userStats: UserStats }) {
  const { user, reviewCount, attendanceCount, ratingCount, averageRating, communityScore, badges, blogPostCount } =
    userStats;

  // All scores use consistent brand color
  const getScoreColor = () => "text-brand-primary";

  // Show multiple badges (up to 3 for space)
  const displayBadges = badges?.slice(0, 3) || [];

  return (
    <Card className="glass-content hover:glass-content-hover transition-all duration-300">
      <CardContent className="p-4">
        {/* Header with avatar, username, and score */}
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage src={user.avatarUrl || undefined} />
            <AvatarFallback className="bg-brand-primary/20 text-brand-primary font-medium">
              {user.username?.slice(0, 2).toUpperCase() || "??"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <Link
              to={`/users/${user.username}`}
              className="text-brand-primary hover:text-brand-secondary font-medium transition-colors block"
            >
              {user.username}
            </Link>
          </div>
          <div className="flex-shrink-0">
            <Badge variant="default" className="bg-brand-primary text-white font-bold text-sm px-3 py-1">
              {communityScore || 0}
            </Badge>
          </div>
        </div>

        {/* Stats section with flexible layout */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-content-text-secondary">
            <div className="flex items-center gap-1.5">
              <UserRound className="h-3 w-3 flex-shrink-0" />
              <span>{reviewCount} reviews</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="h-3 w-3 flex-shrink-0" />
              <span>{ratingCount} ratings</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Music className="h-3 w-3 flex-shrink-0" />
              <span>{attendanceCount} shows</span>
            </div>
            {blogPostCount > 0 && (
              <div className="flex items-center gap-1.5">
                <FileText className="h-3 w-3 flex-shrink-0" />
                <span>{blogPostCount} posts</span>
              </div>
            )}
          </div>
          {averageRating && (
            <div className="flex items-center gap-1.5 text-sm text-content-text-secondary pt-1">
              <Trophy className="h-3 w-3 flex-shrink-0" />
              <span>{averageRating.toFixed(1)} avg rating</span>
            </div>
          )}
        </div>

        {/* Badges at the bottom */}
        {displayBadges.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-content-border/30">
            {displayBadges.map((badge) => (
              <div
                key={badge.id}
                className="inline-flex items-center gap-1 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 border border-brand-primary/20 rounded-full px-2 py-1 text-xs"
              >
                <span className="text-xs">{badge.emoji}</span>
                <span className="text-brand-primary font-medium text-xs">{badge.name}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function LeaderboardSection({
  title,
  users,
  icon: Icon,
  metric,
}: {
  title: string;
  users: UserStats[];
  icon: React.ComponentType<{ className?: string }>;
  metric: keyof Pick<UserStats, "reviewCount" | "attendanceCount" | "ratingCount" | "blogPostCount">;
}) {
  return (
    <Card className="card-premium">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Icon className="h-5 w-5 text-brand-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {users.map((userStats, index) => (
            <div key={userStats.user.id} className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 text-center">
                <Badge
                  variant={index === 0 ? "default" : "secondary"}
                  className={index === 0 ? "bg-brand-primary text-white" : ""}
                >
                  {index + 1}
                </Badge>
              </div>
              <Avatar className="h-8 w-8">
                <AvatarImage src={userStats.user.avatarUrl || undefined} />
                <AvatarFallback className="bg-brand-primary/20 text-brand-primary text-xs">
                  {userStats.user.username?.slice(0, 2).toUpperCase() || "??"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Link
                  to={`/users/${userStats.user.username}`}
                  className="text-content-text-primary hover:text-brand-primary font-medium transition-colors"
                >
                  {userStats.user.username}
                </Link>
              </div>
              <div className="text-brand-primary font-medium">{userStats[metric]}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function getTimeAgo(timestamp?: string): string {
  if (!timestamp) return "Never";

  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now.getTime() - past.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffHours >= 1) {
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  } else if (diffMinutes >= 1) {
    return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
  } else {
    return "Just now";
  }
}

export default function Community() {
  const { allUserStats, topReviewers, topAttenders, topRaters, topBloggers, communityTotals, lastUpdated } =
    useSerializedLoaderData<LoaderData>();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("score");

  // Filter users by search term
  const filteredUsers = allUserStats.filter((userStat) =>
    userStat.user.username?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Sort filtered users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case "score":
        return (b.communityScore || 0) - (a.communityScore || 0);
      case "reviews":
        return b.reviewCount - a.reviewCount;
      case "ratings":
        return b.ratingCount - a.ratingCount;
      case "attendance":
        return b.attendanceCount - a.attendanceCount;
      case "blogPosts":
        return b.blogPostCount - a.blogPostCount;
      case "username":
        return (a.user.username || "").localeCompare(b.user.username || "");
      default:
        return (b.communityScore || 0) - (a.communityScore || 0);
    }
  });

  // Sort by community score for top scores leaderboard
  const topCommunityScores = [...allUserStats]
    .sort((a, b) => (b.communityScore || 0) - (a.communityScore || 0))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="page-heading">BISCUITS COMMUNITY</h1>
        <p className="text-xl text-content-text-secondary mb-2">Community scores, badges, and leaderboards</p>
        <p className="text-sm text-content-text-secondary mb-6">Last calculated {getTimeAgo(lastUpdated || undefined)}</p>

        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="glass-content">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-brand-primary">{communityTotals.totalUsers}</div>
              <div className="text-sm text-content-text-secondary">Community Members</div>
            </CardContent>
          </Card>
          <Card className="glass-content">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-brand-secondary">{communityTotals.totalReviews}</div>
              <div className="text-sm text-content-text-secondary">Total Reviews</div>
            </CardContent>
          </Card>
          <Card className="glass-content">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-brand-tertiary">{communityTotals.totalRatings}</div>
              <div className="text-sm text-content-text-secondary">Ratings Given</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Top Community Scores */}
      <div className="mb-8">
        <Card className="card-premium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Trophy className="h-5 w-5 text-brand-primary" />
              Top Community Scores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topCommunityScores.map((userStats, index) => (
                <div key={userStats.user.id} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 text-center">
                    <Badge
                      variant={index === 0 ? "default" : "secondary"}
                      className={index === 0 ? "bg-brand-primary text-white" : ""}
                    >
                      {index + 1}
                    </Badge>
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userStats.user.avatarUrl || undefined} />
                    <AvatarFallback className="bg-brand-primary/20 text-brand-primary text-xs">
                      {userStats.user.username?.slice(0, 2).toUpperCase() || "??"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Link
                      to={`/users/${userStats.user.username}`}
                      className="text-content-text-primary hover:text-brand-primary font-medium transition-colors"
                    >
                      {userStats.user.username}
                    </Link>
                    {userStats.badges && userStats.badges.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {userStats.badges.slice(0, 2).map((badge) => (
                          <div
                            key={badge.id}
                            className="inline-flex items-center gap-0.5 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 border border-brand-primary/20 rounded-full px-1.5 py-0.5 text-xs"
                          >
                            <span className="text-xs">{badge.emoji}</span>
                            <span className="text-brand-primary font-medium text-xs">{badge.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <Badge variant="default" className="bg-brand-primary text-white font-bold text-sm px-3 py-1">
                      {userStats.communityScore || 0}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Leaderboards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8">
        <LeaderboardSection title="Top Reviewers" users={topReviewers} icon={UserRound} metric="reviewCount" />
        <LeaderboardSection title="Most Show Attendance" users={topAttenders} icon={Music} metric="attendanceCount" />
        <LeaderboardSection title="Most Ratings Given" users={topRaters} icon={Star} metric="ratingCount" />
        <LeaderboardSection title="Top Bloggers" users={topBloggers} icon={FileText} metric="blogPostCount" />
      </div>

      {/* All Users Grid */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-content-text-primary">All Community Members</h2>

          {/* Search and Sort Controls */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-content-text-secondary h-4 w-4" />
              <Input
                placeholder="Search usernames..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score">Score (Highest)</SelectItem>
                <SelectItem value="reviews">Reviews (Most)</SelectItem>
                <SelectItem value="ratings">Ratings (Most)</SelectItem>
                <SelectItem value="attendance">Shows (Most)</SelectItem>
                <SelectItem value="blogPosts">Blog Posts (Most)</SelectItem>
                <SelectItem value="username">Username (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="text-sm text-content-text-secondary mb-4">
          Showing {sortedUsers.length} of {allUserStats.length} community members
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedUsers.map((userStats) => (
            <UserCard key={userStats.user.id} userStats={userStats} />
          ))}
        </div>
      </div>
    </div>
  );
}
