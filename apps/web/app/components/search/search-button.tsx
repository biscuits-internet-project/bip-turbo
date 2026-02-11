import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Input } from "~/components/ui/input";
import { useGlobalSearch } from "~/hooks/use-global-search";
import { cn } from "~/lib/utils";

interface SearchButtonProps {
  className?: string;
  showShortcut?: boolean;
}

export function SearchButton({
  className,
  showShortcut = true,
}: SearchButtonProps) {
  const { open, setQuery, query } = useGlobalSearch();
  const [localQuery, setLocalQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync with global query when it changes
  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalQuery(e.target.value);
  };

  const handleSearch = () => {
    const trimmedQuery = localQuery.trim();
    if (trimmedQuery) {
      if (trimmedQuery === query) {
        // Same query, just open with cached results
        open();
      } else {
        // New query, update and search
        setQuery(trimmedQuery);
        open();
      }
    }
  };

  const handleClear = () => {
    setLocalQuery("");
    setQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape' && localQuery) {
      handleClear();
    }
  };

  const handleFocus = () => {
    // If there's a query with results, show them
    if (query.trim()) {
      open();
    }
  };

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      <Input
        ref={inputRef}
        value={localQuery}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        placeholder="Search..."
        className={cn(
          "pl-9",
          localQuery ? "pr-8" : "pr-16",
          "bg-muted/50 border-muted",
          "h-9",
          "focus:bg-background"
        )}
      />
      {localQuery ? (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded"
        >
          <X className="h-3 w-3 text-muted-foreground" />
        </button>
      ) : (
        showShortcut && (
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-sm font-medium text-muted-foreground pointer-events-none">
            <span className="text-sm">⌘</span>K
          </kbd>
        )
      )}
    </div>
  );
}
