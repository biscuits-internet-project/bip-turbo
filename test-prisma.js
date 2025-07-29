const { PrismaClient } = require('@prisma/client');

async function test() {
  const db = new PrismaClient();
  
  console.log('Testing Prisma client...');
  
  try {
    // Test if searchIndex exists
    console.log('searchIndex model exists:', typeof db.searchIndex);
    
    // Try to count records
    const count = await db.searchIndex.count();
    console.log('Current searchIndex count:', count);
    
    // Test raw SQL insert
    console.log('Testing raw SQL...');
    const result = await db.$queryRaw`
      INSERT INTO search_indexes (entity_type, entity_id, display_text, content, embedding_small, model_used)
      VALUES ('test', '123e4567-e89b-12d3-a456-426614174000', 'Test Item', 'This is a test', ARRAY[0.1, 0.2, 0.3]::vector(1536), 'text-embedding-3-small')
      RETURNING id
    `;
    console.log('Raw SQL result:', result);
    console.log('Test successful!');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await db.$disconnect();
  }
}

test();