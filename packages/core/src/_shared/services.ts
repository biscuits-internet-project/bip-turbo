import type { Logger } from "@bip/domain";
import { AnnotationService } from "../annotations/annotation-service";
import { AttendanceService } from "../attendances/attendance-service";
import { AuthorService } from "../authors/author-service";
import { BlogPostService } from "../blog-posts/blog-post-service";
import { FileService } from "../files/file-service";
import { InstrumentService, MusicianService } from "../musicians/musician-service";
import { SongPageComposer } from "../page-composers/song-page-composer";
import { RatingService } from "../ratings/rating-service";
import { ReviewService } from "../reviews/review-service";
import { RockOperaService } from "../rock-operas/rock-opera-service";
import { PostgresSearchService } from "../search/postgres-search-service";
import { SearchHistoryService } from "../search/search-history-service";
import { SetlistService } from "../setlists/setlist-service";
import { ArchiveDotOrgService } from "../shows/archive-dot-org-service";
import { NugsService } from "../shows/nugs-service";
import { RelistenService } from "../shows/relisten-service";
import { ShowService } from "../shows/show-service";
import { TourDatesService } from "../shows/tour-dates-service";
import { YoutubeService } from "../shows/youtube-service";
import { SongService } from "../songs/song-service";
import { StatsService } from "../stats/stats-service";
import { TrackDurationService } from "../tracks/track-duration-service";
import { TrackService } from "../tracks/track-service";
import { PersonalSongHistoryService } from "../users/personal-song-history-service";
import { UserService } from "../users/user-service";
import { VenueService } from "../venues/venue-service";
import type { CacheService, CloudflareCacheService } from "./cache";
import type { CacheInvalidationService } from "./cache/cache-invalidation-service";
import type { ServiceContainer } from "./container";
import type { RedisService } from "./redis";

export interface Services {
  annotations: AnnotationService;
  authors: AuthorService;
  blogPosts: BlogPostService;
  instruments: InstrumentService;
  musicians: MusicianService;
  shows: ShowService;
  songs: SongService;
  stats: StatsService;
  tracks: TrackService;
  trackDurations: TrackDurationService;
  setlists: SetlistService;
  venues: VenueService;
  users: UserService;
  personalSongHistory: PersonalSongHistoryService;
  reviews: ReviewService;
  rockOperas: RockOperaService;
  ratings: RatingService;
  attendances: AttendanceService;
  songPageComposer: SongPageComposer;
  tourDatesService: TourDatesService;
  nugs: NugsService;
  relisten: RelistenService;
  archiveDotOrg: ArchiveDotOrgService;
  youtube: YoutubeService;
  files: FileService;
  postgresSearch: PostgresSearchService;
  searchHistory: SearchHistoryService;
  redis: RedisService;
  cache: CacheService;
  cacheInvalidation: CacheInvalidationService;
  cloudflareCache: CloudflareCacheService;
  logger: Logger;
}

export function createServices(container: ServiceContainer): Services {
  // Create search services
  const searchHistoryService = new SearchHistoryService(container.db);
  const postgresSearchService = new PostgresSearchService(container.db, container.logger, searchHistoryService);

  // Create core services
  const songService = new SongService(container.db, container.logger);
  // StatsService is constructed first so ShowService can hand it the
  // post-mutation rebuild dependency.
  const statsService = new StatsService(container.db, container.cache);
  // RockOperaService is constructed before SetlistService because every
  // setlist returned overlays rock opera annotations via a batched
  // lookup — SetlistService takes RockOperaService as a constructor dep.
  const rockOperaService = new RockOperaService(container.db, container.logger, statsService);

  // nugs/archive are shared by their own service slots and by the duration
  // resolver, which reads each source's per-show track lists.
  const nugsService = new NugsService(container.redis, container.logger);
  const archiveDotOrgService = new ArchiveDotOrgService(container.redis, container.logger);

  return {
    annotations: new AnnotationService(container.db, container.logger, container.cacheInvalidation),
    authors: new AuthorService(container.db, container.logger),
    blogPosts: new BlogPostService(container.db, container.redis, container.logger),
    instruments: new InstrumentService(container.db, container.logger),
    musicians: new MusicianService(container.db, container.logger),
    shows: new ShowService(container.db, container.logger, container.cacheInvalidation, statsService),
    songs: songService,
    stats: statsService,
    tracks: new TrackService(container.db, container.logger, container.cacheInvalidation),
    trackDurations: new TrackDurationService(
      container.db,
      nugsService,
      archiveDotOrgService,
      container.cacheInvalidation,
      container.logger,
    ),
    setlists: new SetlistService(container.db, rockOperaService),
    venues: new VenueService(container.db, container.logger),
    users: new UserService(container.db, container.logger),
    personalSongHistory: new PersonalSongHistoryService(container.db, container.cache),
    reviews: new ReviewService(container.db, container.logger),
    rockOperas: rockOperaService,
    ratings: new RatingService(container.db, container.cacheInvalidation),
    attendances: new AttendanceService(container.db, container.logger),
    songPageComposer: new SongPageComposer(container.db, songService, statsService),
    tourDatesService: new TourDatesService(container.redis),
    nugs: nugsService,
    relisten: new RelistenService(container.redis, container.logger),
    archiveDotOrg: archiveDotOrgService,
    youtube: new YoutubeService(container.db, container.cacheInvalidation),
    files: new FileService(container.db, container.logger, {
      accountId: container.env.CLOUDFLARE_ACCOUNT_ID,
      apiToken: container.env.CLOUDFLARE_IMAGES_API_TOKEN,
    }),
    postgresSearch: postgresSearchService,
    searchHistory: searchHistoryService,
    redis: container.redis,
    cache: container.cache,
    cacheInvalidation: container.cacheInvalidation,
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
