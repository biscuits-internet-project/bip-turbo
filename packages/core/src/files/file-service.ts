import type {
  BlogPostFile,
  CloudflareImagesConfig,
  File,
  FileCreateWithBlogPostInput,
  ImageUploadResult,
  Logger,
  ShowFile,
} from "@bip/domain";
import { CloudflareImagesClient } from "./cloudflare-images";
import type { FileRepository } from "./file-repository";

export interface ImageUploadInput {
  file: Buffer | Blob;
  filename: string;
  type: string;
  size: number;
  userId: string;
  metadata?: Record<string, string>;
}

export class FileService {
  private cloudflareClient: CloudflareImagesClient;

  constructor(
    protected readonly repository: FileRepository,
    protected readonly logger: Logger,
    cloudflareConfig: CloudflareImagesConfig,
  ) {
    this.cloudflareClient = new CloudflareImagesClient(cloudflareConfig, logger);
  }

  async create(input: FileCreateWithBlogPostInput): Promise<File> {
    const file = await this.repository.create(input);

    if (input.blogPostId) {
      await this.repository.associateWithBlogPost({
        path: file.path,
        blogPostId: input.blogPostId,
        isCover: input.isCover || false,
      });
    }

    return file;
  }

  async uploadImage(input: ImageUploadInput): Promise<ImageUploadResult> {
    this.logger.info("Uploading image to Cloudflare", { filename: input.filename, size: input.size });

    // Upload to Cloudflare Images
    const cloudflareResult = await this.cloudflareClient.upload({
      file: input.file,
      filename: input.filename,
      metadata: input.metadata,
    });

    // Parse variant URLs into a map
    const variants = this.cloudflareClient.parseVariants(cloudflareResult.variants);

    // Create file record in database
    const file = await this.repository.create({
      path: cloudflareResult.id,
      filename: input.filename,
      type: input.type,
      size: input.size,
      userId: input.userId,
      cloudflareId: cloudflareResult.id,
      variants,
    });

    this.logger.info("Image uploaded successfully", { fileId: file.id, cloudflareId: cloudflareResult.id });

    return { file, variants };
  }

  async findByBlogPostId(blogPostId: string): Promise<File[]> {
    return this.repository.findByBlogPostId(blogPostId);
  }

  async updateBlogPostFiles(blogPostId: string, files: BlogPostFile[]): Promise<void> {
    this.logger.info("Updating files for blog post", { blogPostId, fileCount: files.length });

    // First, remove all existing file associations for this blog post
    await this.repository.removeAllBlogPostFiles(blogPostId);

    // Then create new associations for each file
    for (const file of files) {
      await this.repository.associateWithBlogPost({
        path: file.path,
        blogPostId,
        isCover: file.isCover || false,
      });
    }
    this.logger.info("Completed file associations for blog post", { blogPostId, fileCount: files.length });
  }

  async findByShowId(showId: string): Promise<ShowFile[]> {
    return this.repository.findByShowId(showId);
  }
}
