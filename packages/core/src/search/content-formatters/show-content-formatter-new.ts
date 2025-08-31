import type { ContentFormatter } from "./base-content-formatter";

// Helper function to safely cast show data
function asShow(show: Record<string, unknown>) {
  return show as {
    date?: string;
    venue?: {
      name?: string;
      city?: string;
      state?: string;
      country?: string;
    };
    tracks?: Array<{
      set: string;
      position: number;
      song?: { title?: string };
      segue?: string;
      note?: string;
      allTimer?: boolean;
    }>;
    notes?: string;
  };
}

export class ShowContentFormatter implements ContentFormatter {
  entityType = "show";

  private parseDate(dateStr: string): {
    formatted: string[];
    searchTerms: string[];
    specialDates: string[];
  } {
    const formatted: string[] = [];
    const searchTerms: string[] = [];
    const specialDates: string[] = [];

    // Parse YYYY-MM-DD format
    const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) {
      const [_, year, month, day] = match;
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      const monthName = monthNames[parseInt(month) - 1];
      
      // Multiple date formats for better search matching
      formatted.push(
        dateStr,                                    // 2024-12-31
        `${month}/${day}/${year}`,                 // 12/31/2024
        `${parseInt(month)}/${parseInt(day)}/${year}`, // 12/31/2024
        `${monthName} ${parseInt(day)}, ${year}`,  // December 31, 2024
        `${monthName} ${parseInt(day)} ${year}`,   // December 31 2024
        `${parseInt(day)} ${monthName} ${year}`    // 31 December 2024
      );
      
      // Search terms for partial matching
      searchTerms.push(
        year,                    // "2024"
        monthName,              // "December"
        `${monthName} ${year}`, // "December 2024"
        `${monthName.slice(0, 3)} ${year}` // "Dec 2024"
      );
      
      // Check for special dates
      if (month === "12" && day === "31") {
        specialDates.push("New Years Eve", "NYE", `NYE ${year}`, "New Year's Eve");
      }
      if (month === "01" && day === "01") {
        specialDates.push("New Years Day", "NYD", `New Year's Day ${year}`);
      }
      if (month === "07" && day === "04") {
        specialDates.push("Fourth of July", "Independence Day", "July 4th", `4th of July ${year}`);
      }
      if (month === "10" && day === "31") {
        specialDates.push("Halloween", `Halloween ${year}`);
      }
      if (month === "04" && day === "20") {
        specialDates.push("420", "Four Twenty", `420 ${year}`);
      }
      
      // Season detection
      const monthInt = parseInt(month);
      if (monthInt >= 3 && monthInt <= 5) {
        searchTerms.push(`Spring ${year}`, "Spring Tour");
      } else if (monthInt >= 6 && monthInt <= 8) {
        searchTerms.push(`Summer ${year}`, "Summer Tour");
      } else if (monthInt >= 9 && monthInt <= 11) {
        searchTerms.push(`Fall ${year}`, "Fall Tour", `Autumn ${year}`);
      } else {
        searchTerms.push(`Winter ${year}`, "Winter Tour");
      }
    }
    
