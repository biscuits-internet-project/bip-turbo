import type { Venue } from "@bip/domain";
import { Check, ChevronsUpDown } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "~/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { cn } from "~/lib/utils";

interface VenueSearchProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function VenueSearch({ value, onValueChange, placeholder = "Search venues...", className }: VenueSearchProps) {
  const [open, setOpen] = useState(false);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentVenue, setCurrentVenue] = useState<Venue | null>(null);

  const selectedVenue = venues.find((venue) => venue.id === value) || currentVenue;

  const searchVenues = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setVenues([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/venues?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setVenues(data);
      } else {
      }
    } catch (_error) {
    } finally {
      setLoading(false);
    }
  }, []);

  // Load current venue when value changes
  useEffect(() => {
    const loadCurrentVenue = async () => {
      if (value && value !== "none" && !venues.find((v) => v.id === value) && !currentVenue) {
        try {
          const response = await fetch(`/api/venues/${value}`);
          if (response.ok) {
            const venue = await response.json();
            setCurrentVenue(venue);
          }
        } catch (_error) {}
      } else if (!value || value === "none") {
        setCurrentVenue(null);
      }
    };

    loadCurrentVenue();
  }, [value, venues, currentVenue]);

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
          aria-expanded={open}
          className={cn(
            "justify-between bg-content-bg border-content-bg-secondary text-white hover:bg-content-bg-secondary",
            className,
          )}
        >
          {selectedVenue ? formatVenueLabel(selectedVenue) : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0 bg-content-bg-primary/95 backdrop-blur-md border border-content-glass-border"
        align="start"
      >
        <Command className="bg-transparent" shouldFilter={false}>
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
                className="text-white hover:bg-content-bg-secondary"
              >
                <Check className={cn("mr-2 h-4 w-4", value === "none" ? "opacity-100" : "opacity-0")} />
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
                  className="text-white hover:bg-content-bg-secondary"
                >
                  <Check className={cn("mr-2 h-4 w-4", value === venue.id ? "opacity-100" : "opacity-0")} />
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
