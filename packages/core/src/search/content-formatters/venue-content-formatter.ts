import type { ContentFormatter } from "./base-content-formatter";

export class VenueContentFormatter implements ContentFormatter {
  entityType = "venue";

  generateDisplayText(venue: any): string {
    let displayText = venue.name || "Unknown Venue";
    
    if (venue.city && venue.state) {
      displayText += ` • ${venue.city}, ${venue.state}`;
    }
    
    if (venue.timesPlayed > 0) {
      displayText += ` • ${venue.timesPlayed} shows`;
    }
    
    return displayText;
  }

  generateContent(venue: any): string {
    // Implementation following strategy: "[Venue Name] in [City, State]. [Times played]. Notable shows from database. [Basic characteristics from existing data]."
    
    const venueName = venue.name || "Unknown Venue";
    
    // Emphasize venue name by repeating it (like we do for songs)
    let content = `${venueName}. Venue name: ${venueName}. Concert venue: ${venueName}`;
    
    if (venue.city && venue.state) {
      content += ` in ${venue.city}, ${venue.state}`;
    }
    
    if (venue.timesPlayed !== undefined) {
      content += `. Played ${venue.timesPlayed} times`;
    }
    
    // Add notable shows from database
    if (venue.shows && venue.shows.length > 0) {
      const notableShows = venue.shows
        .sort((a: any, b: any) => {
          // Sort by rating first, then by date
          if (a.averageRating && b.averageRating) {
            return b.averageRating - a.averageRating;
          }
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        })
        .slice(0, 5); // Top 5 shows
      
      if (notableShows.length > 0) {
        const showDescriptions = notableShows.map((show: any) => {
          let desc = show.date;
          if (show.averageRating && show.averageRating > 0) {
            desc += ` (★${show.averageRating.toFixed(1)})`;
          }
          return desc;
        });
        content += `. Notable shows: ${showDescriptions.join(", ")}`;
      }
    }
    
    // Add basic characteristics from existing data
    const characteristics: string[] = [];
    
    if (venue.country && venue.country !== "USA") {
      characteristics.push(`international venue (${venue.country})`);
    }
    
    // Add location coordinates if available
    if (venue.latitude && venue.longitude) {
      characteristics.push(`coordinates: ${venue.latitude}, ${venue.longitude}`);
    }
    
    // Add postal code for identification
    if (venue.postalCode) {
      characteristics.push(`postal code: ${venue.postalCode}`);
    }
    
    if (characteristics.length > 0) {
      content += `. Characteristics: ${characteristics.join(", ")}`;
    }
    
    return content;
  }
}