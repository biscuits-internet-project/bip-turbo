/**
 * Default per-minute limits for a signed-in MCP app or an API key. Kept apart from
 * server/rate-limit.ts so pages that quote them don't pull server code into the
 * browser bundle.
 */
export const RATE_LIMIT_DEFAULTS = { mcp: 60, api: 300 } as const;
