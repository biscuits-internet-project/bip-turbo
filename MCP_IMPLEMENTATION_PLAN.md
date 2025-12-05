# MCP Server Implementation Plan

## Overview
Create an MCP server for the BIP setlist database using **HTTP/SSE transport** for remote access. The MCP server is implemented as API endpoints in the existing React Router web app.

## Architecture Decision

**Remote MCP Server via HTTP endpoints** - MCP tools are exposed as POST endpoints at `/mcp/*` in the web app:
1. Users with Claude Pro/Team/Enterprise can add the remote MCP server
2. Endpoints use existing `@bip/core` repositories and services
3. No separate server process needed
4. Simple HTTP POST requests with JSON responses

## Project Structure

```
apps/web/app/
├── routes/mcp/               # MCP endpoint handlers
│   ├── search-shows.tsx
│   ├── search-songs.tsx
│   ├── search-venues.tsx
│   ├── search-segues.tsx
│   ├── search-by-date.tsx
│   ├── get-shows.tsx
│   ├── get-songs.tsx
│   ├── get-venues.tsx
│   ├── get-setlists.tsx
│   ├── get-song-performances.tsx
│   ├── get-trending-songs.tsx
│   ├── get-song-statistics.tsx
│   ├── get-venue-history.tsx
│   └── get-shows-by-year.tsx
└── lib/
    └── mcp-utils.ts          # Shared utilities for MCP responses
```

## MCP Tools (14 tools)

### Core Entity Retrieval (Bulk Operations)

**1. `get_shows`** - Get multiple shows by IDs or slugs
```typescript
Input: { ids?: string[], slugs?: string[] }
Output: {
  shows: Array<{
    id, slug, date, venueId, venueName, venueSlug, venueCity, venueState,
    bandId, notes, relistenUrl, averageRating, ratingsCount, likesCount,
    reviewsCount, showPhotosCount, showYoutubesCount
  }>
}
```

**2. `get_songs`** - Get multiple songs by IDs or slugs
```typescript
Input: { ids?: string[], slugs?: string[] }
Output: {
  songs: Array<{
    id, slug, title, lyrics, tabs, notes, history, featuredLyric,
    cover, authorName, guitarTabsUrl, timesPlayed,
    dateFirstPlayed, dateLastPlayed, mostCommonYear, leastCommonYear
  }>
}
```

**3. `get_venues`** - Get multiple venues by IDs or slugs
```typescript
Input: { ids?: string[], slugs?: string[] }
Output: {
  venues: Array<{
    id, slug, name, city, state, country, street, postalCode,
    latitude, longitude, phone, website, timesPlayed
  }>
}
```

**4. `get_setlists`** - Get complete setlists for multiple shows
```typescript
Input: { showIds?: string[], showSlugs?: string[] }
Output: {
  setlists: Array<{
    showId, showSlug, showDate,
    venue: { name, city, state, slug },
    sets: Array<{
      label: "S1" | "S2" | "E1" | "E2" | etc,
      tracks: Array<{
        position, songId, songTitle, songSlug,
        segue, note, allTimer,
        annotations: Array<{ desc }>
      }>
    }>
  }>
}
```

**5. `get_song_performances`** - Get all performances of a song
```typescript
Input: {
  songSlug: string,
  limit?: number,        // Default: 50
  sortBy?: 'date' | 'rating'
}
Output: {
  song: { id, slug, title },
  performances: Array<{
    trackId, showId, showSlug, showDate,
    venueSlug, venueName, venueCity, set, position,
    averageRating, ratingsCount, allTimer, note,
    annotations: Array<{ desc }>
  }>
}
```

### Search Tools

**6. `search_shows`** - Primary search interface
```typescript
Input: {
  query: string,         // Song, venue, date, or combinations
  limit?: number         // Default: 50
}
Output: {
  results: Array<{
    id, slug, date, venueName, venueCity, venueState, score
  }>
}
```

**7. `search_songs`** - Search song catalog
```typescript
Input: { query: string, limit?: number }  // Default: 50
Output: {
  results: Array<{
    id, slug, title, authorName, timesPlayed, cover
  }>
}
```

**8. `search_venues`** - Search venues
```typescript
Input: { query: string, limit?: number }  // Default: 50
Output: {
  results: Array<{
    id, slug, name, city, state, country, timesPlayed
  }>
}
```

