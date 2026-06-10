# BIP MCP Server - User Guide

The BIP setlist database is available as a Model Context Protocol (MCP) server. This lets LLMs like Claude directly query our comprehensive database of show information, setlists, songs, and venues.

## What is MCP?

Model Context Protocol (MCP) is an open standard that allows AI assistants to securely access external data sources. With MCP, Claude can answer questions about the Disco Biscuits' performance history, setlists, song lyrics, and more.

## Requirements

- Claude Pro, Team, Max, or Enterprise subscription (for remote MCP servers), or
- Claude Code, Cursor, or any other MCP-capable client

The server is public and read-only — no account, API key, or authentication is required.

## Setup

The server endpoint is `https://discobiscuits.net/mcp` (HTTP transport).

### Claude Code (CLI)

```bash
claude mcp add discobiscuits --transport http https://discobiscuits.net/mcp
```

### Claude Desktop

Add the server to your config file:

- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "discobiscuits": {
      "type": "http",
      "url": "https://discobiscuits.net/mcp"
    }
  }
}
```

Restart Claude Desktop to enable the server.

### Cursor

Add the same block to `.cursor/mcp.json`, or use **Settings → Features → MCP Servers → Add Server** with type `HTTP` and URL `https://discobiscuits.net/mcp`.

## Available Tools

The server exposes 23 tools: 17 for querying the database (below) and 6 internal Sync / Replication tools (documented at the end of this section) used to mirror prod into local dev environments.

### 🔍 Search Tools

#### `search_shows`

Search for shows by song, venue, date, or any combination.

**Input:** `query` (required), `limit` (default 50, max 100)

**Returns:** `results`, each `{ slug, date, venue, location }`.

**Example queries:** "fillmore swell", "12/30/99", "red rocks 2022"

#### `search_songs`

Search the song catalog by title.

**Input:** `query` (required), `limit` (default 50)

**Returns:** `results`, each `{ slug, title, author }`.

#### `search_venues`

Find venues by name, city, state, or country.

**Input:** `query` (required), `limit` (default 50)

**Returns:** `results`, each `{ slug, name, city, state }`.

#### `search_segues`

Find specific song sequences using `>` notation.

**Input:** `sequence` (required, e.g. "Shimmy > Basis > Woody"), `venueFilter` (optional)

**Returns:** `results`, each `{ showSlug, showDate, venueName, set, matchedSequence }`.

#### `search_by_date`

Find shows by exact date, month, or year.

**Input:** `date` (required, e.g. "1999-12-31", "1999-12", "1999"), `dateType` (required: `exact` | `month` | `year`)

**Returns:** `results`, each `{ slug, date, venueName, venueCity }`.

### 📊 Data Retrieval Tools

#### `get_setlist`

Get a single show's setlist in a compact, human-readable shape.

**Input:** `slug` (required, e.g. "1999-12-31")

**Returns:** `{ date, venue, location, sets }` — each set `{ name, tracks }`, each track `{ position, song, segue, notes }`. For the full structured payload (ids, performer lineup, flags, completions), use `get_setlists`.

#### `get_setlists`

Get complete setlists for multiple shows at once, with the full structured payload.

**Input:** `showSlugs` (required, array of show slugs)

**Returns:** `setlists`, each with `showSlug`, `showDate`, `venue`, and `sets`. Per track: `id`, `position`, `songTitle`, `songSlug`, `segue`, `note`, `allTimer`, `duration`, `durationSource`, `annotations`, plus the structured performer data the local sync mirrors:

- `lineup` (per show): the whole-show performer lineup — each member `{ musicianSlug, musicianName, knownFrom, defaultInstrument, instruments }`, with musicians and instruments carried by slug (the stable cross-environment id) plus name.
- `trackMusicians` (per track): sit-in / sat-out deltas `{ musicianSlug, musicianName, present, defaultInstrument, instruments }` (`present: true` = sit-in, `false` = sat-out).
- `flags` (per track): structured flag enum names (e.g. `DYSLEXIC`, `INVERTED`, `UNFINISHED`, `ENDING_ONLY`). Derived recurrence columns are excluded — the consumer recomputes them.
- `completes` (per track): completion links where this is the later (completing) track, each pointing at the earlier track by natural key `{ showSlug, set, position }`.

