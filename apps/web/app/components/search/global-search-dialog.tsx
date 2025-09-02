import { Calendar, Loader2, MapPin, Music, Play } from "lucide-react";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import { CommandDialog, CommandGroup, CommandInput, CommandItem, CommandList } from "~/components/ui/command";
import { useGlobalSearch } from "~/hooks/use-global-search";
import { useVectorSearch } from "~/hooks/use-vector-search";

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
  const { query, setQuery } = useGlobalSearch();
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
    }, 600);

    return () => clearTimeout(timeoutId);
  }, [query, search, clear]);

  const handleSelect = useCallback(
    (url: string) => {
      onOpenChange(false); // Close dialog but keep query
      navigate(url);
    },
    [onOpenChange, navigate],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
        // Don't clear query, just close dialog
      }
    },
    [onOpenChange],
  );

  // Group results by entity type
  const groupedResults = results.reduce(
    (groups, result) => {
      const type = result.entityType;
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(result);
      return groups;
    },
    {} as Record<string, typeof results>,
  );

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} shouldFilter={false}>
      <div className="[&_[cmdk-root]]:max-h-[600px] [&_[cmdk-root]]:max-w-[800px] [&_[cmdk-root]]:w-[800px]">
        <CommandInput
          placeholder="Search shows, songs, venues..."
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
                  <CommandGroup
                    key={entityType}
                    heading={`${label}s`}
                    className="[&_[cmdk-group-heading]]:text-base [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-gray-300 [&_[cmdk-group-heading]]:mb-2"
                  >
                    {typeResults.map((result) => (
                      <CommandItem
                        key={result.id}
                        value={`${result.displayText} ${result.entityType} ${result.entityId}`}
                        onSelect={() => handleSelect(result.url)}
                      >
                        <Icon className="h-5 w-5 text-gray-400" />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-lg truncate text-white">{result.displayText}</div>
                          {(result.metadata as Record<string, unknown>)?.similarity ? (
                            <div className="text-sm text-gray-400">{Math.round(result.score as number)}% match</div>
                          ) : null}
                        </div>
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
              <p className="text-base text-gray-300">Search across all shows, songs, and venues</p>
            </div>
          )}
        </CommandList>
      </div>
    </CommandDialog>
  );
}
