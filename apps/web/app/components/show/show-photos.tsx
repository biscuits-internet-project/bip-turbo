import type { ShowFile } from "@bip/domain";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "~/components/ui/dialog";
import { cn } from "~/lib/utils";

interface ShowPhotosProps {
  photos: ShowFile[];
  className?: string;
}

export function ShowPhotos({ photos, className }: ShowPhotosProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<ShowFile | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  // Update scroll state on mount
  useEffect(() => {
    updateScrollState();
  }, [updateScrollState]);

  const scroll = useCallback((direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  }, []);

  const openPhoto = (photo: ShowFile, index: number) => {
    setSelectedPhoto(photo);
    setSelectedIndex(index);
  };

  const navigatePhoto = (direction: "prev" | "next") => {
    const newIndex = direction === "prev" ? selectedIndex - 1 : selectedIndex + 1;
    if (newIndex >= 0 && newIndex < photos.length) {
      setSelectedIndex(newIndex);
      setSelectedPhoto(photos[newIndex]);
    }
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!selectedPhoto) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && selectedIndex > 0) {
        navigatePhoto("prev");
      } else if (e.key === "ArrowRight" && selectedIndex < photos.length - 1) {
        navigatePhoto("next");
      } else if (e.key === "Escape") {
        setSelectedPhoto(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPhoto, selectedIndex, photos.length]);

  if (photos.length === 0) {
    return null;
  }

  return (
    <div className={cn("relative group", className)}>
      {/* Gradient edges for scroll indication */}
      <div className="absolute left-0 top-0 bottom-2 w-8 bg-gradient-to-r from-background to-transparent z-[5] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-background to-transparent z-[5] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Scroll buttons */}
      {photos.length > 3 && (
        <>
          <button
            type="button"
            onClick={() => scroll("left")}
            className={cn(
              "absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white p-2.5 rounded-full transition-all shadow-lg backdrop-blur-sm",
              "opacity-0 group-hover:opacity-100 hover:scale-110",
              !canScrollLeft && "!opacity-0 pointer-events-none",
            )}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white p-2.5 rounded-full transition-all shadow-lg backdrop-blur-sm",
              "opacity-0 group-hover:opacity-100 hover:scale-110",
              !canScrollRight && "!opacity-0 pointer-events-none",
            )}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Photo strip */}
      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth py-3 px-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => openPhoto(photo, index)}
            className="flex-shrink-0 group/photo relative overflow-hidden rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-all duration-300 hover:-translate-y-1"
          >
            {/* Image container with border */}
            <div className="relative rounded-xl overflow-hidden border-2 border-white/20 group-hover/photo:border-white/50 shadow-lg shadow-black/50 group-hover/photo:shadow-xl group-hover/photo:shadow-black/70 transition-all duration-300">
              <img
                src={photo.thumbnailUrl || photo.url}
                alt={photo.label || `Show photo ${index + 1}`}
                className="h-40 w-auto object-cover transition-all duration-300 group-hover/photo:scale-105 group-hover/photo:brightness-110"
                loading="lazy"
              />
              {/* Hover overlay with gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover/photo:opacity-100 transition-opacity duration-300" />
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
        <DialogContent className="max-w-5xl w-[95vw] p-0 bg-black/95 border-2 border-white/30 overflow-hidden backdrop-blur-xl shadow-2xl">
          <DialogTitle className="sr-only">
            {selectedPhoto?.label || `Photo ${selectedIndex + 1} of ${photos.length}`}
          </DialogTitle>

          {/* Close button */}
          <button
            type="button"
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 z-20 bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-full transition-all hover:scale-110 backdrop-blur-sm border border-white/20"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Navigation buttons */}
          {selectedIndex > 0 && (
            <button
              type="button"
              onClick={() => navigatePhoto("prev")}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all hover:scale-110 backdrop-blur-sm border border-white/20"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-7 w-7" />
            </button>
          )}
          {selectedIndex < photos.length - 1 && (
            <button
              type="button"
              onClick={() => navigatePhoto("next")}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all hover:scale-110 backdrop-blur-sm border border-white/20"
              aria-label="Next photo"
            >
              <ChevronRight className="h-7 w-7" />
            </button>
          )}

          {/* Main image */}
          {selectedPhoto && (
            <div className="flex items-center justify-center min-h-[60vh] max-h-[85vh] p-4">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.label || `Show photo ${selectedIndex + 1}`}
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl border border-white/10"
              />
            </div>
          )}

          {/* Photo info bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 pt-12">
            <div className="flex items-end justify-between">
              <div>
                {selectedPhoto?.label && (
                  <p className="text-white font-medium text-lg">{selectedPhoto.label}</p>
                )}
                {selectedPhoto?.source && selectedPhoto.source !== selectedPhoto?.label && (
                  <p className="text-white/60 text-sm mt-0.5">{selectedPhoto.source}</p>
                )}
              </div>
              <div className="text-white/50 text-sm font-medium bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                {selectedIndex + 1} / {photos.length}
              </div>
            </div>

            {/* Thumbnail strip in lightbox */}
            {photos.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto scrollbar-hide justify-center pb-1">
                {photos.map((photo, index) => (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => {
                      setSelectedIndex(index);
                      setSelectedPhoto(photo);
                    }}
                    className={cn(
                      "flex-shrink-0 rounded-md overflow-hidden transition-all duration-200 border-2",
                      index === selectedIndex
                        ? "border-white scale-100 opacity-100 shadow-lg shadow-white/20"
                        : "border-white/30 scale-95 opacity-60 hover:opacity-90 hover:scale-100 hover:border-white/50"
                    )}
                  >
                    <img
                      src={photo.thumbnailUrl || photo.url}
                      alt=""
                      className="h-14 w-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
