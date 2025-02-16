import { db as drizzleDb } from "@bip/core";

// Maintain singleton instance in development
declare global {
  var __db: typeof drizzleDb | undefined;
}

let db: typeof drizzleDb;

if (process.env.NODE_ENV === "production") {
  db = drizzleDb;
} else {
  if (!global.__db) {
    global.__db = drizzleDb;
  }
  db = global.__db;
}

export { db };
