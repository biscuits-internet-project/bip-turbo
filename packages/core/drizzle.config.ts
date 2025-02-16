import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required. Use doppler run to provide it.");
}

export default defineConfig({
  out: "./src/shared/drizzle",
  schema: "./src/shared/drizzle/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
