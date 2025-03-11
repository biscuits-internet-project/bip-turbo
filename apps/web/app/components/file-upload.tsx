import { Loader2 } from "lucide-react";
import { Input } from "~/components/ui/input";
import { useFileUpload } from "~/hooks/use-file-upload";
import { cn } from "~/lib/utils";

interface FileUploadProps {
  onUploadComplete?: (result: { path: string; url: string }) => void;
  onError?: (error: string) => void;
  bucket: string;
  folder: string;
  className?: string;
}

export function FileUpload({ onUploadComplete, onError, bucket, folder, className }: FileUploadProps) {
  const { upload, isUploading, error, isReady, maxFileSize, allowedFileTypes, fileTypeNames } = useFileUpload();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const result = await upload(file, { bucket, folder });

    if (result) {
      onUploadComplete?.(result);
    } else if (error) {
      onError?.(error);
    }
  };

  // Create a friendly string of allowed file types
  const allowedTypesString = allowedFileTypes.map((type) => fileTypeNames[type]).join(", ");

  return (
    <div className={cn("space-y-2", className)}>
      <Input
        type="file"
        onChange={handleFileChange}
        disabled={!isReady || isUploading}
        accept={allowedFileTypes.join(",")}
        className={cn(
          "cursor-pointer file:cursor-pointer",
          "file:mr-4 file:py-2 file:px-4 file:mb-4",
          "file:rounded-md file:border-0",
          "file:text-sm file:font-medium",
          "file:bg-secondary file:text-secondary-foreground",
          "hover:file:bg-secondary/80",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          (!isReady || isUploading) && "pointer-events-none opacity-60",
        )}
      />
      <div className="text-xs text-muted-foreground p-2">
        <p>Accepted formats: {allowedTypesString}</p>
        <p>Maximum size: {Math.round(maxFileSize / 1024)}KB</p>
      </div>
      {!isReady && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Initializing upload service...</span>
        </div>
      )}
      {isUploading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Uploading...</span>
        </div>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
