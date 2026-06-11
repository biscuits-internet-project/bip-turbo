import type { VenueShowAggregate } from "@bip/core";
import type { Venue } from "@bip/domain";

/** A venue plus the per-venue show stats the /venues table renders. */
export interface VenueRow {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string | null;
  country: string;
  showCount: number;
  years: number[];
  firstSlug: string | null;
  firstDate: string | null;
  lastSlug: string | null;
  lastDate: string | null;
}

/**
 * Join venues to their show aggregates by id for the index table. Venues with
 * no shows (absent from the aggregate query) get zeroed stats; the loader hides
 * those from non-admins and the stat counts, but keeps them for admins so they
 * can delete the stale rows.
 */
export function buildVenueRows(venues: Venue[], aggregates: VenueShowAggregate[]): VenueRow[] {
  const byVenueId = new Map(aggregates.map((aggregate) => [aggregate.venueId, aggregate]));

  return venues.map((venue) => {
    const aggregate = byVenueId.get(venue.id);
    return {
      id: venue.id,
      name: venue.name,
      slug: venue.slug,
      city: venue.city,
      state: venue.state,
      country: venue.country,
      showCount: aggregate?.showCount ?? 0,
      years: aggregate?.years ?? [],
      firstSlug: aggregate?.firstSlug ?? null,
      firstDate: aggregate?.firstDate ?? null,
      lastSlug: aggregate?.lastSlug ?? null,
      lastDate: aggregate?.lastDate ?? null,
    };
  });
}
