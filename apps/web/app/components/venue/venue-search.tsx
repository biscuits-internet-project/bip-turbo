import { useState, useEffect, useCallback } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import type { Venue } from "@bip/domain";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "~/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";

interface VenueSearchProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function VenueSearch({ 
  value, 
  onValueChange, 
  placeholder = "Search venues...",
  className 
}: VenueSearchProps) {
  const [open, setOpen] = useState(false);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedVenue = venues.find((venue) => venue.id === value);

  const searchVenues = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setVenues([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/venues?q=${encodeURIComponent(query)}`);
      console.log("Venue search response status:", response.status);
      if (response.ok) {
        const data = await response.json();
        console.log("Venue search response data:", data);
        setVenues(data);
      } else {
        console.error("Venue search failed with status:", response.status);
      }
    } catch (error) {
      console.error("Failed to search venues:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      searchVenues(searchQuery);
    }, 300); // Debounce search

    return () => clearTimeout(delayedSearch);
  }, [searchQuery, searchVenues]);

  const formatVenueLabel = (venue: Venue) => {
    const location = [venue.city, venue.state].filter(Boolean).join(", ");
    return location ? `${venue.name} (${location})` : venue.name;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "justify-between bg-gray-800 border-gray-700 text-white hover:bg-gray-700",
            className
          )}
        >
          {selectedVenue ? formatVenueLabel(selectedVenue) : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 bg-gray-800 border-gray-700" align="start">
        <Command className="bg-gray-800" shouldFilter={false}>
          <CommandInput
            placeholder="Search venues..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="text-white"
          />
          <CommandList>
            <CommandEmpty>
              {loading ? "Searching..." : searchQuery.length < 2 ? "Type to search venues" : "No venues found."}
            </CommandEmpty>
            <CommandGroup>
              {/* Option to clear selection */}
              <CommandItem
                value="none"
                onSelect={() => {
                  onValueChange("none");
                  setOpen(false);
                }}
                className="text-white hover:bg-gray-700"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === "none" ? "opacity-100" : "opacity-0"
                  )}
                />
                No venue
              </CommandItem>
              
              {venues.map((venue) => (
                <CommandItem
                  key={venue.id}
                  value={venue.id}
                  onSelect={() => {
                    onValueChange(venue.id);
                    setOpen(false);
                  }}
                  className="text-white hover:bg-gray-700"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === venue.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {formatVenueLabel(venue)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}