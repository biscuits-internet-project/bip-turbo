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
    <CommandDialog open={open} onOpenChange={onOpenChange} shouldFilter={false}>
      <div className="[&_[cmdk-root]]:max-h-[400px]">
        <CommandInput
          placeholder="Search shows, songs, venues, tracks..."
          value={query}
          onValueChange={setQuery}
          onKeyDown={handleKeyDown}
        />
        <CommandList>
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin mr-3 text-gray-400" />
            <span className="text-base text-gray-300">Searching...</span>
          </div>
        )}

        {error && (
          <div className="py-8 text-center">
            <p className="text-base text-red-400">Error: {error}</p>
          </div>
        )}

        {!isLoading && !error && query.trim() && results.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-base text-gray-400">No results found for "{query}"</p>
          </div>
        )}

        {!isLoading && !error && results.length > 0 && (
          <>
            {Object.entries(groupedResults).map(([entityType, typeResults]) => {
              const Icon = ENTITY_ICONS[entityType as keyof typeof ENTITY_ICONS] || Music;
              const label = ENTITY_LABELS[entityType as keyof typeof ENTITY_LABELS] || entityType;
              
              return (
                <CommandGroup key={entityType} heading={`${label}s`} className="[&_[cmdk-group-heading]]:text-base [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-gray-300 [&_[cmdk-group-heading]]:mb-2">
                  {typeResults.map((result) => (
                    <CommandItem
                      key={result.id}
                      value={`${result.displayText} ${result.entityType} ${result.entityId}`}
                      onSelect={() => handleSelect(result.url)}
                    >
                      <Icon className="h-5 w-5 text-gray-400" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-lg truncate text-white">{result.displayText}</div>
                        {result.metadata?.similarity && (
                          <div className="text-sm text-gray-400">
                            {Math.round(result.score)}% match
                          </div>
                        )}
                      </div>
                      <Badge variant="outline" className="text-sm border-green-500/40 text-green-300 bg-green-500/10">
                        {label}
                      </Badge>
                    </CommandItem>
                  ))}
                </CommandGroup>
              );
            })}
            
            {results.length > 0 && (
              <div className="border-t border-purple-500/30 px-4 py-3">
                <div className="text-sm text-purple-300 text-center">
                  {results.length} results • Click to navigate
                </div>
              </div>
            )}
          </>
        )}

        {!query.trim() && (
          <div className="py-8 text-center">
            <p className="text-base text-gray-300 mb-4">
              Search across all shows, songs, venues, and tracks
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Badge variant="outline" className="text-sm border-purple-500/40 text-purple-300 bg-purple-500/10">
                <Music className="h-4 w-4 mr-2" />
                Songs
              </Badge>
              <Badge variant="outline" className="text-sm border-purple-500/40 text-purple-300 bg-purple-500/10">
                <Calendar className="h-4 w-4 mr-2" />
                Shows
              </Badge>
              <Badge variant="outline" className="text-sm border-green-500/40 text-green-300 bg-green-500/10">
                <MapPin className="h-4 w-4 mr-2" />
                Venues
              </Badge>
              <Badge variant="outline" className="text-sm border-green-500/40 text-green-300 bg-green-500/10">
                <Play className="h-4 w-4 mr-2" />
                Tracks
              </Badge>
            </div>
          </div>
        )}
      </CommandList>
      </div>
    </CommandDialog>
  );
}