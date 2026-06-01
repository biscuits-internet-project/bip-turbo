// US venues store their country as either of these; both are omitted from the
// location line since the "City, ST" form already implies the country.
const US_COUNTRY_NAMES = new Set(["usa", "united states"]);

/**
 * Build the "City, State, Country" location line shown beside a venue name.
 *
 * State is empty for international venues, so it's only appended when present;
 * the country fills in instead (otherwise the line dangles a comma, e.g.
 * "Reykjavik,"). The US country name is omitted because domestic venues read as
 * "City, ST" by convention. A missing city yields an empty string so callers
 * prefixing a name can `[name, location].filter(Boolean)` without "Name, ".
 */
export function formatVenueLocation(venue: {
  city?: string | null;
  state?: string | null;
  country?: string | null;
}): string {
  if (!venue.city) return "";
  const parts = [venue.city];
  if (venue.state) parts.push(venue.state);
  if (venue.country && !US_COUNTRY_NAMES.has(venue.country.toLowerCase())) parts.push(venue.country);
  return parts.join(", ");
}

/**
 * Country for a venue's schema.org PostalAddress. Defaults to "US" when the
 * venue has no country, since the catalog is US-majority and a missing value
 * historically meant a domestic venue.
 */
export function venueAddressCountry(country?: string | null): string {
  return country || "US";
}
