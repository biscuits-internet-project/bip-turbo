import type { ContentFormatter } from "./base-content-formatter";

interface Track {
  id: string;
  set: string;
  position: number;
  segue?: string | null;
  note?: string | null;
  allTimer?: boolean | null;
  song: {
    title: string;
  };
  annotations: Array<{
    desc: string;
  }>;
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

export class ShowSongIndividualFormatter implements ContentFormatter<{ show: Show; track: Track }> {
  entityType = "show";
  indexStrategy = "song_individual";

  generateDisplayText(data: { show: Show; track: Track }): string {
    const { show, track } = data;
    const songTitle = track.song.title;
    const showDate = show.date;
    const venue = show.venue?.name || "Unknown Venue";

    return `${songTitle} • ${showDate} • ${venue}`;
  }

  generateContent(data: { show: Show; track: Track }): string {
    const { show, track } = data;
    const parts: string[] = [];

    // Song title repeated for emphasis/weight
    parts.push(track.song.title);
    parts.push(track.song.title);
    parts.push(track.song.title);

    // Set indicators
    const setInfo = this.getSetInfo(track.set);
    parts.push(...setInfo);

    // Position markers
    const positionMarkers = this.getPositionMarkers(track, show.tracks);
    parts.push(...positionMarkers);

    // Annotations with repetition rules
    if (track.annotations && track.annotations.length > 0) {
      for (const annotation of track.annotations) {
        if (annotation.desc) {
          const desc = annotation.desc.toLowerCase();
          // Repeat these annotations for emphasis/weight
          if (desc === "inverted" || desc === "dyslexic") {
            parts.push(annotation.desc);
            parts.push(annotation.desc);
            parts.push(annotation.desc);
          } else {
            // Other annotations singular
            parts.push(annotation.desc);
          }
        }
      }
    }

    // Special markers
    if (track.allTimer) {
      parts.push("all-timer", "legendary", "must-hear");
    }

    return parts.join(" ");
  }

  private getSetInfo(setName: string): string[] {
    const parts: string[] = [];
    const lower = setName.toLowerCase();

    if (lower.includes("e") || lower === "encore") {
      parts.push("Encore", "E", "encore");
    } else if (lower === "1") {
      parts.push("Set 1", "S1", "first set");
    } else if (lower === "2") {
      parts.push("Set 2", "S2", "second set");
    } else {
      parts.push(`Set ${setName}`, `S${setName}`);
    }

    return parts;
  }

  private getPositionMarkers(track: Track, allTracks: Track[]): string[] {
    const markers: string[] = [];

    // Sort tracks to understand positions
    const sortedTracks = [...allTracks].sort((a, b) => {
      if (a.set !== b.set) return a.set.localeCompare(b.set);
      return a.position - b.position;
    });

    const tracksInSet = sortedTracks.filter((t) => t.set === track.set);
    const isFirstInSet = tracksInSet[0]?.id === track.id;
    const isLastInSet = tracksInSet[tracksInSet.length - 1]?.id === track.id;
    const isFirstInShow = sortedTracks[0]?.id === track.id;
    const isLastInShow = sortedTracks[sortedTracks.length - 1]?.id === track.id;

    if (isFirstInShow) {
      markers.push("show opener");
    }

    if (isLastInShow) {
      markers.push("show closer");
    }

    if (isFirstInSet) {
      markers.push("set opener");
    }

    if (isLastInSet) {
      markers.push("set closer");
    }

    if (track.set.toLowerCase().includes("e") || track.set.toLowerCase() === "encore") {
      markers.push("encore");
    }

    return markers;
  }
}