    return { formatted, searchTerms, specialDates };
  }

  private formatVenue(venue: any): {
    full: string[];
    searchTerms: string[];
  } {
    const full: string[] = [];
    const searchTerms: string[] = [];
    
    if (!venue) return { full, searchTerms };
    
    const name = venue.name || "";
    const city = venue.city || "";
    const state = venue.state || "";
    
    // Full venue formats
    if (name) {
      full.push(name);
      searchTerms.push(name);
      
      // Common venue abbreviations
      if (name.includes("Madison Square Garden")) {
        searchTerms.push("MSG", "The Garden");
      }
      if (name.includes("Red Rocks")) {
        searchTerms.push("Red Rocks", "RRAX");
      }
      if (name.includes("The Capitol Theatre")) {
        searchTerms.push("The Cap", "Capitol", "Port Chester");
      }
      if (name.includes("The Fillmore")) {
        searchTerms.push("Fillmore");
      }
    }
    
    // Location formats
    if (city && state) {
      full.push(`${city}, ${state}`);
      full.push(`${city} ${state}`);
      searchTerms.push(city, state);
      searchTerms.push(`${city} shows`, `${state} shows`);
    }
    
    // Full venue string
    if (name && city && state) {
      full.push(`${name}, ${city}, ${state}`);
      full.push(`${name} in ${city}`);
    }
    
    return { full, searchTerms };
  }

  generateDisplayText(show: Record<string, unknown>): string {
    const s = asShow(show);
    const date = s.date || "Unknown Date";
    const venue = s.venue?.name || "Unknown Venue";
    const location = s.venue?.city && s.venue?.state 
      ? `${s.venue.city}, ${s.venue.state}` 
      : "Unknown Location";

    return `${date} • ${venue}, ${location}`;
  }

  generateContent(show: Record<string, unknown>): string {
    const s = asShow(show);
    const dateStr = s.date || "";
    
    // Parse date into multiple formats
    const { formatted: dateFormats, searchTerms: dateSearchTerms, specialDates } = this.parseDate(dateStr);
    
    // Format venue information
    const { full: venueFormats, searchTerms: venueSearchTerms } = this.formatVenue(s.venue);
    
    // Start with all date variations for maximum searchability
    let content = dateFormats.join(" ");
    
    // Add special date recognition
    if (specialDates.length > 0) {
      content += ` ${specialDates.join(" ")}`;
    }
    
    // Add date search terms
    if (dateSearchTerms.length > 0) {
      content += ` ${dateSearchTerms.join(" ")}`;
    }
    
    // Add all venue variations
    if (venueFormats.length > 0) {
      content += ` ${venueFormats.join(" ")}`;
    }
    
    // Add venue search terms
    if (venueSearchTerms.length > 0) {
      content += ` ${venueSearchTerms.join(" ")}`;
    }
    
    // Add setlist with position markers
    if (s.tracks && s.tracks.length > 0) {
      const tracksBySet: Record<string, typeof s.tracks> = {};
      s.tracks.forEach(track => {
        if (!tracksBySet[track.set]) tracksBySet[track.set] = [];
        tracksBySet[track.set].push(track);
      });
      
      const setlistParts: string[] = [];
      const importantSongs: string[] = [];
      
      Object.entries(tracksBySet).forEach(([setName, tracks]) => {
        tracks.sort((a, b) => a.position - b.position);
        
        // Mark openers and closers
        if (tracks.length > 0) {
          const opener = tracks[0].song?.title;
          const closer = tracks[tracks.length - 1].song?.title;
          
          if (opener) {
            const setLabel = setName.toLowerCase() === 'e1' || setName.toLowerCase() === 'encore' 
              ? "encore" 
              : `set ${setName}`;
            importantSongs.push(`${opener} ${setLabel} opener`);
            importantSongs.push(`${setLabel} opener ${opener}`);
            importantSongs.push(`opened ${setLabel} with ${opener}`);
          }
          
          if (closer && tracks.length > 1) {
            const setLabel = setName.toLowerCase() === 'e1' || setName.toLowerCase() === 'encore' 
              ? "encore" 
              : `set ${setName}`;
            importantSongs.push(`${closer} ${setLabel} closer`);
            importantSongs.push(`${setLabel} closer ${closer}`);
            importantSongs.push(`closed ${setLabel} with ${closer}`);
          }
        }
        
        // Build setlist with segue notation
        const setContent = tracks.map((track, idx) => {
          let song = track.song?.title || "Unknown";
          
          // Add segue markers
          if (track.segue && track.segue !== 'none') {
            const nextTrack = tracks[idx + 1];
            if (nextTrack?.song?.title) {
              // Create segue pairs for searching
              importantSongs.push(`${song} > ${nextTrack.song.title}`);
              importantSongs.push(`${song} segue ${nextTrack.song.title}`);
              importantSongs.push(`${song} into ${nextTrack.song.title}`);
            }
            song += " >";
          }
          
          // Mark special songs
          if (track.allTimer) {
            importantSongs.push(`${song} all-timer`);
            importantSongs.push(`all-timer ${song}`);
          }
          
          if (track.note) {
            importantSongs.push(`${song} ${track.note}`);
          }
          
          return song;
        }).join(" ");
        
        const setLabel = setName.toLowerCase() === 'e1' || setName.toLowerCase() === 'encore' 
          ? "Encore" 
          : `Set ${setName}`;
        setlistParts.push(`${setLabel}: ${setContent}`);
      });
      
      // Add overall show opener/closer
      const allTracks = s.tracks.sort((a, b) => {
        if (a.set !== b.set) {
          // Encore comes last
          if (a.set.toLowerCase().includes('e')) return 1;
          if (b.set.toLowerCase().includes('e')) return -1;
          return a.set.localeCompare(b.set);
        }
        return a.position - b.position;
      });
      
      if (allTracks.length > 0) {
        const showOpener = allTracks[0].song?.title;
        const showCloser = allTracks[allTracks.length - 1].song?.title;
        
        if (showOpener) {
          importantSongs.push(`show opener ${showOpener}`);
          importantSongs.push(`opened with ${showOpener}`);
          importantSongs.push(`${showOpener} opener`);
        }
        
        if (showCloser) {
          const isEncore = allTracks[allTracks.length - 1].set.toLowerCase().includes('e');
          if (isEncore) {
            importantSongs.push(`encore ${showCloser}`);
            importantSongs.push(`encored with ${showCloser}`);
            importantSongs.push(`${showCloser} encore`);
          }
          importantSongs.push(`show closer ${showCloser}`);
          importantSongs.push(`closed with ${showCloser}`);
        }
      }
      
      // Add all the important song markers
      if (importantSongs.length > 0) {
        content += ` ${importantSongs.join(" ")}`;
      }
      
      // Add full setlist
      content += ` Setlist: ${setlistParts.join(" ")}`;
      
      // List all songs for basic searching
      const allSongNames = s.tracks
        .map(t => t.song?.title)
        .filter(Boolean)
        .join(" ");
      content += ` Songs played: ${allSongNames}`;
    }
    
    // Add show notes
    if (s.notes) {
      content += ` Show notes: ${s.notes}`;
    }
    
    return content;
  }
}