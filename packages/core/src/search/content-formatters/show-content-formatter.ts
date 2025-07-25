import type { ContentFormatter } from "./base-content-formatter";

export class ShowContentFormatter implements ContentFormatter {
  entityType = "show";

  generateDisplayText(show: any): string {
    // TODO: Implement proper show display text generation
    // Example: "2023-07-15 - The Fillmore, San Francisco, CA"
    
    // Placeholder implementation
    const date = show.date || "Unknown Date";
    const venue = show.venue?.name || "Unknown Venue";
    const location = show.venue?.city && show.venue?.state 
      ? `${show.venue.city}, ${show.venue.state}`
      : "Unknown Location";
    
    return `${date} - ${venue}, ${location}`;
  }

  generateContent(show: any): string {
    // TODO: Implement comprehensive show content generation
    // This should include setlist, venue info, ratings, notes, etc.
    
    // Placeholder implementation - basic show information
    let content = `Show Date: ${show.date || "Unknown"}\n`;
    
    if (show.venue) {
      content += `Venue: ${show.venue.name || "Unknown"}\n`;
      if (show.venue.city && show.venue.state) {
        content += `Location: ${show.venue.city}, ${show.venue.state}\n`;
      }
    }
    
    if (show.notes) {
      content += `Notes: ${show.notes}\n`;
    }
    
    if (show.averageRating) {
      content += `Rating: ${show.averageRating}/5\n`;
    }
    
    // Add track information if available
    if (show.tracks && show.tracks.length > 0) {
      content += "\nSetlist:\n";
      
      // Group tracks by set
      const tracksBySet = show.tracks.reduce((acc: any, track: any) => {
        if (!acc[track.set]) acc[track.set] = [];
        acc[track.set].push(track);
        return acc;
      }, {});
      
      Object.keys(tracksBySet).forEach(setName => {
        content += `${setName}: `;
        const setTracks = tracksBySet[setName]
          .sort((a: any, b: any) => a.position - b.position)
          .map((track: any) => {
            let trackText = track.song?.title || "Unknown Song";
            if (track.segue && track.segue !== "none") trackText += " >";
            if (track.note) trackText += ` (${track.note})`;
            return trackText;
          });
        content += setTracks.join(" ") + "\n";
      });
    }
    
    return content;
  }
}