import type { ActionFunctionArgs } from "react-router";

// OAuth 2.0 Dynamic Client Registration (RFC 7591)
// Returns our pre-registered public client since all MCP clients can share it
// (public clients with PKCE don't need unique client_ids for security)
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

  // Return our pre-registered public client
  const response = {
    client_id: "d202b41b-9391-403d-a4d3-f3cdd68d7c8b",
    client_id_issued_at: Math.floor(Date.now() / 1000),
    token_endpoint_auth_method: "none",
    grant_types: ["authorization_code", "refresh_token"],
    response_types: ["code"],
    redirect_uris: body.redirect_uris || [],
  };

  return new Response(JSON.stringify(response), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
