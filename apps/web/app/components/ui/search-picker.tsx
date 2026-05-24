import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { type ReactNode, useCallback, useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "~/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { cn } from "~/lib/utils";

export interface SearchPickerCreateOption<T> {
  // Built from the current query — e.g. `Create "Foo"`.
  label: (query: string) => string;
  // Called when the user clicks the create option. Returns the new item, or
  // null if creation failed. On success, the new item is selected and the
  // popover closes.
  onCreate: (query: string) => Promise<T | null>;
  // Optional predicate to decide whether the create option should show.
  // Default: query has at least 2 trimmed chars AND no existing item
  // already matches the query exactly via itemLabel comparison.
  shouldShow?: (query: string, items: T[]) => boolean;
}

interface SearchPickerProps<T> {
  // The selected item's id, or null when nothing is selected.
  value: string | null;
  onValueChange: (value: string | null) => void;

  // Returns items matching the current query. Wrappers decide what "empty
  // query" means — return [] to suppress the list, or return top-N items.
  fetchResults: (query: string) => Promise<T[]>;
  // Optional: fetch by id so the trigger label can render before the user
  // opens the popover. Use this OR `initialItem`.
  fetchById?: (id: string) => Promise<T | null>;
  // Pre-seeded initial item — alternative to `fetchById` when the caller
  // already has the full record (e.g. from a parent loader).
  initialItem?: T | null;

  itemId: (item: T) => string;
  itemLabel: (item: T) => ReactNode;

  // Optional clear-selection row at the top of the list. When set, a row
  // with this label is rendered first; selecting it fires onValueChange(null).
  noneLabel?: string;

  // Optional create-from-query affordance (AuthorSearch's feature). When
  // provided, a "Create …" row appears at the top of the list whenever
  // `shouldShow` returns true.
  allowCreate?: SearchPickerCreateOption<T>;

  // If true, fires fetchResults("") as soon as the popover opens — used
  // when the wrapper wants to seed a top-N list before the user types.
  loadOnOpen?: boolean;

  placeholder?: string;
  searchPlaceholder?: string;
  // Static message OR function of the current query. The function form
  // lets wrappers say things like "Type to search…" until the query is
  // long enough, then "No results."
  emptyMessage?: string | ((query: string) => string);
  loadingMessage?: string;

  className?: string;
}

/**
 * Generic popover-combobox for picking a single item from an async search.
 * Powers AuthorSearch, SongSearch, VenueSearch (and any future "pick a thing
 * by typing to search" UI). The wrapper supplies the domain-specific bits
 * (API endpoint, item shape, copy); this component owns the popover shell,
 * debounced search, selection state, and "glass" styling so all three look
 * and feel the same.
 */
export function SearchPicker<T>({
  value,
  onValueChange,
  fetchResults,
  fetchById,
  initialItem,
  itemId,
  itemLabel,
  noneLabel,
  allowCreate,
  loadOnOpen = false,
  placeholder = "Search…",
  searchPlaceholder = "Search…",
  emptyMessage = "No results found.",
  loadingMessage = "Searching…",
  className,
}: SearchPickerProps<T>) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentItem, setCurrentItem] = useState<T | null>(initialItem ?? null);
  const [hasLoadedInitial, setHasLoadedInitial] = useState(false);

  // Pick the matching item from the latest results, falling back to the
  // pre-seeded `currentItem` (initialItem or fetched-by-id).
  const selectedItem = (value != null && items.find((it) => itemId(it) === value)) || currentItem;

  // Seed the trigger label by fetching the selected item by id when it
  // isn't in `items` and no `initialItem` was provided. Re-runs whenever
  // `value` changes so route navigations / form resets stay in sync.
  useEffect(() => {
    if (!fetchById) return;
    if (value == null) {
      setCurrentItem(initialItem ?? null);
      return;
    }
    if (currentItem && itemId(currentItem) === value) return;
    if (items.find((it) => itemId(it) === value)) return;

    let cancelled = false;
    (async () => {
      try {
        const fetched = await fetchById(value);
        if (!cancelled && fetched) setCurrentItem(fetched);
      } catch {
        // Trigger keeps placeholder if the fetch fails — non-fatal.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [value, fetchById, currentItem, items, itemId, initialItem]);

  const runSearch = useCallback(
    async (query: string) => {
      setLoading(true);
      try {
        const next = await fetchResults(query);
        setItems(next);
      } catch {
        // Empty results on failure; UI shows the configured empty message.
        setItems([]);
      } finally {
        setLoading(false);
      }
    },
    [fetchResults],
  );

  // Debounce the search so we don't spam the API on every keystroke.
  useEffect(() => {
    const timer = setTimeout(() => {
      runSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, runSearch]);

  // Optional load-on-open: triggers the first fetch immediately (without
  // waiting for the debounce) so the user sees a populated list before
  // they start typing.
  useEffect(() => {
    if (open && loadOnOpen && !hasLoadedInitial) {
      setHasLoadedInitial(true);
      runSearch("");
    }
  }, [open, loadOnOpen, hasLoadedInitial, runSearch]);

  const defaultShouldShowCreate = (query: string, currentItems: T[]) => {
    const trimmed = query.trim();
    if (trimmed.length < 2) return false;
    return !currentItems.some((item) => {
      const label = itemLabel(item);
      return typeof label === "string" && label.toLowerCase() === trimmed.toLowerCase();
    });
  };

  const showCreate = allowCreate != null && (allowCreate.shouldShow ?? defaultShouldShowCreate)(searchQuery, items);

  const handleCreate = async () => {
    if (!allowCreate || !searchQuery.trim() || creating) return;
    setCreating(true);
    try {
      const created = await allowCreate.onCreate(searchQuery.trim());
      if (created) {
        setItems((prev) => [created, ...prev]);
        onValueChange(itemId(created));
        setCurrentItem(created);
        setSearchQuery("");
        setOpen(false);
      }
    } finally {
      setCreating(false);
    }
  };

  const resolveEmptyMessage = () => {
    if (creating) return "Creating…";
    if (loading) return loadingMessage;
    return typeof emptyMessage === "function" ? emptyMessage(searchQuery) : emptyMessage;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "justify-between bg-glass-bg border border-glass-border text-white hover:bg-glass-bg/80 focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/20",
            className,
          )}
        >
          <span className="truncate">{selectedItem ? itemLabel(selectedItem) : placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 bg-glass-bg backdrop-blur-md border border-glass-border" align="start">
        <Command className="bg-transparent" shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="text-white"
          />
          <CommandList className="max-h-[300px] overflow-auto">
            <CommandEmpty>{resolveEmptyMessage()}</CommandEmpty>
            <CommandGroup>
              {noneLabel != null && (
                <CommandItem
                  value="__none__"
                  onSelect={() => {
                    onValueChange(null);
                    setOpen(false);
                  }}
                  className="text-content-text-primary hover:bg-hover-glass"
                >
                  <Check className={cn("mr-2 h-4 w-4", value == null ? "opacity-100" : "opacity-0")} />
                  {noneLabel}
                </CommandItem>
              )}

              {showCreate && allowCreate && (
                <CommandItem
                  value={`__create__:${searchQuery}`}
                  onSelect={handleCreate}
                  className="text-brand-primary hover:bg-hover-glass font-medium"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {allowCreate.label(searchQuery)}
                </CommandItem>
              )}

              {items.map((item) => {
                const id = itemId(item);
                return (
                  <CommandItem
                    key={id}
                    value={id}
                    onSelect={() => {
                      onValueChange(id);
                      setCurrentItem(item);
                      setOpen(false);
                    }}
                    className="text-content-text-primary hover:bg-hover-glass"
                  >
                    <Check className={cn("mr-2 h-4 w-4", value === id ? "opacity-100" : "opacity-0")} />
                    {itemLabel(item)}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
