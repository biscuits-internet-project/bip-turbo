import { PauseCircle, PlayCircle, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "~/lib/utils";

// Define TypeScript interfaces
interface ArchiveFile {
  name: string;
  format?: string;
  size?: string;
  length?: string;
  title?: string;
  track?: string;
  source?: string;
  original?: string;
}

interface ArchiveMetadata {
  files: ArchiveFile[];
  metadata: {
    title?: string;
    creator?: string;
    description?: string;
    date?: string;
    [key: string]: string | number | boolean | undefined;
  };
  [key: string]: unknown;
}

interface ArchivePlayerProps {
  identifier: string;
  className?: string;
  showDate?: string;
}

// Utility function to convert date to Archive.org format
export const convertToArchiveDate = (dateString: string): string => {
  if (!dateString) return "";

  try {
    // Handle "Month Day, Year" format (e.g., "April 9, 1999")
    const monthDayYearMatch = dateString.match(/([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})/);
    if (monthDayYearMatch) {
      const month = monthDayYearMatch[1];
      const day = Number.parseInt(monthDayYearMatch[2], 10);
      const year = monthDayYearMatch[3];

      // Convert month name to month number
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const monthIndex = monthNames.findIndex((m) => m.toLowerCase() === month.toLowerCase());

      if (monthIndex !== -1) {
        // Format as YYYY-MM-DD
        const monthNum = (monthIndex + 1).toString().padStart(2, "0");
        const dayStr = day.toString().padStart(2, "0");
        return `${year}-${monthNum}-${dayStr}`;
      }
    }

    // If it's already in ISO format (YYYY-MM-DD), return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }

    // Try to parse with Date object as fallback
    const date = new Date(dateString);
    if (!Number.isNaN(date.getTime())) {
      return date.toISOString().split("T")[0];
    }

    // If all else fails, return original string
    return dateString;
  } catch (error) {
    console.error("Error converting date:", error);
    return dateString;
  }
};

const ArchiveMusicPlayer: React.FC<ArchivePlayerProps> = ({ identifier, className, showDate }) => {
  const [metadata, setMetadata] = useState<ArchiveMetadata | null>(null);
  const [audioFiles, setAudioFiles] = useState<ArchiveFile[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  // Fetch metadata and audio files for the provided Archive.org identifier
  useEffect(() => {
    const fetchArchiveData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const url = `https://archive.org/metadata/${identifier}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Failed to fetch metadata: ${response.status} ${response.statusText}`);
        }

        const data: ArchiveMetadata = await response.json();
        setMetadata(data);

        console.log("Metadata for identifier:", identifier);
        console.log(JSON.stringify(data, null, 2));

        // Log specific metadata fields that might be useful for prioritization
        console.log("=== METADATA FIELDS ===");
        console.log("Metadata fields:", Object.keys(data.metadata));
        if (data.metadata.reviews) console.log("Reviews:", data.metadata.reviews);
        if (data.metadata.rating) console.log("Rating:", data.metadata.rating);
        if (data.metadata.stars) console.log("Stars:", data.metadata.stars);
        if (data.metadata.downloads) console.log("Downloads:", data.metadata.downloads);
        if (data.metadata.num_reviews) console.log("Number of reviews:", data.metadata.num_reviews);
        if (data.metadata.avg_rating) console.log("Average rating:", data.metadata.avg_rating);

        // Filter for MP3 files only to avoid duplicates
        const files = data.files.filter(
          (file) =>
            file.name.endsWith(".mp3") ||
            (file.format && (file.format.includes("MP3") || file.format.includes("VBR MP3"))),
        );

        // Group files by track number
        const trackGroups = new Map<string, ArchiveFile[]>();

        // Group all files by their track number
        for (const file of files) {
          if (file.track) {
            if (!trackGroups.has(file.track)) {
              trackGroups.set(file.track, []);
            }
            trackGroups.get(file.track)?.push(file);
          }
        }

        // Select the best file for each track
        const selectedFiles: ArchiveFile[] = [];

        for (const [trackNum, trackFiles] of trackGroups.entries()) {
          console.log(`Selecting best file for track ${trackNum} from ${trackFiles.length} options`);

          // Score each file based on multiple factors
          const scoredFiles = trackFiles.map((file) => {
            let score = 0;

            // Factor 1: Length - longer files are usually better (complete versions)
            const length = file.length ? parseTimeToSeconds(file.length) : 0;
            score += length;

            // Factor 2: File size - larger files often have better quality
            const size = file.size ? Number.parseInt(file.size, 10) : 0;
            score += size / 1000000; // Normalize size impact

            // Factor 3: Source quality - prefer soundboard (SBD) over audience (AUD)
            if (file.source) {
              if (file.source.toUpperCase().includes("SBD")) score += 1000;
              if (file.source.toUpperCase().includes("SOUNDBOARD")) score += 1000;
              if (file.source.toUpperCase().includes("MATRIX")) score += 800;
              if (file.source.toUpperCase().includes("AUD")) score += 200;
            }

            // Factor 4: Format quality - prefer higher quality formats
            if (file.format) {
              if (file.format.includes("VBR MP3")) score += 300;
              if (file.format.includes("192")) score += 200;
              if (file.format.includes("256")) score += 300;
              if (file.format.includes("320")) score += 400;
            }

            // Factor 5: Prefer files with titles
            if (file.title) score += 500;

            console.log(`File: ${file.name}, Length: ${file.length}, Size: ${file.size}, Score: ${score}`);

            return { file, score };
          });

          // Sort by score (descending)
          scoredFiles.sort((a, b) => b.score - a.score);

          // Select the highest scoring file
          if (scoredFiles.length > 0) {
            console.log(`Selected for track ${trackNum}: ${scoredFiles[0].file.name} (Score: ${scoredFiles[0].score})`);
            selectedFiles.push(scoredFiles[0].file);
          }
        }

        // Add files without track numbers if we don't have enough tracks
        if (selectedFiles.length === 0) {
          console.log("No files with track numbers found, using all files");
          selectedFiles.push(...files);
        }

        // Sort files by track number
        const sortedFiles = selectedFiles.sort((a, b) => {
          if (a.track && b.track) {
            return Number.parseInt(a.track) - Number.parseInt(b.track);
          }
          return a.name.localeCompare(b.name);
        });

        console.log("=== FINAL SELECTED FILES ===");
        for (const file of sortedFiles) {
          console.log(`${file.track || "N/A"}: ${file.name}`);
          console.log(`  Title: ${file.title || "N/A"}`);
          console.log(`  Length: ${file.length || "N/A"}`);
          console.log(`  Format: ${file.format || "N/A"}`);
          console.log(`  Size: ${file.size || "N/A"}`);
          console.log(`  Source: ${file.source || "N/A"}`);
        }

        setAudioFiles(sortedFiles);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        console.error("Error fetching Archive.org data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    // Helper function to convert MM:SS format to seconds
    const parseTimeToSeconds = (timeStr: string): number => {
      if (!timeStr.includes(":")) return Number.parseFloat(timeStr) || 0;

      const parts = timeStr.split(":");
      if (parts.length === 2) {
        const minutes = Number.parseInt(parts[0], 10);
        const seconds = Number.parseInt(parts[1], 10);
        return minutes * 60 + seconds;
      }

      return 0;
    };

    if (identifier) {
      fetchArchiveData();
    }
  }, [identifier]);

  // Handle track changes
  const playTrack = useCallback(
    (index: number): void => {
      if (index >= 0 && index < audioFiles.length) {
        setCurrentTrackIndex(index);

        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current
              .play()
              .then(() => setIsPlaying(true))
              .catch((err) => console.error("Playback failed:", err));
          }
        }, 100);
      }
    },
    [audioFiles.length],
  );

  // Handle audio playback events
  useEffect(() => {
    const audio = audioRef.current;

    const handleEnded = () => {
      // Auto play next track
      if (currentTrackIndex < audioFiles.length - 1) {
        playTrack(currentTrackIndex + 1);
      } else {
        setIsPlaying(false);
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => {
      if (audio) {
        setCurrentTime(audio.currentTime);
      }
    };
    const handleDurationChange = () => {
      if (audio) {
        setDuration(audio.duration);
      }
    };

    if (audio) {
      audio.addEventListener("ended", handleEnded);
      audio.addEventListener("play", handlePlay);
      audio.addEventListener("pause", handlePause);
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("durationchange", handleDurationChange);
      audio.volume = volume;

      return () => {
        audio.removeEventListener("ended", handleEnded);
        audio.removeEventListener("play", handlePlay);
        audio.removeEventListener("pause", handlePause);
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("durationchange", handleDurationChange);
      };
    }
  }, [currentTrackIndex, audioFiles, volume, playTrack]);

  // Format time for display
  const formatTime = (seconds: number | string | undefined): string => {
    if (seconds === undefined) return "0:00";

    // If the input is already in MM:SS format, just return it
    if (typeof seconds === "string" && seconds.includes(":")) {
      return seconds;
    }

    const totalSeconds = typeof seconds === "string" ? Number.parseFloat(seconds) : seconds;
    if (Number.isNaN(totalSeconds)) return "0:00";

    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Format date with special case handling for known problematic dates
  const formatDate = (rawDate: string): string => {
    if (!rawDate) return "";

    // If the date is already in YYYY-MM-DD format, convert to readable format
    const isoDateMatch = rawDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (isoDateMatch) {
      const year = isoDateMatch[1];
      const month = new Date(`${year}-${isoDateMatch[2]}-01`).toLocaleString("default", { month: "long" });
      const day = Number.parseInt(isoDateMatch[3], 10); // Remove leading zero
      return `${month} ${day}, ${year}`;
    }

    return rawDate;
  };

  // Get track display name
  const getTrackName = (file: ArchiveFile): string => {
    // If title is available, use it
    if (file.title) {
      return file.title;
    }

    // Extract name from filename
    let name = file.name;

    // Remove file extension
    name = name.replace(/\.(mp3|ogg|shn|flac|wav)$/i, "");

    // Handle common Archive.org patterns
    // Pattern like: db1999-04-09d1/db1999-04-09d1t01
    if (name.includes("/")) {
      name = name.split("/").pop() || name;
    }

    // Handle patterns like db1999-04-09d1t01 (date-disc-track format)
    const archivePattern = /^([a-z]+)?(\d{4}-\d{2}-\d{2})?d(\d+)t(\d+)(.*)$/i;
    if (archivePattern.test(name)) {
      const match = name.match(archivePattern);
      if (match) {
        const trackNum = match[4];

        // If we have a track number in the metadata, use it with a generic name
        if (file.track) {
          return `Track ${file.track}`;
        }

        return `Track ${Number.parseInt(trackNum, 10)}`;
      }
    }

    // Handle patterns with "-mastered-d1t01" suffix
    if (name.includes("-mastered-d") && name.includes("t")) {
      const parts = name.split("-mastered-d");
      if (parts.length > 1 && parts[1].includes("t")) {
        const trackPart = parts[1];
        const trackMatch = trackPart.match(/\d+t(\d+)/);
        if (trackMatch) {
          const trackNum = trackMatch[1];
          console.log(`Detected mastered pattern. Track number: ${trackNum}`);
          return `Track ${Number.parseInt(trackNum, 10)}`;
        }
      }
    }

    // Replace underscores with spaces
    name = name.replace(/_/g, " ");

    // If the name is too short and we have a track number, use a generic name
    if (name.length < 3 && file.track) {
      return `Track ${file.track}`;
    }

    console.log(`Final name: ${name}`);
    return name;
  };

  // Handle progress bar click
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * duration;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Handle progress bar keyboard navigation
  const handleProgressKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;

    // Left arrow decreases time by 5 seconds, right arrow increases by 5 seconds
    if (e.key === "ArrowLeft") {
      const newTime = Math.max(0, currentTime - 5);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    } else if (e.key === "ArrowRight") {
      const newTime = Math.min(duration, currentTime + 5);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Handle play/pause toggle
  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  // Handle previous track
  const playPreviousTrack = () => {
    if (currentTrackIndex > 0) {
      playTrack(currentTrackIndex - 1);
    }
  };

  // Handle next track
  const playNextTrack = () => {
    if (currentTrackIndex < audioFiles.length - 1) {
      playTrack(currentTrackIndex + 1);
    }
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value);
    setVolume(newVolume);

    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }

    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (!audioRef.current) return;

    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  // Handle track selection via keyboard
  const handleTrackKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      playTrack(index);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-content-bg border border-content-bg-secondary rounded-lg p-6 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-4 bg-content-bg-secondary rounded w-3/4 mb-4" />
          <div className="h-10 bg-content-bg-secondary rounded w-full mb-4" />
          <div className="h-4 bg-content-bg-secondary rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-content-bg border border-warning rounded-lg p-6 text-warning">
        <p>Error loading audio: {error}</p>
      </div>
    );
  }

  if (!metadata || audioFiles.length === 0) {
    return (
      <div className="bg-content-bg border border-content-bg-secondary rounded-lg p-6 text-content-text-tertiary">
        <p>No audio files found for this Archive.org item</p>
      </div>
    );
  }

  const currentFile = audioFiles[currentTrackIndex];
  const audioUrl = `https://archive.org/download/${identifier}/${currentFile?.name}`;
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={cn("archive-player", className)}>
      <div className="player-container bg-content-bg border border-content-bg-secondary rounded-lg p-6 shadow-lg">
        {/* Hidden audio element */}
        <audio ref={audioRef} src={audioUrl} preload="metadata">
          <track kind="captions" src="" />
        </audio>

        {/* Player header */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-brand-secondary mb-1 truncate">
            {metadata.metadata.title || "Unknown Title"}
          </h3>
          {metadata.metadata.creator && (
            <p className="text-sm text-content-text-tertiary truncate">by {metadata.metadata.creator}</p>
          )}
          {metadata.metadata.date && <p className="text-xs text-content-text-tertiary mt-1">{formatDate(metadata.metadata.date)}</p>}
        </div>

        {/* Now playing */}
        <div className="mb-4 bg-content-bg-secondary/50 rounded-md p-3 border border-content-bg-secondary">
          <div className="text-sm font-medium text-content-text-tertiary mb-1">Now Playing:</div>
          <div className="text-base text-content-text-primary font-medium truncate">{getTrackName(currentFile)}</div>
          <div className="text-xs text-content-text-tertiary mt-1">
            Track {currentFile.track || currentTrackIndex + 1} of {audioFiles.length}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div
            ref={progressRef}
            className="h-2 bg-content-bg-secondary rounded-full cursor-pointer overflow-hidden"
            onClick={handleProgressClick}
            onKeyDown={handleProgressKeyDown}
            role="slider"
            aria-label="Audio progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progressPercentage)}
            tabIndex={0}
          >
            <div
              className="h-full bg-gradient-to-r from-brand-primary to-chart-primary rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-content-text-tertiary mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(currentFile.length || duration)}</span>
          </div>
        </div>

        {/* Playback controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={playPreviousTrack}
              disabled={currentTrackIndex === 0}
              className={cn(
                "text-content-text-secondary hover:text-content-text-primary transition-colors",
                currentTrackIndex === 0 && "opacity-50 cursor-not-allowed",
              )}
              aria-label="Previous track"
            >
              <SkipBack size={20} />
            </button>

            <button
              type="button"
              onClick={togglePlayPause}
              className="text-content-text-primary hover:text-brand-secondary transition-colors"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <PauseCircle size={36} /> : <PlayCircle size={36} />}
            </button>

            <button
              type="button"
              onClick={playNextTrack}
              disabled={currentTrackIndex === audioFiles.length - 1}
              className={cn(
                "text-content-text-secondary hover:text-content-text-primary transition-colors",
                currentTrackIndex === audioFiles.length - 1 && "opacity-50 cursor-not-allowed",
              )}
              aria-label="Next track"
            >
              <SkipForward size={20} />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={toggleMute}
              className="text-content-text-secondary hover:text-content-text-primary transition-colors"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 h-1 bg-content-bg-secondary rounded-lg appearance-none cursor-pointer"
              aria-label="Volume"
            />
          </div>
        </div>

        {/* Track list */}
        {audioFiles.length > 1 && (
          <div className="track-list">
            <h4 className="text-md font-medium text-content-text-secondary mb-2">Tracks</h4>
            <div className="max-h-48 overflow-y-auto rounded-md border border-content-bg-secondary bg-content-bg-secondary/30 scrollbar-thin scrollbar-thumb-content-bg-secondary scrollbar-track-content-bg">
              {audioFiles.map((file, index) => (
                <button
                  key={file.name}
                  type="button"
                  className={cn(
                    "w-full p-2 cursor-pointer text-sm border-b border-content-bg-secondary last:border-0 hover:bg-content-bg-secondary/80 transition-colors text-left",
                    currentTrackIndex === index
                      ? "bg-gradient-to-r from-brand-primary/50 to-chart-primary/30 text-brand-secondary"
                      : "text-content-text-secondary",
                  )}
                  onClick={() => playTrack(index)}
                  onKeyDown={(e) => handleTrackKeyDown(e, index)}
                  aria-label={`Play track: ${getTrackName(file)}`}
                  aria-current={currentTrackIndex === index}
                >
                  <div className="flex items-center">
                    <span className="w-6 text-center text-content-text-tertiary">{file.track || index + 1}</span>
                    <span className="flex-1 truncate ml-2">{getTrackName(file)}</span>
                    {file.length && (
                      <span className="text-xs text-content-text-tertiary ml-2 flex-shrink-0">{formatTime(file.length)}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 text-xs text-content-text-tertiary flex justify-between items-center">
          <a
            href={`https://archive.org/details/${identifier}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-secondary hover:text-hover-accent transition-colors"
          >
            View on Archive.org
          </a>
          <span>Powered by Internet Archive</span>
        </div>
      </div>
    </div>
  );
};

export default ArchiveMusicPlayer;
