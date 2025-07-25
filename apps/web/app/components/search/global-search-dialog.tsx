import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { useVectorSearch } from "~/hooks/use-vector-search";
import { Badge } from "~/components/ui/badge";
import { Loader2, Music, MapPin, Calendar, Play } from "lucide-react";
import { cn } from "~/lib/utils";

interface GlobalSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ENTITY_ICONS = {
  show: Calendar,
  song: Music,
  venue: MapPin,
  track: Play,
} as const;

const ENTITY_LABELS = {
  show: "Show",
  song: "Song", 
  venue: "Venue",
  track: "Track",
} as const;

export function GlobalSearchDialog({ open, onOpenChange }: GlobalSearchDialogProps) {
  const [query, setQuery] = useState("");
  const { results, isLoading, error, search, clear } = useVectorSearch();
  const navigate = useNavigate();

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      clear();
      return;
    }

    const timeoutId = setTimeout(() => {
      search(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, search, clear]);

  const handleSelect = useCallback((url: string) => {
    onOpenChange(false);
    navigate(url);
    setQuery("");
    clear();
  }, [onOpenChange, navigate, clear]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onOpenChange(false);
      setQuery("");
      clear();
    }
  }, [onOpenChange, clear]);

  // Group results by entity type
  const groupedResults = results.reduce((groups, result) => {
    const type = result.entityType;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(result);
    return groups;
  }, {} as Record<string, typeof results>);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search shows, songs, venues, tracks..."
        value={query}
        onValueChange={setQuery}
        onKeyDown={handleKeyDown}
      />
      <CommandList>
        {isLoading && (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span className="text-sm text-muted-foreground">Searching...</span>
          </div>
        )}

        {error && (
          <div className="py-6 text-center">
            <p className="text-sm text-destructive">Error: {error}</p>
          </div>
        )}

        {!isLoading && !error && query.trim() && results.length === 0 && (
          <CommandEmpty>No results found for "{query}"</CommandEmpty>
        )}

        {!isLoading && !error && results.length > 0 && (
          <>
            {Object.entries(groupedResults).map(([entityType, typeResults]) => {
              const Icon = ENTITY_ICONS[entityType as keyof typeof ENTITY_ICONS] || Music;
              const label = ENTITY_LABELS[entityType as keyof typeof ENTITY_LABELS] || entityType;
              
              return (
                <CommandGroup key={entityType} heading={`${label}s`}>
                  {typeResults.map((result) => (
                    <CommandItem
                      key={result.id}
                      value={`${result.entityType}-${result.entityId}`}
                      onSelect={() => handleSelect(result.url)}
                      className="flex items-center gap-3 py-3 cursor-pointer"
                    >
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{result.displayText}</div>
                        {result.metadata?.similarity && (
                          <div className="text-xs text-muted-foreground">
                            {Math.round(result.score * 100)}% match
                          </div>
                        )}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {label}
                      </Badge>
                    </CommandItem>
                  ))}
                </CommandGroup>
              );
            })}
            
            {results.length > 0 && (
              <div className="border-t px-2 py-2">
                <div className="text-xs text-muted-foreground text-center">
                  {results.length} results • Press Enter to navigate
                </div>
              </div>
            )}
          </>
        )}

        {!query.trim() && (
          <div className="py-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Search across all shows, songs, venues, and tracks
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="outline" className="text-xs">
                <Music className="h-3 w-3 mr-1" />
                Songs
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Calendar className="h-3 w-3 mr-1" />
                Shows
              </Badge>
              <Badge variant="outline" className="text-xs">
                <MapPin className="h-3 w-3 mr-1" />
                Venues
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Play className="h-3 w-3 mr-1" />
                Tracks
              </Badge>
            </div>
          </div>
        )}
      </CommandList>
    </CommandDialog>
  );
}