Unknown slugs come back in an `errors` array.

#### `get_song`

Get a single song's lyrics and headline play info.

**Input:** `slug` (required)

**Returns:** `{ title, author, lyrics, notes, timesPlayed, debut, lastPlayed }`. Use `get_songs` for the full curated field set.

#### `get_songs`

Get detailed information for multiple songs at once.

**Input:** `slugs` (required, array of song slugs)

**Returns:** `songs`, each with `slug`, `title`, `author`, `lyrics`, `timesPlayed`, `dateFirstPlayed`, `dateLastPlayed`, plus the curated admin fields `kind` (original / cover / mashup / improvisation), `legacyAuthor`, `featuredLyric`, `tabs`, `notes`, `history`, and `guitarTabsUrl`. Unknown slugs come back in an `errors` array.

#### `get_shows`

Get detailed information for multiple shows at once.

**Input:** `slugs` (required, array of show slugs, e.g. ["1999-12-30", "2000-01-01"])

**Returns:** `shows`, each with `id`, `slug`, `date`, `venueName`, `venueCity`, `averageRating`, `ratingsCount`, `notes`, `relistenUrl`, the admin-curated stat flags `countForStats` and `dayOrder`, and `rockOperaSlugs` (full-album performances tagged on the show). Unknown slugs come back in an `errors` array.

#### `get_venues`

Get venue details including location and contact info.

**Input:** `slugs` (required, array of venue slugs)

**Returns:** `venues`, each with `slug`, `name`, `city`, `state`, `country`, `timesPlayed`, and the geocode/contact columns `street`, `postalCode`, `phone`, `website`, `latitude`, `longitude`. Unknown slugs come back in an `errors` array.

#### `get_rock_operas`

List the rock operas / full-album performances the catalog tracks.

**Input:** None

**Returns:** `rockOperas`, each `{ slug, name, shortName }`. The slugs match `rockOperaSlugs` from `get_shows`.

#### `get_song_performances`

Get all performances of a specific song across all shows.

**Input:** `songSlug` (required), `limit` (default 50, max 500), `sortBy` (`date` | `rating`, default `date`)

**Returns:** `{ song, performances }` — each performance `{ showSlug, showDate, venueName, venueCity, set, position, averageRating, allTimer }`.

### 📈 Analytics Tools

#### `get_trending_songs`

See which songs have been played most frequently in recent shows.

**Input:** `lastXShows` (default 50, max 200), `limit` (default 50, max 100)

**Returns:** `songs`, each `{ slug, title, playCount, lastPlayed }`.

#### `get_song_statistics`

Get detailed analytics for a song.

**Input:** `songSlug` (required)

**Returns:** `{ song, statistics }` — statistics include `timesPlayed`, `dateFirstPlayed`, `dateLastPlayed`, `yearlyPlayData`, `longestGapsData`, `mostCommonYear`, `leastCommonYear`.

#### `get_venue_history`

Get all shows performed at a specific venue.

**Input:** `venueSlug` (required), `limit` (default 50, max 500), `sortBy` (`date` | `rating`, default `date`)

**Returns:** `{ venue, shows }` — each show `{ slug, date, averageRating, ratingsCount }`.

#### `get_shows_by_year`

List all shows from a specific year.

**Input:** `year` (required), `limit` (default 50, max 500), `sortBy` (`date` | `rating`, default `date`)

**Returns:** `{ year, shows }` — each show `{ slug, date, venueName, venueCity, averageRating }`.

### 🔄 Sync / Replication Tools (internal)

