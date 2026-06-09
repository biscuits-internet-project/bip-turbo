import type { ReactNode } from "react";
import { SearchPicker } from "~/components/ui/search-picker";

/** Props every entity picker wrapper (MusicianSearch, AuthorSearch, …) accepts. */
export interface EntityPickerProps {
  value?: string | null;
  onValueChange: (value: string | null) => void;
  placeholder?: string;
  className?: string;
  allowCreate?: boolean;
}

interface EntitySearchProps<T extends { id: string }> extends EntityPickerProps {
  /** Plural API segment: "musicians" → /api/musicians, /api/musicians/:id, /api/admin/musicians. */
  resource: string;
  /** Label for the clear-selection row, e.g. "No Musician" or "All Authors". */
  noneLabel: string;
  itemLabel: (item: T) => ReactNode;
}

/**
 * Shared async picker for the small admin vocabularies (musicians, instruments,
 * authors). Loads a top-10 list when the popover opens and switches to a
 * query-scoped search at 2+ chars; with allowCreate it POSTs a name-only create
 * to the admin endpoint and selects the new row. Entity-specific wrappers supply
 * the resource segment and labels; everything else derives from the resource.
 */
export function EntitySearch<T extends { id: string }>({
  value,
  onValueChange,
  placeholder,
  className,
  allowCreate = false,
  resource,
  noneLabel,
  itemLabel,
}: EntitySearchProps<T>) {
  const searchPlaceholder = placeholder ?? `Search ${resource}...`;
  return (
    <SearchPicker<T>
      value={value ?? null}
      onValueChange={onValueChange}
      className={className}
      placeholder={searchPlaceholder}
      searchPlaceholder={searchPlaceholder}
      emptyMessage={`No ${resource} found.`}
      loadingMessage="Loading..."
      loadOnOpen
      itemId={(item) => item.id}
      itemLabel={itemLabel}
      noneLabel={noneLabel}
      fetchResults={async (query) => {
        const url =
          query && query.length >= 2
            ? `/api/${resource}?q=${encodeURIComponent(query)}&limit=20`
            : `/api/${resource}?top=10`;
        const response = await fetch(url);
        if (!response.ok) return [];
        return (await response.json()) as T[];
      }}
      fetchById={async (id) => {
        const response = await fetch(`/api/${resource}/${id}`);
        if (!response.ok) return null;
        return (await response.json()) as T;
      }}
      allowCreate={
        allowCreate
          ? {
              label: (query) => `Create "${query}"`,
              onCreate: async (name) => {
                const response = await fetch(`/api/admin/${resource}`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ name }),
                });
                if (!response.ok) return null;
                return (await response.json()) as T;
              },
            }
          : undefined
      }
    />
  );
}
