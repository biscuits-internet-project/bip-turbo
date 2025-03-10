import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

// Validate environment variables
const envSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

// Bun automatically loads environment variables
const env = envSchema.parse(process.env);

const prisma = new PrismaClient();

// Initialize Supabase Admin Client
const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function migrateUsers() {
  try {
    // Get all users from your database
    const users = await prisma.user.findMany();

    console.log(`Found ${users.length} users to migrate`);

    for (const user of users) {
      try {
        // Create user in Supabase Auth with their existing UUID and password hash
        const { data, error } = await supabase.auth.admin.createUser({
          email: user.email.toLowerCase(),
          email_confirm: true,
          user_metadata: {
            username: user.username,
            created_at: user.createdAt.toISOString(),
          },
          password_hash: user.passwordDigest, // Use existing BCrypt hash from Rails
          id: user.id, // This preserves their UUID
        });

        if (error) {
          console.error(`Failed to migrate user ${user.email}:`, error);
          continue;
        }

        console.log(`Successfully migrated user ${user.email}`);
      } catch (err) {
        console.error(`Error processing user ${user.email}:`, err);
      }
    }
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

// Self-executing async function for top-level await with Bun
await migrateUsers();
