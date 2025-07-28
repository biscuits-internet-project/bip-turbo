import type { ActionFunctionArgs } from "react-router-dom";
import { z } from "zod";
import { services } from "~/server/services";
import { getServerClient } from "~/server/supabase";

const updateUserSchema = z.object({
  username: z.string().min(3).max(50).optional(),
  avatarUrl: z.string().url().nullable().optional(),
});

export async function action({ request }: ActionFunctionArgs) {
  try {
    // Get current session user
    const { supabase } = getServerClient(request);
    const { data: { user } } = await supabase.auth.getUser();
    
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
      if (typeof value === 'string') {
        data[key] = value;
      } else {
        data[key] = null;
      }
    }
    
    // Handle null values for avatarUrl
    if (data.avatarUrl === "null" || data.avatarUrl === "") {
      data.avatarUrl = null;
    }

    const validatedData = updateUserSchema.parse(data);

    const updatedUser = await services.users.update(user.id, validatedData);

    if (!updatedUser) {
      return new Response(JSON.stringify({ error: "Failed to update user" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(updatedUser), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return new Response(JSON.stringify({ error: "Invalid request data" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}