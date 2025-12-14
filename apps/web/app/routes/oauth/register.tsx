import type { ActionFunctionArgs } from "react-router";
import { env } from "~/server/env";

// OAuth 2.0 Dynamic Client Registration (RFC 7591)
// Proxies to Supabase's registration endpoint with our service role key
export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    // Empty body is fine
  }

  // Forward registration to Supabase with service role key
  const supabaseResponse = await fetch(
    `${env.SUPABASE_URL}/auth/v1/oauth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": env.SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({
        redirect_uris: body.redirect_uris || [],
        grant_types: body.grant_types || ["authorization_code", "refresh_token"],
        response_types: body.response_types || ["code"],
        token_endpoint_auth_method: body.token_endpoint_auth_method || "none",
        client_name: body.client_name || "MCP Client",
      }),
    }
  );

  const data = await supabaseResponse.json();

  return new Response(JSON.stringify(data), {
    status: supabaseResponse.status,
    headers: { "Content-Type": "application/json" },
  });
}
