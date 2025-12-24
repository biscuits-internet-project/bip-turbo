import type {
  CloudflareApiResponse,
  CloudflareImagesConfig,
  CloudflareUploadResult,
  Logger,
  UploadImageOptions,
} from "@bip/domain";

export class CloudflareImagesClient {
  private readonly baseUrl: string;

  constructor(
    private readonly config: CloudflareImagesConfig,
    private readonly logger: Logger,
  ) {
    this.baseUrl = `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/images/v1`;
  }

  async upload(options: UploadImageOptions): Promise<CloudflareUploadResult> {
    const { file, filename, metadata, requireSignedURLs = false } = options;

    this.logger.info("Uploading image to Cloudflare Images", { filename });

    const formData = new FormData();

    // Handle both Buffer and Blob
    if (Buffer.isBuffer(file)) {
      formData.append("file", new Blob([new Uint8Array(file)]), filename);
    } else {
      formData.append("file", file, filename);
    }

    if (requireSignedURLs) {
      formData.append("requireSignedURLs", "true");
    }

    if (metadata) {
      formData.append("metadata", JSON.stringify(metadata));
    }

    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.config.apiToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      this.logger.error("Cloudflare Images upload failed", {
        status: response.status,
        error: errorText,
      });
      throw new Error(`Cloudflare Images upload failed: ${response.status} ${errorText}`);
    }

    const data = (await response.json()) as CloudflareApiResponse;

    if (!data.success) {
      const errorMessage = data.errors.map((e) => e.message).join(", ");
      this.logger.error("Cloudflare Images upload failed", { errors: data.errors });
      throw new Error(`Cloudflare Images upload failed: ${errorMessage}`);
    }

    this.logger.info("Image uploaded successfully", {
      id: data.result.id,
      filename: data.result.filename,
      variants: data.result.variants,
    });

    return data.result;
  }

  async delete(imageId: string): Promise<void> {
    this.logger.info("Deleting image from Cloudflare Images", { imageId });

    const response = await fetch(`${this.baseUrl}/${imageId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${this.config.apiToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      this.logger.error("Cloudflare Images delete failed", {
        status: response.status,
        error: errorText,
      });
      throw new Error(`Cloudflare Images delete failed: ${response.status} ${errorText}`);
    }

    this.logger.info("Image deleted successfully", { imageId });
  }

  /**
   * Parse variant URLs from Cloudflare response into a key-value map.
   * Cloudflare returns URLs like: https://imagedelivery.net/{account_hash}/{image_id}/{variant_name}
   */
  parseVariants(variantUrls: string[]): Record<string, string> {
    const variants: Record<string, string> = {};

    for (const url of variantUrls) {
      // Extract variant name from URL (last path segment)
      const parts = url.split("/");
      const variantName = parts[parts.length - 1];
      variants[variantName] = url;
    }

    return variants;
  }
}
