import type { LoaderFunctionArgs } from "react-router";
import { mcpResourcePath, protectedResourceMetadata } from "~/server/oauth-protected-resource";

// Served at the bare well-known path and at each resource's suffixed one
// (`/mcp`, `/mcp/signin`), since clients differ in which they request.
export function loader({ request }: LoaderFunctionArgs) {
  const resourcePath = mcpResourcePath(new URL(request.url).pathname);
  return new Response(JSON.stringify(protectedResourceMetadata(resourcePath)), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
