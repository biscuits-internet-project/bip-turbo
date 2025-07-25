import type { ContentFormatter } from "./base-content-formatter";

export class SongContentFormatter implements ContentFormatter {
  entityType = "song";

  generateDisplayText(song: any): string {
    // TODO: Implement proper song display text generation
    
    // Placeholder implementation
    let displayText = song.title || "Unknown Song";
    
    if (song.author?.name) {
      displayText += ` by ${song.author.name}`;
    }
    
    if (song.cover) {
      displayText += " (Cover)";
    }
    
    return displayText;
  }

  generateContent(song: any): string {
    // TODO: Implement comprehensive song content generation
    // This should include performance stats, gaps, notable versions, etc.
    
    // Placeholder implementation - basic song information
    let content = `Song: ${song.title || "Unknown"}\n`;
    
    if (song.author?.name) {
      content += `Author: ${song.author.name}\n`;
    }
    
    if (song.cover) {
      content += "Type: Cover Song\n";
    }
    
    if (song.timesPlayed !== undefined) {
      content += `Times Played: ${song.timesPlayed}\n`;
    }
    
    if (song.dateLastPlayed) {
      content += `Last Played: ${song.dateLastPlayed}\n`;
    }
    
    if (song.mostCommonYear) {
      content += `Most Common Year: ${song.mostCommonYear}\n`;
    }
    
    if (song.leastCommonYear) {
      content += `Least Common Year: ${song.leastCommonYear}\n`;
    }
    
    // Add gap information from longestGapsData
    if (song.longestGapsData && Object.keys(song.longestGapsData).length > 0) {
      content += "Longest Gaps Between Performances:\n";
      Object.entries(song.longestGapsData).forEach(([period, days]) => {
        content += `  ${period}: ${days} days\n`;
      });
    }
    
    // Add yearly play data
    if (song.yearlyPlayData && Object.keys(song.yearlyPlayData).length > 0) {
      content += "Performance History by Year:\n";
      Object.entries(song.yearlyPlayData).forEach(([year, count]) => {
        content += `  ${year}: ${count} times\n`;
      });
    }
    
    if (song.notes) {
      content += `Notes: ${song.notes}\n`;
    }
    
    if (song.lyrics) {
      content += `Lyrics: ${song.lyrics.substring(0, 500)}...\n`;
    }
    
    return content;
  }
}