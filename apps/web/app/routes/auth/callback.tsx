import { type LoaderFunctionArgs, redirect } from "react-router";
import { logger } from "~/server/logger";
import { services } from "~/server/services";
import { getServerClient, getServiceRoleClient } from "~/server/supabase";

export async function loader({ request }: LoaderFunctionArgs) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const type = requestUrl.searchParams.get("type");
  const next = requestUrl.searchParams.get("next") || "/";

  logger.info({ message: "Auth callback", url: requestUrl.toString(), code: !!code, type });

  if (code) {
    const { supabase, headers } = getServerClient(request);
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      logger.error({ error, message: "Failed to exchange code for session" });
      return redirect("/auth/login", { headers });
    }

    // Get the user from the session
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (authUser) {
      try {
        if (!authUser.email) {
          throw new Error("User has no email address");
        }

        // Ensure local user exists (create if new, return existing if not)
        const localUser = await services.users.findOrCreate({
          id: authUser.id, // Use Supabase ID for new users (but existing users keep their ID)
          email: authUser.email,
          username: authUser.user_metadata.username || authUser.email.split("@")[0],
        });

        logger.info({
          message: "Local user synced",
          authUserId: authUser.id,
          localUserId: localUser.id,
          email: authUser.email,
        });

        // ALWAYS store the internal user ID in Supabase metadata
        // This is our single source of truth
        if (!authUser.user_metadata.internal_user_id || authUser.user_metadata.internal_user_id !== localUser.id) {
          const adminClient = getServiceRoleClient();
          const { error: updateError } = await adminClient.auth.admin.updateUserById(authUser.id, {
            user_metadata: {
              ...authUser.user_metadata,
              internal_user_id: localUser.id,
            },
          });

          if (updateError) {
            logger.error({ error: updateError, message: "Failed to update user metadata with internal_user_id" });
          } else {
            logger.info({ message: "Updated user metadata with internal_user_id", userId: localUser.id });
          }
        }
      } catch (err) {
        logger.error({ error: err, message: "Failed to sync local user" });
        // Continue anyway - user can still log in
      }
    }

    // If this is a password recovery flow, redirect to reset password page
    if (type === "recovery") {
      logger.info("Redirecting to reset password page");
      return redirect("/auth/reset-password", { headers });
    }

    logger.info({ message: "Redirecting to next page", next });
    return redirect(next, { headers });
  }

  logger.error("missing code from supabase auth callback");
  return redirect("/auth/login");
}
