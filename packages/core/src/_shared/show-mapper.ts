import type { Show } from "@bip/domain";
import type { DbShow } from "./database/models";

/**
 * Build the domain `Show` from a raw Prisma row.
 *
 * Every field is listed explicitly rather than spread (`...rest`), because the
 * rows handed to this mapper are loaded with relation includes (tracks, venue,
 * showMusicians) and a spread sweeps all of them plus non-domain columns
 * (searchText, weightedRating) into the returned object. That excess rides
 * along into every cached setlist payload, and the declared `Show` return type
 * does not catch it: TypeScript's excess-property check does not apply to a
 * spread. An explicit list means a new relation on a query's include cannot
 * silently re-inflate the payload.
 *
 * The relation-shaped fields on `Show` (`tracks`, `venue`) are deliberately not
 * populated here; callers that need them attach mapped copies themselves.
 */
export function mapDbShowToDomainEntity(dbShow: DbShow): Show {
  return {
    id: dbShow.id,
    slug: dbShow.slug ?? "",
    date: String(dbShow.date),
    venueId: dbShow.venueId ?? "",
    bandId: dbShow.bandId ?? "",
    notes: dbShow.notes,
    createdAt: new Date(dbShow.createdAt),
    updatedAt: new Date(dbShow.updatedAt),
    likesCount: dbShow.likesCount,
    relistenUrl: dbShow.relistenUrl,
    averageRating: dbShow.averageRating,
    ratingsCount: dbShow.ratingsCount,
    showPhotosCount: dbShow.showPhotosCount,
    showYoutubesCount: dbShow.showYoutubesCount,
    reviewsCount: dbShow.reviewsCount,
    countForStats: dbShow.countForStats,
    dayOrder: dbShow.dayOrder,
    duration: dbShow.duration,
  };
}
