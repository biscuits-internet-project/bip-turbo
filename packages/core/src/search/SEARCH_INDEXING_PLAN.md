# Search Indexing Plan

## Overview
Multi-methodology indexing system where each show has multiple search index entries optimized for different search patterns.

## Indexing Methodologies

### 1. ShowDateVenueFormatter
**Purpose**: Optimize for date and venue-based searches

**Content to Embed**:
- [x] Date variations: Multiple formats for vector matching
  - ISO format: "2024-04-06"
  - US format: "04/06/2024"
  - Long format: "April 6 2024"
  - Month/Year: "April 2024"
- [x] Venue information: Simple and clean
  - Venue name
  - City, State (for US)
  - City, Country (for non-US)

**Decisions**:
- No day of week (Friday, weekend, etc.)
- No special event markers in venue formatter
- Keep it focused on date and location only

### 2. ShowSongFormatter  
**Purpose**: Optimize for song, setlist, and musical content searches

**Multiple Entry Types Per Show**:

#### 2a. Individual Song Entries
- Song title (repeated for emphasis/weight)
- Set indicators: "Set 1", "S1", "Set 2", "S2", "Encore", "E"
- Position markers (when applicable):
  - "show opener" (first song of entire show)
  - "set opener" (first song of any set)
  - "set closer" (last song of any set)
  - "show closer" (last song of entire show)
  - "encore"
- Annotations:
  - Repeated annotations (for emphasis/weight): inverted, dyslexic
  - Singular annotations: unfinished, etc.

#### 2b. Segue Pair Entries  
- Format: "Song A > Song B" 
- Preserves segue notation from database (>, →, etc.)
- No set context (individual songs provide that)

#### 2c. Full Segue Sequence Entries
- Complete segue chains with 3+ songs: "Song A > Song B > Song C"
- Minimum 3 songs (2-song transitions covered by pairs)
- No maximum length
- Preserves segue notation from database
- No set context (individual songs provide that)

**Decisions**:
- Create multiple entry types for maximum search flexibility
- Each entry type will have different scoring weight
- Segue notation preserved as stored (>, →, etc.)

## Scoring and Weighting

**Weighting Strategy** (proposed):
- [ ] Full segue sequence: 2.0x (most specific)
- [ ] Segue pair: 1.5x
- [ ] Individual song: 1.0x (baseline)
- [ ] Date/venue: 1.2x 

**Aggregation Method**:
- Group all entries by show ID
- Apply weights based on entry type
- Sum weighted scores for final show score

**Implementation Question**:
- Need to track entry type for weighting
- Options: Add metadata field or encode in content

## Implementation Notes

### Index Strategy Types
- `date_venue` - Date and venue focused entry
- `song_individual` - Individual song entry  
- `segue_pair` - Two-song segue transition
- `segue_sequence` - Full segue chain (3+ songs)

### Database Schema
- Added `index_strategy` field to SearchIndex table
- Default value: "date_venue" for migration compatibility
- Indexed for efficient filtering

---

## Q&A Decision Log
