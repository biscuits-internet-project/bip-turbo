import type {
  BlogPostFile,
  CloudflareImagesConfig,
  File,
  FileCreateWithBlogPostInput,
  ImageUploadResult,
  Logger,
  ShowFile,
} from "@bip/domain";
import type { DbClient } from "../_shared/database/models";
import { CloudflareImagesClient } from "./cloudflare-images";

export interface ImageUploadInput {
  file: Buffer | Blob;
  filename: string;
  type: string;
  size: number;
  userId: string;
  metadata?: Record<string, string>;
}

interface DbFile {
  id: string;
  path: string;
  filename: string;
  type: string;
  size: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  cloudflareId?: string | null;
  variants?: Record<string, string> | null;
  blogPosts?: Array<{ isCover: boolean }>;
}

// Mapper function
function mapFileToDomainEntity(file: DbFile): File {
  return {
    id: file.id,
    path: file.path,
    filename: file.filename,
    type: file.type,
    size: file.size,
    userId: file.userId,
    createdAt: file.createdAt,
    updatedAt: file.updatedAt,
    cloudflareId: file.cloudflareId ?? undefined,
    variants: file.variants ?? undefined,
  };
}

function getPublicUrl(path: string): string {
  return `${process.env.SUPABASE_STORAGE_URL}/object/public/${path}`;
}

export class FileService {
  private cloudflareClient: CloudflareImagesClient;

  constructor(
    protected readonly db: DbClient,
    protected readonly logger: Logger,
    cloudflareConfig: CloudflareImagesConfig,
  ) {
    this.cloudflareClient = new CloudflareImagesClient(cloudflareConfig, logger);
  }

  async create(input: FileCreateWithBlogPostInput): Promise<File> {
    this.logger.info("Creating file record", { data: input });
    const now = new Date();
    const file = await this.db.file.create({
      data: {
        path: input.path,
        filename: input.filename,
        type: input.type,
        size: input.size,
        userId: input.userId,
        cloudflareId: input.cloudflareId,
        variants: input.variants ?? {},
        createdAt: now,
        updatedAt: now,
      },
    });
    this.logger.info("Created file record", { file });

    const domainFile = mapFileToDomainEntity({
      ...file,
      variants: file.variants as Record<string, string> | null,
    });

    if (input.blogPostId) {
      await this.associateWithBlogPost({
        path: domainFile.path,
        blogPostId: input.blogPostId,
        isCover: input.isCover || false,
      });
    }

    return domainFile;
  }

  private async associateWithBlogPost(data: { path: string; blogPostId: string; isCover: boolean }): Promise<void> {
    this.logger.info("Looking up file to associate", { data });
    const file = await this.db.file.findFirst({
      where: {
        path: data.path,
      },
    });

    if (!file) {
      this.logger.error("File not found during association", { path: data.path });
      throw new Error(`File not found with path: ${data.path}`);
    }

    this.logger.info("Found file to associate", { file });
    await this.db.blogPostToFile.create({
      data: {
        blogPostId: data.blogPostId,
        fileId: file.id,
        isCover: data.isCover,
        createdAt: new Date(),
      },
    });
    this.logger.info("Created blog post to file association");
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
    const now = new Date();
    const file = await this.db.file.create({
      data: {
        path: cloudflareResult.id,
        filename: input.filename,
        type: input.type,
        size: input.size,
        userId: input.userId,
        cloudflareId: cloudflareResult.id,
        variants,
        createdAt: now,
        updatedAt: now,
      },
    });

    const domainFile = mapFileToDomainEntity({
      ...file,
      variants: file.variants as Record<string, string> | null,
    });

    this.logger.info("Image uploaded successfully", { fileId: file.id, cloudflareId: cloudflareResult.id });

    return { file: domainFile, variants };
  }

  async findByBlogPostId(blogPostId: string): Promise<File[]> {
    this.logger.info("Finding files for blog post", { blogPostId });
    const files = await this.db.file.findMany({
      where: {
        blogPosts: {
          some: {
            blogPostId,
          },
        },
      },
      include: {
        blogPosts: {
          where: {
            blogPostId,
          },
        },
      },
    });

    this.logger.info("Found files for blog post", { blogPostId, count: files.length });
    return files.map((file) => {
      const url = getPublicUrl(file.path);
      return {
        ...mapFileToDomainEntity(file as DbFile),
        isCover: file.blogPosts[0]?.isCover || false,
        url,
      };
    });
  }

  async updateBlogPostFiles(blogPostId: string, files: BlogPostFile[]): Promise<void> {
    this.logger.info("Updating files for blog post", { blogPostId, fileCount: files.length });

    // First, remove all existing file associations for this blog post
    await this.db.blogPostToFile.deleteMany({
      where: {
        blogPostId,
      },
    });

    // Then create new associations for each file
    for (const file of files) {
      await this.associateWithBlogPost({
        path: file.path,
        blogPostId,
        isCover: file.isCover || false,
      });
    }
    this.logger.info("Completed file associations for blog post", { blogPostId, fileCount: files.length });
  }

  async findByShowId(showId: string): Promise<ShowFile[]> {
    this.logger.info("Finding files for show", { showId });

    const showFiles = await this.db.showToFile.findMany({
      where: { showId },
      include: {
        file: {
          select: {
            id: true,
            variants: true,
            metadata: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    this.logger.info("Found files for show", { showId, count: showFiles.length });

    return showFiles.map((sf) => {
      const variants = (sf.file.variants as Record<string, string>) || {};
      const metadata = (sf.file.metadata as Record<string, unknown>) || {};

      return {
        id: sf.file.id,
        url: variants.public || Object.values(variants)[0] || "",
        thumbnailUrl: variants.thumbnail || variants.public || Object.values(variants)[0],
        label: (metadata.label as string) || null,
        source: (metadata.source as string) || null,
      };
    });
  }
}
