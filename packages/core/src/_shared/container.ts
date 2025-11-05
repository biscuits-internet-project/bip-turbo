import type { Logger } from "@bip/domain";
import type { RedisClientType } from "redis";
import { AnnotationRepository } from "../annotations/annotation-repository";
import { AttendanceRepository } from "../attendances/attendance-repository";
import { BlogPostRepository } from "../blog-posts/blog-post-repository";
import { FileRepository } from "../files/file-repository";
import { RatingRepository } from "../ratings/rating-repository";
import { ReviewRepository } from "../reviews/review-repository";
import { SearchHistoryRepository } from "../search/search-history-repository";
import { SetlistRepository } from "../setlists/setlist-repository";
import { ShowRepository } from "../shows/show-repository";
import { SongRepository } from "../songs/song-repository";
import { TrackRepository } from "../tracks/track-repository";
import { UserRepository } from "../users/user-repository";
import { VenueRepository } from "../venues/venue-repository";
import { CacheInvalidationService, CacheService } from "./cache";
import type { DbClient } from "./database/models";
import type { Env } from "./env";
import { RedisService } from "./redis";

export interface ServiceContainer {
  db: DbClient;
  redis: RedisService;
  cache: CacheService;
  cacheInvalidation: CacheInvalidationService;
  logger: Logger;
  repositories: {
    annotations: AnnotationRepository;
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

  const redis = new RedisService(env.REDIS_URL);

  // Create cache services
  const cache = new CacheService(redis, logger);
  const cacheInvalidation = new CacheInvalidationService(cache, logger);

  // Create repositories
  const repositories = {
    annotations: new AnnotationRepository(db, cacheInvalidation),
    setlists: new SetlistRepository(db),
    shows: new ShowRepository(db, cacheInvalidation),
    songs: new SongRepository(db),
    tracks: new TrackRepository(db, cacheInvalidation),
    users: new UserRepository(db),
    venues: new VenueRepository(db),
    blogPosts: new BlogPostRepository(db),
    reviews: new ReviewRepository(db),
    ratings: new RatingRepository(db, cacheInvalidation),
    attendances: new AttendanceRepository(db),
    files: new FileRepository(db),
    searchHistories: new SearchHistoryRepository(db),
  };

  return {
    db,
    redis,
    cache,
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
