import type { ContentFormatter } from "./base-content-formatter";

interface Track {
  id: string;
  set: string;
  position: number;
  segue?: string | null;
  song: {
    title: string;
  };
}

interface Show {
  id: string;
  date: string;
  slug?: string | null;
  venue: {
    name: string | null;
    city: string | null;
    state?: string | null;
    country?: string | null;
  } | null;
  tracks: Track[];
}

interface SegueSequence {
  songs: string[];
  segueSymbols: string[];
}

export class ShowSegueSequenceFormatter implements ContentFormatter<{ show: Show; sequence: SegueSequence }> {
  entityType = "show";
  indexStrategy = "segue_sequence";

  generateDisplayText(data: { show: Show; sequence: SegueSequence }): string {
    const { show, sequence } = data;
    const showDate = show.date;
    const venue = show.venue?.name || "Unknown Venue";
    const sequenceText = this.buildSequenceText(sequence);

    return `${sequenceText} • ${showDate} • ${venue}`;
  }

  generateContent(data: { show: Show; sequence: SegueSequence }): string {
    const { sequence } = data;

    // Format: "Song A > Song B > Song C"
    return this.buildSequenceText(sequence);
  }

  private buildSequenceText(sequence: SegueSequence): string {
    const parts: string[] = [];

    for (let i = 0; i < sequence.songs.length; i++) {
      parts.push(sequence.songs[i]);

      // Add segue symbol if not the last song
      if (i < sequence.songs.length - 1) {
        parts.push(sequence.segueSymbols[i] || ">");
      }
    }

    return parts.join(" ");
  }

  // Static method to extract segue sequences from a show
  static extractSegueSequences(show: Show): SegueSequence[] {
    const sequences: SegueSequence[] = [];

    // Sort tracks by set and position
    const sortedTracks = [...show.tracks].sort((a, b) => {
      if (a.set !== b.set) return a.set.localeCompare(b.set);
      return a.position - b.position;
    });

    // Group tracks by set
    const tracksBySet = new Map<string, Track[]>();
    for (const track of sortedTracks) {
      if (!tracksBySet.has(track.set)) {
        tracksBySet.set(track.set, []);
      }
      const setTracks = tracksBySet.get(track.set);
      if (setTracks) {
        setTracks.push(track);
      }
    }

    // Find sequences in each set
    const setTrackArrays = Array.from(tracksBySet.values());
    for (const setTracks of setTrackArrays) {
      const setSequences = ShowSegueSequenceFormatter.findSequencesInSet(setTracks);
      sequences.push(...setSequences);
    }

    return sequences;
  }

  private static findSequencesInSet(tracks: Track[]): SegueSequence[] {
    const sequences: SegueSequence[] = [];
    let currentSequence: SegueSequence | null = null;

    for (let i = 0; i < tracks.length; i++) {
      const currentTrack = tracks[i];
      const hasSegue = currentTrack.segue && currentTrack.segue !== "none";

      if (hasSegue && i < tracks.length - 1) {
        // Start or continue a sequence
        if (!currentSequence) {
          currentSequence = {
            songs: [currentTrack.song.title],
            segueSymbols: [],
          };
        }

        // Add the next song and the segue symbol
        currentSequence.songs.push(tracks[i + 1].song.title);
        currentSequence.segueSymbols.push(ShowSegueSequenceFormatter.normalizeSegueSymbol(currentTrack.segue || ">"));
      } else {
        // End of sequence (or no segue)
        if (currentSequence && currentSequence.songs.length >= 3) {
          // Only keep sequences with 3+ songs
          sequences.push(currentSequence);
        }
        currentSequence = null;
      }
    }

    // Handle sequence that goes to the end of the set
    if (currentSequence && currentSequence.songs.length >= 3) {
      sequences.push(currentSequence);
    }

    return sequences;
  }

  private static normalizeSegueSymbol(segue: string): string {
    // Preserve segue notation as stored in database
    return segue || ">";
  }
}
