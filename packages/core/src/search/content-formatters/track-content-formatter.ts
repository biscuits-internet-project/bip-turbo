import type { ContentFormatter } from "./base-content-formatter";

// Helper function to safely cast track data
function asTrack(track: Record<string, unknown>) {
  return track as {
    song?: { title?: string; author?: { name?: string }; cover?: boolean; timesPlayed?: number };
    show?: {
      date?: string;
      venue?: { name?: string; city?: string; state?: string };
      averageRating?: number;
      notes?: string;
    };
    averageRating?: number;
    allTimer?: boolean;
    set?: string;
    position?: number;
    segue?: string;
    note?: string;
    previousTrackId?: string;
    nextTrackId?: string;
  };
}

export class TrackContentFormatter implements ContentFormatter {
  entityType = "track";

  generateDisplayText(track: Record<string, unknown>): string {
    const t = asTrack(track);
    const songTitle = t.song?.title || "Unknown Song";
    const showDate = t.show?.date || "Unknown Date";
    const venue = t.show?.venue?.name || "Unknown Venue";

    let displayText = `${songTitle} • ${showDate} • ${venue}`;

    if (t.averageRating && t.averageRating > 0) {
      displayText += ` • ★ ${t.averageRating.toFixed(1)}`;
    }

    if (t.allTimer) {
      displayText += " • All-Timer";
    }

    return displayText;
  }

  generateContent(track: Record<string, unknown>): string {
    // Implementation following strategy: "[Song] performed on [Date] at [Venue]. [Segue context: song before > current > song after]. [Track notes]. Rating: [X]. [All-timer status]."

    const t = asTrack(track);
    let content = t.song?.title || "Unknown Song";

    if (t.show) {
      content += ` performed on ${t.show.date || "Unknown Date"}`;

      if (t.show.venue) {
        content += ` at ${t.show.venue.name || "Unknown Venue"}`;
        if (t.show.venue.city && t.show.venue.state) {
          content += `, ${t.show.venue.city}, ${t.show.venue.state}`;
        }
      }
    }

    // Add segue context (song before > current > song after)
    // Note: This would require additional data about previous/next tracks
    // For now, we'll use the segue field to indicate the flow
    const segueContext: string[] = [];

    if (t.previousTrackId || t.nextTrackId) {
      // If we have track linking data, we could fetch the adjacent songs
      // For now, we'll just note the segue information
      if (t.segue && t.segue !== "none") {
        segueContext.push(`segues into ${t.segue}`);
      }
    } else if (t.segue && t.segue !== "none") {
      segueContext.push(`segues into next song`);
    }

    // Add set and position context
    if (t.set) {
      segueContext.push(`${t.set} set`);
    }

    if (t.position) {
      segueContext.push(`position ${t.position}`);
    }

    if (segueContext.length > 0) {
      content += `. Context: ${segueContext.join(", ")}`;
    }

    // Add track notes
    if (t.note) {
      content += `. ${t.note}`;
    }

    // Add rating
    if (t.averageRating && t.averageRating > 0) {
      content += `. Rating: ${t.averageRating.toFixed(1)}`;
    }

    // Add all-timer status
    if (t.allTimer) {
      content += ". All-timer performance";
    }

    // Add song context
    if (t.song) {
      const songDetails: string[] = [];

      if (t.song.author?.name) {
        songDetails.push(`by ${t.song.author.name}`);
      }

      if (t.song.cover) {
        songDetails.push("cover song");
      }

      if (t.song.timesPlayed) {
        songDetails.push(`played ${t.song.timesPlayed} times total`);
      }

      if (songDetails.length > 0) {
        content += `. Song details: ${songDetails.join(", ")}`;
      }
    }

    // Add show context
    if (t.show) {
      const showDetails: string[] = [];

      if (t.show.averageRating && t.show.averageRating > 0) {
        showDetails.push(`show rated ${t.show.averageRating.toFixed(1)}`);
      }

      if (t.show.notes) {
        showDetails.push(`show notes: ${t.show.notes}`);
      }

      if (showDetails.length > 0) {
        content += `. Show context: ${showDetails.join(", ")}`;
      }
    }

    return content;
  }
}
