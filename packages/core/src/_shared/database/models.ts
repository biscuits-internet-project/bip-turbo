/**
 * Database models
 *
 * This file re-exports Prisma types with generic names to decouple the repository
 * from Prisma. If you switch to a different ORM, you only need to update this file.
 */
import type {
  Annotation as PrismaAnnotation,
  Author as PrismaAuthor,
  PrismaClient,
  Show as PrismaShow,
  Song as PrismaSong,
  Track as PrismaTrack,
  User as PrismaUser,
  Venue as PrismaVenue,
  // Add other Prisma models as needed
} from "@prisma/client";

// Re-export the Prisma types with generic names
export type DbAnnotation = PrismaAnnotation;
export type DbClient = PrismaClient;
export type DbSong = PrismaSong;
export type DbAuthor = PrismaAuthor;
export type DbShow = PrismaShow;
export type DbTrack = PrismaTrack;
export type DbVenue = PrismaVenue;
export type DbUser = PrismaUser;

// Define a type for any model name in the database client
export type ModelName = keyof DbClient;

// Define a generic database model type
export type DbModel = DbSong | DbAuthor | DbShow | DbTrack | DbVenue | DbUser | DbAnnotation;

// Re-export the Prisma client instance with the generic type
import { prisma as prismaInstance } from "../prisma";

export const dbClient: DbClient = prismaInstance;
