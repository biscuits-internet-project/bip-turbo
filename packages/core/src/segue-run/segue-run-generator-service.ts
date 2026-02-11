import type { PrismaClient, Show, Track, Song } from "@prisma/client";
import type { Logger } from "@bip/domain";

type TrackWithSong = Track & {
  song: Song;
};

type ShowWithTracksAndSongs = Show & {
  tracks: TrackWithSong[];
};

interface SegueSequence {
  showId: string;
  set: string;
  trackIds: string[];
  sequence: string;
  length: number;
  searchText: string;
}

export class SegueRunGeneratorService {
  constructor(
    private readonly db: PrismaClient,
    private readonly logger: Logger
  ) {}

  /**
   * Generate SegueRuns for all shows in the database
   */
  async generateAllSegueRuns(): Promise<void> {
    this.logger.info("Starting SegueRun generation for all shows");

    const shows = await this.db.show.findMany({
      include: {
        tracks: {
          include: {
            song: true,
          },
          orderBy: [{ set: "asc" }, { position: "asc" }],
        },
      },
    });

    this.logger.info(`Processing ${shows.length} shows`);

    let totalGenerated = 0;
    for (const show of shows) {
      const count = await this.generateSegueRunsForShow(show);
      totalGenerated += count;
    }

    this.logger.info(`Generated ${totalGenerated} total SegueRuns`);
  }

  /**
   * Generate SegueRuns for a specific show
   */
  async generateSegueRunsForShow(show: ShowWithTracksAndSongs): Promise<number> {
    // Delete existing SegueRuns for this show
    await this.db.segueRun.deleteMany({
      where: { showId: show.id },
    });

    // Group tracks by set
    const tracksBySet = this.groupTracksBySet(show.tracks);
    
    const sequences: SegueSequence[] = [];
    
    for (const [set, tracks] of tracksBySet.entries()) {
      const setSequences = this.extractSegueSequences(show.id, set, tracks);
      sequences.push(...setSequences);
    }

    if (sequences.length === 0) {
      return 0;
    }

    // Create SegueRuns in bulk
    await this.db.segueRun.createMany({
      data: sequences.map(seq => ({
        showId: seq.showId,
        set: seq.set,
        trackIds: seq.trackIds,
        sequence: seq.sequence,
        length: seq.length,
        searchText: seq.searchText,
      })),
    });

    this.logger.debug(`Generated ${sequences.length} SegueRuns for show ${show.date}`);
    return sequences.length;
  }

  /**
   * Generate SegueRuns for shows in a date range
   */
  async generateSegueRunsForDateRange(startDate: string, endDate: string): Promise<void> {
    this.logger.info(`Generating SegueRuns for shows from ${startDate} to ${endDate}`);

    const shows = await this.db.show.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        tracks: {
          include: {
            song: true,
          },
          orderBy: [{ set: "asc" }, { position: "asc" }],
        },
      },
    });

    this.logger.info(`Processing ${shows.length} shows in date range`);

    let totalGenerated = 0;
    for (const show of shows) {
      const count = await this.generateSegueRunsForShow(show);
      totalGenerated += count;
    }

    this.logger.info(`Generated ${totalGenerated} SegueRuns for date range`);
  }

  /**
   * Group tracks by set
   */
  private groupTracksBySet(tracks: TrackWithSong[]): Map<string, TrackWithSong[]> {
    const tracksBySet = new Map<string, TrackWithSong[]>();
    
    for (const track of tracks) {
      if (!tracksBySet.has(track.set)) {
        tracksBySet.set(track.set, []);
      }
      const tracks = tracksBySet.get(track.set);
      if (tracks) {
        tracks.push(track);
      }
    }
    
    return tracksBySet;
  }

  /**
   * Extract segue sequences from a set of tracks
   */
  private extractSegueSequences(showId: string, set: string, tracks: TrackWithSong[]): SegueSequence[] {
    const sequences: SegueSequence[] = [];
    let currentSequence: {
      trackIds: string[];
      songTitles: string[];
    } | null = null;

    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i];
      const hasSegue = track.segue && track.segue !== "none" && track.segue !== "";

      if (hasSegue) {
        // Start or continue a sequence
        if (!currentSequence) {
          currentSequence = {
            trackIds: [track.id],
            songTitles: [track.song.title],
          };
        }
        
        // Add the next track if it exists
        if (i < tracks.length - 1) {
          const nextTrack = tracks[i + 1];
          currentSequence.trackIds.push(nextTrack.id);
          currentSequence.songTitles.push(nextTrack.song.title);
        }
      } else {
        // End of sequence
        if (currentSequence && currentSequence.trackIds.length >= 2) {
          // Create a SegueRun for sequences with 2+ songs
          const sequence = currentSequence.songTitles.join(" > ");
          sequences.push({
            showId,
            set,
            trackIds: currentSequence.trackIds,
            sequence,
            length: currentSequence.trackIds.length,
            searchText: sequence.toLowerCase(),
          });
        }
        currentSequence = null;
      }
    }

    // Handle sequence that goes to the end of the set
    if (currentSequence && currentSequence.trackIds.length >= 2) {
      const sequence = currentSequence.songTitles.join(" > ");
      sequences.push({
        showId,
        set,
        trackIds: currentSequence.trackIds,
        sequence,
        length: currentSequence.trackIds.length,
        searchText: sequence.toLowerCase(),
      });
    }

    return sequences;
  }

  /**
   * Update search vectors for all SegueRuns
   */
  async updateSearchVectors(): Promise<void> {
    this.logger.info("Updating search vectors for SegueRuns");

    await this.db.$executeRaw`
      UPDATE segue_runs
      SET search_vector = to_tsvector('english', unaccent(search_text))
      WHERE search_vector IS NULL OR search_text IS NOT NULL
    `;

    this.logger.info("Search vectors updated");
  }
}