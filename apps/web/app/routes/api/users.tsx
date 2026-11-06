import { getFeatureFlags } from "@bip/core";
import type { ActionFunctionArgs } from "react-router-dom";
import { z } from "zod";
import { logger } from "~/lib/logger";
import { enforceRateLimit } from "~/server/rate-limit";
import { services } from "~/server/services";
import { getServerClient } from "~/server/supabase";

const USERNAME_PATTERN = /^[A-Za-z0-9._-]+$/;

const updateUserSchema = z.object({
  // "@" is refused even on an unchanged resubmit: a username renders publicly, and an
  // email-shaped one published the address (a DB CHECK enforces the same rule).
  username: z
    .string()
    .min(3)
    .max(50)
    .refine((value) => !value.includes("@"), "Usernames cannot contain @")
    .optional(),
  // Toggles arrive as "true"/"false" strings; persistence is flag-gated below.
  showCalibratedRatings: z.enum(["true", "false"]).optional(),
  showRatingComparisonDebug: z.enum(["true", "false"]).optional(),
  trackCalibratedRatings: z.enum(["true", "false"]).optional(),
  trackRatingComparisonDebug: z.enum(["true", "false"]).optional(),
  colorCodeRatings: z.enum(["true", "false"]).optional(),
  showSetlistTimes: z.enum(["true", "false"]).optional(),
  // Rating display precision arrives as the chosen decimal-places string.
  ratingDecimalPlaces: z.enum(["1", "2", "3", "4"]).optional(),
});

export async function action({ request }: ActionFunctionArgs) {
  // Not wrapped in base-loaders, so it applies the shared /api budget itself (by IP).
  await enforceRateLimit(request, "api");

  try {
    // Get current session user
    const { supabase } = getServerClient(request);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const formData = await request.formData();
    const rawData = Object.fromEntries(formData);
    const data: Record<string, string | null> = {};

    // Convert FormDataEntryValue to string or null
    for (const [key, value] of Object.entries(rawData)) {
      if (typeof value === "string") {
        data[key] = value;
      } else {
        data[key] = null;
      }
    }

    const validatedData = updateUserSchema.parse(data);

    // Find the local user by email to get the correct local user ID
    const localUser = await services.users.findByEmail(user.email || "");
    if (!localUser) {
      return new Response(JSON.stringify({ error: "User not found in local database" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // If Supabase user metadata doesn't have a username, sync it from local database
    if (!user.user_metadata?.username && localUser.username) {
      try {
        await supabase.auth.updateUser({
          data: {
            ...user.user_metadata,
            username: localUser.username,
          },
        });
      } catch (error) {
        logger.error("Failed to initialize username in Supabase", { error });
      }
    }

    // Build the update explicitly: persist a flag-gated pref only if the matching
    // flag makes that toggle visible for this user (so an ineligible user can't set
    // it via a crafted POST), and coerce the "true"/"false" strings to booleans.
    const update: {
      username?: string;
      showCalibratedRatings?: boolean;
      showRatingComparisonDebug?: boolean;
      trackCalibratedRatings?: boolean;
      trackRatingComparisonDebug?: boolean;
      colorCodeRatings?: boolean;
      showSetlistTimes?: boolean;
      ratingDecimalPlaces?: number;
    } = {};
    if (validatedData.username && validatedData.username !== localUser.username) {
      // Same alphabet signup produces (UserService.sanitizeUsername). Without it, a rename
      // could pick spaces, Unicode lookalikes, or an email address, which renders publicly.
      // Checked only on change: 139 existing names predate the rule, and the profile form
      // resubmits the current name with every save.
      if (!USERNAME_PATTERN.test(validatedData.username)) {
        return new Response(
          JSON.stringify({ error: "Usernames may contain only letters, numbers, dots, dashes and underscores" }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }
      if (await services.users.isUsernameTaken(validatedData.username, localUser.id)) {
        return new Response(JSON.stringify({ error: "That username is taken" }), {
          status: 409,
          headers: { "Content-Type": "application/json" },
        });
      }
      update.username = validatedData.username;
    }
    const flags = await getFeatureFlags({ user: { id: localUser.id, username: localUser.username } });
    if (flags.toggleVisible && validatedData.showCalibratedRatings !== undefined) {
      update.showCalibratedRatings = validatedData.showCalibratedRatings === "true";
    }
    if (flags.compareVisible && validatedData.showRatingComparisonDebug !== undefined) {
      update.showRatingComparisonDebug = validatedData.showRatingComparisonDebug === "true";
    }
    if (flags.toggleVisible && validatedData.trackCalibratedRatings !== undefined) {
      update.trackCalibratedRatings = validatedData.trackCalibratedRatings === "true";
    }
    if (flags.compareVisible && validatedData.trackRatingComparisonDebug !== undefined) {
      update.trackRatingComparisonDebug = validatedData.trackRatingComparisonDebug === "true";
    }
    // Color coding and setlist times are available to everyone, so no flag
    // guards these.
    if (validatedData.colorCodeRatings !== undefined) {
      update.colorCodeRatings = validatedData.colorCodeRatings === "true";
    }
    if (validatedData.showSetlistTimes !== undefined) {
      update.showSetlistTimes = validatedData.showSetlistTimes === "true";
    }
    if (validatedData.ratingDecimalPlaces !== undefined) {
      update.ratingDecimalPlaces = Number(validatedData.ratingDecimalPlaces);
    }

    const updatedUser = await services.users.update(localUser.id, update);

    if (!updatedUser) {
      return new Response(JSON.stringify({ error: "Failed to update user" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Sync username back to Supabase user metadata if it was updated
    if (validatedData.username && validatedData.username !== user.user_metadata?.username) {
      try {
        await supabase.auth.updateUser({
          data: {
            ...user.user_metadata,
            username: validatedData.username,
          },
        });
      } catch (error) {
        logger.error("Failed to sync username to Supabase", { error });
        // Don't fail the request if Supabase sync fails
      }
    }

    return new Response(JSON.stringify(updatedUser), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    logger.error("Error updating user", { error });
    return new Response(JSON.stringify({ error: "Invalid request data" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
