/**
 * Migration script to upload images from S3/local storage to Cloudflare Images
 * and create the appropriate File records and associations.
 *
 * Usage:
 *   # Dry run (preview only)
 *   DRY_RUN=true doppler run --config prd -- bun scripts/migrate-images-to-cloudflare.ts
 *
 *   # Run migration against production
 *   doppler run --config prd -- bun scripts/migrate-images-to-cloudflare.ts
 *
 * Environment variables:
 *   DRY_RUN=true           - Preview changes without making them
 *   IMAGES_PATH=../s3-images - Path to the images directory
 *   BATCH_SIZE=50          - Number of images to process per batch
 *   SKIP_EXISTING=true     - Skip files already migrated (default: true)
 *   RECORD_TYPE=ShowPhoto  - Only process specific type (User, ShowPhoto, BlogPost)
 */

import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { PrismaClient } from "@prisma/client";
import { CloudflareImagesClient } from "../packages/core/src/files/cloudflare-images";
import type { Logger } from "@bip/domain";

// Configuration
const DRY_RUN = process.env.DRY_RUN === "true";
const IMAGES_PATH = process.env.IMAGES_PATH || "../s3-images";
const BATCH_SIZE = Number.parseInt(process.env.BATCH_SIZE || "50", 10);
const SKIP_EXISTING = process.env.SKIP_EXISTING !== "false";
const RECORD_TYPE_FILTER = process.env.RECORD_TYPE || null;

// Cloudflare config from environment (provided by Doppler)
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_IMAGES_API_TOKEN = process.env.CLOUDFLARE_IMAGES_API_TOKEN;

if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_IMAGES_API_TOKEN) {
  console.error("Missing CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_IMAGES_API_TOKEN");
  console.error("Make sure to run with: doppler run --config prd -- bun scripts/migrate-images-to-cloudflare.ts");
  process.exit(1);
}

// Simple console logger
const logger: Logger = {
  info: (msg: string, _meta?: Record<string, unknown>) => {
    // Suppress verbose logging during migration
  },
  warn: (msg: string, meta?: Record<string, unknown>) => console.warn(`[WARN] ${msg}`, meta || ""),
  error: (msg: string, meta?: Record<string, unknown>) => console.error(`[ERROR] ${msg}`, meta || ""),
  debug: (_msg: string, _meta?: Record<string, unknown>) => {},
};

const prisma = new PrismaClient();
const cloudflare = new CloudflareImagesClient(
  { accountId: CLOUDFLARE_ACCOUNT_ID, apiToken: CLOUDFLARE_IMAGES_API_TOKEN },
  logger
);

// Stats tracking
const stats = {
  total: 0,
  processed: 0,
  uploaded: 0,
  skipped: 0,
  errors: 0,
  missingFiles: 0,
  byType: {} as Record<string, { processed: number; uploaded: number; errors: number }>,
};

// Track missing files for reporting
const missingFileKeys: string[] = [];

interface AttachmentWithBlob {
  id: string;
  name: string;
  recordType: string;
  recordId: string;
  blobId: string;
  createdAt: Date;
  blob: {
    id: string;
    key: string;
    filename: string;
    contentType: string | null;
    metadata: string | null;
    byteSize: bigint;
  };
}

