import type { LoaderFunctionArgs } from "react-router";

// OAuth 2.0 Protected Resource Metadata (RFC 9728)
// This endpoint tells MCP clients how to authenticate with this resource server
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  // Always use https in production (request may come through proxy as http)
  const baseUrl = `https://${url.host}`;

  const metadata = {
    // This resource server
    resource: `${baseUrl}/mcp`,

    // Where to find the authorization server metadata (points to our endpoint which has Supabase URLs)
    authorization_servers: [baseUrl],

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
