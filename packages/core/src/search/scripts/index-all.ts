#!/usr/bin/env bun

/**
 * Master script to index all entities for vector search
 * Usage: bun run packages/core/src/search/scripts/index-all.ts
 */

import { container } from "./container-setup";

async function runScript(scriptName: string, scriptFunction: () => Promise<void>) {
  console.log(`\n🚀 Starting ${scriptName}...`);
  const startTime = Date.now();
  
  try {
    await scriptFunction();
    const duration = Date.now() - startTime;
    console.log(`✅ ${scriptName} completed in ${(duration / 1000).toFixed(1)}s`);
  } catch (error) {
    console.error(`❌ ${scriptName} failed:`, error);
    throw error;
  }
}

async function indexSongs() {
  const searchIndexService = container.searchIndexService();
  const songRepository = container.songRepository();
  
  const songs = await songRepository.findMany({
    include: { author: true }
  });
  
  console.log(`📦 Indexing ${songs.length} songs...`);
  
  let indexed = 0;
  const batchSize = 10;
  
  for (let i = 0; i < songs.length; i += batchSize) {
    const batch = songs.slice(i, i + batchSize);
    
    for (const song of batch) {
      try {
        await searchIndexService.indexEntity(song, "song");
        indexed++;
        
        if (indexed % 50 === 0) {
          console.log(`  ✅ ${indexed}/${songs.length} songs indexed`);
        }
      } catch (error) {
        console.error(`  ❌ Failed to index song ${song.title}:`, error);
      }
    }
    
    if (i + batchSize < songs.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  console.log(`🎵 Songs: ${indexed}/${songs.length} indexed`);
}

async function indexShows() {
  const searchIndexService = container.searchIndexService();
  const showRepository = container.showRepository();
  
  const shows = await showRepository.findMany({
    include: {
      venue: true,
      tracks: {
        include: { song: true },
        orderBy: [{ set: 'asc' }, { position: 'asc' }]
      }
    }
  });
  
  console.log(`📦 Indexing ${shows.length} shows...`);
  
  let indexed = 0;
  const batchSize = 5;
  
  for (let i = 0; i < shows.length; i += batchSize) {
    const batch = shows.slice(i, i + batchSize);
    
    for (const show of batch) {
      try {
        await searchIndexService.indexEntity(show, "show");
        indexed++;
        
        if (indexed % 25 === 0) {
          console.log(`  ✅ ${indexed}/${shows.length} shows indexed`);
        }
      } catch (error) {
        console.error(`  ❌ Failed to index show ${show.date}:`, error);
      }
    }
    
    if (i + batchSize < shows.length) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
  
  console.log(`🎭 Shows: ${indexed}/${shows.length} indexed`);
}

async function indexVenues() {
  const searchIndexService = container.searchIndexService();
  const venueRepository = container.venueRepository();
  
  const venues = await venueRepository.findMany({
    include: {
      shows: {
        orderBy: { date: 'desc' },
        take: 10
      }
    }
  });
  
  console.log(`📦 Indexing ${venues.length} venues...`);
  
  let indexed = 0;
  const batchSize = 15;
  
  for (let i = 0; i < venues.length; i += batchSize) {
    const batch = venues.slice(i, i + batchSize);
    
    for (const venue of batch) {
      try {
        await searchIndexService.indexEntity(venue, "venue");
        indexed++;
        
        if (indexed % 50 === 0) {
          console.log(`  ✅ ${indexed}/${venues.length} venues indexed`);
        }
      } catch (error) {
        console.error(`  ❌ Failed to index venue ${venue.name}:`, error);
      }
    }
    
    if (i + batchSize < venues.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  console.log(`🏟️ Venues: ${indexed}/${venues.length} indexed`);
}

async function indexAll() {
  console.log("🔍 Starting complete vector search indexing...");
  console.log("📊 This will index songs, shows, venues, and tracks for semantic search");
  
  const startTime = Date.now();
  
  try {
    // Clear existing indexes
    console.log("\n🗑️ Clearing existing search indexes...");
    const searchIndexRepository = container.searchIndexRepository();
    await searchIndexRepository.deleteAll();
    console.log("✅ Existing indexes cleared");
    
    // Index in priority order (highest value first)
    await runScript("Song Indexing", indexSongs);
    await runScript("Show Indexing", indexShows);
    await runScript("Venue Indexing", indexVenues);
    
    // Skip tracks for now due to volume - they can be indexed separately
    console.log("\n⏭️ Skipping track indexing (use index-tracks.ts separately if needed)");
    
    const totalTime = Date.now() - startTime;
    
    console.log("\n🎉 Vector search indexing completed!");
    console.log(`⏱️ Total time: ${(totalTime / 1000 / 60).toFixed(1)} minutes`);
    console.log("🔍 Vector search is now ready for use!");
    
    // Show final stats
    const searchIndexRepository = container.searchIndexRepository();
    const stats = await searchIndexRepository.getStats();
    console.log("\n📊 Final indexing stats:");
    Object.entries(stats).forEach(([entityType, count]) => {
      console.log(`  ${entityType}: ${count} indexed`);
    });
    
  } catch (error) {
    console.error("\n💥 Indexing failed:", error);
    process.exit(1);
  }
}

// Run the complete indexing
indexAll()
  .then(() => {
    console.log("\n✨ All done! Vector search is ready to use.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Fatal error:", error);
    process.exit(1);
  });