async function getAttachmentsToMigrate(): Promise<AttachmentWithBlob[]> {
  const where = RECORD_TYPE_FILTER ? { recordType: RECORD_TYPE_FILTER } : {};

  const attachments = await prisma.activeStorageAttachment.findMany({
    where,
    include: {
      blob: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return attachments;
}

async function checkIfAlreadyMigrated(blobKey: string): Promise<string | null> {
  try {
    const existing = await prisma.file.findFirst({
      where: {
        metadata: {
          path: ["legacy_blob_key"],
          equals: blobKey,
        },
      },
    });

    return existing?.id || null;
  } catch (error) {
    // If metadata column doesn't exist, check by cloudflareId pattern
    // This handles the case where migration hasn't been run yet
    if (error instanceof Error && error.message.includes("metadata")) {
      return null;
    }
    throw error;
  }
}

function getFilePath(blobKey: string): string {
  return join(IMAGES_PATH, blobKey);
}

function fileExists(blobKey: string): boolean {
  return existsSync(getFilePath(blobKey));
}

async function uploadToCloudflare(
  blobKey: string,
  filename: string
): Promise<{ cloudflareId: string; variants: Record<string, string> } | null> {
  const filePath = getFilePath(blobKey);

  if (!existsSync(filePath)) {
    return null;
  }

  const fileBuffer = readFileSync(filePath);

  const result = await cloudflare.upload({
    file: fileBuffer,
    filename,
    metadata: { legacy_blob_key: blobKey },
  });

  const variants = cloudflare.parseVariants(result.variants);

  return {
    cloudflareId: result.id,
    variants,
  };
}

async function createFileRecord(
  attachment: AttachmentWithBlob,
  cloudflareId: string,
  variants: Record<string, string>,
  userId: string,
  extraMetadata?: Record<string, string | null>
): Promise<string> {
  // Parse blob metadata for dimensions
  let blobMetadata: Record<string, unknown> = {};
  if (attachment.blob.metadata) {
    try {
      blobMetadata = JSON.parse(attachment.blob.metadata);
    } catch {
      // Ignore parse errors
    }
  }

  const metadata: Record<string, string | number | null> = {
    legacy_blob_key: attachment.blob.key,
    legacy_blob_id: attachment.blob.id,
    legacy_attachment_id: attachment.id,
    ...extraMetadata,
  };

  if (typeof blobMetadata.width === "number") {
    metadata.width = blobMetadata.width;
  }
  if (typeof blobMetadata.height === "number") {
    metadata.height = blobMetadata.height;
  }

  const file = await prisma.file.create({
    data: {
      path: variants.public || Object.values(variants)[0] || "",
      filename: attachment.blob.filename,
      size: Number(attachment.blob.byteSize),
      type: attachment.blob.contentType || "image/jpeg",
      userId,
      cloudflareId,
      variants,
      metadata,
      createdAt: attachment.createdAt,
      updatedAt: new Date(),
    },
  });

  return file.id;
}

async function createUserAvatarAssociation(userId: string, fileId: string, avatarUrl: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      avatarFileId: fileId,
      avatarFileUrl: avatarUrl,
    },
  });
}

async function createShowFileAssociation(
  showPhotoId: string,
  fileId: string,
  userId: string,
  createdAt: Date
): Promise<void> {
  const showPhoto = await prisma.showPhoto.findUnique({
    where: { id: showPhotoId },
  });

  if (!showPhoto) {
    throw new Error(`ShowPhoto ${showPhotoId} not found`);
  }

  // Update file metadata with label/source from ShowPhoto
  const existingFile = await prisma.file.findUnique({ where: { id: fileId } });
  const existingMetadata = (existingFile?.metadata as Record<string, unknown>) || {};

  await prisma.file.update({
    where: { id: fileId },
    data: {
      metadata: {
        ...existingMetadata,
        label: showPhoto.label,
        source: showPhoto.source,
      },
    },
  });

  // Create ShowToFile association
  await prisma.showToFile.create({
    data: {
      showId: showPhoto.showId,
      fileId,
      userId,
      createdAt,
      updatedAt: new Date(),
    },
  });
}

async function createBlogPostFileAssociation(blogPostId: string, fileId: string, createdAt: Date): Promise<void> {
  await prisma.blogPostToFile.create({
    data: {
      blogPostId,
      fileId,
      isCover: true,
      createdAt,
    },
  });
}

