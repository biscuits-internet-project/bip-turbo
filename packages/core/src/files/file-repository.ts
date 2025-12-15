import type { BlogPostFileAssociation, File, FileCreateInput, Logger, ShowFile } from "@bip/domain";
import type { PrismaClient } from "@prisma/client";

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
        cloudflareId: data.cloudflareId,
        variants: data.variants ?? {},
        createdAt: now,
        updatedAt: now,
      },
    });
    this.logger.info("Created file record", { file });
    return this.mapToDomainEntity({
      ...file,
      variants: file.variants as Record<string, string> | null,
    });
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
      cloudflareId: file.cloudflareId ?? undefined,
      variants: file.variants ?? undefined,
    };
  }

  private getPublicUrl(path: string): string {
    return `${process.env.SUPABASE_STORAGE_URL}/object/public/${path}`;
  }
}
