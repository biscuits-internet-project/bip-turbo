import type { File, Logger } from "@bip/domain";
import type { PrismaClient } from "@prisma/client";

interface FileCreateInput {
  path: string;
  filename: string;
  type: string;
  size: number;
  userId: string;
}

interface BlogPostFileAssociation {
  path: string;
  blogPostId: string;
  isCover: boolean;
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
  blogPosts?: Array<{ isCover: boolean }>;
}

export class FileRepository {
  constructor(
    protected db: PrismaClient,
    protected logger: Logger,
  ) {}

  async create(data: FileCreateInput): Promise<File> {
    this.logger.info("Creating file record", { data });
    const now = new Date();
    const file = await this.db.file.create({
      data: {
        path: data.path,
        filename: data.filename,
        type: data.type,
        size: data.size,
        userId: data.userId,
        createdAt: now,
        updatedAt: now,
      },
    });
    this.logger.info("Created file record", { file });
    return this.mapToDomainEntity(file);
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
      const url = this.getPublicUrl(file.path);
      return {
        ...this.mapToDomainEntity(file as DbFile),
        isCover: file.blogPosts[0]?.isCover || false,
        url,
      };
    });
  }

  async associateWithBlogPost(data: BlogPostFileAssociation): Promise<void> {
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

  async removeAllBlogPostFiles(blogPostId: string): Promise<void> {
    await this.db.blogPostToFile.deleteMany({
      where: {
        blogPostId,
      },
    });
  }

  private mapToDomainEntity(file: DbFile): File {
    return {
      id: file.id,
      path: file.path,
      filename: file.filename,
      type: file.type,
      size: file.size,
      userId: file.userId,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
    };
  }

  private getPublicUrl(path: string): string {
    return `${process.env.SUPABASE_STORAGE_URL}/object/public/${path}`;
  }
}
