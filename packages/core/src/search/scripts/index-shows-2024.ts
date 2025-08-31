#!/usr/bin/env bun

/**
 * Script to index 2024 shows for vector search with annotations
 * Usage: bun run packages/core/src/search/scripts/index-shows-2024.ts
 */

import { container } from "./container-setup";

async function indexShows2024() {
  console.log("🎭 Starting 2024 show indexing...");

  try {
    const searchIndexService = container.searchIndexService();

    // Get 2024 shows with related data including annotations
    console.log("📊 Fetching 2024 shows...");
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
            annotations: true, // Include track annotations
          },
          orderBy: [{ set: "asc" }, { position: "asc" }],
        },
      },
    });

    console.log(`📦 Found ${shows.length} 2024 shows to index`);

    // Estimate cost
    const embeddingService = container.embeddingService();
    const formatter = container.showContentFormatter();

    const sampleContents = shows.slice(0, Math.min(10, shows.length)).map((show) => formatter.generateContent(show));
    const { estimatedCostUSD, estimatedTokens } = embeddingService.estimateCost(sampleContents);
    const totalEstimatedCost = (estimatedCostUSD * shows.length) / Math.min(10, shows.length);

    console.log(
      `💰 Estimated cost: $${totalEstimatedCost.toFixed(4)} (${Math.round((estimatedTokens * shows.length) / Math.min(10, shows.length))} tokens)`,
    );

    // Index shows in batches
    let indexed = 0;
    const batchSize = 5; // Smaller batches for shows since they have more content

    for (let i = 0; i < shows.length; i += batchSize) {
      const batch = shows.slice(i, i + batchSize);

      console.log(
        `📝 Indexing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(shows.length / batchSize)} (${batch.length} shows)...`,
      );

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
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }

    console.log(`🎉 Successfully indexed ${indexed}/${shows.length} 2024 shows`);

    if (indexed < shows.length) {
      console.log(`⚠️  ${shows.length - indexed} shows failed to index`);
    }

    // Final cost report
    console.log(`💰 Final estimated cost: $${totalEstimatedCost.toFixed(4)}`);
  } catch (error) {
    console.error("💥 2024 show indexing failed:", error);
    process.exit(1);
  }
}

// Run the script
indexShows2024()
  .then(() => {
    console.log("✨ 2024 show indexing completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Fatal error:", error);
    process.exit(1);
  });