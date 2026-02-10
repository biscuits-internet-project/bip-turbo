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
  // Search tools
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
    name: "search_segues",
    description: "Search for song transitions/segues (e.g., 'Basis > Helicopters')",
    inputSchema: {
      type: "object",
      properties: {
        sequence: { type: "string", description: "Song sequence to search for (use > between songs)" },
        venueFilter: { type: "string", description: "Optional venue name to filter results" },
      },
      required: ["sequence"],
    },
  },
  {
    name: "search_by_date",
    description: "Search for shows by date",
    inputSchema: {
      type: "object",
      properties: {
        date: { type: "string", description: "Date to search (e.g., '1999-12-31', '1999-12', '1999')" },
        dateType: { type: "string", enum: ["exact", "month", "year"], description: "Type of date search" },
      },
      required: ["date", "dateType"],
    },
  },
  // Single item getters
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
  {
    name: "get_song_statistics",
    description: "Get detailed statistics for a song including yearly play counts and gaps",
    inputSchema: {
      type: "object",
      properties: {
        songSlug: { type: "string", description: "Song slug" },
      },
      required: ["songSlug"],
    },
  },
  {
    name: "get_song_performances",
    description: "Get all performances of a specific song with venue and rating info",
    inputSchema: {
      type: "object",
      properties: {
        songSlug: { type: "string", description: "Song slug" },
        limit: { type: "number", description: "Max results (default 50, max 500)" },
        sortBy: { type: "string", enum: ["date", "rating"], description: "Sort by date or rating (default: date)" },
      },
      required: ["songSlug"],
    },
  },
  {
    name: "get_venue_history",
    description: "Get show history at a specific venue",
    inputSchema: {
      type: "object",
      properties: {
        venueSlug: { type: "string", description: "Venue slug" },
        limit: { type: "number", description: "Max results (default 50, max 500)" },
        sortBy: { type: "string", enum: ["date", "rating"], description: "Sort by date or rating (default: date)" },
      },
      required: ["venueSlug"],
    },
  },
  {
    name: "get_shows_by_year",
    description: "Get all shows from a specific year",
    inputSchema: {
      type: "object",
      properties: {
        year: { type: "number", description: "Year (e.g., 1999, 2023)" },
        limit: { type: "number", description: "Max results (default 50, max 500)" },
        sortBy: { type: "string", enum: ["date", "rating"], description: "Sort by date or rating (default: date)" },
      },
      required: ["year"],
    },
  },
  {
    name: "get_trending_songs",
    description: "Get songs that are trending (most played in recent shows)",
    inputSchema: {
      type: "object",
      properties: {
        lastXShows: { type: "number", description: "Number of recent shows to analyze (default 50, max 200)" },
        limit: { type: "number", description: "Max songs to return (default 50, max 100)" },
      },
      required: [],
    },
  },
  // Batch getters
  {
    name: "get_setlists",
    description: "Get setlists for multiple shows at once",
    inputSchema: {
      type: "object",
      properties: {
        showSlugs: { type: "array", items: { type: "string" }, description: "Array of show slugs (YYYY-MM-DD format)" },
      },
      required: ["showSlugs"],
    },
  },
  {
    name: "get_shows",
    description: "Get detailed info for multiple shows at once",
    inputSchema: {
      type: "object",
      properties: {
        slugs: { type: "array", items: { type: "string" }, description: "Array of show slugs" },
      },
      required: ["slugs"],
    },
  },
  {
    name: "get_songs",
    description: "Get detailed info for multiple songs at once",
    inputSchema: {
      type: "object",
      properties: {
        slugs: { type: "array", items: { type: "string" }, description: "Array of song slugs" },
      },
      required: ["slugs"],
    },
  },
  {
    name: "get_venues",
    description: "Get detailed info for multiple venues at once",
    inputSchema: {
      type: "object",
      properties: {
        slugs: { type: "array", items: { type: "string" }, description: "Array of venue slugs" },
      },
      required: ["slugs"],
    },
  },
];

