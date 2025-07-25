import { useState, useEffect, useCallback } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import type { Song } from "@bip/domain";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "~/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";

interface SongSearchProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  initialSong?: Song;
}

export function SongSearch({ 
  value, 
  onValueChange, 
  placeholder = "Search songs...",
  className,
  initialSong
}: SongSearchProps) {
  const [open, setOpen] = useState(false);
  const [songs, setSongs] = useState<Song[]>(initialSong ? [initialSong] : []);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedSong = songs.find((song) => song.id === value) || initialSong;

  const searchSongs = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setSongs(initialSong ? [initialSong] : []);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/songs?q=${encodeURIComponent(query)}`);
      console.log("Song search response status:", response.status);
      if (response.ok) {
        const data = await response.json();
        console.log("Song search response data:", data);
        
        // Ensure the initialSong is included if it's not in the search results
        const songsToSet = [...data];
        if (initialSong && !data.find((song: Song) => song.id === initialSong.id)) {
          songsToSet.unshift(initialSong);
        }
        
        setSongs(songsToSet);
      } else {
        console.error("Song search failed with status:", response.status);
      }
    } catch (error) {
      console.error("Failed to search songs:", error);
    } finally {
      setLoading(false);
    }
  }, [initialSong]);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      searchSongs(searchQuery);
    }, 300); // Debounce search

    return () => clearTimeout(delayedSearch);
  }, [searchQuery, searchSongs]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "justify-between bg-gray-800 border-gray-700 text-white hover:bg-gray-700",
            className
          )}
        >
          {selectedSong ? selectedSong.title : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 bg-gray-800 border-gray-700" align="start">
        <Command className="bg-gray-800" shouldFilter={false}>
          <CommandInput
            placeholder="Search songs..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="text-white"
          />
          <CommandList>
            <CommandEmpty>
              {loading ? "Searching..." : searchQuery.length < 2 ? "Type to search songs" : "No songs found."}
            </CommandEmpty>
            <CommandGroup>
              {/* Option to clear selection */}
              <CommandItem
                value="none"
                onSelect={() => {
                  onValueChange("none");
                  setOpen(false);
                }}
                className="text-white hover:bg-gray-700"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === "none" ? "opacity-100" : "opacity-0"
                  )}
                />
                No song
              </CommandItem>
              
              {songs.map((song) => (
                <CommandItem
                  key={song.id}
                  value={song.id}
                  onSelect={() => {
                    onValueChange(song.id);
                    setOpen(false);
                  }}
                  className="text-white hover:bg-gray-700"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === song.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {song.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}