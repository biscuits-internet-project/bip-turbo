import type { ContentFormatter } from "./base-content-formatter";

export class TrackContentFormatter implements ContentFormatter {
  entityType = "track";

  generateDisplayText(track: any): string {
    const songTitle = track.song?.title || "Unknown Song";
    const showDate = track.show?.date || "Unknown Date";
    const venue = track.show?.venue?.name || "Unknown Venue";
    
    let displayText = `${songTitle} • ${showDate} • ${venue}`;
    
    if (track.averageRating && track.averageRating > 0) {
      displayText += ` • ★ ${track.averageRating.toFixed(1)}`;
    }
    
    if (track.allTimer) {
      displayText += " • All-Timer";
    }
    
    return displayText;
  }

  generateContent(track: any): string {
    // Implementation following strategy: "[Song] performed on [Date] at [Venue]. [Segue context: song before > current > song after]. [Track notes]. Rating: [X]. [All-timer status]."
    
    let content = track.song?.title || "Unknown Song";
    
    if (track.show) {
      content += ` performed on ${track.show.date || "Unknown Date"}`;
      
      if (track.show.venue) {
        content += ` at ${track.show.venue.name || "Unknown Venue"}`;
        if (track.show.venue.city && track.show.venue.state) {
          content += `, ${track.show.venue.city}, ${track.show.venue.state}`;
        }
      }
    }
    
    // Add segue context (song before > current > song after)
    // Note: This would require additional data about previous/next tracks
    // For now, we'll use the segue field to indicate the flow
    const segueContext: string[] = [];
    
    if (track.previousTrackId || track.nextTrackId) {
      // If we have track linking data, we could fetch the adjacent songs
      // For now, we'll just note the segue information
      if (track.segue && track.segue !== "none") {
        segueContext.push(`segues into ${track.segue}`);
      }
    } else if (track.segue && track.segue !== "none") {
      segueContext.push(`segues into next song`);
    }
    
    // Add set and position context
    if (track.set) {
      segueContext.push(`${track.set} set`);
    }
    
    if (track.position) {
      segueContext.push(`position ${track.position}`);
    }
    
    if (segueContext.length > 0) {
      content += `. Context: ${segueContext.join(", ")}`;
    }
    
    // Add track notes
    if (track.note) {
      content += `. ${track.note}`;
    }
    
    // Add rating
    if (track.averageRating && track.averageRating > 0) {
      content += `. Rating: ${track.averageRating.toFixed(1)}`;
    }
    
    // Add all-timer status
    if (track.allTimer) {
      content += ". All-timer performance";
    }
    
    // Add song context
    if (track.song) {
      const songDetails: string[] = [];
      
      if (track.song.author?.name) {
        songDetails.push(`by ${track.song.author.name}`);
      }
      
      if (track.song.cover) {
        songDetails.push("cover song");
      }
      
      if (track.song.timesPlayed) {
        songDetails.push(`played ${track.song.timesPlayed} times total`);
      }
      
      if (songDetails.length > 0) {
        content += `. Song details: ${songDetails.join(", ")}`;
      }
    }
    
    // Add show context
    if (track.show) {
      const showDetails: string[] = [];
      
      if (track.show.averageRating && track.show.averageRating > 0) {
        showDetails.push(`show rated ${track.show.averageRating.toFixed(1)}`);
      }
      
      if (track.show.notes) {
        showDetails.push(`show notes: ${track.show.notes}`);
      }
      
      if (showDetails.length > 0) {
        content += `. Show context: ${showDetails.join(", ")}`;
      }
    }
    
    return content;
  }
}