async function handleToolCall(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    // Search tools
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

    case "search_segues": {
      const sequence = args.sequence as string;
      const venueFilter = args.venueFilter as string | undefined;
      const searchQuery = venueFilter ? `${venueFilter} ${sequence}` : sequence;
      const results = await services.postgresSearch.search(searchQuery, { limit: 50 });
      return {
        results: results.results.map((r) => ({
          showSlug: r.entitySlug,
          showDate: r.date || "",
          venueName: r.venueName || "",
          set: r.setInfo || "",
          matchedSequence: sequence,
        })),
      };
    }

    case "search_by_date": {
      const date = args.date as string;
      const results = await services.postgresSearch.search(date, { limit: 50 });
      const showResults = results.results.filter((r) => r.entityType === "show");
      return {
        results: showResults.map((r) => ({
          slug: r.entitySlug,
          date: r.date || "",
          venueName: r.venueName || "",
          venueCity: r.venueLocation || "",
        })),
      };
    }

    // Single item getters
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

    case "get_song_statistics": {
      const songSlug = args.songSlug as string;
      const song = await services.songs.findBySlug(songSlug);
      if (!song) {
        return { error: "Song not found" };
      }
      return {
        song: { slug: song.slug, title: song.title },
        statistics: {
          timesPlayed: song.timesPlayed,
          dateFirstPlayed: song.dateFirstPlayed,
          dateLastPlayed: song.dateLastPlayed,
          yearlyPlayData: song.yearlyPlayData || {},
          longestGapsData: song.longestGapsData || {},
          mostCommonYear: song.mostCommonYear,
          leastCommonYear: song.leastCommonYear,
        },
      };
    }

    case "get_song_performances": {
      const songSlug = args.songSlug as string;
      const limit = Math.min((args.limit as number) || 50, 500);
      const sortBy = (args.sortBy as string) || "date";

      const song = await services.songs.findBySlug(songSlug);
      if (!song) {
        return { error: "Song not found" };
      }

      const tracks = await services.tracks.findMany({
        filters: [{ field: "songId", operator: "eq", value: song.id }],
        sort:
          sortBy === "rating"
            ? [{ field: "averageRating", direction: "desc" }]
            : [{ field: "createdAt", direction: "desc" }],
        pagination: { page: 1, limit },
        includes: ["annotations"],
      });

      const showIds = [...new Set(tracks.map((t) => t.showId))];
      const showsData = await Promise.all(
        showIds.map(async (showId) => {
          const show = await services.shows.findById(showId);
          if (!show) return null;
          const venue = show.venueId ? await services.venues.findById(show.venueId) : null;
          return { showId, show, venue };
        }),
      );
      const showMap = new Map(
        showsData.filter((d): d is NonNullable<typeof d> => d !== null).map((d) => [d.showId, d]),
      );

      return {
        song: { slug: song.slug, title: song.title },
        performances: tracks.map((track) => {
          const showData = showMap.get(track.showId);
          return {
            showSlug: showData?.show.slug || "",
            showDate: showData?.show.date || "",
            venueName: showData?.venue?.name || "",
            venueCity: showData?.venue?.city || "",
            set: track.set,
            position: track.position,
            averageRating: track.averageRating,
            allTimer: track.allTimer || false,
          };
        }),
      };
    }

    case "get_venue_history": {
      const venueSlug = args.venueSlug as string;
      const limit = Math.min((args.limit as number) || 50, 500);
      const sortBy = (args.sortBy as string) || "date";

      const venue = await services.venues.findBySlug(venueSlug);
      if (!venue) {
        return { error: "Venue not found" };
      }

      const shows = await services.shows.findMany({
        filters: [{ field: "venueId", operator: "eq", value: venue.id }],
        sort:
          sortBy === "rating"
            ? [{ field: "averageRating", direction: "desc" }]
            : [{ field: "date", direction: "desc" }],
        pagination: { page: 1, limit },
      });

      return {
        venue: { slug: venue.slug, name: venue.name, city: venue.city, state: venue.state },
        shows: shows.map((show) => ({
          slug: show.slug,
          date: show.date,
          averageRating: show.averageRating,
          ratingsCount: show.ratingsCount,
        })),
      };
    }

    case "get_shows_by_year": {
      const year = args.year as number;
      const limit = Math.min((args.limit as number) || 50, 500);
      const sortBy = (args.sortBy as string) || "date";

      const shows = await services.shows.findMany({
        filters: [
          { field: "date", operator: "gte", value: `${year}-01-01` },
          { field: "date", operator: "lt", value: `${year + 1}-01-01` },
        ],
        sort:
          sortBy === "rating" ? [{ field: "averageRating", direction: "desc" }] : [{ field: "date", direction: "asc" }],
        pagination: { page: 1, limit },
        includes: ["venue"],
      });

      return {
        year,
        shows: shows.map((show) => ({
          slug: show.slug,
          date: show.date,
          venueName: show.venue?.name || "",
          venueCity: show.venue?.city || "",
          averageRating: show.averageRating,
        })),
      };
    }

    case "get_trending_songs": {
      const lastXShows = Math.min((args.lastXShows as number) || 50, 200);
      const limit = Math.min((args.limit as number) || 50, 100);

      const trendingSongs = await services.songs.findTrendingLastXShows(lastXShows, limit);

      return {
        songs: trendingSongs.map((song) => ({
          slug: song.slug,
          title: song.title,
          playCount: song.count,
          lastPlayed: song.dateLastPlayed,
        })),
      };
    }

    // Batch getters
    case "get_setlists": {
      const showSlugs = args.showSlugs as string[];
      const setlists = [];
      const errors = [];

      for (const slug of showSlugs) {
        try {
          const setlist = await services.setlists.findByShowSlug(slug);
          if (setlist) {
            setlists.push({
              showSlug: setlist.show.slug,
              showDate: setlist.show.date,
              venue: { name: setlist.venue.name, city: setlist.venue.city, state: setlist.venue.state },
              sets: setlist.sets.map((set) => ({
                label: set.label,
                tracks: set.tracks.map((t) => ({
                  position: t.position,
                  songTitle: t.song?.title || "",
                  songSlug: t.song?.slug || "",
                  segue: t.segue,
                })),
              })),
            });
          } else {
            errors.push({ slug, error: "Not found" });
          }
        } catch (e) {
          errors.push({ slug, error: e instanceof Error ? e.message : "Unknown error" });
        }
      }

      return { setlists, ...(errors.length > 0 && { errors }) };
    }

    case "get_shows": {
      const slugs = args.slugs as string[];
      const shows = [];
      const errors = [];

      for (const slug of slugs) {
        try {
          const show = await services.shows.findBySlug(slug);
          if (show) {
            const venue = show.venueId ? await services.venues.findById(show.venueId) : null;
            shows.push({
              slug: show.slug,
              date: show.date,
              venueName: venue?.name,
              venueCity: venue?.city,
              averageRating: show.averageRating,
              ratingsCount: show.ratingsCount,
              notes: show.notes,
              relistenUrl: show.relistenUrl,
            });
          } else {
            errors.push({ slug, error: "Not found" });
          }
        } catch (e) {
          errors.push({ slug, error: e instanceof Error ? e.message : "Unknown error" });
        }
      }

      return { shows, ...(errors.length > 0 && { errors }) };
    }

    case "get_songs": {
      const slugs = args.slugs as string[];
      const songs = [];
      const errors = [];

      for (const slug of slugs) {
        try {
          const song = await services.songs.findBySlug(slug);
          if (song) {
            songs.push({
              slug: song.slug,
              title: song.title,
              author: song.authorName,
              lyrics: song.lyrics,
              timesPlayed: song.timesPlayed,
              dateFirstPlayed: song.dateFirstPlayed,
              dateLastPlayed: song.dateLastPlayed,
            });
          } else {
            errors.push({ slug, error: "Not found" });
          }
        } catch (e) {
          errors.push({ slug, error: e instanceof Error ? e.message : "Unknown error" });
        }
      }

      return { songs, ...(errors.length > 0 && { errors }) };
    }

    case "get_venues": {
      const slugs = args.slugs as string[];
      const venues = [];
      const errors = [];

      for (const slug of slugs) {
        try {
          const venue = await services.venues.findBySlug(slug);
          if (venue) {
            venues.push({
              slug: venue.slug,
              name: venue.name,
              city: venue.city,
              state: venue.state,
              country: venue.country,
              timesPlayed: venue.timesPlayed,
            });
          } else {
            errors.push({ slug, error: "Not found" });
          }
        } catch (e) {
          errors.push({ slug, error: e instanceof Error ? e.message : "Unknown error" });
        }
      }

      return { venues, ...(errors.length > 0 && { errors }) };
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
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
    return new Response(JSON.stringify(jsonRpcError(0, -32700, "Parse error")), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const { jsonrpc, id, method, params } = body;

  if (jsonrpc !== "2.0") {
    return new Response(JSON.stringify(jsonRpcError(id, -32600, "Invalid Request")), {
      headers: { "Content-Type": "application/json" },
    });
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
      return new Response(JSON.stringify(jsonRpcError(id, -32601, "Method not found")), {
        headers: { "Content-Type": "application/json" },
      });
  }

  return new Response(JSON.stringify(jsonRpcSuccess(id, result)), {
    headers: { "Content-Type": "application/json" },
  });
}
