import type { Logger } from "@bip/domain";
import type { RedisClientType } from "redis";
import { SetlistRepository } from "../setlists/setlist-repository";
import { ShowRepository } from "../shows/show-repository";
import { SongRepository } from "../songs/song-repository";
import { TrackRepository } from "../tracks/track-repository";
import { UserRepository } from "../users/user-repository";
import { VenueRepository } from "../venues/venue-repository";
import type { Database } from "./drizzle/client";
import type { Env } from "./env";
import { RedisService } from "./redis";

export interface ServiceContainer {
  db: Database;
  redis: RedisService;
  logger: Logger;
  repositories: {
    setlists: SetlistRepository;
    shows: ShowRepository;
    songs: SongRepository;
    tracks: TrackRepository;
    users: UserRepository;
    venues: VenueRepository;
  };
}

export interface ContainerArgs {
  db?: Database;
  logger: Logger;
  env: Env;
}

export function createContainer(args: ContainerArgs): ServiceContainer {
  const { db, env, logger } = args;

  if (!db) throw new Error("Database connection required for container initialization");
  if (!env) throw new Error("Environment required for container initialization");

  // Create repositories
  const repositories = {
    setlists: new SetlistRepository(db),
    shows: new ShowRepository(db),
    songs: new SongRepository(db),
    tracks: new TrackRepository(db),
    users: new UserRepository(db),
    venues: new VenueRepository(db),
  };

  const redis = new RedisService(env.REDIS_URL);

  return {
    db,
    redis,
    logger,
    repositories,
  };
}

// Singleton instance
let container: ServiceContainer | undefined;

export function getContainer(args: ContainerArgs): ServiceContainer {
  if (!container) {
    container = createContainer(args);
  }
  return container;
}
