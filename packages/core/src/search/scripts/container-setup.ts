import type { Logger } from "@bip/domain";
import { PrismaClient } from "@prisma/client";
import { createContainer } from "../../_shared/container";
import { ShowContentFormatter } from "../content-formatters/show-content-formatter";
import { ShowVenueFormatter } from "../content-formatters/show-venue-formatter";
import { SongContentFormatter } from "../content-formatters/song-content-formatter";
import { TrackContentFormatter } from "../content-formatters/track-content-formatter";
import { TrackSongFormatter } from "../content-formatters/track-song-formatter";
import { VenueContentFormatter } from "../content-formatters/venue-content-formatter";
import { EmbeddingService } from "../embedding-service";
import { SearchIndexService } from "../search-index-service";

// Simple console logger for scripts
const logger: Logger = {
  info: (obj: string | object, msg?: string) => console.log(`ℹ️ ${obj} ${msg}`),
  warn: (obj: string | object, msg?: string) => console.warn(`⚠️ ${obj} ${msg}`),
  error: (obj: string | object, msg?: string) => console.error(`❌ ${obj} ${msg}`),
  debug: (obj: string | object, msg?: string) => console.debug(`🐛 ${obj} ${msg}`),
  fatal: (obj: string | object, msg?: string) => console.error(`💀 ${obj} ${msg}`),
  trace: (obj: string | object, msg?: string) => console.trace(`🔍 ${obj} ${msg}`),
  child: (_bindings: object) => logger,
};

// Environment setup
const env = {
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
};

// Create database connection
const db = new PrismaClient();

// Create the main container
const mainContainer = createContainer({ db, logger, env });

// Create search services
const embeddingService = new EmbeddingService(logger, env.OPENAI_API_KEY);
const searchIndexService = new SearchIndexService(mainContainer.repositories.searchIndex, embeddingService, logger);

// Register content formatters
searchIndexService.registerContentFormatter(new SongContentFormatter());
searchIndexService.registerContentFormatter(new ShowContentFormatter());
searchIndexService.registerContentFormatter(new ShowVenueFormatter());
searchIndexService.registerContentFormatter(new VenueContentFormatter());
searchIndexService.registerContentFormatter(new TrackContentFormatter());
searchIndexService.registerContentFormatter(new TrackSongFormatter());

// Export container with search services
export const container = {
  ...mainContainer,
  db: () => db, // Expose raw Prisma client for search indexing
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
