import type { ReactNode } from "react";

interface VenueInfo {
  name?: string | null;
  city?: string | null;
  state?: string | null;
}

interface DateVenueCellProps {
  date: ReactNode;
  venue?: VenueInfo;
}

/**
 * Combined Date + Venue cell for the performance tables (song-detail
 * "All Performances" and /songs/all-timers). The date renders on top; the
 * venue stacks beneath it at sm+ and is hidden on mobile so the column
 * collapses to a single-line date at narrow widths.
 */
export function DateVenueCell({ date, venue }: DateVenueCellProps) {
  const venueLabel = venue?.name ? [venue.name, venue.city, venue.state].filter(Boolean).join(", ") : null;

  return (
    <>
      <div className="font-medium">{date}</div>
      {venueLabel && <div className="text-xs text-content-text-tertiary mt-0.5 hidden sm:block">{venueLabel}</div>}
    </>
  );
}
