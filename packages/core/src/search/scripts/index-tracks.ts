#!/usr/bin/env bun

/**
 * Script to index all tracks for vector search
 * Usage: bun run packages/core/src/search/scripts/index-tracks.ts
 */

import { container } from "./container-setup";

async function indexTracks() {
  console.log("🎵 Starting track indexing...");
  
  try {
    const searchIndexService = container.searchIndexService();
    const trackRepository = container.trackRepository();
    
    // Get total count first for progress tracking
    console.log("📊 Counting tracks...");
    const totalCount = await trackRepository.count();
    console.log(`📦 Found ${totalCount} tracks to index`);
    
    // Process tracks in pages to avoid memory issues
    let indexed = 0;
    const pageSize = 100;
    const totalPages = Math.ceil(totalCount / pageSize);
    
    // Estimate cost using a sample
    console.log("💰 Estimating costs...");
    const sampleTracks = await trackRepository.findMany({
      take: 10,
      include: {
        song: {
          include: {
            author: true
          }
        },
        show: {
          include: {
            venue: true
          }
        }
      }
    });
    
    const embeddingService = container.embeddingService();
    const formatter = container.trackContentFormatter();
    
    const sampleContents = sampleTracks.map(track => formatter.generateContent(track));
    const { estimatedCostUSD, estimatedTokens } = embeddingService.estimateCost(sampleContents);
    const totalEstimatedCost = (estimatedCostUSD * totalCount) / 10;
    
    console.log(`💰 Estimated cost: $${totalEstimatedCost.toFixed(4)} (${Math.round(estimatedTokens * totalCount / 10)} tokens)`);
    
    // Process in pages
    for (let page = 0; page < totalPages; page++) {
      console.log(`📄 Processing page ${page + 1}/${totalPages}...`);
      
      const tracks = await trackRepository.findMany({
        skip: page * pageSize,
        take: pageSize,
        include: {
          song: {
            include: {
              author: true
            }
          },
          show: {
            include: {
              venue: true
            }
          }
        }
      });
      
      // Index tracks in smaller batches
      const batchSize = 5;
      for (let i = 0; i < tracks.length; i += batchSize) {
        const batch = tracks.slice(i, i + batchSize);
        
        for (const track of batch) {
          try {
            await searchIndexService.indexEntity(track, "track");
            indexed++;
            
            if (indexed % 100 === 0) {
              console.log(`✅ Indexed ${indexed}/${totalCount} tracks (${((indexed / totalCount) * 100).toFixed(1)}%)`);
            }
          } catch (error) {
            console.error(`❌ Failed to index track ${track.song?.title} from ${track.show?.date} (${track.id}):`, error);
          }
        }
        
        // Small delay between batches to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }
    
    console.log(`🎉 Successfully indexed ${indexed}/${totalCount} tracks`);
    
    if (indexed < totalCount) {
      console.log(`⚠️  ${totalCount - indexed} tracks failed to index`);
    }
    
    // Final cost report
    console.log(`💰 Final estimated cost: $${totalEstimatedCost.toFixed(4)}`);
    
  } catch (error) {
    console.error("💥 Track indexing failed:", error);
    process.exit(1);
  }
}

// Run the script
indexTracks()
  .then(() => {
    console.log("✨ Track indexing completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Fatal error:", error);
    process.exit(1);
  });