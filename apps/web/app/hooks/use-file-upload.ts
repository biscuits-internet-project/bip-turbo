import { useState } from "react";
import {
  type FileCategory,
  type AllowedImageType,
  FILE_SIZE_LIMITS,
  ALLOWED_IMAGE_TYPES,
  FILE_TYPE_NAMES,
  validateFileUpload,
} from "@bip/domain";

interface UploadOptions {
  category: FileCategory;
  maxSize?: number;
  allowedTypes?: AllowedImageType[];
}

interface UploadResult {
  id: string;
  filename: string;
  url: string;
  size: number;
  type: string;
}

export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File, options: UploadOptions): Promise<UploadResult | null> => {
    // Clear any previous errors
    setError(null);

    console.log("Starting file upload with options:", { options });

    // Validate file before attempting upload
    const validationError = validateFileUpload(file, options.category);
    if (validationError) {
      console.error("File validation error:", validationError);
      setError(validationError.message);
      return null;
    }

    try {
      setIsUploading(true);

      // Create FormData for the upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", options.category);

      console.log("Uploading file via API:", { 
        filename: file.name, 
        category: options.category,
        size: file.size 
      });

      // Upload to our R2 API
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Upload failed" }));
        throw new Error(errorData.error || `Upload failed with status ${response.status}`);
      }

      const result = await response.json();
      console.log("File uploaded successfully:", result);

      return result.file;
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
    isReady: true, // Always ready for R2 uploads
    allowedFileTypes: ALLOWED_IMAGE_TYPES,
    fileTypeNames: FILE_TYPE_NAMES,
    categoryMaxSizes: FILE_SIZE_LIMITS.INPUT,
    acceptedFormats: ALLOWED_IMAGE_TYPES.join(", "),
  };
}
