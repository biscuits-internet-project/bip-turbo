import type { LoaderFunctionArgs } from "react-router";
import { env } from "~/server/env";

// OAuth 2.0 Authorization Server Metadata (RFC 8414)
// This endpoint allows MCP clients to discover OAuth configuration
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const baseUrl = `https://${url.host}`;

  const metadata = {
    // Supabase is the authorization server, we just handle registration
    issuer: env.SUPABASE_URL,
    authorization_endpoint: `${env.SUPABASE_URL}/auth/v1/oauth/authorize`,
    token_endpoint: `${env.SUPABASE_URL}/auth/v1/oauth/token`,
    registration_endpoint: `${baseUrl}/oauth/register`,

    // Supported features
    response_types_supported: ["code"],
    grant_types_supported: ["authorization_code", "refresh_token"],
    code_challenge_methods_supported: ["S256"],

    // Scopes (must match Supabase supported scopes)
    scopes_supported: ["openid", "profile", "email", "phone"],

    // Token info
    token_endpoint_auth_methods_supported: ["none"], // Public clients use PKCE

    // MCP OAuth client (public client, uses PKCE)
    client_id: "d202b41b-9391-403d-a4d3-f3cdd68d7c8b",
  };

  return new Response(JSON.stringify(metadata, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
