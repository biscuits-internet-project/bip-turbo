import { env } from "~/server/env";

/** The MCP endpoint is the one resource these tokens are for. */
export function mcpResourceUrl(): string {
  return new URL("/mcp", env.BASE_URL).toString();
}

/**
 * Where MCP clients find out how to get a token (RFC 9728). The path carries the
 * resource's own path, `/mcp`, as the spec's well-known URI construction requires.
 */
export function protectedResourceMetadataUrl(): string {
  return new URL("/.well-known/oauth-protected-resource/mcp", env.BASE_URL).toString();
}

/**
 * Points clients at Supabase Auth, which runs the OAuth 2.1 server: dynamic client
 * registration, the authorize and token endpoints, and the signing keys. Its own
 * metadata lives at `<issuer>/.well-known/...`, which clients discover from here.
 */
export function protectedResourceMetadata() {
  return {
    resource: mcpResourceUrl(),
    authorization_servers: [new URL("/auth/v1", env.SUPABASE_URL).toString()],
    bearer_methods_supported: ["header"],
    scopes_supported: ["openid", "email", "profile"],
    resource_name: "Disco Biscuits setlist database",
    resource_documentation: new URL("/mcp-info", env.BASE_URL).toString(),
  };
}
