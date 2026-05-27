/**
 * Canonical client-side identifiers for the three known rock operas.
 *
 * The DB's `rock_operas` table is the runtime source of truth (the
 * RockOpera lookup is queried via `services.rockOperas.findAll()` and
 * mirrored from prod via `sync-missing-shows`). These constants exist so
 * static call sites that link to one of the three known operas — the
 * resource pages themselves, the home page hero, the resources index,
 * band-history prose — share a single string per opera instead of
 * scattering `"hot-air-balloon"` literals throughout the codebase.
 *
 * If a fourth rock opera is added in the future, the DB will start
 * returning it from `findAll()` automatically; this file only needs to
 * grow when a STATIC reference (a Link `to=`, an image filename, etc.)
 * needs to be wired up.
 */

export const ROCK_OPERA_SLUG = {
  HOT_AIR_BALLOON: "hot-air-balloon",
  CHEMICAL_WARFARE_BRIGADE: "chemical-warfare-brigade",
  REVOLUTION_IN_MOTION: "revolution-in-motion",
} as const;

export type RockOperaSlug = (typeof ROCK_OPERA_SLUG)[keyof typeof ROCK_OPERA_SLUG];

/**
 * Build the resource page path for a known rock opera slug. Keeps the
 * `/resources/` prefix in one place so a future route rename only
 * touches this file.
 */
export function rockOperaPath(slug: RockOperaSlug): string {
  return `/resources/${slug}`;
}
