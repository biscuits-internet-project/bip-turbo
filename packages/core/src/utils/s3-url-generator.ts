/**
 * S3 URL Generator for Active Storage Blobs
 *
 * This utility helps transition from Rails Active Storage to direct S3 access
 * by generating S3 URLs based on Active Storage blob data.
 */

export interface ActiveStorageBlob {
  key: string;
  filename: string;
  content_type?: string;
  byte_size?: number;
  checksum?: string;
  created_at?: string;
}

export interface S3Config {
  region: string;
  bucket: string;
  endpoint?: string; // For custom endpoints like DigitalOcean Spaces
  force_path_style?: boolean; // Matches Rails Active Storage config
  access_key_id?: string; // Optional for URL generation, required for signed URLs
  secret_access_key?: string; // Optional for URL generation, required for signed URLs
}

export interface AttachmentRecord {
  id: string;
  name: string;
  record_type: string;
  record_id: string;
  blob_id: string;
  created_at: string;
}

export interface BlobRecord {
  id: string;
  key: string;
  filename: string;
  content_type: string;
  metadata: Record<string, unknown>;
  byte_size: number;
  checksum: string;
  created_at: string;
}

/**
 * Generate a direct S3 URL from Active Storage blob data
 *
 * @param blob - The Active Storage blob data
 * @param config - S3 configuration
 * @returns S3 URL to the file
 */
export function generateS3Url(blob: ActiveStorageBlob, config: S3Config): string {
  if (!blob.key) {
    throw new Error("Blob key is required");
  }

  // Active Storage uses the blob's key as the S3 object key
  const objectKey = blob.key;

  // Build the S3 URL based on the configuration
  if (config.endpoint) {
    // If an endpoint is specified, use it
    if (config.force_path_style) {
      // force_path_style: true uses path-style URLs (endpoint/bucket/key)
      return `${config.endpoint}/${config.bucket}/${objectKey}`;
    } else {
      // force_path_style: false uses virtual-hosted-style URLs (bucket.endpoint/key)
      // Extract the hostname from the endpoint
      const url = new URL(config.endpoint);
      return `https://${config.bucket}.${url.hostname}/${objectKey}`;
    }
  }

  // Default AWS S3 URL format
  return `https://${config.bucket}.s3.${config.region}.amazonaws.com/${objectKey}`;
}

/**
 * Generate a signed S3 URL with expiration for private files
 *
 * Note: This is a placeholder. In a real implementation, you would use the AWS SDK
 * to generate a signed URL with proper authentication.
 *
 * @param blob - The Active Storage blob data
 * @param config - S3 configuration
 * @param expiresInSeconds - URL expiration time in seconds (default: 3600 = 1 hour)
 * @returns Promise resolving to a signed S3 URL
 */
export async function generateSignedS3Url(
  blob: ActiveStorageBlob,
  config: S3Config,
  expiresInSeconds = 3600,
): Promise<string> {
  // In a real implementation, you would use the AWS SDK like this:
  //
  // import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
  // import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
  //
  // const s3Client = new S3Client({
  //   region: config.region,
  //   endpoint: config.endpoint,
  //   forcePathStyle: config.force_path_style,
  //   credentials: {
  //     accessKeyId: config.access_key_id || '',
  //     secretAccessKey: config.secret_access_key || ''
  //   }
  // });
  //
  // const command = new GetObjectCommand({
  //   Bucket: config.bucket,
  //   Key: blob.key
  // });
  //
  // return await getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });

  // Placeholder implementation
  const baseUrl = generateS3Url(blob, config);
  return `${baseUrl}?X-Amz-Expires=${expiresInSeconds}&X-Amz-SignedHeaders=host`;
}

/**
 * Generate an S3 URL from Active Storage attachment and blob records
 *
 * @param attachmentRecord - The record from active_storage_attachments table
 * @param blobRecord - The record from active_storage_blobs table
 * @param config - S3 configuration
 * @returns S3 URL to the file
 */
export function generateS3UrlFromRecords(
  attachmentRecord: AttachmentRecord,
  blobRecord: BlobRecord,
  config: S3Config,
): string {
  const blob: ActiveStorageBlob = {
    key: blobRecord.key,
    filename: blobRecord.filename,
  };

  return generateS3Url(blob, config);
}

/**
 * Extract the S3 key from a Rails Active Storage service_url
 *
 * This is useful when you have a service_url but need just the S3 key
 *
 * @param serviceUrl - The Active Storage service_url
 * @returns The S3 key
 */
export function extractS3KeyFromServiceUrl(serviceUrl: string): string {
  // Remove query parameters
  const urlWithoutParams = serviceUrl.split("?")[0];

  // Extract the key (last part of the URL path)
  const parts = urlWithoutParams.split("/");
  return parts[parts.length - 1];
}

/**
 * Create an S3 configuration object from environment variables
 *
 * @param env - Environment name ('staging' or 'production')
 * @returns S3 configuration object
 */
export function createS3ConfigFromEnv(env: "staging" | "production"): S3Config {
  // Default configuration based on your Rails Active Storage setup
  const config: S3Config = {
    region: "us-east-1",
    endpoint: "https://s3.us-east-1.amazonaws.com",
    force_path_style: false,
    access_key_id: process.env.AWS_ACCESS_KEY_ID,
    secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
  };

  // Set the bucket based on the environment
  if (env === "staging") {
    config.bucket = "bip-staging";
  } else {
    config.bucket = "bip-prod";
  }

  return config;
}
