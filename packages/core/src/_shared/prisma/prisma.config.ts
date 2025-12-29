// Only load dotenv in development - production uses system env vars
if (process.env.NODE_ENV !== "production") {
  await import("dotenv/config").catch(() => {});
}

import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "./schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
