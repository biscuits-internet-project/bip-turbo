#!/usr/bin/env bun

/**
 * Multi-methodology indexing for 2024 shows
 * Creates multiple search entries per show for different search patterns
 */

import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";
import { 
  ShowDateVenueFormatter,
  ShowSongIndividualFormatter,
  ShowSeguePairFormatter,
  ShowSegueSequenceFormatter
} from "../content-formatters";
import type { SearchIndexData } from "../search-index-repository";

const db = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function indexShows() {
  console.log("🎭 Multi-methodology indexing for 2024 shows...");

  // Clear old entries first
  await db.$executeRaw`DELETE FROM search_indexes WHERE entity_type = 'show'`;
  console.log("✅ Cleared old search entries");

  // Get shows with all related data
  const shows = await db.show.findMany({
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
          annotations: true
        },
        orderBy: [{ set: "asc" }, { position: "asc" }]
      }
    }
  });

  console.log(`📊 Found ${shows.length} shows to index`);

  // Initialize formatters
  const dateVenueFormatter = new ShowDateVenueFormatter();
  const individualFormatter = new ShowSongIndividualFormatter();
  const pairFormatter = new ShowSeguePairFormatter();
  const sequenceFormatter = new ShowSegueSequenceFormatter();

  // Counters
  let totalShows = 0;
  let dateVenueEntries = 0;
  let individualEntries = 0;
  let pairEntries = 0;
  let sequenceEntries = 0;

  const searchIndexData: SearchIndexData[] = [];

  for (const show of shows) {
    try {
      // 1. Date/Venue Entry (1 per show)
      const dateVenueContent = dateVenueFormatter.generateContent(show);
      const dateVenueDisplay = dateVenueFormatter.generateDisplayText(show);
      
      const dateVenueEmbedding = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: dateVenueContent,
        dimensions: 1536
      });

      searchIndexData.push({
        entityType: "show",
        entityId: show.id,
        entitySlug: show.slug || show.id,
        displayText: dateVenueDisplay,
        content: dateVenueContent,
        embeddingSmall: dateVenueEmbedding.data[0].embedding,
        modelUsed: "text-embedding-3-small",
        indexStrategy: "date_venue"
      });
      dateVenueEntries++;

      // 2. Individual Song Entries (1 per track)
      for (const track of show.tracks) {
        const individualContent = individualFormatter.generateContent({ show, track });
        const individualDisplay = individualFormatter.generateDisplayText({ show, track });
        
        const individualEmbedding = await openai.embeddings.create({
          model: "text-embedding-3-small",
          input: individualContent,
          dimensions: 1536
        });

        searchIndexData.push({
          entityType: "show",
          entityId: show.id,
          entitySlug: show.slug || show.id,
          displayText: individualDisplay,
          content: individualContent,
          embeddingSmall: individualEmbedding.data[0].embedding,
          modelUsed: "text-embedding-3-small",
          indexStrategy: "song_individual"
        });
        individualEntries++;
      }

      // 3. Segue Pair Entries
      const seguePairs = ShowSeguePairFormatter.extractSeguePairs(show);
      for (const pair of seguePairs) {
        const pairContent = pairFormatter.generateContent({ show, pair });
        const pairDisplay = pairFormatter.generateDisplayText({ show, pair });
        
        const pairEmbedding = await openai.embeddings.create({
          model: "text-embedding-3-small",
          input: pairContent,
          dimensions: 1536
        });

        searchIndexData.push({
          entityType: "show",
          entityId: show.id,
          entitySlug: show.slug || show.id,
          displayText: pairDisplay,
          content: pairContent,
          embeddingSmall: pairEmbedding.data[0].embedding,
          modelUsed: "text-embedding-3-small",
          indexStrategy: "segue_pair"
        });
        pairEntries++;
      }

      // 4. Segue Sequence Entries (3+ songs)
      const segueSequences = ShowSegueSequenceFormatter.extractSegueSequences(show);
      for (const sequence of segueSequences) {
        const sequenceContent = sequenceFormatter.generateContent({ show, sequence });
        const sequenceDisplay = sequenceFormatter.generateDisplayText({ show, sequence });
        
        const sequenceEmbedding = await openai.embeddings.create({
          model: "text-embedding-3-small",
          input: sequenceContent,
          dimensions: 1536
        });

        searchIndexData.push({
          entityType: "show",
          entityId: show.id,
          entitySlug: show.slug || show.id,
          displayText: sequenceDisplay,
          content: sequenceContent,
          embeddingSmall: sequenceEmbedding.data[0].embedding,
          modelUsed: "text-embedding-3-small",
          indexStrategy: "segue_sequence"
        });
        sequenceEntries++;
      }

      totalShows++;
      if (totalShows % 10 === 0) {
        console.log(`⚡ Processed ${totalShows}/${shows.length} shows...`);
      }

      // Batch insert every 50 shows to avoid memory issues
      if (searchIndexData.length >= 500) {
        await bulkInsertSearchData(searchIndexData);
        searchIndexData.length = 0; // Clear array
      }

    } catch (error) {
      console.error(`❌ Failed processing show ${show.date}:`, error instanceof Error ? error.message : error);
    }
  }

  // Insert any remaining data
  if (searchIndexData.length > 0) {
    await bulkInsertSearchData(searchIndexData);
  }

  // Final statistics
  console.log(`\n✨ Indexing Complete!`);
  console.log(`📈 Statistics:`);
  console.log(`   Shows processed: ${totalShows}/${shows.length}`);
  console.log(`   Date/venue entries: ${dateVenueEntries}`);
  console.log(`   Individual song entries: ${individualEntries}`);
  console.log(`   Segue pair entries: ${pairEntries}`);
  console.log(`   Segue sequence entries: ${sequenceEntries}`);
  console.log(`   Total search entries: ${dateVenueEntries + individualEntries + pairEntries + sequenceEntries}`);

  // Verify multi-entry indexing
  const strategyStats = await db.$queryRaw<Array<{ index_strategy: string; count: bigint }>>`
    SELECT index_strategy, COUNT(*) as count
    FROM search_indexes 
    WHERE entity_type = 'show'
    GROUP BY index_strategy
    ORDER BY index_strategy
  `;

  console.log(`\n📊 Index Strategy Breakdown:`);
  for (const stat of strategyStats) {
    console.log(`   ${stat.index_strategy}: ${Number(stat.count)} entries`);
  }
}

