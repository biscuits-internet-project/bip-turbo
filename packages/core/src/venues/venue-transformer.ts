import type { Venue } from "@bip/domain";
import type { VenueRow } from "../_shared/drizzle/types";

export function transformVenue(venue: VenueRow): Venue {
  return {
    ...venue,
    createdAt: new Date(venue.createdAt),
    updatedAt: new Date(venue.updatedAt),
  };
}
