import type { ContentFormatter } from "./base-content-formatter";

// Helper function to safely cast track data
function asTrack(track: Record<string, unknown>) {
  return track as {
    id?: string;
    showId?: string;
    set: string;
    position: number;
    song?: { title?: string };
    segue?: string;
    note?: string;
    allTimer?: boolean;
    annotations?: Array<{
      desc?: string;
    }>;
    show?: {
      id?: string;
      date?: string;
      venue?: { name?: string; city?: string; state?: string };
    };
  };
}

export class TrackSongFormatter implements ContentFormatter {
  entityType = "show";  // Changed from "track_song" to "show"
  
  // Override to return the show ID instead of track ID
  getEntityId(track: Record<string, unknown>): string {
    const t = asTrack(track);
    // Use show.id if available, otherwise fall back to showId field
    return t.show?.id || t.showId || "";
  }

  generateDisplayText(track: Record<string, unknown>): string {
    const t = asTrack(track);
    const songTitle = t.song?.title || "Unknown Song";
    const showDate = t.show?.date || "Unknown Date";
    const venue = t.show?.venue?.name || "Unknown Venue";

    return `${songTitle} • ${showDate} • ${venue}`;
  }

  generateContent(track: Record<string, unknown>): string {
    const t = asTrack(track);
    const songTitle = t.song?.title || "Unknown Song";
    
    let content = songTitle;
    
    // Add basic show context for reference
    if (t.show) {
      const date = t.show.date || "";
      const venue = t.show.venue?.name || "";
      const city = t.show.venue?.city || "";
      const state = t.show.venue?.state || "";
      
      content += ` ${date}`;
      if (venue) content += ` ${venue}`;
      if (city && state) content += ` ${city} ${state}`;
    }
    
    // Position information
    const setInfo = this.getSetInfo(t.set);
    content += ` ${setInfo}`;
    
    if (t.position) {
      content += ` position ${t.position}`;
    }
    
    // Add position-specific markers
    const positionMarkers = this.getPositionMarkers(t);
    if (positionMarkers.length > 0) {
      content += ` ${positionMarkers.join(" ")}`;
    }
    
    // Segue information
    if (t.segue && t.segue !== 'none') {
      // We don't know the next song from this track alone, so just mark it has segue
      content += ` segue segues into next song segue out`;
    }
    
    // Special markers
    if (t.allTimer) {
      content += ` all-timer all timer legendary performance must hear`;
    }
    
    // Notes
    if (t.note) {
      content += ` ${t.note}`;
    }
    
    // Annotations
    if (t.annotations && t.annotations.length > 0) {
      t.annotations.forEach(annotation => {
        if (annotation.desc) {
          content += ` ${annotation.desc}`;
        }
      });
    }
    
    return content;
  }
  
  private getSetInfo(setName: string): string {
    const lower = setName.toLowerCase();
    if (lower.includes('e') || lower === 'encore') {
      return `encore encore set`;
    }
    return `set ${setName} set${setName}`;
  }
  
  private getPositionMarkers(track: any): string[] {
    const markers: string[] = [];
    const songTitle = track.song?.title || "";
    
    // We can't determine if this is an opener/closer without context of other tracks
    // So we'll mark common position indicators
    const setInfo = this.getSetInfo(track.set);
    
    // Add song + set combinations for searching
    markers.push(`${songTitle} ${setInfo}`);
    
    // If it's position 1 in a set, likely an opener
    if (track.position === 1) {
      markers.push(`${songTitle} opener`);
      markers.push(`opener ${songTitle}`);
      markers.push(`opened with ${songTitle}`);
      markers.push(`${setInfo} opener ${songTitle}`);
    }
    
    // Common patterns people search for
    if (setInfo.includes('encore')) {
      markers.push(`${songTitle} encore`);
      markers.push(`encore ${songTitle}`);
      markers.push(`encored with ${songTitle}`);
    }
    
    return markers;
  }
}