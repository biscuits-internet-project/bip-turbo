#!/usr/bin/env bun

/**
 * Script to index 2024 shows using dual index system:
 * 1. Show-level index for date/venue searches
 * 2. Track-level index for song/position searches
 */

import { container } from "./container-setup";
import { ShowVenueFormatter } from "../content-formatters/show-venue-formatter";
import { TrackSongFormatter } from "../content-formatters/track-song-formatter";

// Configuration
const BATCH_SIZE = 30; // Process this many items in parallel
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000; // ms
const RATE_LIMIT_DELAY = 50; // ms between batches

async function retry<T>(
  fn: () => Promise<T>,
  attempts: number = RETRY_ATTEMPTS,
  delay: number = RETRY_DELAY
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (attempts <= 1) throw error;
    
    console.warn(`⚠️  Retrying after error: ${error.message}`);
    await new Promise(resolve => setTimeout(resolve, delay));
    return retry(fn, attempts - 1, delay * 2); // Exponential backoff
  }
}

async function processBatch<T>(
  items: T[],
  processor: (item: T) => Promise<void>,
  batchSize: number = BATCH_SIZE
): Promise<{ successful: number; failed: number; errors: Array<{ item: T; error: any }> }> {
  const results = {
    successful: 0,
    failed: 0,
    errors: [] as Array<{ item: T; error: any }>
  };

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    
    const promises = batch.map(async (item) => {
      try {
        await retry(() => processor(item));
        results.successful++;
      } catch (error) {
        results.failed++;
        results.errors.push({ item, error });
      }
    });

    await Promise.all(promises);
    
    // Rate limiting between batches
    if (i + batchSize < items.length) {
      await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
    }
    
    // Progress update
    const processed = Math.min(i + batchSize, items.length);
    if (processed % (batchSize * 5) === 0 || processed === items.length) {
      console.log(`📊 Progress: ${processed}/${items.length} (${Math.round(processed / items.length * 100)}%)`);
    }
  }

  return results;
}

async function indexDual2024() {
  console.log("🎭 Starting dual index system for 2024 shows...");
  console.log(`⚙️  Configuration: Batch size=${BATCH_SIZE}, Retries=${RETRY_ATTEMPTS}`);

  try {
    const searchIndexService = container.searchIndexService();
    
    // Create formatter instances
    const showVenueFormatter = new ShowVenueFormatter();
    const trackSongFormatter = new TrackSongFormatter();

    // Get 2024 shows with all related data
    console.log("\n📊 Fetching 2024 shows and tracks...");
    const shows = await container.db().show.findMany({
      where: {
        date: {
          gte: '2024-01-01',
          lte: '2024-12-31'
        }
      },
      include: {
        venue: true,
        tracks: {
          include: {
            song: true,
            annotations: true,
          },
          orderBy: [{ set: "asc" }, { position: "asc" }],
        },
      },
    });

    const totalTracks = shows.reduce((sum, show) => sum + show.tracks.length, 0);
    console.log(`📦 Found ${shows.length} shows with ${totalTracks} tracks`);

    // Clear existing 2024 indexes
    console.log("\n🧹 Clearing existing indexes...");
    const deleted = await container.db().searchIndex.deleteMany({});
    console.log(`🗑️  Deleted ${deleted.count} existing index entries`);

    // Index shows (date/venue info)
    console.log("\n📍 Phase 1: Indexing show-level records (date/venue)...");
    
    const showResults = await processBatch(
      shows,
      async (show) => {
        await searchIndexService.indexWithFormatter(show, showVenueFormatter, "show");
      }
    );

    console.log(`✅ Show indexing complete: ${showResults.successful} successful, ${showResults.failed} failed`);
    
    if (showResults.errors.length > 0) {
      console.log("❌ Failed shows:");
      showResults.errors.forEach(({ item, error }) => {
        console.log(`  - ${item.date} at ${item.venue?.name}: ${error.message}`);
      });
    }

    // Prepare tracks with show context
    console.log("\n🎵 Phase 2: Indexing track-level records (songs/positions)...");
    
    const tracksWithContext = shows.flatMap(show => 
      show.tracks.map(track => ({
        ...track,
        id: show.id,  // Use show ID as the entity ID for tracks
        show: {
          id: show.id,
          date: show.date,
          venue: show.venue
        }
      }))
    );

    const trackResults = await processBatch(
      tracksWithContext,
      async (track) => {
        await searchIndexService.indexWithFormatter(track, trackSongFormatter, "show");
      }
    );

    console.log(`✅ Track indexing complete: ${trackResults.successful} successful, ${trackResults.failed} failed`);
    
    if (trackResults.errors.length > 0) {
      console.log(`❌ Failed tracks (showing first 10 of ${trackResults.errors.length}):`);
      trackResults.errors.slice(0, 10).forEach(({ item, error }) => {
        console.log(`  - ${item.song?.title} from ${item.show.date}: ${error.message}`);
      });
    }

    // Final stats
    console.log("\n📊 Final Index Stats:");
    const stats = await searchIndexService.getStats();
    console.log(`  Total entries: ${stats.totalCount}`);
    console.log(`  By type:`, stats.countsByType);
    
    // Summary
    console.log("\n📈 Indexing Summary:");
    console.log(`  Shows: ${showResults.successful}/${shows.length} (${Math.round(showResults.successful / shows.length * 100)}%)`);
    console.log(`  Tracks: ${trackResults.successful}/${tracksWithContext.length} (${Math.round(trackResults.successful / tracksWithContext.length * 100)}%)`);
    
    const totalErrors = showResults.failed + trackResults.failed;
    if (totalErrors > 0) {
      console.log(`\n⚠️  Total errors: ${totalErrors}`);
      console.log("  Check the error messages above for details.");
    }

  } catch (error) {
    console.error("💥 Dual indexing failed:", error);
    process.exit(1);
  }
}

// Run the script
indexDual2024()
  .then(() => {
    console.log("\n✨ Dual index system completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Fatal error:", error);
    process.exit(1);
  });