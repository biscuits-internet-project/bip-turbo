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

interface SeguePair {
  songA: string;
  songB: string;
  segueSymbol: string;
}

export class ShowSeguePairFormatter implements ContentFormatter<{ show: Show; pair: SeguePair }> {
  entityType = "show";
  indexStrategy = "segue_pair";

  generateDisplayText(data: { show: Show; pair: SeguePair }): string {
    const { show, pair } = data;
    const showDate = show.date;
    const venue = show.venue?.name || "Unknown Venue";

    return `${pair.songA} ${pair.segueSymbol} ${pair.songB} • ${showDate} • ${venue}`;
  }

  generateContent(data: { show: Show; pair: SeguePair }): string {
    const { pair } = data;

    // Simple format: "Song A > Song B"
    return `${pair.songA} ${pair.segueSymbol} ${pair.songB}`;
  }

  // Static method to extract segue pairs from a show
  static extractSeguePairs(show: Show): SeguePair[] {
    const pairs: SeguePair[] = [];

    // Sort tracks by set and position
    const sortedTracks = [...show.tracks].sort((a, b) => {
      if (a.set !== b.set) return a.set.localeCompare(b.set);
      return a.position - b.position;
    });

    for (let i = 0; i < sortedTracks.length - 1; i++) {
      const currentTrack = sortedTracks[i];
      const nextTrack = sortedTracks[i + 1];

      // Only create pairs if there's a segue and they're in the same set
      if (currentTrack.segue && currentTrack.segue !== "none" && currentTrack.set === nextTrack.set) {
        pairs.push({
          songA: currentTrack.song.title,
          songB: nextTrack.song.title,
          segueSymbol: ShowSeguePairFormatter.normalizeSegueSymbol(currentTrack.segue),
        });
      }
    }

    return pairs;
  }

  private static normalizeSegueSymbol(segue: string): string {
    // Preserve segue notation as stored in database
    // Common formats: '>', '->', '=>', etc.
    return segue || ">";
  }
}
