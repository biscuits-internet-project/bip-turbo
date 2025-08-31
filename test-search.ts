import { dbClient, getContainer, getServices } from "@bip/core";
import { env } from "./apps/web/app/server/env";
import { logger } from "./apps/web/app/server/logger";

const container = getContainer({ db: dbClient, env, logger });
const services = getServices(container);

const testQueries = [
  // Date searches
  "NYE 2024",
  "December 2024", 
  "12/31/2024",
  "Halloween 2024",
  
  // Venue searches
  "Fillmore",
  "Philadelphia shows",
  "Silver Spring",
  
  // Song searches
  "Rockafella opener",
  "Sister Judy's encore", 
  "Helicopters",
  
  // Segue searches
  "Rockafella > Spaga",
  "Above The Waves > Fire Will Exchange",
  "segue into"
];

async function testSearch() {
  console.log('🔍 Testing Search with New Embeddings\n');
  
  for (const query of testQueries) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🔍 SEARCHING: "${query}"`);
    console.log('='.repeat(60));
    
    try {
      const results = await services.search.search({
        query,
        limit: 3,
        threshold: 0.3,
        entityTypes: ['show']
      });
      
      if (results.length === 0) {
        console.log('❌ No results found');
      } else {
        console.log(`✅ Found ${results.length} results:`);
        results.forEach((result, idx) => {
          console.log(`\n${idx + 1}. ${result.displayText} (${result.score}% match)`);
        });
      }
      
    } catch (error) {
      console.error(`❌ Search failed: ${error}`);
    }
  }
  
  // Test specific searches we know should work
  console.log('\n' + '='.repeat(80));
  console.log('🎯 SPECIFIC TESTS FOR KNOWN 2024 SHOWS');
  console.log('='.repeat(80));
  
  const specificTests = [
    {
      query: "New Years Eve Fillmore",
      expected: "2024-12-31 NYE show"
    },
    {
      query: "Sister Judy sandwich",
      expected: "Show with Sister Judy's Soul Shack sandwich"
    },
    {
      query: "Rockafella all-timer",
      expected: "Show with all-timer Rockafella"
    }
  ];
  
  for (const test of specificTests) {
    console.log(`\n🎯 Testing: "${test.query}" (expect: ${test.expected})`);
    
    const results = await services.search.search({
      query: test.query,
      limit: 1,
      entityTypes: ['show']
    });
    
    if (results.length > 0) {
      console.log(`✅ ${results[0].displayText} (${results[0].score}% match)`);
    } else {
      console.log('❌ No results');
    }
  }
}

testSearch()
  .then(() => console.log('\n🎉 Search testing complete!'))
  .catch(console.error);