import { ShowRepository } from "../../shows/show-repository";
import { SongRepository } from "../../songs/song-repository";
import { TrackRepository } from "../../tracks/track-repository";
import { UserRepository } from "../../users/user-repository";
import { VenueRepository } from "../../venues/venue-repository";
import type { Database } from "../drizzle/client";

export class RepositoryFactory {
  private readonly userRepository: UserRepository;
  private readonly showRepository: ShowRepository;
  private readonly songRepository: SongRepository;
  private readonly trackRepository: TrackRepository;
  private readonly venueRepository: VenueRepository;

  constructor(db: Database) {
    this.userRepository = new UserRepository(db);
    this.showRepository = new ShowRepository(db);
    this.songRepository = new SongRepository(db);
    this.trackRepository = new TrackRepository(db);
    this.venueRepository = new VenueRepository(db);
  }

  users() {
    return this.userRepository;
  }

  shows() {
    return this.showRepository;
  }

  songs() {
    return this.songRepository;
  }

  tracks() {
    return this.trackRepository;
  }

  venues() {
    return this.venueRepository;
  }
}

export type { Repository } from "./base";
export { UserRepository, ShowRepository, SongRepository, TrackRepository, VenueRepository };