async function getSystemUserId(): Promise<string> {
  // Find an admin user to use for orphaned attachments
  const adminRole = await prisma.role.findFirst({
    where: { name: "admin" },
  });

  if (adminRole) {
    const adminUserRole = await prisma.userRole.findFirst({
      where: { roleId: adminRole.id },
    });

    if (adminUserRole) {
      return adminUserRole.userId;
    }
  }

  throw new Error("No admin user found for orphaned attachments");
}

async function processAttachment(attachment: AttachmentWithBlob, systemUserId: string): Promise<void> {
  const { recordType, recordId, blob } = attachment;

  if (!stats.byType[recordType]) {
    stats.byType[recordType] = { processed: 0, uploaded: 0, errors: 0 };
  }
  const typeStats = stats.byType[recordType];

  typeStats.processed++;
  stats.processed++;

  // Check if file exists on disk
  if (!fileExists(blob.key)) {
    stats.missingFiles++;
    missingFileKeys.push(blob.key);
    console.log(`  [SKIP] Missing file: ${blob.key}`);
    return;
  }

  // Check if already migrated
  if (SKIP_EXISTING) {
    const existingFileId = await checkIfAlreadyMigrated(blob.key);
    if (existingFileId) {
      stats.skipped++;
      console.log(`  [SKIP] Already migrated: ${blob.key}`);
      return;
    }
  }

  if (DRY_RUN) {
    console.log(`  [DRY-RUN] Would upload: ${blob.key} (${blob.filename}) -> ${recordType}:${recordId}`);
    stats.uploaded++;
    typeStats.uploaded++;
    return;
  }

  try {
    // Upload to Cloudflare
    const uploadResult = await uploadToCloudflare(blob.key, blob.filename);

    if (!uploadResult) {
      stats.missingFiles++;
      console.log(`  [ERROR] Failed to read file: ${blob.key}`);
      return;
    }

    // Determine userId for the file record
    let userId: string;

    if (recordType === "User") {
      userId = recordId;
    } else if (recordType === "ShowPhoto") {
      const showPhoto = await prisma.showPhoto.findUnique({ where: { id: recordId } });
      userId = showPhoto?.userId || systemUserId;
    } else if (recordType === "BlogPost") {
      const blogPost = await prisma.blogPost.findUnique({ where: { id: recordId } });
      userId = blogPost?.userId || systemUserId;
    } else {
      userId = systemUserId;
    }

    // Create File record
    const fileId = await createFileRecord(attachment, uploadResult.cloudflareId, uploadResult.variants, userId);

    // Create association based on record type
    const avatarUrl = uploadResult.variants.avatar || uploadResult.variants.public || Object.values(uploadResult.variants)[0];

    if (recordType === "User") {
      await createUserAvatarAssociation(recordId, fileId, avatarUrl);
      console.log(`  [OK] User avatar: ${recordId}`);
    } else if (recordType === "ShowPhoto") {
      await createShowFileAssociation(recordId, fileId, userId, attachment.createdAt);
      console.log(`  [OK] ShowPhoto -> Show file: ${recordId}`);
    } else if (recordType === "BlogPost") {
      await createBlogPostFileAssociation(recordId, fileId, attachment.createdAt);
      console.log(`  [OK] BlogPost file: ${recordId}`);
    }

    stats.uploaded++;
    typeStats.uploaded++;
  } catch (error) {
    stats.errors++;
    typeStats.errors++;
    console.error(`  [ERROR] ${recordType}:${recordId} - ${error instanceof Error ? error.message : error}`);
  }
}

