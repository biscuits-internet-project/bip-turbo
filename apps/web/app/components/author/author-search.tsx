import type { Author } from "@bip/domain";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "~/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { cn } from "~/lib/utils";

interface AuthorSearchProps {
  value?: string | null;
  onValueChange: (value: string | null) => void;
  placeholder?: string;
  className?: string;
  allowCreate?: boolean;
}

export function AuthorSearch({
  value,
  onValueChange,
  placeholder = "Search authors...",
  className,
  allowCreate = false,
}: AuthorSearchProps) {
  const [open, setOpen] = useState(false);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentAuthor, setCurrentAuthor] = useState<Author | null>(null);
  const [creating, setCreating] = useState(false);
  const [hasLoadedInitial, setHasLoadedInitial] = useState(false);

  const selectedAuthor = authors.find((author) => author.id === value) || currentAuthor;

  const searchAuthors = useCallback(async (query: string) => {
    setLoading(true);
    try {
      const url =
        query && query.length >= 2 ? `/api/authors?q=${encodeURIComponent(query)}&limit=20` : "/api/authors?top=10";

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setAuthors(data);
      }
    } catch (_error) {
      // Swallow errors for now; UI remains unchanged on failure.
    } finally {
      setLoading(false);
    }
  }, []);

  // Load current author when value changes
  useEffect(() => {
    const loadCurrentAuthor = async () => {
      if (value && !authors.find((a) => a.id === value) && !currentAuthor) {
        try {
          const response = await fetch(`/api/authors/${value}`);
          if (response.ok) {
            const author = await response.json();
            setCurrentAuthor(author);
          }
        } catch (_error) {
          // Ignore errors when fetching the initial author; dropdown will just show placeholder.
        }
      } else if (!value) {
        setCurrentAuthor(null);
      }
    };

    loadCurrentAuthor();
  }, [value, authors, currentAuthor]);

  // Load top authors when dropdown opens
  useEffect(() => {
    if (open && !hasLoadedInitial) {
      searchAuthors("");
      setHasLoadedInitial(true);
    }
  }, [open, hasLoadedInitial, searchAuthors]);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      searchAuthors(searchQuery);
    }, 300); // Debounce search

    return () => clearTimeout(delayedSearch);
  }, [searchQuery, searchAuthors]);

  const handleCreateAuthor = async () => {
    if (!allowCreate || !searchQuery.trim() || creating) return;

    setCreating(true);
    try {
      const response = await fetch("/api/admin/authors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: searchQuery.trim() }),
      });

      if (response.ok) {
        const newAuthor = await response.json();
        // Add to local state
        setAuthors((prev) => [newAuthor, ...prev]);
        // Select the newly created author
        onValueChange(newAuthor.id);
        setSearchQuery("");
        setOpen(false);
      }
    } catch (_error) {
      // Fail silently; the button remains available for another attempt.
    } finally {
      setCreating(false);
    }
  };

  const showCreateOption =
    allowCreate &&
    searchQuery.trim().length >= 2 &&
    !authors.some((a) => a.name.toLowerCase() === searchQuery.toLowerCase());

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-expanded={open}
          className={cn(
            "justify-between bg-glass-bg border border-glass-border text-white hover:bg-glass-bg/80 focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/20",
            className,
          )}
        >
          {selectedAuthor ? selectedAuthor.name : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0 bg-content-bg-primary/95 backdrop-blur-md border border-content-glass-border"
        align="start"
      >
        <Command className="bg-transparent" shouldFilter={false}>
          <CommandInput
            placeholder="Search authors..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="text-white"
          />
          <CommandList className="max-h-[300px] overflow-auto">
            <CommandEmpty>{loading ? "Loading..." : creating ? "Creating..." : "No authors found."}</CommandEmpty>
            <CommandGroup>
              {/* Option to clear selection */}
              <CommandItem
                value="none"
                onSelect={() => {
                  onValueChange(null);
                  setOpen(false);
                }}
                className="text-white hover:bg-content-bg-secondary"
              >
                <Check className={cn("mr-2 h-4 w-4", !value ? "opacity-100" : "opacity-0")} />
                All Authors
              </CommandItem>

              {/* Option to create new author */}
              {showCreateOption && (
                <CommandItem
                  value={`create-${searchQuery}`}
                  onSelect={handleCreateAuthor}
                  className="text-brand-primary hover:bg-content-bg-secondary font-medium"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create "{searchQuery}"
                </CommandItem>
              )}

              {authors.map((author) => (
                <CommandItem
                  key={author.id}
                  value={author.id}
                  onSelect={() => {
                    onValueChange(author.id);
                    setOpen(false);
                  }}
                  className="text-white hover:bg-content-bg-secondary"
                >
                  <Check className={cn("mr-2 h-4 w-4", value === author.id ? "opacity-100" : "opacity-0")} />
                  {author.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
