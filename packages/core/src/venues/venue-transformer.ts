import type { Venue, VenueMinimal } from "@bip/domain";
import type { VenueRow } from "../_shared/drizzle/types";

export function transformVenue(venue: VenueRow): Venue {
  return {
    ...venue,
    createdAt: new Date(venue.createdAt),
    updatedAt: new Date(venue.updatedAt),
  };
}

export function transformVenueMinimal(venue: VenueRow): VenueMinimal {
  return {
    id: venue.id,
    name: venue.name,
    slug: venue.slug,
    country: venue.country,
    state: venue.state,
    city: venue.city,
  };
}
