import type { Instrument } from "@bip/domain";
import { SearchPicker } from "~/components/ui/search-picker";

interface InstrumentSearchProps {
  value?: string | null;
  onValueChange: (value: string | null) => void;
  placeholder?: string;
  className?: string;
  allowCreate?: boolean;
}

/**
 * Instrument picker for the musician form and the lineup/track editors. Loads a
 * top-10 list as soon as the popover opens and switches to a query-scoped search
 * at 2+ chars. Optionally exposes a "Create '<name>'" affordance for admins
 * adding an instrument that isn't on file yet.
 */
export function InstrumentSearch({
  value,
  onValueChange,
  placeholder = "Search instruments...",
  className,
  allowCreate = false,
}: InstrumentSearchProps) {
  return (
    <SearchPicker<Instrument>
      value={value ?? null}
      onValueChange={onValueChange}
      className={className}
      placeholder={placeholder}
      searchPlaceholder="Search instruments..."
      emptyMessage="No instruments found."
      loadingMessage="Loading..."
      loadOnOpen
      itemId={(i) => i.id}
      itemLabel={(i) => i.name}
      noneLabel="No Instrument"
      fetchResults={async (query) => {
        const url =
          query && query.length >= 2
            ? `/api/instruments?q=${encodeURIComponent(query)}&limit=20`
            : "/api/instruments?top=10";
        const response = await fetch(url);
        if (!response.ok) return [];
        return (await response.json()) as Instrument[];
      }}
      fetchById={async (id) => {
        const response = await fetch(`/api/instruments/${id}`);
        if (!response.ok) return null;
        return (await response.json()) as Instrument;
      }}
      allowCreate={
        allowCreate
          ? {
              label: (query) => `Create "${query}"`,
              onCreate: async (name) => {
                const response = await fetch("/api/admin/instruments", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ name }),
                });
                if (!response.ok) return null;
                return (await response.json()) as Instrument;
              },
            }
          : undefined
      }
    />
  );
}
