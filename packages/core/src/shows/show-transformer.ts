import type { Show, ShowMinimal } from "@bip/domain";
import type { ShowRow, VenueRow } from "../_shared/drizzle/types";
import { transformVenue, transformVenueMinimal } from "../venues/venue-transformer";

export function transformShow(show: ShowRow, venue?: VenueRow | null): Show {
  return {
    ...show,
    date: new Date(show.date),
    createdAt: new Date(show.createdAt),
    updatedAt: new Date(show.updatedAt),
    venue: venue ? transformVenue(venue) : null,
  };
}

export function transformShowMinimal(show: ShowRow): ShowMinimal {
  return {
    date: new Date(show.date),
    slug: show.slug,
    id: show.id,
    venueId: show.venueId ?? null,
  };
}
