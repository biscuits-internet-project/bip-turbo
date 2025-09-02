import type { Logger } from "@bip/domain";
import type { EmbeddingService } from "./embedding-service";
import type { SearchIndexRepository, SearchResult } from "./search-index-repository";
import { SearchResultAggregator, type SearchResultWithScore } from "./search-result-aggregator";

export interface SearchQuery {
  query: string;
  entityTypes?: string[];
  limit?: number;
  threshold?: number;
  useModel?: "small" | "large";
}

// Re-export from aggregator
export type { SearchResultWithScore };

export interface IndexStats {
  totalCount: number;
  countsByType: Record<string, number>;
  isVectorExtensionAvailable: boolean;
}

export interface ContentFormatter {
  entityType: string;
  generateDisplayText(entity: Record<string, unknown>): string;
  generateContent(entity: Record<string, unknown>): string;
}

export class SearchIndexService {
  private readonly resultAggregator: SearchResultAggregator;

  constructor(
    private readonly repository: SearchIndexRepository,
    private readonly embeddingService: EmbeddingService,
    private readonly logger: Logger,
  ) {
    this.resultAggregator = new SearchResultAggregator();
  }

  /**
   * Perform semantic search
   */
  async search(searchQuery: SearchQuery): Promise<SearchResultWithScore[]> {
    const { query, entityTypes, limit = 20, threshold = 0.3, useModel = "small" } = searchQuery;

    this.logger.info(`Performing search for query: "${query}" using ${useModel} model`);

    try {
      // Generate embedding for the search query using the appropriate model
      // Note: We need to ensure the embedding service uses the same model as requested
      const { embedding } = await this.embeddingService.generateEmbedding(query);

      // Perform vector similarity search
      const results = await this.repository.search(embedding, {
        entityTypes,
        limit,
        threshold,
        useModel,
      });

      // Convert similarity to a 0-100 score for better UX with hybrid scoring
      const resultsWithScore = results.map((result) => {
        let score = Math.round(result.similarity * 100);
        
        // Apply hybrid scoring for segue searches
        if (query.includes(' > ') && result.indexStrategy === 'segue_pair') {
          score = this.calculateSegueMatchScore(query, result.content || '');
        }
        // Apply hybrid scoring for regular song searches
        else if (!query.includes(' > ') && (result.indexStrategy === 'song_individual' || result.indexStrategy === 'segue_pair')) {
          score = this.calculateSongMatchScore(query, result.content || '', result.displayText || '');
        }
        
        return {
          ...result,
          score,
        };
      });

      // Aggregate results by entityId to handle multiple entries per show
      const aggregatedResults = this.resultAggregator.aggregate(resultsWithScore);

      this.logger.info(
        `Search completed. Found ${resultsWithScore.length} raw results, ${aggregatedResults.length} unique entities`,
      );

      return aggregatedResults;
    } catch (error) {
      this.logger.error(
        `Search failed for query "${query}": ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      throw new Error(`Search failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Update search result aggregation weights
   */
  updateAggregationWeights(weights: Record<string, number>): void {
    this.resultAggregator.updateWeights(weights);
    this.logger.info(`Updated search aggregation weights: ${JSON.stringify(weights)}`);
  }

  /**
   * Get current aggregation weights
   */
  getAggregationWeights(): Record<string, number> {
    return this.resultAggregator.getWeights();
  }

  /**
   * Index with a specific formatter (bypasses registration)
   */
  async indexWithFormatter(
    entity: Record<string, unknown>,
    formatter: ContentFormatter,
    overrideEntityType?: string,
  ): Promise<void> {
    const entityId = entity.id as string;
    if (!entityId) {
      throw new Error(`Entity must have an id field for indexing`);
    }

    try {
      // Generate content using the provided formatter
      const displayText = formatter.generateDisplayText(entity);
      const content = formatter.generateContent(entity);

      // Generate embedding for the content
      const { embedding } = await this.embeddingService.generateEmbedding(content);

      // Use override entity type if provided, otherwise use formatter's type
      const entityType = overrideEntityType || formatter.entityType;

      // Upsert index entry
      await this.repository.upsert({
        entityType,
        entityId,
        entitySlug: (entity.slug as string) || entityId,
        displayText,
        content,
        embeddingSmall: embedding,
        embeddingLarge: undefined,
        modelUsed: "text-embedding-3-small",
      });
    } catch (error) {
      this.logger.error(`Failed to index ${entityId}: ${error instanceof Error ? error.message : "Unknown error"}`);
      throw error;
    }
  }

  /**
   * Index multiple entities of the same type in batch
   */
  async indexEntities(entityType: string, entities: Record<string, unknown>[]): Promise<void> {
    const formatter = this.contentFormatters.get(entityType);
    if (!formatter) {
      throw new Error(`No content formatter registered for entity type: ${entityType}`);
    }

    if (entities.length === 0) {
      return;
    }

    this.logger.info(`Starting batch indexing of ${entities.length} ${entityType} entities`);

    try {
      // Generate content for all entities
      const contents = entities.map((entity) => formatter.generateContent(entity));
      const displayTexts = entities.map((entity) => formatter.generateDisplayText(entity));

      // Generate embeddings in batch
      const embeddingResults = await this.embeddingService.generateEmbeddingsInBatches(contents);

      // Prepare data for batch insert
      const indexData = entities.map((entity, index) => ({
        entityType,
        entityId: entity.id as string,
        entitySlug: (entity.slug as string) || (entity.id as string), // Use slug if available, fallback to ID
        displayText: displayTexts[index],
        content: contents[index],
        embeddingSmall: embeddingResults[index].embedding,
        embeddingLarge: undefined, // Can be added later if needed
        modelUsed: "text-embedding-3-small",
      }));

      // Create new entries in batch (using upsert logic)
      await this.repository.createMany(indexData);

      this.logger.info(`Successfully batch indexed ${entities.length} ${entityType} entities`);
    } catch (error) {
      this.logger.error(
        `Failed to batch index ${entities.length} ${entityType} entities: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      throw error;
    }
  }

  /**
   * Update an existing index entry
   */
  async updateEntity(entity: Record<string, unknown>, entityType: string): Promise<void> {
    // For now, we'll just re-index the entity
    // In the future, we could optimize this to only update if content changed
    await this.indexEntity(entity, entityType);
  }

  /**
   * Remove an entity from the search index
   */
  async removeEntity(entityType: string, entityId: string): Promise<void> {
    try {
      await this.repository.deleteByEntity(entityType, entityId);
      this.logger.info(`Removed ${entityType} ${entityId} from search index`);
    } catch (error) {
      this.logger.error(
        `Failed to remove ${entityType} ${entityId} from search index: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      throw error;
    }
  }

  /**
   * Get search index statistics
   */
  async getStats(): Promise<IndexStats> {
    try {
      const [totalCount, countsByType, isVectorExtensionAvailable] = await Promise.all([
        this.repository.getTotalCount(),
        this.repository.getCountByEntityType(),
        this.repository.checkVectorExtension(),
      ]);

      return {
        totalCount,
        countsByType,
        isVectorExtensionAvailable,
      };
    } catch (error) {
      this.logger.error(
        `Failed to get search index stats: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      throw error;
    }
  }

  /**
   * Rebuild the entire search index for a specific entity type
   */
  async rebuildIndex(entityType: string, entities: Record<string, unknown>[]): Promise<void> {
    this.logger.info(`Starting index rebuild for ${entityType}`);

    try {
      // Delete all existing entries for this entity type
      await this.repository.deleteByEntityType(entityType);

      // Re-index all entities
      await this.indexEntities(entityType, entities);

      this.logger.info(`Successfully rebuilt index for ${entityType}`);
    } catch (error) {
      this.logger.error(
        `Failed to rebuild index for ${entityType}: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      throw error;
    }
  }

  /**
   * Calculate hybrid score for song searches combining vector similarity with exact text matching
   */
  private calculateSongMatchScore(query: string, content: string, displayText: string): number {
    const queryLower = query.toLowerCase().trim();
    const contentLower = content.toLowerCase();
    const displayLower = displayText.toLowerCase();
    
    // Check for exact matches in display text (song titles)
    if (displayLower.includes(queryLower)) {
      return 95; // Exact match in song title
    }
    
    // Check for exact matches in content
    if (contentLower.includes(queryLower)) {
      return 85; // Exact match in content
    }
    
    // Check for partial word matches
    const queryWords = queryLower.split(' ').filter(w => w.length > 2); // Ignore small words
    if (queryWords.length === 0) return 30; // No meaningful words
    
    let matchCount = 0;
    
    for (const word of queryWords) {
      if (displayLower.includes(word) || contentLower.includes(word)) {
        matchCount++;
      }
    }
    
    const matchRatio = matchCount / queryWords.length;
    if (matchRatio === 1) return 90;      // All words match
    if (matchRatio >= 0.75) return 75;    // Most words match
    if (matchRatio >= 0.5) return 60;     // Half words match
    if (matchRatio > 0) return 40;        // Some words match
    
    return 25; // No exact matches, rely on vector similarity
  }

  /**
   * Calculate hybrid score for segue searches combining vector similarity with exact text matching
   */
  private calculateSegueMatchScore(query: string, content: string): number {
    // Parse the query (e.g., "basis > shanker")
    const queryParts = query.toLowerCase().split(' > ').map(part => part.trim());
    if (queryParts.length !== 2) return 50; // Default score if not a valid segue format
    
    const [queryFirstSong, querySecondSong] = queryParts;
    
    // Parse the content (e.g., "Basis For A Day > Boom Shanker") 
    const contentParts = content.split(' > ');
    if (contentParts.length !== 2) return 50; // Default score if not a valid segue format
    
    const [contentFirstSong, contentSecondSong] = contentParts.map(part => part.trim().toLowerCase());
    
    // Calculate exact match scores
    const firstSongMatch = contentFirstSong.includes(queryFirstSong) ? 50 : 0;
    const secondSongMatch = contentSecondSong.includes(querySecondSong) ? 50 : 0;
    
    // Perfect match gets 95+, partial match gets lower score
    const totalMatch = firstSongMatch + secondSongMatch;
    if (totalMatch === 100) return 95; // Both songs match
    if (totalMatch === 50) return 45;  // One song matches  
    return 25; // No exact matches, rely on vector similarity
  }

  /**
   * Initialize vector extension and indexes
   */
  async initializeVectorSupport(): Promise<void> {
    try {
      const isAvailable = await this.repository.checkVectorExtension();

      if (!isAvailable) {
        this.logger.warn("pgvector extension is not available. Vector search will not work.");
        return;
      }

      // Create vector index if it doesn't exist
      await this.repository.createVectorIndex();

      this.logger.info("Vector support initialized successfully");
    } catch (error) {
      this.logger.error(
        `Failed to initialize vector support: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      throw error;
    }
  }
}
