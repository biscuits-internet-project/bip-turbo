/*
  Warnings:

  - Added the required column `entity_slug` to the `search_indexes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "search_indexes" ADD COLUMN     "entity_slug" VARCHAR NOT NULL;
