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
 * "All Performances" and /songs/all-timers). The venue sublabel only
 * shows at `sm` and above (mobile keeps the row tight to a single line),
 * AND only when this cell's inline-size container has room — so the row
 * still collapses cleanly when the column gets squeezed on desktop.
 */
export function DateVenueCell({ date, venue }: DateVenueCellProps) {
  const venueLabel = venue?.name ? [venue.name, venue.city, venue.state].filter(Boolean).join(", ") : null;

  return (
    <div className="@container/datecell">
      <div className="font-medium">{date}</div>
      {venueLabel && (
        <div className="text-xs text-content-text-tertiary mt-0.5 hidden sm:@[10rem]/datecell:block">{venueLabel}</div>
      )}
    </div>
  );
}
