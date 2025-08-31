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
    notes?: string;
  };
}

export class ShowVenueFormatter implements ContentFormatter {
  entityType = "show";  // Changed from "show_venue" to "show"

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
    const parts: string[] = [];
    
    // Single clean date format (model understands variations)
    if (s.date) {
      const match = s.date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (match) {
        const [_, year, month, day] = match;
        const monthNames = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];
        const monthName = monthNames[parseInt(month) - 1];
        parts.push(`${monthName} ${parseInt(day)} ${year}`);
      }
    }
    
    // Venue name
    if (s.venue?.name) {
      parts.push(s.venue.name);
    }
    
    // Location (city, state/country)
    if (s.venue?.city) parts.push(s.venue.city);
    if (s.venue?.state) {
      parts.push(s.venue.state);
    } else if (s.venue?.country && s.venue.country !== 'USA') {
      parts.push(s.venue.country);
    }
    
    // Notes (excluding soundcheck lines)
    if (s.notes) {
      const cleanNotes = s.notes
        .split('\n')
        .filter(line => !line.toLowerCase().startsWith('soundcheck:'))
        .join(' ')
        .trim();
      
      if (cleanNotes) {
        parts.push(cleanNotes);
      }
    }
    
    return parts.join(" ");
  }
}