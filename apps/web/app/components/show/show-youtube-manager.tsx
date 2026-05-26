import { Plus, Trash, Youtube } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { formInputClass, listRowClass } from "~/lib/form-styles";
import { cn } from "~/lib/utils";

interface ShowYoutubeEntry {
  id: string;
  videoId: string;
  url: string;
}

interface ShowYoutubeManagerProps {
  showId: string;
}

export function ShowYoutubeManager({ showId }: ShowYoutubeManagerProps) {
  const [entries, setEntries] = useState<ShowYoutubeEntry[]>([]);
  const [input, setInput] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const response = await fetch(`/api/show-youtubes?showId=${showId}`);
      if (!response.ok) throw new Error("load failed");
      const data = (await response.json()) as ShowYoutubeEntry[];
      setEntries(data);
    } catch {
      toast.error("Failed to load YouTube videos");
    }
  }, [showId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = async () => {
    if (!input.trim() || isAdding) return;
    setIsAdding(true);
    try {
      const response = await fetch("/api/show-youtubes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ showId, input: input.trim() }),
      });
      if (!response.ok) {
        const { error } = (await response.json().catch(() => ({}))) as { error?: string };
        toast.error(error || "Failed to add video");
        return;
      }
      const entry = (await response.json()) as ShowYoutubeEntry;
      setEntries((prev) => [...prev, entry]);
      setInput("");
      toast.success("Video added");
    } catch {
      toast.error("Failed to add video");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeletingId(id);
    try {
      const response = await fetch("/api/show-youtubes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        const { error } = (await response.json().catch(() => ({}))) as { error?: string };
        toast.error(error || "Failed to remove video");
        return;
      }
      setEntries((prev) => prev.filter((e) => e.id !== id));
      toast.success("Video removed");
    } catch {
      toast.error("Failed to remove video");
    } finally {
      setIsDeletingId(null);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-content-text-secondary">
        <Youtube className="h-4 w-4 text-red-500" />
        YouTube Videos
      </div>

      {entries.length > 0 && (
        <ul className="space-y-2">
          {entries.map((entry) => (
            <li key={entry.id} className={cn(listRowClass, "flex items-center justify-between gap-3 p-2")}>
              <a
                href={entry.url}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-content-text-primary hover:text-brand-primary underline truncate"
              >
                {entry.url}
              </a>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDelete(entry.id)}
                disabled={isDeletingId === entry.id}
                className="h-8 w-8 p-0 md:h-9 md:w-auto md:px-3 border-red-600 text-red-400 hover:bg-red-900/20 shrink-0"
              >
                <Trash className="h-3 w-3" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="YouTube URL or 11-char video ID"
          className={formInputClass}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
        />
        <Button onClick={handleAdd} disabled={!input.trim() || isAdding} variant="brand" className="shrink-0">
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>
    </div>
  );
}
