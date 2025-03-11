import { useRef, useState } from "react";
import { useFileUpload } from "~/hooks/use-file-upload";
import { cn } from "~/lib/utils";
import { Button } from "./button";
import { Icons } from "./icons";

interface FileUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onUpload?: (file: File) => Promise<void>;
  onUploadComplete?: (result: { path: string; url: string }) => void;
  isUploading?: boolean;
  error?: string | null;
  maxSize?: number;
  helperText?: string;
  className?: string;
  bucket: string;
  folder: string;
}

export function FileUpload({
  onUpload,
  onUploadComplete,
  isUploading: externalIsUploading,
  error: externalError,
  maxSize = 1024 * 1024, // 1MB
  helperText,
  className,
  accept,
  bucket,
  folder,
  ...props
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { upload, isUploading, error } = useFileUpload();

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    if (onUpload) {
      await onUpload(file);
    }

    // Handle Supabase upload if bucket is provided
    if (bucket) {
      const result = await upload(file, { bucket, folder });
      if (result && onUploadComplete) {
        onUploadComplete(result);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      await handleFileSelect(file);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFileSelect(file);
    }
  };

  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size}B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)}KB`;
    return `${(size / (1024 * 1024)).toFixed(1)}MB`;
  };

  const isUploadingState = externalIsUploading || isUploading;
  const errorState = externalError || error;

  return (
    <div className={cn("w-full", className)}>
      <button
        type="button"
        className={cn(
          "group relative flex min-h-[120px] w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 px-6 py-4 text-center transition-colors hover:border-muted-foreground/50",
          isDragging && "border-primary",
          errorState && "border-destructive",
          isUploadingState && "pointer-events-none opacity-60",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={isUploadingState}
      >
        <input ref={inputRef} type="file" className="hidden" onChange={handleChange} accept={accept} {...props} />

        <div className="flex flex-col items-center gap-2">
          {isUploadingState ? (
            <Icons.spinner className="h-8 w-8 animate-spin text-muted-foreground" />
          ) : (
            <Icons.upload className="h-8 w-8 text-muted-foreground transition-colors group-hover:text-foreground" />
          )}
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">
              {selectedFile ? (
                <>
                  Selected: <span className="font-semibold">{selectedFile.name}</span> (
                  {formatFileSize(selectedFile.size)})
                </>
              ) : (
                <>
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </>
              )}
            </p>
            {helperText && <p className="text-xs text-muted-foreground">{helperText}</p>}
            {maxSize && !errorState && (
              <p className="text-xs text-muted-foreground">Max file size: {formatFileSize(maxSize)}</p>
            )}
            {errorState && <p className="text-xs text-destructive">{errorState}</p>}
          </div>
        </div>

        {selectedFile && !isUploadingState && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-6 w-6 rounded-full opacity-70 ring-offset-background transition-opacity hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedFile(null);
              if (inputRef.current) {
                inputRef.current.value = "";
              }
            }}
          >
            <Icons.x className="h-3 w-3" />
          </Button>
        )}
      </button>
    </div>
  );
}
