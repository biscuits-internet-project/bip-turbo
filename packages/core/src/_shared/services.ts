import type { Logger } from "@bip/domain";
import { SetlistService } from "../setlists/setlist-service";
import { ShowService } from "../shows/show-service";
import { SongService } from "../songs/song-service";
import { VenueService } from "../venues/venue-service";
import type { ServiceContainer } from "./container";
import type { RedisService } from "./redis";

export interface Services {
  shows: ShowService;
  songs: SongService;
  setlists: SetlistService;
  venues: VenueService;
  redis: RedisService;
  logger: Logger;
}

export function createServices(container: ServiceContainer): Services {
  return {
    shows: new ShowService(container.repositories.shows, container.logger),
    songs: new SongService(container.repositories.songs, container.logger),
    setlists: new SetlistService(container.repositories.setlists, container.logger),
    venues: new VenueService(container.repositories.venues, container.logger),
    redis: container.redis,
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
