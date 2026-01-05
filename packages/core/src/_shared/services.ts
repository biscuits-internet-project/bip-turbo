import type { Logger } from "@bip/domain";
import { AnnotationService } from "../annotations/annotation-service";
import { AttendanceService } from "../attendances/attendance-service";
import { AuthorService } from "../authors/author-service";
import { BlogPostService } from "../blog-posts/blog-post-service";
import { FileService } from "../files/file-service";
import { SongPageComposer } from "../page-composers/song-page-composer";
import { RatingService } from "../ratings/rating-service";
import { ReviewService } from "../reviews/review-service";
import { PostgresSearchService } from "../search/postgres-search-service";
import { SearchHistoryService } from "../search/search-history-service";
import { SetlistService } from "../setlists/setlist-service";
import { ShowService } from "../shows/show-service";
import { TourDatesService } from "../shows/tour-dates-service";
import { SongService } from "../songs/song-service";
import { TrackService } from "../tracks/track-service";
import { UserService } from "../users/user-service";
import { VenueService } from "../venues/venue-service";
import type { CacheService, CloudflareCacheService } from "./cache";
import type { ServiceContainer } from "./container";
import type { RedisService } from "./redis";

export interface Services {
  annotations: AnnotationService;
  authors: AuthorService;
  blogPosts: BlogPostService;
  shows: ShowService;
  songs: SongService;
  tracks: TrackService;
  setlists: SetlistService;
  venues: VenueService;
  users: UserService;
  reviews: ReviewService;
  ratings: RatingService;
  attendances: AttendanceService;
  songPageComposer: SongPageComposer;
  tourDatesService: TourDatesService;
  files: FileService;
  postgresSearch: PostgresSearchService;
  searchHistory: SearchHistoryService;
  redis: RedisService;
  cache: CacheService;
  cloudflareCache: CloudflareCacheService;
  logger: Logger;
}

export function createServices(container: ServiceContainer): Services {
  // Create search services
  const searchHistoryService = new SearchHistoryService(container.db);
  const postgresSearchService = new PostgresSearchService(container.db, container.logger, searchHistoryService);

  // Create core services
  const songService = new SongService(container.db, container.logger);

  return {
    annotations: new AnnotationService(container.db, container.logger, container.cacheInvalidation),
    authors: new AuthorService(container.db, container.logger),
    blogPosts: new BlogPostService(container.db, container.redis, container.logger),
    shows: new ShowService(container.db, container.logger, container.cacheInvalidation),
    songs: songService,
    tracks: new TrackService(container.db, container.logger, container.cacheInvalidation),
    setlists: new SetlistService(container.db),
    venues: new VenueService(container.db, container.logger),
    users: new UserService(container.db, container.logger),
    reviews: new ReviewService(container.db, container.logger),
    ratings: new RatingService(container.db, container.cacheInvalidation),
    attendances: new AttendanceService(container.db, container.logger),
    songPageComposer: new SongPageComposer(container.db, songService),
    tourDatesService: new TourDatesService(container.redis),
    files: new FileService(container.db, container.logger, {
      accountId: container.env.CLOUDFLARE_ACCOUNT_ID,
      apiToken: container.env.CLOUDFLARE_IMAGES_API_TOKEN,
    }),
    postgresSearch: postgresSearchService,
    searchHistory: searchHistoryService,
    redis: container.redis,
    cache: container.cache,
    cloudflareCache: container.cloudflareCache,
    logger: container.logger,
  };
}

// Singleton instance
let services: Services | undefined;

export function getServices(container: ServiceContainer): Services {
  if (!services) {
    services = createServices(container);
  }
  return services;
}
