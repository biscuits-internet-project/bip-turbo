-- AlterTable
ALTER TABLE "api_keys" ADD COLUMN     "api_limit_per_minute" INTEGER,
ADD COLUMN     "mcp_limit_per_minute" INTEGER;