These tools mirror prod's user-activity tables into local dev databases (see `packages/core/scripts/sync-missing-shows.ts`); they are not meant for general LLM querying. They expose a PII-free projection only — the service-layer `select` allowlist enforces the shape.

#### `list_users_since`, `list_ratings_since`, `list_attendances_since`

Cursor-paginated pulls of rows changed since a timestamp.

**Input:** `since` (required, ISO-8601 timestamp), `cursor` (optional, opaque base64 of `updatedAt|id`), `limit` (default 2000, max 5000)

**Returns:** A `users` / `ratings` / `attendances` array plus `nextCursor` (null when the page isn't full). Users carry no email or password — only the fields needed to attach activity (`id`, `username`, avatar references, timestamps). Ratings carry `id`, `userId`, `value`, `rateableType`, `rateableId`, timestamps; attendances carry `id`, `userId`, `showId`, timestamps.

#### `list_all_user_ids`, `list_all_rating_ids`, `list_all_attendance_ids`

Full id dumps used by the sync's `--full-users` / prune reconcile to delete local rows no longer present on prod.

**Input:** None

**Returns:** `{ ids: string[] }`

## Example Queries

Once configured, you can ask Claude questions like:

### Show Information

- "Show me the setlist from the 12/30/99 show"
- "Find all shows at the Fillmore in 1999 where they played Swell"
- "What were the highest rated shows in 2022?"

### Song Information

- "What are the lyrics to 'Basis'?"
- "When was the last time they played 'Aceetobee'?"
- "Show me all performances of 'Swell' sorted by rating"
- "What songs have been trending in the last 50 shows?"

### Venue Information

- "What venues in Colorado have they played?"
- "Show me all shows at Red Rocks"
- "Find venues in Philadelphia"

### Advanced Queries

- "Find all shows where they played 'Shimmy > Basis > Woody'"
- "What are the song statistics for 'The Devil's Waltz'?"
- "List all shows from 1999 sorted by rating"
- "Get me the setlists for both 12/30/99 and 12/31/99"

### Cross-referencing

- "Compare the setlists from the top 3 rated shows in 2023"
- "What songs appeared in multiple shows at the Fillmore in 1999?"
- "Show me lyrics for all songs that were trending in 2022"

## Protocol

The server speaks [JSON-RPC 2.0](https://www.jsonrpc.org/specification) over a single HTTP endpoint:

```text
POST https://discobiscuits.net/mcp
```

(A `GET` on the same URL returns server identity metadata.)

Three methods are supported:

- `initialize` — handshake; returns `protocolVersion`, `capabilities`, and `serverInfo`.
- `tools/list` — returns the full `tools` array with names, descriptions, and input schemas.
- `tools/call` — invokes a tool. `params` is `{ name, arguments }`, where `arguments` matches the tool's input schema.

A `tools/call` result wraps the tool's JSON payload as text:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [{ "type": "text", "text": "{ ...the tool's JSON output... }" }]
  }
}
```

On a tool error the same shape is returned with `"isError": true` and an `Error: …` message in the text.

### Example Call

```bash
curl -X POST https://discobiscuits.net/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "search_shows",
      "arguments": { "query": "red rocks 2022", "limit": 10 }
    }
  }'
```

## Data Coverage

The database includes:

- **2,400+** shows dating back to the 1990s
- **700+** songs including lyrics, tabs, and history
- **500+** venues worldwide
- Complete setlists with song positions, segues, and per-track performer/flag/completion data
- User ratings and attendance
- Annotations and performance notes

## Rate Limits

No rate limits are currently enforced, but please use the server responsibly. If you're building an integration, consider caching responses.

## Privacy

The query tools expose only publicly available show, song, and venue data. The Sync / Replication tools expose a deliberately PII-free user projection (id, username, avatar reference, timestamps) plus ratings and attendance rows — no emails, passwords, or other account details are ever returned.

## Support

Questions or issues? Open an issue on the [bip-turbo repository](https://github.com/biscuits-internet-project/bip-turbo).

---

Built with ❤️ for the Biscuits community
