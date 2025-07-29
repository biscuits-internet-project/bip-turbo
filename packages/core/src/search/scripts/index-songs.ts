#!/usr/bin/env bun

/**
 * Script to index all songs for vector search
 * Usage: bun run packages/core/src/search/scripts/index-songs.ts
 */

import { container } from "./container-setup";

async function indexSongs() {
  console.log("🎵 Starting song indexing...");

  try {
    const searchIndexService = container.searchIndexService();
    const songRepository = container.songRepository();
    // Get all songs with related data
    console.log("📊 Fetching songs...");
    const songs = await container.db().song.findMany({
      include: {
        author: true,
      },
    });

    console.log(`📦 Found ${songs.length} songs to index`);

    // Estimate cost
    const embeddingService = container.embeddingService();
    const formatter = container.songContentFormatter();

    const sampleContents = songs.slice(0, 10).map((song) => formatter.generateContent(song));
    const { estimatedCostUSD, estimatedTokens } = embeddingService.estimateCost(sampleContents);
    const totalEstimatedCost = (estimatedCostUSD * songs.length) / 10;

    console.log(
      `💰 Estimated cost: $${totalEstimatedCost.toFixed(4)} (${Math.round((estimatedTokens * songs.length) / 10)} tokens)`,
    );

    // Index songs in batches
    let indexed = 0;
    const batchSize = 10;

    for (let i = 0; i < songs.length; i += batchSize) {
      const batch = songs.slice(i, i + batchSize);

      console.log(
        `📝 Indexing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(songs.length / batchSize)} (${batch.length} songs)...`,
      );

      for (const song of batch) {
        try {
          await searchIndexService.indexEntity(song, "song");
          indexed++;

          if (indexed % 50 === 0) {
            console.log(`✅ Indexed ${indexed}/${songs.length} songs`);
          }
        } catch (error) {
          console.error(`❌ Failed to index song ${song.title} (${song.id}):`, error);
        }
      }

      // Small delay between batches to respect rate limits
      if (i + batchSize < songs.length) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    console.log(`🎉 Successfully indexed ${indexed}/${songs.length} songs`);

    if (indexed < songs.length) {
      console.log(`⚠️  ${songs.length - indexed} songs failed to index`);
    }

    // Final cost report
    console.log(`💰 Final estimated cost: $${totalEstimatedCost.toFixed(4)}`);
  } catch (error) {
    console.error("💥 Song indexing failed:", error);
    process.exit(1);
  }
}

// Run the script
indexSongs()
  .then(() => {
    console.log("✨ Song indexing completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Fatal error:", error);
    process.exit(1);
  });
