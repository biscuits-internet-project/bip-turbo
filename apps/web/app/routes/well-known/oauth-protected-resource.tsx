import { protectedResourceMetadata } from "~/server/oauth-protected-resource";

// Served at both the bare well-known path and the `/mcp`-suffixed one, since
// clients differ in which they request.
export function loader() {
  return new Response(JSON.stringify(protectedResourceMetadata()), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
