/*
  Warnings:

  - Made the column `rateable_type` on table `ratings` required. This step will fail if there are existing NULL values in that column.
  - Made the column `rateable_id` on table `ratings` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ratings" ALTER COLUMN "rateable_type" SET NOT NULL,
ALTER COLUMN "rateable_id" SET NOT NULL;
