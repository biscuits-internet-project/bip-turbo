import { dbClient, getContainer, getServices } from "@bip/core";
import { env } from "./apps/web/app/server/env";
import { logger } from "./apps/web/app/server/logger";

const container = getContainer({ db: dbClient, env, logger });
const services = getServices(container);

const partialTests = [
  // Full vs partial song names
  { query: "Above The Waves > Fire Will Exchange", label: "Full names" },
  { query: "Waves > Fire", label: "Short partials" },
  { query: "Above Waves > Fire Exchange", label: "Medium partials" },
  
  // Other partial tests
  { query: "Sister Judy", label: "Partial song name" },
  { query: "Sister Judy's Soul Shack", label: "Full song name" },
  
  { query: "Rockafella", label: "Full song name" },
  { query: "Rock", label: "Very short partial" },
  
  { query: "Helicopters", label: "Full song name" },
  { query: "Copters", label: "Partial song name" },
  
  // Test segue variations  
  { query: "Reactor > Caves", label: "Partial segue" },
  { query: "Reactor > Caves of the East", label: "Full segue" },
  
  // Test venue partials
  { query: "Fillmore Philadelphia", label: "Full venue + city" },
  { query: "Fillmore", label: "Just venue name" },
];

async function testPartialSearch() {
  console.log('🔍 Testing Partial Song/Venue Name Searches\n');
  
  for (const test of partialTests) {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`🔍 ${test.label.toUpperCase()}: "${test.query}"`);
    console.log('='.repeat(70));
    
    try {
      const results = await services.search.search({
        query: test.query,
        limit: 3,
        threshold: 0.25, // Lower threshold for partials
        entityTypes: ['show']
      });
      
      if (results.length === 0) {
        console.log('❌ No results found');
      } else {
        console.log(`✅ Found ${results.length} results:`);
        results.forEach((result, idx) => {
          console.log(`  ${idx + 1}. ${result.displayText} (${result.score}% match)`);
        });
      }
      
    } catch (error) {
      console.error(`❌ Search failed: ${error}`);
    }
  }
  
  // Show what's actually in the content for the NYE show
  console.log('\n' + '='.repeat(80));
  console.log('📝 NYE SHOW CONTENT SAMPLE (for reference)');
  console.log('='.repeat(80));
  
  const nyeShows = await services.search.search({
    query: "2024-12-31",
    limit: 1,
    entityTypes: ['show']
  });
  
  if (nyeShows.length > 0) {
    // Get the actual indexed content to show what we're searching against
    const searchIndex = await container.db().searchIndex.findFirst({
      where: {
        entityType: 'show',
        entityId: nyeShows[0].entityId
      }
    });
    
    if (searchIndex) {
      console.log('Content length:', searchIndex.content.length);
      console.log('Content preview (first 500 chars):');
      console.log(searchIndex.content.substring(0, 500) + '...\n');
      
      // Show segue-related content
      const segueMatches = searchIndex.content.match(/[A-Za-z\s]+ > [A-Za-z\s]+/g) || [];
      console.log('Segues found in content:', segueMatches.slice(0, 5));
    }
  }
}

testPartialSearch()
  .then(() => console.log('\n🎉 Partial search testing complete!'))
  .catch(console.error);