**9. `search_segues`** - Find segue sequences
```typescript
Input: {
  sequence: string,      // e.g., "Shimmy > Basis > Woody"
  venueFilter?: string   // Optional venue name/city filter
}
Output: {
  results: Array<{
    showId, showSlug, showDate, venueName, set, matchedSequence
  }>
}
```

**10. `search_by_date`** - Find shows by date
```typescript
Input: {
  date: string,          // "12/30/99", "December", "1999"
  dateType: 'exact' | 'month' | 'year'
}
Output: {
  results: Array<{
    id, slug, date, venueName, venueCity
  }>
}
```

### Analytics & Statistics

**11. `get_trending_songs`** - Recently popular songs
```typescript
Input: {
  lastXShows?: number,   // Default: 50
  limit?: number         // Default: 50
}
Output: {
  songs: Array<{
    id, slug, title, playCount, lastPlayed
  }>
}
```

**12. `get_song_statistics`** - Detailed song analytics
```typescript
Input: { songSlug: string }
Output: {
  song: { id, slug, title },
  statistics: {
    timesPlayed, dateFirstPlayed, dateLastPlayed,
    yearlyPlayData, longestGapsData,
    mostCommonYear, leastCommonYear
  }
}
```

**13. `get_venue_history`** - Shows at a venue
```typescript
Input: {
  venueSlug: string,
  limit?: number,        // Default: 50
  sortBy?: 'date' | 'rating'
}
Output: {
  venue: { id, slug, name, city, state },
  shows: Array<{
    id, slug, date, averageRating, ratingsCount
  }>
}
```

**14. `get_shows_by_year`** - List shows from a year
```typescript
Input: {
  year: number,
  sortBy?: 'date' | 'rating',
  limit?: number         // Default: 50
}
Output: {
  year: number,
  shows: Array<{
    id, slug, date, venueName, venueCity, averageRating
  }>
}
```

## Implementation Steps

### Phase 1: Setup MCP Server Package

1. Create `apps/mcp-server/` directory structure
2. Initialize `package.json` with dependencies:
   - `@modelcontextprotocol/sdk` - MCP protocol implementation
   - `@bip/core` - Database access
   - `@bip/domain` - Domain models
   - `zod` - Validation
3. Configure `tsconfig.json` for TypeScript
4. Setup build process with Bun

### Phase 2: Implement Core Infrastructure

1. **Service Container Setup** (`src/utils/container.ts`)
   - Initialize Prisma client
   - Create all repositories
   - Setup logging

2. **Validation Schemas** (`src/utils/validation.ts`)
   - Zod schemas for each tool's input parameters
   - Reusable validation functions

3. **Error Handling** (`src/utils/error-handler.ts`)
   - Standardized error responses
   - Logging for debugging
   - MCP-compliant error format

4. **Response Formatters** (`src/formatters/`)
   - Convert DB models to MCP response format
   - Handle null values, date formatting
   - Minimize response size

### Phase 3: Implement Tool Handlers

Create handler for each tool:

1. **Search Handlers** (`src/handlers/search-*.ts`)
   - `search-shows.ts` - Uses `PostgresSearchService`
   - `search-songs.ts` - Song catalog search
   - `search-venues.ts` - Venue search
   - `search-segues.ts` - Segue sequence search
   - `search-by-date.ts` - Date-based show search

2. **Entity Handlers** (`src/handlers/get-*.ts`)
   - `get-shows.ts` - Bulk show retrieval
   - `get-songs.ts` - Bulk song retrieval
   - `get-venues.ts` - Bulk venue retrieval
   - `get-setlists.ts` - Bulk setlist retrieval
   - `get-song-performances.ts` - Song performance history

3. **Analytics Handlers** (`src/handlers/analytics-*.ts`)
   - `get-trending-songs.ts` - Trending analysis
   - `get-song-statistics.ts` - Song statistics
   - `get-venue-history.ts` - Venue show history
   - `get-shows-by-year.ts` - Year-based listing

### Phase 4: MCP Server Setup

1. **Tool Definitions** (`src/tools/`)
   - Define JSON schemas for each tool
   - Register tools with MCP server
   - Map tool names to handlers

2. **Server Entry Point** (`src/index.ts`)
   - Initialize MCP server with stdio transport
   - Register all tools
   - Setup error handling
   - Start listening on stdin/stdout

