import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/schema";

// For query purposes
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}
const queryClient = postgres(connectionString);

// Drizzle client instance
export const db = drizzle(queryClient, {
  schema,
  logger: true,
});

export type Database = typeof db;
