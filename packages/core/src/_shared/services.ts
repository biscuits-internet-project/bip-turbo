import type { Logger } from "@bip/domain";
import { SetlistService } from "../setlists/setlist-service";
import { ShowService } from "../shows/show-service";
import { SongService } from "../songs/song-service";
import { VenueService } from "../venues/venue-service";
import type { ServiceContainer } from "./container";

export interface Services {
  shows: ShowService;
  songs: SongService;
  setlists: SetlistService;
  venues: VenueService;
}

export function createServices(container: ServiceContainer, logger: Logger): Services {
  return {
    shows: new ShowService(container.repositories.shows, logger),
    songs: new SongService(container.repositories.songs, logger),
    setlists: new SetlistService(container.repositories.setlists, logger),
    venues: new VenueService(container.repositories.venues, logger),
  };
}

// Singleton instance
let services: Services | undefined;

export function getServices(container: ServiceContainer, logger: Logger): Services {
  if (!services) {
    services = createServices(container, logger);
  }
  return services;
}
