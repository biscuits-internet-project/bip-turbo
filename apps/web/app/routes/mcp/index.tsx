import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { getServerClient } from "~/server/supabase";
import { services } from "~/server/services";

// MCP JSON-RPC Protocol Handler
// Implements Model Context Protocol for Claude Code and other MCP clients

interface JsonRpcRequest {
  jsonrpc: "2.0";
  id: string | number;
  method: string;
  params?: Record<string, unknown>;
}

interface JsonRpcResponse {
  jsonrpc: "2.0";
  id: string | number;
  result?: unknown;
  error?: { code: number; message: string; data?: unknown };
}

// Tool definitions for MCP
const tools = [
  {
    name: "search_shows",
    description: "Search for Disco Biscuits shows by song, venue, date, or any combination",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search query (e.g., 'fillmore swell', '12/30/99', 'red rocks 2022')" },
        limit: { type: "number", description: "Max results to return (default 50, max 100)" },
      },
      required: ["query"],
    },
  },
  {
    name: "search_songs",
    description: "Search the Disco Biscuits song catalog by title",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Song title to search for" },
        limit: { type: "number", description: "Max results (default 50)" },
      },
      required: ["query"],
    },
  },
  {
    name: "search_venues",
    description: "Search for venues by name, city, state, or country",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Venue search query" },
        limit: { type: "number", description: "Max results (default 50)" },
      },
      required: ["query"],
    },
  },
  {
    name: "get_setlist",
    description: "Get the full setlist for a specific show by slug (e.g., '1999-12-31')",
    inputSchema: {
      type: "object",
      properties: {
        slug: { type: "string", description: "Show slug in YYYY-MM-DD format" },
      },
      required: ["slug"],
    },
  },
  {
    name: "get_song",
    description: "Get detailed information about a song including lyrics and play history",
    inputSchema: {
      type: "object",
      properties: {
        slug: { type: "string", description: "Song slug (URL-friendly name)" },
      },
      required: ["slug"],
    },
  },
];

async function handleToolCall(
  name: string,
  args: Record<string, unknown>,
): Promise<unknown> {
  switch (name) {
    case "search_shows": {
      const query = args.query as string;
      const limit = (args.limit as number) || 50;
      const results = await services.postgresSearch.search(query, { limit });
      const showResults = results.results.filter((r) => r.entityType === "show");
      return {
        results: showResults.map((r) => ({
          slug: r.entitySlug,
          date: r.date || "",
          venue: r.venueName || "",
          location: r.venueLocation || "",
        })),
      };
    }

    case "search_songs": {
      const query = args.query as string;
      const limit = (args.limit as number) || 50;
      const songs = await services.postgresSearch.searchSongs(query, limit);
      return {
        results: songs.map((s) => ({
          slug: s.slug,
          title: s.title,
          author: s.authorName,
        })),
      };
    }

    case "search_venues": {
      const query = args.query as string;
      const limit = (args.limit as number) || 50;
      const venues = await services.postgresSearch.searchVenues(query, limit);
      return {
        results: venues.map((v) => ({
          slug: v.slug,
          name: v.name,
          city: v.city,
          state: v.state,
        })),
      };
    }

    case "get_setlist": {
      const slug = args.slug as string;
      const setlist = await services.setlists.findByShowSlug(slug);
      if (!setlist) {
        return { error: "Show not found" };
      }
      return {
        date: setlist.show.date,
        venue: setlist.venue.name,
        location: `${setlist.venue.city}, ${setlist.venue.state || ""}`.trim(),
        sets: setlist.sets.map((set) => ({
          name: set.label,
          tracks: set.tracks.map((t) => ({
            position: t.position,
            song: t.song?.title || "",
            segue: t.segue,
            notes: t.note,
          })),
        })),
      };
    }

    case "get_song": {
      const slug = args.slug as string;
      const song = await services.songs.findBySlug(slug);
      if (!song) {
        return { error: "Song not found" };
      }
      return {
        title: song.title,
        author: song.authorName,
        lyrics: song.lyrics,
        notes: song.notes,
        timesPlayed: song.timesPlayed,
        debut: song.dateFirstPlayed,
        lastPlayed: song.dateLastPlayed,
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

function jsonRpcError(id: string | number, code: number, message: string): JsonRpcResponse {
  return { jsonrpc: "2.0", id, error: { code, message } };
}

function jsonRpcSuccess(id: string | number, result: unknown): JsonRpcResponse {
  return { jsonrpc: "2.0", id, result };
}

export async function loader({ request }: LoaderFunctionArgs) {
  // Return 401 for unauthenticated GET requests to trigger OAuth
  const { supabase } = getServerClient(request);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
        "WWW-Authenticate": 'Bearer realm="discobiscuits.net"',
      },
    });
  }

  // For authenticated GET, return server info
  return new Response(
    JSON.stringify({
      name: "discobiscuits",
      version: "1.0.0",
      description: "Disco Biscuits setlist database MCP server",
    }),
    { headers: { "Content-Type": "application/json" } },
  );
}

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Check authentication
  const { supabase } = getServerClient(request);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
        "WWW-Authenticate": 'Bearer realm="discobiscuits.net"',
      },
    });
  }

  let body: JsonRpcRequest;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify(jsonRpcError(0, -32700, "Parse error")),
      { headers: { "Content-Type": "application/json" } },
    );
  }

  const { jsonrpc, id, method, params } = body;

  if (jsonrpc !== "2.0") {
    return new Response(
      JSON.stringify(jsonRpcError(id, -32600, "Invalid Request")),
      { headers: { "Content-Type": "application/json" } },
    );
  }

  let result: unknown;

  switch (method) {
    case "initialize":
      result = {
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: {
          name: "discobiscuits",
          version: "1.0.0",
        },
      };
      break;

    case "tools/list":
      result = { tools };
      break;

    case "tools/call": {
      const toolName = (params as { name: string })?.name;
      const toolArgs = (params as { arguments?: Record<string, unknown> })?.arguments || {};
      try {
        const toolResult = await handleToolCall(toolName, toolArgs);
        result = {
          content: [{ type: "text", text: JSON.stringify(toolResult, null, 2) }],
        };
      } catch (error) {
        result = {
          content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : "Unknown error"}` }],
          isError: true,
        };
      }
      break;
    }

    default:
      return new Response(
        JSON.stringify(jsonRpcError(id, -32601, "Method not found")),
        { headers: { "Content-Type": "application/json" } },
      );
  }

  return new Response(JSON.stringify(jsonRpcSuccess(id, result)), {
    headers: { "Content-Type": "application/json" },
  });
}
