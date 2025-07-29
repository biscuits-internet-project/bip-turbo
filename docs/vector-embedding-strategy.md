# Vector Embedding Strategy for The Biscuits Internet Project

## Phase 1: Content Strategy & Formatters (Week 1)

### Model Selection
- **text-embedding-3-small** (1536 dimensions, $0.00002/1K tokens)
- Total cost estimate: ~$0.40 for full 20k records
- Allows for vector indexing (within 2000 dimension limit)
- Easy upgrade path to 3-large if needed

### Priority Entity Order
1. **Songs** (highest ROI) - Rich content with lyrics, tabs, performance history
2. **Shows** (high engagement) - Dates, venues, setlists, notes, reviews  
3. **Venues** (simple start) - Location and basic venue info from existing data
4. **Tracks** (granular detail) - Individual performances with context

### Content Formatter Implementation

**Song Embeddings:**
```
Format: "[Song Title] by [Author]. [Lyrics excerpt]. Played [X] times. [Performance context: most/least common years, notable gaps from longestGapsData]. [Tabs/musical info]. [Notes/history]."
```

**Show Embeddings:**  
```
Format: "[Date] at [Venue], [City, State]. Setlist: [song1 > song2 > song3...]. [Show notes]. Average rating: [X]. [Key characteristics: debuts, bustouts, notable segues]."
```

**Venue Embeddings:**
```  
Format: "[Venue Name] in [City, State]. [Times played]. Notable shows from database. [Basic characteristics from existing data]."
```

**Track Embeddings:**
```
Format: "[Song] performed on [Date] at [Venue]. [Segue context: song before > current > song after]. [Track notes]. Rating: [X]. [All-timer status]."
```

## Phase 2: Initial Indexing (Week 1-2)

### Batch Processing Strategy
- Start with **Songs** (highest value, ~500-1000 records)
- Process in batches of 50 with 100ms delays (rate limiting)
- **Very affordable**: ~$0.40 total cost for all 20k records
- Run during off-peak hours to minimize user impact

### Vector Index Creation
- With 1536 dimensions, we can create proper vector indexes
- IVFFlat index for efficient similarity search
- Better performance than sequential scan

### Error Handling & Monitoring
- Comprehensive logging for each embedding generation
- Graceful failure handling (skip problematic records)
- Progress tracking and resumable operations
- Cost monitoring (though very low cost)

## Phase 3: Search Experience Enhancement (Week 2-3)

### Query Understanding
- **Musical queries**: "psychedelic jams", "reggae versions", "bustouts"  
- **Historical queries**: "1999 shows", "debut performances", "rare songs"
- **Contextual queries**: "small venue shows", "festival sets"
- **Relationship queries**: "songs that follow Dark Star", "venues in Colorado"

### Result Ranking & Metadata
- Boost recent/popular content in rankings
- Include performance statistics in results
- Show relationships (common song pairings, venue characteristics)
- Surface rare/interesting connections users might not find otherwise

## Phase 4: Real-time Indexing (Week 3-4)

### Update Triggers
- Index new shows/songs immediately upon creation
- Re-index on content updates (lyrics changes, new notes)
- Batch re-index for bulk imports of historical data
- Scheduled maintenance for data consistency

### Performance Optimization  
- Monitor query performance with vector indexes
- Track search analytics to optimize content formatting
- Implement query result caching for common searches

## Success Metrics

### Quantitative
- Search query response time < 200ms (with indexes)
- User engagement: clicks from search results  
- Search success rate (queries returning relevant results)
- Cost per search (target: < $0.0001 per query with 3-small)

### Qualitative  
- Enable discovery of musical connections users wouldn't find otherwise
- Surface rare/interesting setlist patterns and song relationships
- Improve navigation between related shows, songs, and venues
- Support natural language queries about band history and music

## Future Considerations
- Easy upgrade to text-embedding-3-large if search quality needs improvement
- Venue web enrichment for enhanced context
- User behavior analytics to optimize content formatting

## Technical Implementation Notes

### Database Schema
- SearchIndex table already implemented with vector(3072) support
- Can accommodate both 3-small (1536) and 3-large (3072) dimensions
- pgvector extension enabled with proper migrations

### Existing Infrastructure
- EmbeddingService configured for OpenAI API integration
- SearchIndexService with content formatter pattern
- Vector similarity search with cosine distance
- Complete /api/search endpoint with error handling
- Frontend Command+K interface ready

### Content Formatters Location
```
packages/core/src/search/content-formatters/
├── show-content-formatter.ts
├── song-content-formatter.ts
├── venue-content-formatter.ts
└── track-content-formatter.ts
```

### Next Steps
1. Update EmbeddingService to use text-embedding-3-small
2. Implement detailed content formatters for each entity type
3. Create indexing scripts for batch processing
4. Add vector index migration for 1536 dimensions
5. Test search quality with real data