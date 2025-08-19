import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import type { Logger, FileCategory } from "@bip/domain";
import { IMAGE_PROCESSING_SETTINGS } from "@bip/domain";

export interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicUrl: string;
}

export interface FileUploadInput {
  buffer: Buffer;
  filename: string;
  contentType: string;
  category: FileCategory;
  userId: string;
}

export interface FileUploadResult {
  path: string;
  url: string;
  size: number;
  category: FileCategory;
}

export class R2Service {
  private client: S3Client;

  constructor(
    private config: R2Config,
    private logger: Logger,
  ) {
    this.client = new S3Client({
      region: "auto",
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }

  async uploadFile(input: FileUploadInput): Promise<FileUploadResult> {
    const path = this.generatePath(input.category, input.userId, input.filename);
    
    this.logger.info({ 
      path, 
      category: input.category,
      contentType: input.contentType,
      originalSize: input.buffer.length
    }, "Uploading file to R2");

    try {
      // Process image based on category
      const processedBuffer = await this.processImage(input.buffer, input.category, input.contentType);
      
      const command = new PutObjectCommand({
        Bucket: this.config.bucketName,
        Key: path,
        Body: processedBuffer,
        ContentType: input.contentType,
      });

      await this.client.send(command);

      const url = `${this.config.publicUrl}/${path}`;
      
      this.logger.info({ 
        path, 
        url, 
        category: input.category,
        originalSize: input.buffer.length,
        processedSize: processedBuffer.length
      }, "File uploaded successfully");

      return {
        path,
        url,
        size: processedBuffer.length,
        category: input.category,
      };
    } catch (error) {
      this.logger.error({ error, path, category: input.category }, "Failed to upload file to R2");
      throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  private async processImage(buffer: Buffer, category: FileCategory, contentType: string): Promise<Buffer> {
    // Only process images
    if (!contentType.startsWith('image/')) {
      return buffer;
    }

    try {
      const settings = IMAGE_PROCESSING_SETTINGS[category];
      let sharpInstance = sharp(buffer);

      // Apply resize settings
      if (settings.maxWidth || settings.maxHeight) {
        sharpInstance = sharpInstance.resize(settings.maxWidth, settings.maxHeight, {
          fit: settings.fit,
          withoutEnlargement: true,
        });
      }

      // Apply compression settings - convert to JPEG for optimal size
      sharpInstance = sharpInstance.jpeg({
        quality: settings.quality,
        progressive: true,
        mozjpeg: category === "avatar", // Use mozjpeg for avatars for better compression
      });

      return await sharpInstance.toBuffer();
    } catch (error) {
      this.logger.warn({ error, category }, "Failed to process image, using original");
      return buffer;
    }
  }

  private generatePath(category: FileCategory, userId: string, filename: string): string {
    const timestamp = Date.now();
    const extension = filename.split('.').pop();
    const sanitizedFilename = `${timestamp}.${extension}`;

    switch (category) {
      case "avatar":
        return `avatars/${userId}/${sanitizedFilename}`;
      case "show-photo":
        return `show-photos/${userId}/${sanitizedFilename}`;
      case "blog-image":
        return `blog-images/${userId}/${sanitizedFilename}`;
      case "general":
        return `uploads/${userId}/${sanitizedFilename}`;
      default:
        throw new Error(`Unknown file category: ${category}`);
    }
  }
}