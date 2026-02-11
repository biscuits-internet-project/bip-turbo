import { IMAGE_MIME_TYPE_NAMES, type AllowedImageMimeType } from "@bip/domain";
import { ImageIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { type UploadedImage, type UploadResult, useImageUpload } from "~/hooks/use-image-upload";
import { cn } from "~/lib/utils";
import { Button } from "./button";
import { Icons } from "./icons";

interface ImageUploadProps {
  endpoint?: string;
  onUploadComplete?: (images: UploadedImage[]) => void;
  onUploadStart?: (files: File[]) => void;
  onError?: (error: string) => void;
  multiple?: boolean;
  maxFiles?: number;
  maxFileSize?: number;
  allowedTypes?: readonly AllowedImageMimeType[];
  className?: string;
  disabled?: boolean;
  showPreviews?: boolean;
}

interface PreviewFile {
  file: File;
  preview: string;
  status: "pending" | "uploading" | "complete" | "error";
  error?: string;
  result?: UploadedImage;
}

export function ImageUpload({
  endpoint,
  onUploadComplete,
  onUploadStart,
  onError,
  multiple = false,
  maxFiles,
  maxFileSize,
  allowedTypes,
  className,
  disabled = false,
  showPreviews = true,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewsRef = useRef<PreviewFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [previews, setPreviewsState] = useState<PreviewFile[]>([]);

  // Wrapper to keep ref in sync with state
  const setPreviews = useCallback((updater: PreviewFile[] | ((prev: PreviewFile[]) => PreviewFile[])) => {
    setPreviewsState((prev) => {
      const newPreviews = typeof updater === "function" ? updater(prev) : updater;
      previewsRef.current = newPreviews;
      return newPreviews;
    });
  }, []);

  const { upload, isUploading, error, maxFileSize: defaultMaxSize, allowedTypes: defaultAllowedTypes } = useImageUpload({
    endpoint,
    maxFileSize,
    allowedTypes,
    maxFiles: multiple ? maxFiles : 1,
    onUploadComplete: (result: UploadResult) => {
      // Update preview statuses based on result
      setPreviews((prev) =>
        prev.map((p) => {
          const uploaded = result.uploaded.find((u) => u.filename === p.file.name);
          const uploadError = result.errors?.find((e) => e.filename === p.file.name);

          if (uploaded) {
            return { ...p, status: "complete" as const, result: uploaded };
          }
          if (uploadError) {
            return { ...p, status: "error" as const, error: uploadError.error };
          }
          return p;
        }),
      );

      if (result.uploaded.length > 0) {
        onUploadComplete?.(result.uploaded);
      }
    },
    onError,
  });

  const effectiveMaxSize = maxFileSize ?? defaultMaxSize;
  const effectiveAllowedTypes = allowedTypes ?? defaultAllowedTypes;

  // Clean up preview URLs on unmount
  useEffect(() => {
    return () => {
      for (const p of previewsRef.current) {
        URL.revokeObjectURL(p.preview);
      }
    };
  }, []);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);

      // Notify parent that upload is starting
      onUploadStart?.(fileArray);

      // Create previews
      const newPreviews: PreviewFile[] = fileArray.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        status: "pending" as const,
      }));

      if (multiple) {
        setPreviews((prev) => [...prev, ...newPreviews]);
      } else {
        // Clean up old previews
        for (const p of previews) {
          URL.revokeObjectURL(p.preview);
        }
        setPreviews(newPreviews);
      }

      // Update to uploading status
      setPreviews((prev) =>
        prev.map((p) => (newPreviews.some((np) => np.file === p.file) ? { ...p, status: "uploading" as const } : p)),
      );

      // Upload
      await upload(fileArray);
    },
    [multiple, previews, upload, onUploadStart, setPreviews],
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled || isUploading) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleFiles(files);
    }
  };

  const handleClick = () => {
    if (!disabled && !isUploading) {
      inputRef.current?.click();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFiles(files);
    }
    // Reset input so same file can be selected again
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const removePreview = (index: number) => {
    setPreviews((prev) => {
      const toRemove = prev[index];
      URL.revokeObjectURL(toRemove.preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size}B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)}KB`;
    return `${(size / (1024 * 1024)).toFixed(1)}MB`;
  };

  const acceptString = effectiveAllowedTypes.join(",");
  const allowedTypeNames = effectiveAllowedTypes.map((t) => IMAGE_MIME_TYPE_NAMES[t]).join(", ");

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Drop zone */}
      <button
        type="button"
        className={cn(
          "group relative flex min-h-[120px] w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 px-6 py-4 text-center transition-colors hover:border-muted-foreground/50",
          isDragging && "border-primary bg-primary/5",
          error && "border-destructive",
          (disabled || isUploading) && "pointer-events-none opacity-60",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={disabled || isUploading}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
          accept={acceptString}
          multiple={multiple}
          disabled={disabled || isUploading}
        />

        <div className="flex flex-col items-center gap-2">
          {isUploading ? (
            <Icons.spinner className="h-8 w-8 animate-spin text-muted-foreground" />
          ) : (
            <ImageIcon className="h-8 w-8 text-muted-foreground transition-colors group-hover:text-foreground" />
          )}
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">{allowedTypeNames}</p>
            <p className="text-xs text-muted-foreground">
              Max {formatFileSize(effectiveMaxSize)}
              {multiple && maxFiles && ` · Up to ${maxFiles} files`}
            </p>
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
        </div>
      </button>

      {/* Previews */}
      {showPreviews && previews.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {previews.map((preview, index) => (
            <div key={preview.preview} className="group relative aspect-square overflow-hidden rounded-lg border">
              <img src={preview.preview} alt={preview.file.name} className="h-full w-full object-cover" />

              {/* Status overlay */}
              {preview.status === "uploading" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Icons.spinner className="h-6 w-6 animate-spin text-white" />
                </div>
              )}

              {preview.status === "error" && (
                <div className="absolute inset-0 flex items-center justify-center bg-destructive/80">
                  <p className="px-2 text-center text-xs text-white">{preview.error}</p>
                </div>
              )}

              {preview.status === "complete" && (
                <div className="absolute bottom-0 left-0 right-0 bg-green-600/90 px-2 py-1">
                  <p className="truncate text-xs text-white">Uploaded</p>
                </div>
              )}

              {/* Remove button */}
              {!isUploading && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute right-1 top-1 h-6 w-6 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    removePreview(index);
                  }}
                >
                  <Icons.x className="h-3 w-3" />
                </Button>
              )}

              {/* Filename */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1 opacity-0 transition-opacity group-hover:opacity-100">
                <p className="truncate text-xs text-white">{preview.file.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
