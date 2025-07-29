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
    // Strategy: Emphasize date + venue, full setlists with openers/closers/encores, prioritize highly-rated shows
    
    const date = show.date || "Unknown Date";
    const venueName = show.venue?.name || "Unknown Venue";
    const venueLocation = show.venue?.city && show.venue?.state 
      ? `${show.venue.city}, ${show.venue.state}` 
      : "Unknown Location";
    
    // Emphasize date and venue by repeating them
    let content = `${date} at ${venueName}, ${venueLocation}. Show date: ${date}. Concert venue: ${venueName}. Concert at ${venueName}`;
    
    // Add comprehensive setlist with set numbers and key moments
    if (show.tracks && show.tracks.length > 0) {
      // Group tracks by set and sort by position
      const tracksBySet = show.tracks.reduce((acc: any, track: any) => {
        if (!acc[track.set]) acc[track.set] = [];
        acc[track.set].push(track);
        return acc;
      }, {});
      
      const setlistParts: string[] = [];
      const keyMoments: string[] = [];
      
      // Sort sets properly (1, 2, 3, encore)
      const sortedSets = Object.keys(tracksBySet).sort((a, b) => {
        if (a.toLowerCase() === 'encore') return 1;
        if (b.toLowerCase() === 'encore') return -1;
        return a.localeCompare(b);
      });
      
      sortedSets.forEach(setName => {
        const setTracks = tracksBySet[setName]
          .sort((a: any, b: any) => a.position - b.position);
        
        // Identify set opener and closer
        if (setTracks.length > 0) {
          const opener = setTracks[0];
          const closer = setTracks[setTracks.length - 1];
          
          keyMoments.push(`Set ${setName} opener: ${opener.song?.title || "Unknown"}`);
          if (setTracks.length > 1) {
            keyMoments.push(`Set ${setName} closer: ${closer.song?.title || "Unknown"}`);
          }
        }
        
        // Build full setlist with segues
        const setTrackTexts = setTracks.map((track: any) => {
          let trackText = track.song?.title || "Unknown Song";
          if (track.segue && track.segue !== "none") trackText += " >";
          return trackText;
        });
        
        setlistParts.push(`Set ${setName}: ${setTrackTexts.join(" ")}`);
      });
      
      // Identify overall show opener and closer
      const allTracks = show.tracks.sort((a: any, b: any) => {
        // Sort by set first, then position
        if (a.set !== b.set) {
          if (a.set.toLowerCase() === 'encore') return 1;
          if (b.set.toLowerCase() === 'encore') return -1;
          return a.set.localeCompare(b.set);
        }
        return a.position - b.position;
      });
      
      if (allTracks.length > 0) {
        keyMoments.unshift(`Show opener: ${allTracks[0].song?.title || "Unknown"}`);
        keyMoments.push(`Show closer: ${allTracks[allTracks.length - 1].song?.title || "Unknown"}`);
      }
      
      content += '. ' + keyMoments.join('. ') + '. Full setlist: ' + setlistParts.join('. ');
    }
    
    // Add show notes
    if (show.notes) {
      content += `. ${show.notes}`;
    }
    
    // Emphasize ratings, especially for highly-rated shows
    if (show.averageRating && show.averageRating > 0) {
      const rating = show.averageRating.toFixed(1);
      content += `. Average rating: ${rating}`;
      
      // Emphasize high ratings for better search relevance
      if (show.averageRating >= 4.5) {
        content += `. Highly rated show: ${rating} stars. Excellent performance: ${rating}/5`;
      } else if (show.averageRating >= 4.0) {
        content += `. High quality show: ${rating} stars. Great performance: ${rating}/5`;
      } else if (show.averageRating >= 3.5) {
        content += `. Good show: ${rating} stars`;
      }
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