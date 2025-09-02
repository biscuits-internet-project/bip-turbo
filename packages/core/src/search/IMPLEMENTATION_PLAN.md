# Multi-Entry Search Implementation Plan

## Overview
Clean implementation of multi-methodology search indexing where each show generates multiple search entries optimized for different search patterns.

## File Structure

### Content Formatters (`src/search/content-formatters/`)

#### 1. `base-content-formatter.ts` ✅ (keep existing)
- Interface definition for all formatters
- No changes needed

#### 2. `show-date-venue-formatter.ts` (new)
- **Index Strategy**: `date_venue`
- **Input**: Full show object with venue
- **Output**: One search entry per show focused on date/venue matching
- **Content**: Date variations + venue name + location

#### 3. `show-song-individual-formatter.ts` (new)
- **Index Strategy**: `song_individual` 
- **Input**: Full show object with tracks
- **Output**: One search entry per track/song
- **Content**: Song title (repeated) + set info + position markers + annotations
- **Special**: Repeat "inverted" and "dyslexic" annotations

#### 4. `show-segue-pair-formatter.ts` (new)
- **Index Strategy**: `segue_pair`
- **Input**: Full show object with tracks 
- **Output**: One search entry per adjacent segue pair (Song A > Song B)
- **Content**: "Song A > Song B" format preserving segue notation

#### 5. `show-segue-sequence-formatter.ts` (new)
- **Index Strategy**: `segue_sequence`
- **Input**: Full show object with tracks
- **Output**: One search entry per segue sequence of 3+ songs
- **Content**: "Song A > Song B > Song C..." format preserving segue notation

### Repository Updates

#### 1. `search-index-repository.ts` (update)
- Add `indexStrategy` field to `SearchIndexData` interface
- Update all SQL queries to include index_strategy field
- Add methods to filter by index strategy if needed

### Scripts

#### 1. `scripts/index-shows-2024.ts` (rewrite)
- Import all 4 new formatters
- For each show, create entries using each formatter
- Track counts by index strategy type
- Clean, simple loop structure

### Search Service Updates

#### 1. `search-index-service.ts` (update)
- Remove old registration system completely
- Keep simple `indexWithFormatter` method for direct usage
- May need aggregation logic later for weighted scoring

## Implementation Order

1. **Phase 1**: Repository + Base Structure
   - Update `SearchIndexData` interface 
   - Update repository SQL queries
   - Test with existing data

2. **Phase 2**: Formatters (in order of complexity)
   - `show-date-venue-formatter.ts` (simplest)
   - `show-song-individual-formatter.ts` 
   - `show-segue-pair-formatter.ts`
   - `show-segue-sequence-formatter.ts` (most complex)

3. **Phase 3**: Indexing Script
   - Rewrite `index-shows-2024.ts`
   - Test with small dataset first
   - Verify multi-entry creation

4. **Phase 4**: Search/Aggregation (future)
   - Weighted scoring system
   - Result aggregation by show
   - Performance optimization

## Data Flow

```
Show Object → 4 Formatters → 4+ Search Entries → Database
                ↓
    DateVenue: 1 entry per show
    Individual: N entries (one per track)  
    SegPair: M entries (adjacent pairs)
    SegSeq: P entries (3+ song sequences)
```

## Key Principles

- **Simple**: Each formatter has single responsibility
- **Direct**: No complex registration or discovery patterns
- **Testable**: Each formatter can be tested independently  
- **Scalable**: Easy to add new index strategies
- **Clean**: Clear separation between formatting and indexing logic