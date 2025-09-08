import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

// Validate environment variables
const envSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

// Bun automatically loads environment variables
const env = envSchema.parse(process.env);

// Check for dry run flag
const isDryRun = process.argv.includes("--dry-run");

// Initialize Supabase Admin Client
const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

interface SyncStats {
  totalUsers: number;
  existingLocalUsers: number;
  newLocalUsers: number;
  metadataUpdates: number;
  alreadySynced: number;
  errors: number;
}

async function syncSupabaseUsers() {
  // Initialize database
  const db = new PrismaClient();

  const stats: SyncStats = {
    totalUsers: 0,
    existingLocalUsers: 0,
    newLocalUsers: 0,
    metadataUpdates: 0,
    alreadySynced: 0,
    errors: 0,
  };

  try {
    console.log(`🔄 Starting Supabase user sync ${isDryRun ? "(DRY RUN)" : "(LIVE RUN)"}...`);
    console.log("");

    // Get all users from Supabase Auth with proper pagination
    console.log("🔍 Fetching all Supabase users...");

    let allUsers: any[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      console.log(`📄 Fetching page ${page}...`);

      const {
        data: { users },
        error,
      } = await supabase.auth.admin.listUsers({
        page,
      });

      if (error) {
        console.error("Failed to fetch Supabase users:", error);
        return;
      }

      if (!users || users.length === 0) {
        hasMore = false;
        break;
      }

      allUsers = allUsers.concat(users);
      console.log(`📄 Got ${users.length} users on page ${page} (total so far: ${allUsers.length})`);

      // Continue to next page - Supabase seems to default to 50 per page
      if (users.length < 50) {
        hasMore = false;
      } else {
        page++;
      }
    }

    console.log(`📊 Total Supabase users found: ${allUsers.length}`);
    stats.totalUsers = allUsers.length;

    for (const authUser of allUsers) {
      try {
        if (!authUser.email) {
          console.error(`❌ User ${authUser.id} has no email address - skipping`);
          stats.errors++;
          continue;
        }

        // Check if local user exists
        const existingLocalUser = await db.user.findUnique({
          where: { email: authUser.email },
        });

        if (existingLocalUser) {
          stats.existingLocalUsers++;
          console.log(`👤 ${authUser.email} -> Found existing local user (ID: ${existingLocalUser.id})`);

          // Check if metadata needs updating
          const needsMetadataUpdate =
            !authUser.user_metadata?.internal_user_id ||
            authUser.user_metadata.internal_user_id !== existingLocalUser.id;

          if (needsMetadataUpdate) {
            console.log(`  📝 Needs metadata update: auth(${authUser.id}) -> internal(${existingLocalUser.id})`);

            if (!isDryRun) {
              const { error: updateError } = await supabase.auth.admin.updateUserById(authUser.id, {
                user_metadata: {
                  ...authUser.user_metadata,
                  internal_user_id: existingLocalUser.id,
                },
              });

              if (updateError) {
                console.error(`  ❌ Failed to update metadata:`, updateError);
                stats.errors++;
              } else {
                console.log(`  ✅ Updated metadata successfully`);
                stats.metadataUpdates++;
              }
            } else {
              stats.metadataUpdates++;
            }
          } else {
            console.log(`  ⏭️  Metadata already up to date`);
            stats.alreadySynced++;
          }
        } else {
          // Would create new local user
          stats.newLocalUsers++;
          console.log(`🆕 ${authUser.email} -> Would create new local user (use Supabase ID: ${authUser.id})`);

          if (!isDryRun) {
            const localUser = await db.user.create({
              data: {
                id: authUser.id, // Use Supabase ID for new users
                email: authUser.email,
                username: authUser.user_metadata?.username || authUser.email.split("@")[0],
                passwordDigest: "supabase_auth", // Placeholder
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            });

            // Update metadata
            const { error: updateError } = await supabase.auth.admin.updateUserById(authUser.id, {
              user_metadata: {
                ...authUser.user_metadata,
                internal_user_id: localUser.id,
              },
            });

            if (updateError) {
              console.error(`  ❌ Failed to update metadata for new user:`, updateError);
              stats.errors++;
            } else {
              console.log(`  ✅ Created local user and updated metadata`);
              stats.metadataUpdates++;
            }
          }
        }
      } catch (err) {
        console.error(`❌ Error processing user ${authUser.email}:`, err);
        stats.errors++;
      }
    }

    // Print summary
    console.log(`\n${"=".repeat(50)}`);
    console.log(`📊 SYNC SUMMARY ${isDryRun ? "(DRY RUN)" : "(LIVE RUN)"}`);
    console.log("=".repeat(50));
    console.log(`Total Supabase users: ${stats.totalUsers}`);
    console.log(`Existing local users: ${stats.existingLocalUsers}`);
    console.log(`New local users: ${stats.newLocalUsers}`);
    console.log(`Metadata updates needed: ${stats.metadataUpdates}`);
    console.log(`Already synced: ${stats.alreadySynced}`);
    console.log(`Errors: ${stats.errors}`);
    console.log("");

    if (isDryRun) {
      console.log("🔥 To run for real, use: bun run sync-supabase-users.ts");
    } else {
      console.log("✨ Sync completed!");
    }
  } catch (err) {
    console.error("💥 Sync failed:", err);
  } finally {
    await db.$disconnect();
  }
}

// Run the sync
await syncSupabaseUsers();
