import type { LoaderFunctionArgs } from "react-router";
import { env } from "~/server/env";

// OAuth 2.0 Protected Resource Metadata (RFC 9728)
// This endpoint tells MCP clients how to authenticate with this resource server
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  const metadata = {
    // This resource server
    resource: `${baseUrl}/mcp`,

    // Where to find the authorization server metadata
    authorization_servers: [env.SUPABASE_URL],

    // Scopes needed to access this resource
    scopes_supported: ["openid", "email"],

    // Bearer token method
    bearer_methods_supported: ["header"],
  };

  return new Response(JSON.stringify(metadata, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
