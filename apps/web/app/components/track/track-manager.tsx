import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Save, Trash, X, Edit2, Check } from "lucide-react";
import type { Track } from "@bip/domain";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { SongSearch } from "~/components/song/song-search";
import { toast } from "sonner";
import { cn } from "~/lib/utils";

interface TrackManagerProps {
  showId: string;
  initialTracks?: Track[];
}

interface TrackFormData {
  id?: string;
  songId: string;
  set: string;
  position: number;
  segue: string;
  note: string | null;
  song?: Track['song'];
}

const SET_OPTIONS = [
  { value: "S1", label: "Set 1" },
  { value: "S2", label: "Set 2" },
  { value: "S3", label: "Set 3" },
  { value: "E1", label: "Encore 1" },
  { value: "E2", label: "Encore 2" },
  { value: "E3", label: "Encore 3" },
];

const SEGUE_OPTIONS = [
  { value: "none", label: "No segue" },
  { value: ">", label: ">" },
];

export function TrackManager({ showId, initialTracks = [] }: TrackManagerProps) {
  const [tracks, setTracks] = useState<Track[]>(initialTracks);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState<TrackFormData>({
    songId: "none",
    set: "S1",
    position: 1,
    segue: "none",
    note: null,
  });

  const queryClient = useQueryClient();

  // Load tracks when component mounts
  useEffect(() => {
    if (initialTracks.length === 0) {
      loadTracks();
    }
  }, [showId]);

  const loadTracks = async () => {
    try {
      const response = await fetch(`/api/tracks?showId=${showId}`);
      if (response.ok) {
        const data = await response.json();
        setTracks(data);
      }
    } catch (error) {
      console.error("Failed to load tracks:", error);
      toast.error("Failed to load tracks");
    }
  };

  // Create track mutation
  const createTrackMutation = useMutation({
    mutationFn: async (data: TrackFormData) => {
      const response = await fetch("/api/tracks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          showId,
          songId: data.songId === "none" ? undefined : data.songId,
          segue: data.segue === "none" ? null : data.segue,
        }),
      });
      if (!response.ok) throw new Error("Failed to create track");
      return response.json();
    },
    onSuccess: (newTrack) => {
      setTracks(prev => [...prev, newTrack].sort((a, b) => {
        if (a.set !== b.set) return sortSets(a.set, b.set);
        return a.position - b.position;
      }));
      setIsAddingNew(false);
      resetForm();
      toast.success("Track added successfully");
    },
    onError: () => toast.error("Failed to add track"),
  });

  // Update track mutation
  const updateTrackMutation = useMutation({
    mutationFn: async ({ id, ...data }: TrackFormData & { id: string }) => {
      const response = await fetch(`/api/tracks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          songId: data.songId === "none" ? undefined : data.songId,
          segue: data.segue === "none" ? null : data.segue,
        }),
      });
      if (!response.ok) throw new Error("Failed to update track");
      return response.json();
    },
    onSuccess: (updatedTrack) => {
      setTracks(prev => prev.map(track => 
        track.id === updatedTrack.id ? updatedTrack : track
      ).sort((a, b) => {
        if (a.set !== b.set) return sortSets(a.set, b.set);
        return a.position - b.position;
      }));
      setEditingId(null);
      resetForm();
      toast.success("Track updated successfully");
    },
    onError: () => toast.error("Failed to update track"),
  });

  // Delete track mutation
  const deleteTrackMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/tracks/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete track");
    },
    onSuccess: (_, deletedId) => {
      setTracks(prev => prev.filter(track => track.id !== deletedId));
      toast.success("Track deleted successfully");
    },
    onError: () => toast.error("Failed to delete track"),
  });

  // Helper function to sort sets properly (S1, S2, S3, E1, E2, E3)
  const sortSets = (a: string, b: string) => {
    const setOrder = { S: 0, E: 1 };
    const aType = a.charAt(0) as 'S' | 'E';
    const bType = b.charAt(0) as 'S' | 'E';
    const aNum = parseInt(a.slice(1));
    const bNum = parseInt(b.slice(1));
    
    if (aType !== bType) {
      return setOrder[aType] - setOrder[bType];
    }
    return aNum - bNum;
  };

  const resetForm = () => {
    setFormData({
      songId: "none",
      set: "S1",
      position: 1,
      segue: "none",
      note: null,
    });
  };

  const startEditing = (track: Track) => {
    setEditingId(track.id);
    setFormData({
      id: track.id,
      songId: track.songId,
      set: track.set,
      position: track.position,
      segue: track.segue || "none",
      note: track.note,
      song: track.song,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setIsAddingNew(false);
    resetForm();
  };

  const handleSubmit = () => {
    if (formData.songId === "none") {
      toast.error("Please select a song");
      return;
    }

    if (editingId) {
      updateTrackMutation.mutate({ ...formData, id: editingId });
    } else {
      createTrackMutation.mutate(formData);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this track?")) {
      deleteTrackMutation.mutate(id);
    }
  };

  // Group tracks by set
  const tracksBySet = tracks.reduce((acc, track) => {
    if (!acc[track.set]) acc[track.set] = [];
    acc[track.set].push(track);
    return acc;
  }, {} as Record<string, Track[]>);

  const renderTrackForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-300 mb-1">Song</label>
        <SongSearch
          value={formData.songId}
          onValueChange={(value) => setFormData(prev => ({ ...prev, songId: value }))}
          placeholder="Select a song..."
          className="w-full"
          initialSong={formData.song}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Set</label>
        <Select 
          value={formData.set} 
          onValueChange={(value) => setFormData(prev => ({ ...prev, set: value }))}
        >
          <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            {SET_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value} className="text-white">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Position</label>
        <Input
          type="number"
          min="1"
          value={formData.position}
          onChange={(e) => setFormData(prev => ({ ...prev, position: parseInt(e.target.value) || 1 }))}
          className="bg-gray-800 border-gray-700 text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Segue</label>
        <Select 
          value={formData.segue} 
          onValueChange={(value) => setFormData(prev => ({ ...prev, segue: value }))}
        >
          <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            {SEGUE_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value} className="text-white">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-end gap-2">
        <Button
          onClick={handleSubmit}
          disabled={createTrackMutation.isPending || updateTrackMutation.isPending}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Check className="h-4 w-4 mr-1" />
          {editingId ? "Update" : "Add"}
        </Button>
        <Button
          onClick={cancelEditing}
          variant="outline"
          className="border-gray-600 text-gray-300"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <Card className="border-gray-800 bg-gray-900/50">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-white">Track List</CardTitle>
          <Button
            onClick={() => setIsAddingNew(true)}
            disabled={isAddingNew || editingId !== null}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Track
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isAddingNew && renderTrackForm()}
        
        {Object.keys(tracksBySet).length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No tracks added yet. Click "Add Track" to get started.
          </div>
        ) : (
          Object.entries(tracksBySet)
            .sort(([a], [b]) => sortSets(a, b))
            .map(([setName, setTracks]) => (
              <div key={setName} className="space-y-2">
                <h3 className="text-lg font-medium text-purple-300 border-b border-gray-700 pb-1">
                  {SET_OPTIONS.find(opt => opt.value === setName)?.label || setName}
                </h3>
                
                {setTracks
                  .sort((a, b) => a.position - b.position)
                  .map((track) => (
                    <div key={track.id}>
                      {editingId === track.id ? (
                        renderTrackForm()
                      ) : (
                        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                          <div className="flex items-center space-x-4">
                            <span className="text-gray-400 font-mono text-sm w-8">
                              {track.position}
                            </span>
                            <span className="text-white font-medium">
                              {track.song?.title || "Unknown Song"}
                            </span>
                            {track.segue && (
                              <span className="text-gray-400 text-sm">
                                {track.segue}
                              </span>
                            )}
                            {track.note && (
                              <span className="text-gray-400 text-sm italic">
                                ({track.note})
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startEditing(track)}
                              className="border-gray-600 text-gray-300 hover:bg-gray-700"
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(track.id)}
                              disabled={deleteTrackMutation.isPending}
                              className="border-red-600 text-red-400 hover:bg-red-900/20"
                            >
                              <Trash className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            ))
        )}
      </CardContent>
    </Card>
  );
}