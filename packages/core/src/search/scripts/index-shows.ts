#!/usr/bin/env bun

/**
 * Script to index all shows for vector search
 * Usage: bun run packages/core/src/search/scripts/index-shows.ts
 */

import { container } from "./container-setup";

async function indexShows() {
  console.log("🎭 Starting show indexing...");
  
  try {
    const searchIndexService = container.searchIndexService();
    const showRepository = container.showRepository();
    
    // Get all shows with related data
    console.log("📊 Fetching shows...");
    const shows = await showRepository.findMany({
      include: {
        venue: true,
        tracks: {
          include: {
            song: true,
          },
          orderBy: [
            { set: 'asc' },
            { position: 'asc' }
          ]
        }
      }
    });
    
    console.log(`📦 Found ${shows.length} shows to index`);
    
    // Estimate cost
    const embeddingService = container.embeddingService();
    const formatter = container.showContentFormatter();
    
    const sampleContents = shows.slice(0, 10).map(show => formatter.generateContent(show));
    const { estimatedCostUSD, estimatedTokens } = embeddingService.estimateCost(sampleContents);
    const totalEstimatedCost = (estimatedCostUSD * shows.length) / 10;
    
    console.log(`💰 Estimated cost: $${totalEstimatedCost.toFixed(4)} (${Math.round(estimatedTokens * shows.length / 10)} tokens)`);
    
    // Index shows in batches
    let indexed = 0;
    const batchSize = 5; // Smaller batches for shows since they have more content
    
    for (let i = 0; i < shows.length; i += batchSize) {
      const batch = shows.slice(i, i + batchSize);
      
      console.log(`📝 Indexing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(shows.length / batchSize)} (${batch.length} shows)...`);
      
      for (const show of batch) {
        try {
          await searchIndexService.indexEntity(show, "show");
          indexed++;
          
          if (indexed % 25 === 0) {
            console.log(`✅ Indexed ${indexed}/${shows.length} shows`);
          }
        } catch (error) {
          console.error(`❌ Failed to index show ${show.date} (${show.id}):`, error);
        }
      }
      
      // Small delay between batches to respect rate limits
      if (i + batchSize < shows.length) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    
    console.log(`🎉 Successfully indexed ${indexed}/${shows.length} shows`);
    
    if (indexed < shows.length) {
      console.log(`⚠️  ${shows.length - indexed} shows failed to index`);
    }
    
    // Final cost report
    console.log(`💰 Final estimated cost: $${totalEstimatedCost.toFixed(4)}`);
    
  } catch (error) {
    console.error("💥 Show indexing failed:", error);
    process.exit(1);
  }
}

// Run the script
indexShows()
  .then(() => {
    console.log("✨ Show indexing completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Fatal error:", error);
    process.exit(1);
  });