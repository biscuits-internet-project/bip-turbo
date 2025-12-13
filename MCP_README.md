# BIP MCP Server - User Guide

The BIP setlist database is now available as a Model Context Protocol (MCP) server! This allows LLMs like Claude to directly query our comprehensive database of show information, setlists, songs, and venues.

## What is MCP?

Model Context Protocol (MCP) is an open standard that allows AI assistants to securely access external data sources. With MCP, Claude can answer questions about the Disco Biscuits' performance history, setlists, song lyrics, and more.

## Requirements

- Claude Pro, Team, Max, or Enterprise subscription (for remote MCP servers)
- Or Claude Code (supports MCP)

## Setup

### For Claude Desktop

Add the BIP MCP server to your Claude Desktop configuration:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "bip-setlist": {
      "url": "https://biscuits.app/mcp",
      "transport": "http"
    }
  }
}
```

### For Claude Code

```bash
claude mcp add https://biscuits.app/mcp --transport http
```

## Available Tools

The MCP server provides 14 specialized tools for querying the setlist database:

### 🔍 Search Tools

#### `search_shows`
Search for shows by song names, venue, date, or any combination.

**Example queries:**
- "fillmore swell" - Shows at Fillmore featuring Swell
- "12/30/99" - Shows on December 30, 1999
- "red rocks 2022" - Shows at Red Rocks in 2022

#### `search_songs`
Search the song catalog by title.

**Example:** "basis", "shimmy"

#### `search_venues`
Find venues by name, city, state, or country.

**Example:** "fillmore", "colorado venues", "red rocks"

#### `search_segues`
Find specific song sequences using ">" notation.

**Example:** "Shimmy > Basis > Woody"

#### `search_by_date`
Find shows by exact date, month, or year.

**Examples:**
- Exact: "12/30/1999"
- Month: "December"
- Year: "1999"

### 📊 Data Retrieval Tools

#### `get_shows`
Get detailed information for multiple shows at once.

**Input:** Array of show slugs (e.g., ["1999-12-30", "2000-01-01"])

**Returns:** Show metadata including venue, ratings, counts

#### `get_songs`
Get detailed song information including lyrics, tabs, and history.

**Input:** Array of song slugs

**Returns:** Full song details, play statistics, author info

#### `get_venues`
Get venue details including location and show history.

**Input:** Array of venue slugs

**Returns:** Venue information with contact details and coordinates

#### `get_setlists`
Get complete setlists organized by sets.

**Input:** Array of show slugs

**Returns:** Full setlists with songs, segues, notes, and annotations

#### `get_song_performances`
Get all performances of a specific song across all shows.

**Input:** Song slug, optional limit and sort preferences

**Returns:** List of shows where the song was played with ratings and context

### 📈 Analytics Tools

#### `get_trending_songs`
See which songs have been played most frequently in recent shows.

**Input:** Number of recent shows to analyze (default: 50)

**Returns:** Songs sorted by play frequency

#### `get_song_statistics`
Get detailed analytics for any song.

**Input:** Song slug

**Returns:**
- Times played
- First/last played dates
- Yearly play data
- Longest gaps between performances
- Most/least common years

#### `get_venue_history`
Get all shows performed at a specific venue.

**Input:** Venue slug, optional limit and sort

**Returns:** List of shows at that venue with dates and ratings

#### `get_shows_by_year`
List all shows from a specific year.

**Input:** Year (e.g., 1999)

**Returns:** All shows from that year with venue info and ratings

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

## API Endpoints

For developers, all tools are accessible as HTTP POST endpoints:

```bash
# Base URL
https://biscuits.app/mcp/

# Endpoints
POST /mcp/search-shows
POST /mcp/search-songs
POST /mcp/search-venues
POST /mcp/search-segues
POST /mcp/search-by-date
POST /mcp/get-shows
POST /mcp/get-songs
POST /mcp/get-venues
POST /mcp/get-setlists
POST /mcp/get-song-performances
POST /mcp/get-trending-songs
POST /mcp/get-song-statistics
POST /mcp/get-venue-history
POST /mcp/get-shows-by-year
```

### Example API Call

```bash
curl -X POST https://biscuits.app/mcp/search-shows \
  -H "Content-Type: application/json" \
  -d '{
    "query": "fillmore swell",
    "limit": 10
  }'
```

## Data Coverage

The database includes:
- **2,400+** shows dating back to the 1990s
- **700+** songs including lyrics, tabs, and history
- **500+** venues worldwide
- Complete setlists with song positions and segues
- User ratings and reviews
- Show photos and videos
- Annotations and performance notes

## Response Format

All endpoints return JSON with consistent formatting:

```json
{
  "results": [...],
  // or
  "shows": [...],
  "songs": [...],
  etc.
}
```

Errors are returned with descriptive messages:

```json
{
  "error": "Description of error",
  "details": "Additional context"
}
```

## Rate Limits

Currently no rate limits are enforced, but please use the API responsibly. If you're building an integration, consider caching responses.

## Support

Questions or issues?
- GitHub: [bip-turbo repository](https://github.com/...)
- Contact: [Your contact info]

## Privacy

The MCP server only accesses publicly available show and song data. No user account information is exposed through these endpoints.

## Future Enhancements

Planned features:
- SSE (Server-Sent Events) support for streaming responses
- Authentication for API access
- Webhooks for new show announcements
- Advanced filtering and aggregation tools

---

Built with ❤️ for the Biscuits community
