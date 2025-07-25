import type { ContentFormatter } from "./base-content-formatter";

export class VenueContentFormatter implements ContentFormatter {
  entityType = "venue";

  generateDisplayText(venue: any): string {
    // TODO: Implement proper venue display text generation
    
    // Placeholder implementation
    let displayText = venue.name || "Unknown Venue";
    
    if (venue.city && venue.state) {
      displayText += ` - ${venue.city}, ${venue.state}`;
    }
    
    return displayText;
  }

  generateContent(venue: any): string {
    // TODO: Implement comprehensive venue content generation
    // This should include location details, show history, notable performances, etc.
    
    // Placeholder implementation - basic venue information
    let content = `Venue: ${venue.name || "Unknown"}\n`;
    
    if (venue.city && venue.state) {
      content += `Location: ${venue.city}, ${venue.state}\n`;
    }
    
    if (venue.country) {
      content += `Country: ${venue.country}\n`;
    }
    
    if (venue.street) {
      content += `Address: ${venue.street}\n`;
    }
    
    if (venue.website) {
      content += `Website: ${venue.website}\n`;
    }
    
    if (venue.phone) {
      content += `Phone: ${venue.phone}\n`;
    }
    
    if (venue.timesPlayed !== undefined) {
      content += `Shows Played: ${venue.timesPlayed}\n`;
    }
    
    // Add show history if available
    if (venue.shows && venue.shows.length > 0) {
      content += "\nShow History:\n";
      const sortedShows = venue.shows
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10); // Only include recent shows to avoid too much content
      
      sortedShows.forEach((show: any) => {
        content += `  ${show.date}`;
        if (show.averageRating) {
          content += ` (Rating: ${show.averageRating}/5)`;
        }
        content += "\n";
      });
      
      if (venue.shows.length > 10) {
        content += `  ... and ${venue.shows.length - 10} more shows\n`;
      }
    }
    
    return content;
  }
}