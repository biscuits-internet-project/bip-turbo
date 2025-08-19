import type { ActionFunctionArgs } from "react-router-dom";
import { z } from "zod";
import { services } from "~/server/services";
import { getServerClient } from "~/server/supabase";
import honeybadger from "~/lib/honeybadger";

const updateUserSchema = z.object({
  username: z.string().min(3).max(50).optional(),
});

export async function action({ request }: ActionFunctionArgs) {
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
        honeybadger.notify(error as Error);
        console.error("Failed to initialize username in Supabase:", error);
      }
    }

    const updatedUser = await services.users.update(localUser.id, validatedData);

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
        honeybadger.notify(error as Error);
        console.error("Failed to sync username to Supabase:", error);
        // Don't fail the request if Supabase sync fails
      }
    }

    return new Response(JSON.stringify(updatedUser), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    honeybadger.notify(error as Error);
    console.error("Error updating user:", error);
    return new Response(JSON.stringify({ error: "Invalid request data" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
