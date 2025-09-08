import type { ContentFormatter } from "./base-content-formatter";

// Helper function to safely cast show data
function asShow(show: Record<string, unknown>) {
  return show as {
    date?: string;
    venue?: {
      name?: string;
      city?: string;
      state?: string;
    };
    averageRating?: number;
    tracks?: Array<{
      set: string;
      position: number;
      song?: { title?: string };
      segue?: string;
      note?: string;
      allTimer?: boolean;
    }>;
    notes?: string;
    yearlyPlayData?: Record<string, number>;
    longestGapsData?: Record<string, number>;
  };
}

export class ShowContentFormatter implements ContentFormatter {
  entityType = "show";

  generateDisplayText(show: Record<string, unknown>): string {
    const s = asShow(show);
    const date = s.date || "Unknown Date";
    const venue = s.venue?.name || "Unknown Venue";
    const location = s.venue?.city && s.venue?.state ? `${s.venue.city}, ${s.venue.state}` : "Unknown Location";

    let displayText = `${date} • ${venue}, ${location}`;

    if (s.averageRating && s.averageRating > 0) {
      displayText += ` • ★ ${s.averageRating.toFixed(1)}`;
    }

    return displayText;
  }

  generateContent(show: Record<string, unknown>): string {
    // Strategy: Emphasize date + venue, full setlists with openers/closers/encores, prioritize highly-rated shows

    const s = asShow(show);
    const date = s.date || "Unknown Date";
    const venueName = s.venue?.name || "Unknown Venue";
    const venueLocation = s.venue?.city && s.venue?.state ? `${s.venue.city}, ${s.venue.state}` : "Unknown Location";

    // Emphasize date and venue by repeating them
    let content = `${date} at ${venueName}, ${venueLocation}. Show date: ${date}. Concert venue: ${venueName}. Concert at ${venueName}`;

    // Add comprehensive setlist with set numbers and key moments
    if (s.tracks && s.tracks.length > 0) {
      // Group tracks by set and sort by position
      const tracksBySet = s.tracks.reduce(
        (acc: Record<string, Array<NonNullable<typeof s.tracks>[0]>>, track) => {
          if (!acc[track.set]) acc[track.set] = [];
          acc[track.set].push(track);
          return acc;
        },
        {} as Record<string, Array<NonNullable<typeof s.tracks>[0]>>,
      );

      const setlistParts: string[] = [];
      const keyMoments: string[] = [];

      // Sort sets properly (1, 2, 3, encore)
      const sortedSets = Object.keys(tracksBySet).sort((a, b) => {
        if (a.toLowerCase() === "encore") return 1;
        if (b.toLowerCase() === "encore") return -1;
        return a.localeCompare(b);
      });

      sortedSets.forEach((setName) => {
        const setTracks = tracksBySet[setName].sort(
          (a: Record<string, unknown>, b: Record<string, unknown>) => (a.position as number) - (b.position as number),
        );

        // Identify set opener and closer
        if (setTracks.length > 0) {
          const opener = setTracks[0];
          const closer = setTracks[setTracks.length - 1];

          keyMoments.push(`Set ${setName} opener: ${(opener.song as Record<string, unknown>)?.title || "Unknown"}`);
          if (setTracks.length > 1) {
            keyMoments.push(`Set ${setName} closer: ${(closer.song as Record<string, unknown>)?.title || "Unknown"}`);
          }
        }

        // Build full setlist with segues
        const setTrackTexts = setTracks.map((track: Record<string, unknown>) => {
          let trackText = (track.song as Record<string, unknown>)?.title || "Unknown Song";
          if (track.segue && track.segue !== "none") trackText += " >";
          return trackText;
        });

        setlistParts.push(`Set ${setName}: ${setTrackTexts.join(" ")}`);
      });

      // Identify overall show opener and closer
      const allTracks = s.tracks.sort((a, b) => {
        // Sort by set first, then position
        if (a.set !== b.set) {
          if (a.set.toLowerCase() === "encore") return 1;
          if (b.set.toLowerCase() === "encore") return -1;
          return a.set.localeCompare(b.set);
        }
        return (a.position as number) - (b.position as number);
      });

      if (allTracks.length > 0) {
        keyMoments.unshift(`Show opener: ${(allTracks[0].song as Record<string, unknown>)?.title || "Unknown"}`);
        keyMoments.push(
          `Show closer: ${(allTracks[allTracks.length - 1].song as Record<string, unknown>)?.title || "Unknown"}`,
        );
      }

      content += `. ${keyMoments.join(". ")}. Full setlist: ${setlistParts.join(". ")}`;
    }

    // Add show notes
    if (s.notes) {
      content += `. ${s.notes}`;
    }

    // Emphasize ratings, especially for highly-rated shows
    if (s.averageRating && s.averageRating > 0) {
      const rating = s.averageRating.toFixed(1);
      content += `. Average rating: ${rating}`;

      // Emphasize high ratings for better search relevance
      if (s.averageRating >= 4.5) {
        content += `. Highly rated show: ${rating} stars. Excellent performance: ${rating}/5`;
      } else if (s.averageRating >= 4.0) {
        content += `. High quality show: ${rating} stars. Great performance: ${rating}/5`;
      } else if (s.averageRating >= 3.5) {
        content += `. Good show: ${rating} stars`;
      }
    }

    // Add key characteristics (debuts, bustouts, notable segues)
    const characteristics: string[] = [];

    if (s.tracks && s.tracks.length > 0) {
      // Check for notable segues
      const segues = s.tracks
        .filter((track) => track.segue && track.segue !== "none")
        .map((track) => `${track.song?.title} > ${track.segue}`)
        .slice(0, 3); // Limit to avoid too much text

      if (segues.length > 0) {
        characteristics.push(`notable segues: ${segues.join(", ")}`);
      }

      // Check for tracks with notes (could indicate debuts, bustouts, etc.)
      const tracksWithNotes = s.tracks
        .filter((track) => track.note)
        .map((track) => `${track.song?.title} (${track.note})`)
        .slice(0, 3); // Limit to avoid too much text

      if (tracksWithNotes.length > 0) {
        characteristics.push(`special performances: ${tracksWithNotes.join(", ")}`);
      }

      // Check for all-timer tracks
      const allTimers = s.tracks
        .filter((track) => track.allTimer)
        .map((track) => track.song?.title)
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
