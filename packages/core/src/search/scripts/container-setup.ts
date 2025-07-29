import { PrismaClient } from "@prisma/client";
import { createContainer } from "../../_shared/container";
import { Logger } from "@bip/domain";
import { EmbeddingService } from "../embedding-service";
import { SearchIndexService } from "../search-index-service";
import { SongContentFormatter } from "../content-formatters/song-content-formatter";
import { ShowContentFormatter } from "../content-formatters/show-content-formatter";
import { VenueContentFormatter } from "../content-formatters/venue-content-formatter";
import { TrackContentFormatter } from "../content-formatters/track-content-formatter";

// Simple console logger for scripts
const logger: Logger = {
  info: (message: string) => console.log(`ℹ️ ${message}`),
  warn: (message: string) => console.warn(`⚠️ ${message}`),
  error: (message: string) => console.error(`❌ ${message}`),
  debug: (message: string) => console.debug(`🐛 ${message}`),
};

// Environment setup
const env = {
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
};

// Create database connection
const db = new PrismaClient();

// Create the main container
const mainContainer = createContainer({ db, logger, env });

// Create search services
const embeddingService = new EmbeddingService(logger, env.OPENAI_API_KEY);
const searchIndexService = new SearchIndexService(
  mainContainer.repositories.searchIndex,
  embeddingService,
  logger
);

// Register content formatters
searchIndexService.registerContentFormatter(new SongContentFormatter());
searchIndexService.registerContentFormatter(new ShowContentFormatter());
searchIndexService.registerContentFormatter(new VenueContentFormatter());
searchIndexService.registerContentFormatter(new TrackContentFormatter());

// Export container with search services
export const container = {
  ...mainContainer,
  embeddingService: () => embeddingService,
  searchIndexService: () => searchIndexService,
  songRepository: () => mainContainer.repositories.songs,
  showRepository: () => mainContainer.repositories.shows,
  venueRepository: () => mainContainer.repositories.venues,
  trackRepository: () => mainContainer.repositories.tracks,
  songContentFormatter: () => new SongContentFormatter(),
  showContentFormatter: () => new ShowContentFormatter(),
  venueContentFormatter: () => new VenueContentFormatter(),
  trackContentFormatter: () => new TrackContentFormatter(),
};