3. **Example Implementation**:
```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { initializeContainer } from "./utils/container.js";
import { toolRegistry } from "./tools/index.js";

const server = new Server({
  name: "bip-setlist-server",
  version: "1.0.0"
}, {
  capabilities: {
    tools: {}
  }
});

// Initialize container
const container = await initializeContainer();

// Register tools
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const handler = toolRegistry[name];

  if (!handler) {
    throw new Error(`Unknown tool: ${name}`);
  }

  return await handler(args, container);
});

// Start server with stdio transport
const transport = new StdioServerTransport();
await server.connect(transport);
```

### Phase 5: Development & Testing

1. **Add Makefile Commands**
```makefile
mcp-server:
	cd apps/mcp-server && bun run start

mcp-dev:
	cd apps/mcp-server && bun run dev
```

2. **Testing Tools**
   - Use MCP Inspector for testing
   - Create test script with sample queries
   - Validate responses match schemas

3. **Documentation**
   - README with setup instructions
   - Tool usage examples
   - Claude Desktop configuration guide

### Phase 6: Claude Desktop Integration

1. **Configuration File**
   Users add to Claude Desktop config:
```json
{
  "mcpServers": {
    "bip-setlist": {
      "command": "bun",
      "args": ["run", "/path/to/bip-turbo/apps/mcp-server/src/index.ts"],
      "env": {
        "DATABASE_URL": "postgresql://..."
      }
    }
  }
}
```

2. **Environment Setup**
   - Document required environment variables
   - Provide example .env file
   - Setup Doppler integration if needed

## Key Design Decisions

### 1. Bulk Operations First
- All entity getters support arrays (get_shows, get_songs, etc.)
- Reduces round trips for LLMs
- More efficient than individual requests

### 2. Defaults: 50 for Everything
- Search results: 50
- Performance lists: 50
- Venue history: 50
- Provides substantial data without overwhelming

### 3. Flexible Identifiers
- Accept both `ids` and `slugs` arrays
- Return both in responses
- Slugs are human-readable for LLMs

### 4. Error Handling Strategy
```typescript
// Success
{ shows: [...] }

// Partial success (some IDs not found)
{
  shows: [...],
  errors: [{ id: "xyz", error: "Not found" }]
}

// Complete failure
{ error: "Invalid request", details: "..." }
```

### 5. No Authentication (For Now)
- Public read-only access
- Direct database connection
- Can add auth layer later if needed

### 6. No Rate Limiting (For Now)
- Trust Claude Desktop usage patterns
- Can add later if needed
- Monitor for abuse

## Expected Capabilities

Once implemented, LLMs using this MCP server will be able to:

- **Search queries:**
  - "Find shows at the Fillmore in 1999 with the song Swell"
  - "Search for venues in Colorado"
  - "Find all performances of 'Shimmy > Basis' segues"

- **Data retrieval:**
  - "Show me the setlist for 12/30/99"
  - "Get details about the songs 'Basis', 'Swell', and 'Aceetobee'"
  - "What are the lyrics to 'The Devil's Waltz'?"

- **Analytics:**
  - "What songs have been trending in the last 50 shows?"
  - "Show me venue statistics for Red Rocks"
  - "List all shows from 2001 sorted by rating"

- **Complex queries:**
  - "Find the highest rated performances of 'Swell'"
  - "When was the last time they played at the Fillmore?"
  - "What songs were most common in 1999?"

## Dependencies

```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "latest",
    "@bip/core": "workspace:*",
    "@bip/domain": "workspace:*",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/node": "^20.x",
    "typescript": "^5.x"
  }
}
```

## Timeline Estimate

- **Phase 1-2 (Infrastructure):** 2-3 hours
- **Phase 3 (Handlers):** 4-6 hours
- **Phase 4 (MCP Setup):** 2-3 hours
- **Phase 5 (Testing):** 2-3 hours
- **Phase 6 (Integration):** 1 hour

**Total:** ~12-16 hours of development time

## Success Criteria

1. ✅ All 14 tools implemented and working
2. ✅ Successfully connects to Claude Desktop via stdio
3. ✅ Handles bulk operations efficiently
4. ✅ Returns properly formatted responses
5. ✅ Error handling works correctly
6. ✅ Documentation complete with examples
7. ✅ Can answer complex queries about setlists, songs, venues
