import { ShowService } from "../shows/show-service";
import { SongService } from "../songs/song-service";
import type { ServiceContainer } from "./container";

export interface Services {
  shows: ShowService;
  songs: SongService;
}

export function createServices(container: ServiceContainer): Services {
  return {
    shows: new ShowService(container.repositories.shows),
    songs: new SongService(container.repositories.songs),
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
