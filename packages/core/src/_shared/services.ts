import type { Logger } from "@bip/domain";
import { AnnotationService } from "../annotations/annotation-service";
import { AttendanceService } from "../attendances/attendance-service";
import { AuthorService } from "../authors/author-service";
import { BlogPostService } from "../blog-posts/blog-post-service";
import { FileService } from "../files/file-service";
import { ModerationService } from "../moderation/moderation-service";
import { NotificationService } from "../notifications/notification-service";
import { SongPageComposer } from "../page-composers/song-page-composer";
import { PostService } from "../posts/post-service";
import { RatingService } from "../ratings/rating-service";
import { ReviewService } from "../reviews/review-service";
import { VoteRepository } from "../votes/vote-repository";
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
  posts: PostService;
  notifications: NotificationService;
  votes: VoteRepository;
  moderation: ModerationService;
  redis: RedisService;
  cache: CacheService;
  cloudflareCache: CloudflareCacheService;
  logger: Logger;
}

export function createServices(container: ServiceContainer): Services {
  // Create search services
  const searchHistoryService = new SearchHistoryService(container.repositories.searchHistories);
  const postgresSearchService = new PostgresSearchService(container.db, container.logger, searchHistoryService);

  // Create notification and post services
  const notificationService = new NotificationService(container.repositories.notifications);
  const postService = new PostService(container.repositories.posts, notificationService);
  const moderationService = new ModerationService(
    container.repositories.contentFlags,
    container.repositories.posts,
    notificationService,
  );

  return {
    annotations: new AnnotationService(container.repositories.annotations, container.logger),
    authors: new AuthorService(container.repositories.authors, container.logger),
    blogPosts: new BlogPostService(container.repositories.blogPosts, container.redis, container.logger),
    shows: new ShowService(container.repositories.shows, container.logger),
    songs: new SongService(container.repositories.songs, container.logger),
    tracks: new TrackService(container.repositories.tracks, container.logger),
    setlists: new SetlistService(container.repositories.setlists),
    venues: new VenueService(container.repositories.venues, container.logger),
    users: new UserService(container.repositories.users, container.logger),
    reviews: new ReviewService(container.repositories.reviews, container.logger),
    ratings: new RatingService(container.repositories.ratings),
    attendances: new AttendanceService(container.repositories.attendances, container.logger),
    songPageComposer: new SongPageComposer(container.db, container.repositories.songs),
    tourDatesService: new TourDatesService(container.redis),
    files: new FileService(container.repositories.files, container.logger, {
      accountId: container.env.CLOUDFLARE_ACCOUNT_ID,
      apiToken: container.env.CLOUDFLARE_IMAGES_API_TOKEN,
    }),
    postgresSearch: postgresSearchService,
    posts: postService,
    notifications: notificationService,
    votes: container.repositories.votes,
    moderation: moderationService,
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
