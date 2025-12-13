import type { LoaderFunctionArgs } from "react-router";
import { env } from "~/server/env";

// OAuth 2.0 Authorization Server Metadata (RFC 8414)
// This endpoint allows MCP clients to discover OAuth configuration
export async function loader({ request }: LoaderFunctionArgs) {
  const metadata = {
    // Supabase is the authorization server
    issuer: env.SUPABASE_URL,
    authorization_endpoint: `${env.SUPABASE_URL}/oauth/v2.1/authorize`,
    token_endpoint: `${env.SUPABASE_URL}/oauth/v2.1/token`,

    // Supported features
    response_types_supported: ["code"],
    grant_types_supported: ["authorization_code", "refresh_token"],
    code_challenge_methods_supported: ["S256"],

    // Scopes
    scopes_supported: ["openid", "email", "profile", "offline_access"],

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
