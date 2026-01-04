import type {
  MatchDetails,
  SearchResult,
  SegueMatchDetails,
  SegueRunMatchDetails,
  TrackMatchDetails,
} from "@bip/domain";
import { Loader2, Search, X } from "lucide-react";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import { Input } from "~/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "~/components/ui/sheet";
import { useGlobalSearch } from "~/hooks/use-global-search";
import { useVectorSearch } from "~/hooks/use-vector-search";
import { formatDateShort } from "~/lib/utils";
import { notifyClientError, trackClientSubmit } from "~/lib/honeybadger.client";
import { SearchFeedback } from "./search-feedback";

interface GlobalSearchDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SearchResultItemProps {
  result: SearchResult;
  onClose?: () => void;
}

function SearchResultItem({ result, onClose }: SearchResultItemProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(result.url);
    // Only close on mobile/touch devices
    if (onClose && window.matchMedia("(max-width: 768px)").matches) {
      onClose();
    }
  };

  // Use displayText as fallback if individual fields aren't available
  const displayDate = result.date
    ? formatDateShort(result.date)
    : result.displayText?.split(" • ")[0] || "Unknown Date";
  const displayVenue = result.venueName || result.displayText?.split(" • ")[1] || "Unknown Venue";
  const displayLocation = result.venueLocation || "";
  const matchDetails = result.metadata?.matchDetails;

  // Format match details with proper parsing and formatting
  const formatMatchDetails = (details: string) => {
    if (!details) return null;

    try {
      const parsed: MatchDetails = JSON.parse(details);

      const trackMatches = parsed as TrackMatchDetails;
      if (trackMatches.type === "trackMatches" && trackMatches.tracks) {
        // Format track matches into readable context
        const contextParts = trackMatches.tracks.map((track) => {
          let context = "";

          // Add segue context (only if prev/next songs exist)
          if (track.prevSegue === ">" && track.prevSong) {
            context += `${track.prevSong} > `;
          }

          context += track.song;

          if (track.nextSegue === ">" && track.nextSong) {
            context += ` > ${track.nextSong}`;
          }

          // Only show specific musical annotations, not jam descriptions
          const musicalAnnotations = ["inverted", "dyslexic", "unfinished", "ending only"];
          if (track.note && musicalAnnotations.some((annotation) => track.note?.toLowerCase().includes(annotation))) {
            // Extract just the annotation term if it's embedded in a longer note
            const matchedAnnotation = musicalAnnotations.find((annotation) =>
              track.note?.toLowerCase().includes(annotation),
            );
            context += ` (${matchedAnnotation})`;
          }

          // Add position context
          if (track.isOpener) {
            context += track.set?.startsWith("E") ? " (Encore Opener)" : " (Opener)";
          } else if (track.isCloser) {
            context += " (Closer)";
          }

          return context;
        });

        // If multiple tracks, join with line breaks, otherwise single line
        return contextParts.length > 1 ? contextParts.join("\n") : contextParts[0];
      }

      const segueMatch = parsed as SegueMatchDetails;
      if (segueMatch.type === "segue" && segueMatch.song1 && segueMatch.song2) {
        // Format segue matches
        let context = `${segueMatch.song1} ${segueMatch.segueSymbol} ${segueMatch.song2}`;
        if (segueMatch.set) {
          context = `${segueMatch.set}: ${context}`;
        }
        return context;
      }

      const segueRunMatch = parsed as SegueRunMatchDetails;
      if (segueRunMatch.type === "segueMatch" && segueRunMatch.segueRun) {
        // Format new segue run matches
        const run = segueRunMatch.segueRun;
        return `${run.set}: ${run.sequence}`;
      }

      return null;
    } catch (_e) {
      // If not valid JSON, return null
      return null;
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="block w-full text-left p-3 hover:bg-purple-900/20 active:bg-purple-900/30 rounded-lg transition-colors group cursor-pointer"
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-base text-gray-200">
            {displayDate} • {displayVenue}
            {displayLocation && ` • ${displayLocation}`}
          </div>
          {matchDetails && formatMatchDetails(matchDetails) && (
            <div className="text-sm text-purple-300 mt-1 font-medium whitespace-pre-line">
              {formatMatchDetails(matchDetails)}
            </div>
          )}
        </div>
        {result.score && <span className="text-xs text-purple-400 font-medium">{result.score}%</span>}
      </div>
    </button>
  );
}

export function GlobalSearchDrawer({ open, onOpenChange }: GlobalSearchDrawerProps) {
  const { query, setQuery } = useGlobalSearch();
  const { results, isLoading, error, searchHistoryId, search, clear } = useVectorSearch();
  const navigate = useNavigate();

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      clear();
      return;
    }

    const timeoutId = setTimeout(() => {
      search(query);
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [query, search, clear]);

  const _handleSelect = useCallback(
    (url: string) => {
      navigate(url);
      // Keep drawer open for continued searching
    },
    [navigate],
  );

  const handleFeedback = useCallback(
    async (searchId: string, sentiment: "positive" | "negative", feedback?: string) => {
      trackClientSubmit("search-feedback:api", {
        searchId,
        sentiment,
      });
      let response: Response;
      try {
        response = await fetch("/api/search/feedback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            searchHistoryId: searchId,
            sentiment,
            feedbackMessage: feedback,
          }),
        });
      } catch (error) {
        notifyClientError(error, {
          context: {
            action: "search-feedback-api",
            searchId,
            sentiment,
          },
        });
        throw error;
      }

      if (!response.ok) {
        const error = new Error("Failed to submit feedback");
        notifyClientError(error, {
          context: {
            action: "search-feedback-api",
            searchId,
            sentiment,
            status: response.status,
          },
        });
        throw error;
      }
    },
    [],
  );

  // Group results by entity type
  const _groupedResults = results.reduce(
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md lg:max-w-lg xl:max-w-xl overflow-y-auto bg-gradient-to-br from-gray-900 via-purple-900/60 to-gray-900 border-l border-purple-500/30 backdrop-blur-md"
      >
        <SheetHeader className="mb-6 pb-4 border-b border-purple-500/20">
          <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Search
          </SheetTitle>
        </SheetHeader>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400" />
          <Input
            placeholder="Search shows, songs, venues, or segues..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-10 h-12 text-base bg-gray-800/50 border-purple-500/30 focus:border-purple-400 focus:ring-purple-400/20"
            autoFocus
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {searchHistoryId && results.length > 0 && (
          <div className="mb-6">
            <SearchFeedback searchId={searchHistoryId} onFeedback={handleFeedback} className="flex justify-center" />
          </div>
        )}

        <div className="space-y-6">
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
              <div className="space-y-1">
                {/* Sort all results by score */}
                {[...results]
                  .sort((a, b) => (b.score || 0) - (a.score || 0))
                  .map((result) => (
                    <SearchResultItem key={result.id} result={result} onClose={() => onOpenChange(false)} />
                  ))}
              </div>

              <div className="border-t border-purple-500/20 pt-4 mt-6">
                <div className="text-sm text-purple-400 text-center font-medium">
                  {results.length} {results.length === 1 ? "result" : "results"} found
                </div>
              </div>
            </>
          )}

          {!query.trim() && (
            <div className="py-8 text-center">
              <p className="text-base text-gray-300">Search across all shows, songs, venues, and segues</p>
              <p className="text-sm text-gray-500 mt-2">
                Try searching for a date, venue, song name, or segue sequence like: shimmy {">"} basis"
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
