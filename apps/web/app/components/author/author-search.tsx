import type { Author } from "@bip/domain";
import { SearchPicker } from "~/components/ui/search-picker";

interface AuthorSearchProps {
  value?: string | null;
  onValueChange: (value: string | null) => void;
  placeholder?: string;
  className?: string;
  allowCreate?: boolean;
}

/**
 * Author picker for blog posts and admin tools. Loads a top-10 list as soon
 * as the popover opens and switches to a query-scoped search at 2+ chars.
 * Optionally exposes a "Create '<name>'" affordance for admins composing
 * new posts when the author isn't on file yet.
 */
export function AuthorSearch({
  value,
  onValueChange,
  placeholder = "Search authors...",
  className,
  allowCreate = false,
}: AuthorSearchProps) {
  return (
    <SearchPicker<Author>
      value={value ?? null}
      onValueChange={onValueChange}
      className={className}
      placeholder={placeholder}
      searchPlaceholder="Search authors..."
      emptyMessage="No authors found."
      loadingMessage="Loading..."
      loadOnOpen
      itemId={(a) => a.id}
      itemLabel={(a) => a.name}
      noneLabel="All Authors"
      fetchResults={async (query) => {
        const url =
          query && query.length >= 2 ? `/api/authors?q=${encodeURIComponent(query)}&limit=20` : "/api/authors?top=10";
        const response = await fetch(url);
        if (!response.ok) return [];
        return (await response.json()) as Author[];
      }}
      fetchById={async (id) => {
        const response = await fetch(`/api/authors/${id}`);
        if (!response.ok) return null;
        return (await response.json()) as Author;
      }}
      allowCreate={
        allowCreate
          ? {
              label: (query) => `Create "${query}"`,
              onCreate: async (name) => {
                const response = await fetch("/api/admin/authors", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ name }),
                });
                if (!response.ok) return null;
                return (await response.json()) as Author;
              },
            }
          : undefined
      }
    />
  );
}
