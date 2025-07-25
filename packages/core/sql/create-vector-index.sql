-- Create pgvector extension if not exists
CREATE EXTENSION IF NOT EXISTS vector;

-- Create IVFFlat index for embedding similarity search
-- This should be run after the search_indexes table is created via Prisma migration
-- IVFFlat is optimized for high-dimensional vector similarity search

-- For datasets with < 1M rows, lists = rows / 1000 is recommended
-- For larger datasets, use lists = sqrt(rows)
-- Starting with 100 lists, can be adjusted later based on data volume

CREATE INDEX CONCURRENTLY IF NOT EXISTS search_indexes_embedding_ivfflat_idx 
ON search_indexes 
USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);

-- Alternative: HNSW index (generally faster queries, slower inserts)
-- Uncomment if you prefer HNSW over IVFFlat:
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS search_indexes_embedding_hnsw_idx 
-- ON search_indexes 
-- USING hnsw (embedding vector_cosine_ops) 
-- WITH (m = 16, ef_construction = 64);

-- Note: You should run VACUUM ANALYZE after creating the index and loading data
-- This helps the query planner make better decisions about using the vector index