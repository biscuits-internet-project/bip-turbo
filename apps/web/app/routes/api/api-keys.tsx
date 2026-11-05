import { ApiKeyLimitError } from "@bip/core";
import { createApiKeySchema } from "@bip/domain";
import { data } from "react-router";
import { protectedAction } from "~/lib/base-loaders";
import { services } from "~/server/services";

function jsonError(status: number, error: string) {
  return data({ error }, { status });
}

// POST { name } creates a key and returns its secret once; DELETE { id } revokes one.
// Managing keys takes a browser session: a key that could mint more keys would let one
// leaked key outlive its own revocation.
export const action = protectedAction(async ({ request, context }) => {
  if (context.currentUser.apiKey) return jsonError(403, "Manage API keys from your settings page");

  // Keys belong to the local users row, whose id can differ from the Supabase auth id
  // (accounts carried over from the old site), so resolve it by email like other routes.
  const owner = await services.users.findByEmail(context.currentUser.email);
  if (!owner) return jsonError(404, "User not found");

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;

  if (request.method === "POST") {
    const parsed = createApiKeySchema.safeParse(body);
    if (!parsed.success) return jsonError(400, parsed.error.issues[0]?.message ?? "Invalid name");
    try {
      return await services.apiKeys.create(owner.id, parsed.data.name);
    } catch (error) {
      if (error instanceof ApiKeyLimitError) return jsonError(400, error.message);
      throw error;
    }
  }

  if (request.method === "DELETE") {
    const id = typeof body?.id === "string" ? body.id : null;
    if (!id || !(await services.apiKeys.revoke(owner.id, id))) return jsonError(404, "Key not found");
    return { revoked: id };
  }

  return jsonError(405, "Method not allowed");
});
