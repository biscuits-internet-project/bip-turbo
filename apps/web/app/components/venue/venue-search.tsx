import type { Venue } from "@bip/domain";
import { SearchPicker } from "~/components/ui/search-picker";

interface VenueSearchProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

function formatVenueLabel(venue: Venue) {
  const location = [venue.city, venue.state].filter(Boolean).join(", ");
  return location ? `${venue.name} (${location})` : venue.name;
}

/**
 * Venue picker for the show edit form. Requires 2+ chars before
 * searching the catalog; the trigger seeds itself by fetching the
 * current venue by id so the show's existing venue renders without
 * needing to open the popover first. Form state uses "none" instead
 * of null for compatibility with the surrounding form layer.
 */
export function VenueSearch({ value, onValueChange, placeholder = "Search venues...", className }: VenueSearchProps) {
  return (
    <SearchPicker<Venue>
      value={value && value !== "none" ? value : null}
      onValueChange={(v) => onValueChange(v ?? "none")}
      className={className}
      placeholder={placeholder}
      searchPlaceholder="Search venues..."
      emptyMessage={(q) => (q.length < 2 ? "Type to search venues" : "No venues found.")}
      loadingMessage="Searching..."
      itemId={(v) => v.id}
      itemLabel={formatVenueLabel}
      noneLabel="No venue"
      fetchResults={async (query) => {
        if (!query || query.length < 2) return [];
        const response = await fetch(`/api/venues?q=${encodeURIComponent(query)}`);
        if (!response.ok) return [];
        return (await response.json()) as Venue[];
      }}
      fetchById={async (id) => {
        const response = await fetch(`/api/venues/${id}`);
        if (!response.ok) return null;
        return (await response.json()) as Venue;
      }}
    />
  );
}
