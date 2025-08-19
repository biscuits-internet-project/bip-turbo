import type { File, Logger, FileCategory } from "@bip/domain";
import type { FileRepository } from "./file-repository";
import type { R2Service } from "./r2-service";

interface FileCreateInput {
  path: string;
  filename: string;
  type: string;
  size: number;
  userId: string;
  blogPostId?: string;
  isCover?: boolean;
}

interface BlogPostFile {
  path: string;
  url: string;
  isCover?: boolean;
}

interface FileUploadInput {
  buffer: Buffer;
  filename: string;
  contentType: string;
  category: FileCategory;
  userId: string;
}

interface FileUploadResult extends File {
  url: string;
}

export class FileService {
  constructor(
    protected readonly repository: FileRepository,
    protected readonly r2Service: R2Service,
    protected readonly logger: Logger,
  ) {}

  async create(input: FileCreateInput): Promise<File> {
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

  async findByBlogPostId(blogPostId: string): Promise<File[]> {
    return this.repository.findByBlogPostId(blogPostId);
  }

  async updateBlogPostFiles(blogPostId: string, files: BlogPostFile[]): Promise<void> {
    console.log("File service: updating files for blog post:", { blogPostId, files });

    // First, remove all existing file associations for this blog post
    await this.repository.removeAllBlogPostFiles(blogPostId);
    console.log("File service: removed existing file associations");

    // Then create new associations for each file
    for (const file of files) {
      console.log("File service: associating file:", file);
      await this.repository.associateWithBlogPost({
        path: file.path,
        blogPostId,
        isCover: file.isCover || false,
      });
    }
    console.log("File service: completed file associations");
  }

  async uploadFile(input: FileUploadInput): Promise<FileUploadResult> {
    this.logger.info({
      filename: input.filename, 
      category: input.category,
      userId: input.userId 
    }, "Starting file upload");

    // Upload to R2
    const uploadResult = await this.r2Service.uploadFile(input);

    // Create database record
    const file = await this.repository.create({
      path: uploadResult.path,
      filename: input.filename,
      type: input.contentType,
      size: uploadResult.size,
      userId: input.userId,
    });

    this.logger.info({ 
      fileId: file.id, 
      path: uploadResult.path,
      url: uploadResult.url 
    }, "File upload completed");

    return {
      ...file,
      url: uploadResult.url,
    };
  }
}
