import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required. Use doppler run to provide it.");
}

export default defineConfig({
  out: "./src/_shared/drizzle/migrations",
  schema: ["./src/_shared/drizzle/schema/schema.ts"],
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
  schemaFilter: ["public"],
  migrations: {
    table: "__drizzle_migrations",
    schema: "public",
  },
});
