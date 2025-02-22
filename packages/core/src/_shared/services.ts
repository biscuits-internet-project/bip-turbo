import type { Logger } from "@bip/domain";
import { SongPageComposer } from "../page-composers/song-page-composer";
import { SetlistService } from "../setlists/setlist-service";
import { ShowService } from "../shows/show-service";
import { TourDatesService } from "../shows/tour-dates-service";
import { SongService } from "../songs/song-service";
import { VenueService } from "../venues/venue-service";
import type { ServiceContainer } from "./container";
import type { RedisService } from "./redis";

export interface Services {
  shows: ShowService;
  songs: SongService;
  setlists: SetlistService;
  venues: VenueService;
  songPageComposer: SongPageComposer;
  tourDatesService: TourDatesService;
  redis: RedisService;
  logger: Logger;
}

export function createServices(container: ServiceContainer): Services {
  const redis = container.redis;
  return {
    shows: new ShowService(container.repositories.shows, container.logger),
    songs: new SongService(container.repositories.songs, container.logger),
    setlists: new SetlistService(container.repositories.setlists, container.logger),
    venues: new VenueService(container.repositories.venues, container.logger),
    songPageComposer: new SongPageComposer(container.db, container.repositories.songs),
    tourDatesService: new TourDatesService(redis),
    redis,
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
