import type { ContentFormatter } from "./base-content-formatter";

export class SongContentFormatter implements ContentFormatter {
  entityType = "song";

  generateDisplayText(song: any): string {
    let displayText = song.title || "Unknown Song";
    
    if (song.author?.name) {
      displayText += ` by ${song.author.name}`;
    }
    
    if (song.cover) {
      displayText += " (Cover)";
    }
    
    if (song.timesPlayed > 0) {
      displayText += ` • ${song.timesPlayed} performances`;
    }
    
    return displayText;
  }

  generateContent(song: any): string {
    // Implementation following strategy: "[Song Title] by [Author]. [Lyrics excerpt]. Played [X] times. [Performance context: most/least common years, notable gaps from longestGapsData]. [Tabs/musical info]. [Notes/history]."
    
    let content = song.title || "Unknown Song";
    
    if (song.author?.name) {
      content += ` by ${song.author.name}`;
    }
    
    // Add full lyrics
    if (song.lyrics) {
      const cleanLyrics = song.lyrics.replace(/<br\/?>/g, ' ').trim();
      if (cleanLyrics) {
        content += `. ${cleanLyrics}`;
      }
    }
    
    // Add performance statistics
    if (song.timesPlayed !== undefined) {
      content += `. Played ${song.timesPlayed} times`;
    }
    
    // Add performance context
    const performanceContext = [];
    if (song.mostCommonYear) {
      performanceContext.push(`most common in ${song.mostCommonYear}`);
    }
    if (song.leastCommonYear) {
      performanceContext.push(`least common in ${song.leastCommonYear}`);
    }
    
    // Add notable gaps from longestGapsData
    if (song.longestGapsData && Object.keys(song.longestGapsData).length > 0) {
      const gaps = Object.entries(song.longestGapsData);
      if (gaps.length > 0) {
        const longestGap = gaps.reduce((max, [period, days]) => 
          Number(days) > Number(max[1]) ? [period, days] : max
        );
        performanceContext.push(`longest gap: ${longestGap[1]} days (${longestGap[0]})`);
      }
    }
    
    if (performanceContext.length > 0) {
      content += `. Performance context: ${performanceContext.join(', ')}`;
    }
    
    
    // Add history and notes
    if (song.history) {
      content += `. History: ${song.history}`;
    }
    
    if (song.notes) {
      content += `. Notes: ${song.notes}`;
    }
    
    if (song.cover) {
      content += '. This is a cover song';
    }
    
    // Add featured lyric if available
    if (song.featuredLyric) {
      content += `. Featured lyric: "${song.featuredLyric}"`;
    }
    
    // Add yearly play data summary for key years
    if (song.yearlyPlayData && Object.keys(song.yearlyPlayData).length > 0) {
      const yearData = Object.entries(song.yearlyPlayData)
        .sort(([, a], [, b]) => Number(b) - Number(a))
        .slice(0, 3); // Top 3 years
      
      if (yearData.length > 0) {
        const yearSummary = yearData.map(([year, count]) => `${year} (${count}x)`).join(', ');
        content += `. Most active years: ${yearSummary}`;
      }
    }
    
    return content;
  }
}