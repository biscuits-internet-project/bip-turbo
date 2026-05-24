import type { Song } from "@bip/domain";
import { SearchPicker } from "~/components/ui/search-picker";

interface SongSearchProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  initialSong?: Song;
}

/**
 * Song picker used in the track-edit form. Requires 2+ chars of input
 * before searching — there are too many songs in the catalog to load up
 * front. The form layer uses the sentinel value "none" rather than null
 * because it threads through react-hook-form as a plain string; the
 * wrapper translates between "none" ↔ null at the boundary.
 */
export function SongSearch({
  value,
  onValueChange,
  placeholder = "Search songs...",
  className,
  initialSong,
}: SongSearchProps) {
  return (
    <SearchPicker<Song>
      value={value && value !== "none" ? value : null}
      onValueChange={(v) => onValueChange(v ?? "none")}
      className={className}
      placeholder={placeholder}
      searchPlaceholder="Search songs..."
      emptyMessage={(q) => (q.length < 2 ? "Type to search songs" : "No songs found.")}
      loadingMessage="Searching..."
      itemId={(s) => s.id}
      itemLabel={(s) => s.title}
      noneLabel="No song"
      initialItem={initialSong}
      fetchResults={async (query) => {
        if (!query || query.length < 2) return initialSong ? [initialSong] : [];
        const response = await fetch(`/api/songs?q=${encodeURIComponent(query)}`);
        if (!response.ok) return [];
        const data = (await response.json()) as Song[];
        // Keep the initial song visible in results even when it doesn't
        // match the query, so the user can re-select the current value
        // without clearing the field first.
        if (initialSong && !data.find((song) => song.id === initialSong.id)) {
          return [initialSong, ...data];
        }
        return data;
      }}
    />
  );
}
