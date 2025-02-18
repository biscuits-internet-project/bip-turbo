import { BandRepository } from "../bands/band-repository";
import { SetlistRepository } from "../setlists/setlist-repository";
import { ShowRepository } from "../shows/show-repository";
import { SongRepository } from "../songs/song-repository";
import { TrackRepository } from "../tracks/track-repository";
import { UserRepository } from "../users/user-repository";
import { VenueRepository } from "../venues/venue-repository";
import type { Database } from "./drizzle/client";

export interface ServiceContainer {
  db: Database;
  repositories: {
    bands: BandRepository;
    setlists: SetlistRepository;
    shows: ShowRepository;
    songs: SongRepository;
    tracks: TrackRepository;
    users: UserRepository;
    venues: VenueRepository;
  };
}

export function createContainer(db: Database): ServiceContainer {
  // Create repositories
  const repositories = {
    bands: new BandRepository(db),
    setlists: new SetlistRepository(db),
    shows: new ShowRepository(db),
    songs: new SongRepository(db),
    tracks: new TrackRepository(db),
    users: new UserRepository(db),
    venues: new VenueRepository(db),
  };

  return {
    db,
    repositories,
  };
}

// Singleton instance
let container: ServiceContainer | undefined;

export function getContainer(db?: Database): ServiceContainer {
  if (!container) {
    if (!db) throw new Error("Database connection required for container initialization");
    container = createContainer(db);
  }
  return container;
}
