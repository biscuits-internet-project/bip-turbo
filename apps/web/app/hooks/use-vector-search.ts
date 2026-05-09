import type { SearchResult } from "@bip/domain";
import { useCallback, useRef, useState } from "react";

export interface SearchResponse {
  results: SearchResult[];
  query: string;
  totalResults: number;
  executionTimeMs: number;
  searchHistoryId?: string;
}

export interface SearchOptions {
  entityTypes?: string[];
  limit?: number;
  threshold?: number;
}

export interface UseVectorSearchReturn {
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
  query: string;
  totalResults: number;
  executionTimeMs: number | null;
  searchHistoryId: string | null;
  search: (query: string, options?: SearchOptions) => Promise<void>;
  clear: () => void;
}

export function useVectorSearch(): UseVectorSearchReturn {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [totalResults, setTotalResults] = useState(0);
  const [executionTimeMs, setExecutionTimeMs] = useState<number | null>(null);
  const [searchHistoryId, setSearchHistoryId] = useState<string | null>(null);

  // Keep track of the latest request to avoid race conditions
  const latestRequestRef = useRef<number>(0);

  const clear = useCallback(() => {
    setResults([]);
    setIsLoading(false);
    setError(null);
    setQuery("");
    setTotalResults(0);
    setExecutionTimeMs(null);
    setSearchHistoryId(null);
    // Increment to invalidate any pending requests
    latestRequestRef.current++;
  }, []);

  const search = useCallback(
    async (searchQuery: string, options: SearchOptions = {}) => {
      if (!searchQuery.trim()) {
        clear();
        return;
      }

      const requestId = ++latestRequestRef.current;

      setIsLoading(true);
      setError(null);
      setQuery(searchQuery);

      try {
        const response = await fetch("/api/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: searchQuery.trim(),
            entityTypes: options.entityTypes,
            limit: options.limit || 20,
            threshold: options.threshold || 0.3,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: "Search failed" }));
          throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        const data: SearchResponse = await response.json();

        // Only update state if this is still the latest request
        if (requestId === latestRequestRef.current) {
          setResults(data.results);
          setTotalResults(data.totalResults);
          setExecutionTimeMs(data.executionTimeMs);
          setSearchHistoryId(data.searchHistoryId || null);
          setError(null);
        }
      } catch (err) {
        // Only update error state if this is still the latest request
        if (requestId === latestRequestRef.current) {
          const errorMessage = err instanceof Error ? err.message : "Search failed";
          setError(errorMessage);
          setResults([]);
          setTotalResults(0);
          setExecutionTimeMs(null);
          setSearchHistoryId(null);
        }
      } finally {
        // Only update loading state if this is still the latest request
        if (requestId === latestRequestRef.current) {
          setIsLoading(false);
        }
      }
    },
    [clear],
  );

  return {
    results,
    isLoading,
    error,
    query,
    totalResults,
    executionTimeMs,
    searchHistoryId,
    search,
    clear,
  };
}