async function verifySchema(): Promise<void> {
  // Check if required tables/columns exist
  try {
    await prisma.$queryRaw`SELECT metadata FROM files LIMIT 1`;
  } catch (error) {
    if (error instanceof Error && error.message.includes("metadata")) {
      console.error("\nERROR: The 'metadata' column does not exist on the 'files' table.");
      console.error("Please run the Prisma migration first:");
      console.error("  doppler run --config prd -- bunx prisma migrate deploy --schema=packages/core/src/_shared/prisma/schema.prisma");
      process.exit(1);
    }
  }

  try {
    await prisma.$queryRaw`SELECT 1 FROM show_files LIMIT 1`;
  } catch (error) {
    if (error instanceof Error && error.message.includes("show_files")) {
      console.error("\nERROR: The 'show_files' table does not exist.");
      console.error("Please run the Prisma migration first:");
      console.error("  doppler run --config prd -- bunx prisma migrate deploy --schema=packages/core/src/_shared/prisma/schema.prisma");
      process.exit(1);
    }
  }
}

async function main() {
  console.log("=".repeat(60));
  console.log("Image Migration to Cloudflare Images");
  console.log("=".repeat(60));
  console.log(`Mode: ${DRY_RUN ? "DRY RUN (no changes)" : "LIVE"}`);
  console.log(`Images path: ${IMAGES_PATH}`);
  console.log(`Batch size: ${BATCH_SIZE}`);
  console.log(`Skip existing: ${SKIP_EXISTING}`);
  console.log(`Record type filter: ${RECORD_TYPE_FILTER || "ALL"}`);
  console.log("=".repeat(60));

  // Verify schema has required migrations
  console.log("\nVerifying database schema...");
  await verifySchema();
  console.log("Schema OK");

  // Verify images directory exists
  if (!existsSync(IMAGES_PATH)) {
    console.error(`\nImages directory not found: ${IMAGES_PATH}`);
    console.error("Make sure to run from the bip-turbo directory");
    process.exit(1);
  }

  // Get system user for orphaned attachments
  const systemUserId = await getSystemUserId();
  console.log(`\nSystem user ID for orphans: ${systemUserId}`);

  // Get all attachments
  console.log("\nFetching attachments from database...");
  const attachments = await getAttachmentsToMigrate();
  stats.total = attachments.length;
  console.log(`Found ${attachments.length} attachments to process`);

  // Group by type for reporting
  const byType = attachments.reduce(
    (acc, a) => {
      acc[a.recordType] = (acc[a.recordType] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  console.log("By type:", byType);

  // Process in batches
  console.log("\nProcessing attachments...\n");

  for (let i = 0; i < attachments.length; i += BATCH_SIZE) {
    const batch = attachments.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(attachments.length / BATCH_SIZE);

    console.log(`--- Batch ${batchNum}/${totalBatches} ---`);

    for (const attachment of batch) {
      await processAttachment(attachment, systemUserId);
    }

    // Progress update
    const progress = ((stats.processed / stats.total) * 100).toFixed(1);
    console.log(`Progress: ${progress}% | Uploaded: ${stats.uploaded} | Skipped: ${stats.skipped} | Errors: ${stats.errors}\n`);
  }

  // Final report
  console.log("=".repeat(60));
  console.log("MIGRATION COMPLETE");
  console.log("=".repeat(60));
  console.log(`Total attachments: ${stats.total}`);
  console.log(`Processed: ${stats.processed}`);
  console.log(`Uploaded: ${stats.uploaded}`);
  console.log(`Skipped (already migrated): ${stats.skipped}`);
  console.log(`Missing files: ${stats.missingFiles}`);
  console.log(`Errors: ${stats.errors}`);
  console.log("\nBy type:");
  for (const [type, typeStats] of Object.entries(stats.byType)) {
    if (typeStats.processed > 0) {
      console.log(`  ${type}: ${typeStats.uploaded} uploaded, ${typeStats.errors} errors`);
    }
  }

  if (DRY_RUN) {
    console.log("\n*** DRY RUN - No changes were made ***");
  }

  // Output missing files
  if (missingFileKeys.length > 0) {
    console.log("\n" + "=".repeat(60));
    console.log("MISSING FILES");
    console.log("=".repeat(60));
    console.log("The following blob keys have no corresponding file on disk:\n");
    for (const key of missingFileKeys) {
      console.log(key);
    }
  }
}

main()
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
