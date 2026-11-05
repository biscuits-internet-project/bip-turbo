import { env } from "~/server/env";

/**
 * `/mcp` is the server; `/mcp/signin` is the same server but always requires
 * sign-in. While anonymous MCP access is still allowed (MCP_ALLOW_ANONYMOUS),
 * `/mcp` never sends the 401 that makes an MCP app start signing in, so the
 * alias is how sign-in gets tested with a real app before anonymous access ends.
 */
export type McpResourcePath = "/mcp" | "/mcp/signin";

export function mcpResourcePath(pathname: string): McpResourcePath {
  return pathname.toLowerCase().replace(/\/+$/, "").endsWith("/mcp/signin") ? "/mcp/signin" : "/mcp";
}

/** True when a caller with no credential may use the server at this path. */
export function anonymousMcpAllowed(resourcePath: McpResourcePath): boolean {
  return env.MCP_ALLOW_ANONYMOUS === "true" && resourcePath === "/mcp";
}

/**
 * Where MCP clients find out how to get a token (RFC 9728). The path carries the
 * resource's own path, as the spec's well-known URI construction requires.
 */
export function protectedResourceMetadataUrl(resourcePath: McpResourcePath = "/mcp"): string {
  return new URL(`/.well-known/oauth-protected-resource${resourcePath}`, env.BASE_URL).toString();
}

/**
 * Points clients at Supabase Auth, which runs the OAuth 2.1 server: dynamic client
 * registration, the authorize and token endpoints, and the signing keys. Its own
 * metadata lives at `<issuer>/.well-known/...`, which clients discover from here.
 */
export function protectedResourceMetadata(resourcePath: McpResourcePath = "/mcp") {
  return {
    resource: new URL(resourcePath, env.BASE_URL).toString(),
    authorization_servers: [new URL("/auth/v1", env.SUPABASE_URL).toString()],
    bearer_methods_supported: ["header"],
    scopes_supported: ["openid", "email", "profile"],
    resource_name: "Disco Biscuits setlist database",
    resource_documentation: new URL("/mcp-info", env.BASE_URL).toString(),
  };
}
