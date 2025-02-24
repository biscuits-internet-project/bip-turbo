import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

// Separate connection for migrations
const migrationClient = postgres(connectionString, { max: 1 });

async function main() {
  console.log("Starting migrations...");
  const db = drizzle(migrationClient);

  try {
    await migrate(db, { migrationsFolder: "./src/_shared/drizzle/migrations" });
    console.log("Migrations completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }

  await migrationClient.end();
  process.exit(0);
}

main();
