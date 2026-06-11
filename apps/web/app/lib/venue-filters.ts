/** US country spellings stored on venues; both read as "domestic". */
const US_COUNTRY_NAMES = new Set(["usa", "united states"]);

type VenueFilterFields = {
  name: string;
  city: string;
  state: string | null;
  country: string;
};

/**
 * Free-text match for the /venues search box across name, city, state, and
 * country — the single input replaces the old per-field card search. An empty
 * query matches everything.
 */
export function venueMatchesSearch(venue: VenueFilterFields, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return [venue.name, venue.city, venue.state, venue.country].some((field) =>
    (field ?? "").toLowerCase().includes(needle),
  );
}

/**
 * State-dropdown predicate. `""` matches all; `"international"` matches venues
 * with no US state (no state set, or a non-US country); any other value is a
 * US state code matched exactly.
 */
export function matchesStateFilter(venue: VenueFilterFields, state: string): boolean {
  if (!state) return true;
  if (state === "international") {
    const country = venue.country?.toLowerCase().trim();
    return (!venue.state && Boolean(venue.country)) || (Boolean(country) && !US_COUNTRY_NAMES.has(country));
  }
  return venue.state === state;
}
