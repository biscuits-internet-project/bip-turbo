import type { ContentFormatter } from "./base-content-formatter";

export class ShowContentFormatter implements ContentFormatter {
  entityType = "show";

  generateDisplayText(show: any): string {
    const date = show.date || "Unknown Date";
    const venue = show.venue?.name || "Unknown Venue";
    const location = show.venue?.city && show.venue?.state 
      ? `${show.venue.city}, ${show.venue.state}`
      : "Unknown Location";
    
    let displayText = `${date} • ${venue}, ${location}`;
    
    if (show.averageRating && show.averageRating > 0) {
      displayText += ` • ★ ${show.averageRating.toFixed(1)}`;
    }
    
    return displayText;
  }

  generateContent(show: any): string {
    // Implementation following strategy: "[Date] at [Venue], [City, State]. Setlist: [song1 > song2 > song3...]. [Show notes]. Average rating: [X]. [Key characteristics: debuts, bustouts, notable segues]."
    
    let content = show.date || "Unknown Date";
    
    if (show.venue) {
      content += ` at ${show.venue.name || "Unknown Venue"}`;
      if (show.venue.city && show.venue.state) {
        content += `, ${show.venue.city}, ${show.venue.state}`;
      }
    }
    
    // Add setlist
    if (show.tracks && show.tracks.length > 0) {
      content += '. Setlist: ';
      
      // Group tracks by set and sort by position
      const tracksBySet = show.tracks.reduce((acc: any, track: any) => {
        if (!acc[track.set]) acc[track.set] = [];
        acc[track.set].push(track);
        return acc;
      }, {});
      
      const setlistParts: string[] = [];
      Object.keys(tracksBySet)
        .sort() // Sort set names
        .forEach(setName => {
          const setTracks = tracksBySet[setName]
            .sort((a: any, b: any) => a.position - b.position)
            .map((track: any) => {
              let trackText = track.song?.title || "Unknown Song";
              if (track.segue && track.segue !== "none") trackText += " >";
              return trackText;
            });
          setlistParts.push(`${setName}: ${setTracks.join(" ")}`);
        });
      
      content += setlistParts.join('. ');
    }
    
    // Add show notes
    if (show.notes) {
      content += `. ${show.notes}`;
    }
    
    // Add average rating
    if (show.averageRating && show.averageRating > 0) {
      content += `. Average rating: ${show.averageRating.toFixed(1)}`;
    }
    
    // Add key characteristics (debuts, bustouts, notable segues)
    const characteristics: string[] = [];
    
    if (show.tracks && show.tracks.length > 0) {
      // Check for notable segues
      const segues = show.tracks
        .filter((track: any) => track.segue && track.segue !== "none")
        .map((track: any) => `${track.song?.title} > ${track.segue}`)
        .slice(0, 3); // Limit to avoid too much text
      
      if (segues.length > 0) {
        characteristics.push(`notable segues: ${segues.join(", ")}`);
      }
      
      // Check for tracks with notes (could indicate debuts, bustouts, etc.)
      const tracksWithNotes = show.tracks
        .filter((track: any) => track.note)
        .map((track: any) => `${track.song?.title} (${track.note})`)
        .slice(0, 3); // Limit to avoid too much text
      
      if (tracksWithNotes.length > 0) {
        characteristics.push(`special performances: ${tracksWithNotes.join(", ")}`);
      }
      
      // Check for all-timer tracks
      const allTimers = show.tracks
        .filter((track: any) => track.allTimer)
        .map((track: any) => track.song?.title)
        .slice(0, 3);
      
      if (allTimers.length > 0) {
        characteristics.push(`all-timers: ${allTimers.join(", ")}`);
      }
    }
    
    if (characteristics.length > 0) {
      content += `. Key characteristics: ${characteristics.join("; ")}`;
    }
    
    return content;
  }
}