async function bulkInsertSearchData(data: SearchIndexData[]): Promise<void> {
  if (data.length === 0) return;

  // Build bulk insert SQL
  const values = data
    .map((_item, index) => {
      const paramBase = index * 9;
      return `(
        $${paramBase + 1}, 
        $${paramBase + 2}::uuid, 
        $${paramBase + 3}, 
        $${paramBase + 4}, 
        $${paramBase + 5}, 
        $${paramBase + 6}::vector(1536),
        $${paramBase + 7}::vector(3072),
        $${paramBase + 8},
        $${paramBase + 9}
      )`;
    })
    .join(", ");

  const params = data.flatMap((item) => [
    item.entityType,
    item.entityId,
    item.entitySlug,
    item.displayText,
    item.content,
    JSON.stringify(item.embeddingSmall),
    item.embeddingLarge ? JSON.stringify(item.embeddingLarge) : null,
    item.modelUsed,
    item.indexStrategy || 'date_venue',
  ]);

  const query = `
    INSERT INTO search_indexes (
      entity_type, entity_id, entity_slug, display_text, content, 
      embedding_small, embedding_large, model_used, index_strategy
    )
    VALUES ${values}
  `;

  await db.$executeRawUnsafe(query, ...params);
  console.log(`💾 Inserted ${data.length} search entries`);
}

indexShows()
  .catch(console.error)
  .finally(() => db.$disconnect());