import type { File, Logger } from "@bip/domain";
import type { FileRepository } from "./file-repository";

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

export class FileService {
  constructor(
    protected readonly repository: FileRepository,
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
}
