import { useState } from "react";
import { useSupabaseContext } from "~/context/supabase-provider";

const MAX_FILE_SIZE = 1024 * 1024; // 1MB in bytes
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"] as const;

type AllowedFileType = (typeof ALLOWED_FILE_TYPES)[number];

const FILE_TYPE_NAMES: Record<AllowedFileType, string> = {
  "image/jpeg": "JPEG",
  "image/png": "PNG",
  "image/gif": "GIF",
  "image/webp": "WebP",
  "image/svg+xml": "SVG",
};

interface UploadOptions {
  bucket: string;
  folder: string;
  maxSize?: number;
  allowedTypes?: AllowedFileType[];
}

interface UploadResult {
  path: string;
  url: string;
}

interface ValidationError {
  code: "FILE_TOO_LARGE" | "INVALID_FILE_TYPE";
  message: string;
}

function validateFile(file: File, options: UploadOptions): ValidationError | null {
  const maxSize = options.maxSize || MAX_FILE_SIZE;
  const allowedTypes = options.allowedTypes || ALLOWED_FILE_TYPES;

  if (file.size > maxSize) {
    return {
      code: "FILE_TOO_LARGE",
      message: `File size must be less than ${Math.round(maxSize / 1024)}KB`,
    };
  }

  if (!allowedTypes.includes(file.type as AllowedFileType)) {
    const friendlyTypes = allowedTypes.map((type) => FILE_TYPE_NAMES[type]).join(", ");
    return {
      code: "INVALID_FILE_TYPE",
      message: `Only ${friendlyTypes} images are allowed`,
    };
  }

  return null;
}

export function useFileUpload() {
  const { client, isLoaded, supabaseStorageUrl } = useSupabaseContext();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File, options: UploadOptions): Promise<UploadResult | null> => {
    // Clear any previous errors
    setError(null);

    console.log("Starting file upload with options:", { options, supabaseStorageUrl });

    if (!isLoaded || !client) {
      console.error("Upload service not ready:", { isLoaded, hasClient: !!client });
      setError("Upload service is initializing. Please try again in a moment.");
      return null;
    }

    // Validate file before attempting upload
    const validationError = validateFile(file, options);
    if (validationError) {
      console.error("File validation error:", validationError);
      setError(validationError.message);
      return null;
    }

    try {
      setIsUploading(true);

      const bucket = options.bucket;
      const folder = options.folder;

      // Generate a unique file path
      const timestamp = new Date().getTime();
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "-").toLowerCase();
      const path = `${folder}/${timestamp}-${sanitizedFileName}`;

      console.log("Uploading file:", { bucket, path });

      // Upload the file to Supabase Storage
      const { data, error: uploadError } = await client.storage.from(bucket).upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw new Error(uploadError.message);
      }

      console.log("File uploaded successfully:", { data });

      // Get the public URL - make sure we're using the correct bucket
      const {
        data: { publicUrl },
      } = client.storage.from(bucket).getPublicUrl(path);

      console.log("Generated public URL:", { publicUrl, bucket });

      return {
        path,
        url: publicUrl,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to upload file";
      console.error("Upload failed:", err);
      setError(message);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    upload,
    isUploading,
    error,
    isReady: isLoaded && !!client,
    maxFileSize: MAX_FILE_SIZE,
    allowedFileTypes: ALLOWED_FILE_TYPES,
    fileTypeNames: FILE_TYPE_NAMES,
    acceptedFormats: "image/jpeg, image/png, image/gif, image/webp, image/svg+xml",
  };
}
