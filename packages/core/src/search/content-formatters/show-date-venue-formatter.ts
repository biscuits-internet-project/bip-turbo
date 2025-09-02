import type { ContentFormatter } from "./base-content-formatter";

interface Show {
  id: string;
  date: string;
  slug?: string | null;
  notes?: string | null;
  venue: {
    name: string | null;
    city: string | null;
    state?: string | null;
    country?: string | null;
  } | null;
}

export class ShowDateVenueFormatter implements ContentFormatter<Show> {
  entityType = "show";
  indexStrategy = "date_venue";

  generateDisplayText(show: Show): string {
    const date = show.date;
    const venue = show.venue?.name || "Unknown Venue";
    const location = show.venue?.state
      ? `${show.venue.city || "Unknown City"}, ${show.venue.state}`
      : `${show.venue?.city || "Unknown City"}, ${show.venue?.country || "Unknown Country"}`;

    return `${date} • ${venue}, ${location}`;
  }

  generateContent(show: Show): string {
    const parts: string[] = [];

    // Multiple date formats for vector matching
    if (show.date) {
      const match = show.date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (match) {
        const [_, year, month, day] = match;
        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        const monthName = monthNames[parseInt(month) - 1];

        // ISO format: "2024-04-06"
        parts.push(show.date);

        // US format: "04/06/2024"
        parts.push(`${month}/${day}/${year}`);

        // Long format: "April 6 2024"
        parts.push(`${monthName} ${parseInt(day)} ${year}`);

        // Month/Year: "April 2024"
        parts.push(`${monthName} ${year}`);
      }
    }

    // Venue information
    if (show.venue?.name) {
      parts.push(show.venue.name);
    }
    if (show.venue?.city) {
      parts.push(show.venue.city);
    }

    if (show.venue?.state) {
      parts.push(show.venue.state);
    } else if (show.venue?.country && show.venue.country !== "USA") {
      parts.push(show.venue.country);
    }

    return parts.join(" ");
  }
}
