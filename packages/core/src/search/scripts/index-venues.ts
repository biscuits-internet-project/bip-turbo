#!/usr/bin/env bun

/**
 * Script to index all venues for vector search
 * Usage: bun run packages/core/src/search/scripts/index-venues.ts
 */

import { container } from "./container-setup";

async function indexVenues() {
  console.log("🏟️ Starting venue indexing...");
  
  try {
    const searchIndexService = container.searchIndexService();
    const venueRepository = container.venueRepository();
    
    // Get all venues with related data
    console.log("📊 Fetching venues...");
    const venues = await venueRepository.findMany({
      include: {
        shows: {
          orderBy: {
            date: 'desc'
          },
          take: 10 // Limit shows per venue to avoid excessive data
        }
      }
    });
    
    console.log(`📦 Found ${venues.length} venues to index`);
    
    // Estimate cost
    const embeddingService = container.embeddingService();
    const formatter = container.venueContentFormatter();
    
    const sampleContents = venues.slice(0, 10).map(venue => formatter.generateContent(venue));
    const { estimatedCostUSD, estimatedTokens } = embeddingService.estimateCost(sampleContents);
    const totalEstimatedCost = (estimatedCostUSD * venues.length) / 10;
    
    console.log(`💰 Estimated cost: $${totalEstimatedCost.toFixed(4)} (${Math.round(estimatedTokens * venues.length / 10)} tokens)`);
    
    // Index venues in batches
    let indexed = 0;
    const batchSize = 15; // Larger batches for venues since they have less content
    
    for (let i = 0; i < venues.length; i += batchSize) {
      const batch = venues.slice(i, i + batchSize);
      
      console.log(`📝 Indexing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(venues.length / batchSize)} (${batch.length} venues)...`);
      
      for (const venue of batch) {
        try {
          await searchIndexService.indexEntity(venue, "venue");
          indexed++;
          
          if (indexed % 50 === 0) {
            console.log(`✅ Indexed ${indexed}/${venues.length} venues`);
          }
        } catch (error) {
          console.error(`❌ Failed to index venue ${venue.name} (${venue.id}):`, error);
        }
      }
      
      // Small delay between batches to respect rate limits
      if (i + batchSize < venues.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    console.log(`🎉 Successfully indexed ${indexed}/${venues.length} venues`);
    
    if (indexed < venues.length) {
      console.log(`⚠️  ${venues.length - indexed} venues failed to index`);
    }
    
    // Final cost report
    console.log(`💰 Final estimated cost: $${totalEstimatedCost.toFixed(4)}`);
    
  } catch (error) {
    console.error("💥 Venue indexing failed:", error);
    process.exit(1);
  }
}

// Run the script
indexVenues()
  .then(() => {
    console.log("✨ Venue indexing completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Fatal error:", error);
    process.exit(1);
  });