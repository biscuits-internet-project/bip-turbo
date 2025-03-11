import type { File } from "@bip/domain";
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
  constructor(protected db: PrismaClient) {}

  async create(data: FileCreateInput): Promise<File> {
    console.log("Creating file record:", data);
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
    console.log("Created file record:", file);
    return this.mapToDomainEntity(file);
  }

  async findByBlogPostId(blogPostId: string): Promise<File[]> {
    console.log("Finding files for blog post:", blogPostId);
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

    console.log("Found files:", files);
    return files.map((file) => {
      const url = this.getPublicUrl(file.path);
      console.log("Generated URL for file:", { path: file.path, url });
      return {
        ...this.mapToDomainEntity(file as DbFile),
        isCover: file.blogPosts[0]?.isCover || false,
        url,
      };
    });
  }

  async associateWithBlogPost(data: BlogPostFileAssociation): Promise<void> {
    console.log("Looking up file to associate:", data);
    const file = await this.db.file.findFirst({
      where: {
        path: data.path,
      },
    });

    if (!file) {
      console.error("File not found during association:", data.path);
      throw new Error(`File not found with path: ${data.path}`);
    }

    console.log("Found file to associate:", file);
    await this.db.blogPostToFile.create({
      data: {
        blogPostId: data.blogPostId,
        fileId: file.id,
        isCover: data.isCover,
        createdAt: new Date(),
      },
    });
    console.log("Created blog post to file association");
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
    return `${process.env.SUPABASE_STORAGE_URL}/object/public/uploads/${path}`;
  }
}
