import type { Logger } from "@bip/domain";
import type { RedisClientType } from "redis";
import { AnnotationRepository } from "../annotations/annotation-repository";
import { AttendanceRepository } from "../attendances/attendance-repository";
import { AuthorRepository } from "../authors/author-repository";
import { BlogPostRepository } from "../blog-posts/blog-post-repository";
import { FileRepository } from "../files/file-repository";
import { ContentFlagRepository } from "../moderation/content-flag-repository";
import { NotificationRepository } from "../notifications/notification-repository";
import { PostRepository } from "../posts/post-repository";
import { RatingRepository } from "../ratings/rating-repository";
import { ReviewRepository } from "../reviews/review-repository";
import { SearchHistoryRepository } from "../search/search-history-repository";
import { VoteRepository } from "../votes/vote-repository";
import { SetlistRepository } from "../setlists/setlist-repository";
import { ShowRepository } from "../shows/show-repository";
import { SongRepository } from "../songs/song-repository";
import { TrackRepository } from "../tracks/track-repository";
import { UserRepository } from "../users/user-repository";
import { VenueRepository } from "../venues/venue-repository";
import { CacheInvalidationService, CacheService, CloudflareCacheService } from "./cache";
import type { DbClient } from "./database/models";
import type { Env } from "./env";
import { RedisService } from "./redis";

export interface ServiceContainer {
  db: DbClient;
  env: Env;
  redis: RedisService;
  cache: CacheService;
  cloudflareCache: CloudflareCacheService;
  cacheInvalidation: CacheInvalidationService;
  logger: Logger;
  repositories: {
    annotations: AnnotationRepository;
    authors: AuthorRepository;
    setlists: SetlistRepository;
    shows: ShowRepository;
    songs: SongRepository;
    tracks: TrackRepository;
    users: UserRepository;
    venues: VenueRepository;
    blogPosts: BlogPostRepository;
    reviews: ReviewRepository;
    ratings: RatingRepository;
    attendances: AttendanceRepository;
    files: FileRepository;
    searchHistories: SearchHistoryRepository;
    posts: PostRepository;
    votes: VoteRepository;
    notifications: NotificationRepository;
    contentFlags: ContentFlagRepository;
  };
}

export interface ContainerArgs {
  db?: DbClient;
  logger: Logger;
  env: Env;
  redis?: RedisClientType;
}

export function createContainer(args: ContainerArgs): ServiceContainer {
  const { db, env, logger } = args;

  if (!db) throw new Error("Database connection required for container initialization");
  if (!env) throw new Error("Environment required for container initialization");

  const redis = new RedisService(env.REDIS_URL, logger);

  // Create cache services
  const cache = new CacheService(redis, logger);
  const cloudflareCache = new CloudflareCacheService(
    {
      zoneId: env.CLOUDFLARE_ZONE_ID,
      apiToken: env.CLOUDFLARE_CACHE_PURGE_TOKEN,
    },
    logger,
  );
  const cacheInvalidation = new CacheInvalidationService(cache, logger, cloudflareCache);

  // Create repositories
  const repositories = {
    annotations: new AnnotationRepository(db, cacheInvalidation, logger),
    authors: new AuthorRepository(db),
    setlists: new SetlistRepository(db),
    shows: new ShowRepository(db, cacheInvalidation, logger),
    songs: new SongRepository(db),
    tracks: new TrackRepository(db, cacheInvalidation, logger),
    users: new UserRepository(db, logger),
    venues: new VenueRepository(db),
    blogPosts: new BlogPostRepository(db, logger),
    reviews: new ReviewRepository(db),
    ratings: new RatingRepository(db, cacheInvalidation),
    attendances: new AttendanceRepository(db),
    files: new FileRepository(db, logger),
    searchHistories: new SearchHistoryRepository(db),
    posts: new PostRepository(db),
    votes: new VoteRepository(db),
    notifications: new NotificationRepository(db),
    contentFlags: new ContentFlagRepository(db),
  };

  return {
    db,
    env,
    redis,
    cache,
    cloudflareCache,
    cacheInvalidation,
    logger,
    repositories,
  };
}

// Singleton instance
let container: ServiceContainer | undefined;

export function getContainer(args: ContainerArgs): ServiceContainer {
  if (!container) {
    container = createContainer(args);
  }
  return container;
}
