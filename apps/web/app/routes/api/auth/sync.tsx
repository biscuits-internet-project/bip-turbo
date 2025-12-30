import { type ActionFunctionArgs, data } from "react-router";
import { logger } from "~/server/logger";
import { services } from "~/server/services";
import { getServerClient, getServiceRoleClient } from "~/server/supabase";

/**
 * POST /api/auth/sync
 *
 * Ensures the authenticated Supabase user has a corresponding PostgreSQL record.
 * Called after registration or when a user is detected without a local record.
 *
 * This is a critical safeguard to prevent Supabase/PostgreSQL user sync issues.
 */
export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return data({ error: "Method not allowed" }, { status: 405 });
  }

  const { supabase, headers } = getServerClient(request);

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    return data({ error: "Not authenticated" }, { status: 401, headers });
  }

  if (!authUser.email) {
    logger.error("User sync failed: no email", { authUserId: authUser.id });
    return data({ error: "User has no email address" }, { status: 400, headers });
  }

  try {
    // Ensure local user exists (create if new, return existing if not)
    const localUser = await services.users.findOrCreate({
      id: authUser.id, // Use Supabase ID for new users (but existing users keep their ID)
      email: authUser.email,
      username: authUser.user_metadata.username || authUser.email.split("@")[0],
    });

    logger.info("User sync successful", {
      authUserId: authUser.id,
      localUserId: localUser.id,
      email: authUser.email,
    });

    // Update Supabase metadata with internal_user_id if needed
    if (!authUser.user_metadata.internal_user_id || authUser.user_metadata.internal_user_id !== localUser.id) {
      const adminClient = getServiceRoleClient();
      const { error: updateError } = await adminClient.auth.admin.updateUserById(authUser.id, {
        user_metadata: {
          ...authUser.user_metadata,
          internal_user_id: localUser.id,
        },
      });

      if (updateError) {
        logger.error("Failed to update user metadata with internal_user_id", { error: updateError });
      } else {
        logger.info("Updated user metadata with internal_user_id", { userId: localUser.id });
      }
    }

    return data(
      {
        success: true,
        user: {
          id: localUser.id,
          email: localUser.email,
          username: localUser.username,
        },
      },
      { headers },
    );
  } catch (err) {
    logger.error("User sync failed", { error: err, authUserId: authUser.id });
    return data({ error: "Failed to sync user" }, { status: 500, headers });
  }
}
