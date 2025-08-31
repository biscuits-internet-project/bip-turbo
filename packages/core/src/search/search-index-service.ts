import type { Logger } from "@bip/domain";
import type { EmbeddingService } from "./embedding-service";
import type { SearchIndexRepository, SearchResult } from "./search-index-repository";

export interface SearchQuery {
  query: string;
  entityTypes?: string[];
  limit?: number;
  threshold?: number;
  useModel?: "small" | "large";
}

export interface SearchResultWithScore extends SearchResult {
  score: number; // Normalized score 0-100
}

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
  private contentFormatters = new Map<string, ContentFormatter>();

  constructor(
    private readonly repository: SearchIndexRepository,
    private readonly embeddingService: EmbeddingService,
    private readonly logger: Logger,
  ) {}

  /**
   * Register a content formatter for an entity type
   */
  registerContentFormatter(formatter: ContentFormatter): void {
    this.contentFormatters.set(formatter.entityType, formatter);
    this.logger.info(`Registered content formatter for entity type: ${formatter.entityType}`);
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

      // Convert similarity to a 0-100 score for better UX
      const resultsWithScore = results.map((result) => ({
        ...result,
        score: Math.round(result.similarity * 100),
      }));

      this.logger.info(`Search completed. Found ${resultsWithScore.length} results`);

      return resultsWithScore;
    } catch (error) {
      this.logger.error(
        `Search failed for query "${query}": ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      throw new Error(`Search failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Index a single entity
   */
  async indexEntity(entity: Record<string, unknown>, entityType: string): Promise<void> {
    const formatter = this.contentFormatters.get(entityType);
    if (!formatter) {
      throw new Error(`No content formatter registered for entity type: ${entityType}`);
    }

    const entityId = entity.id as string;
    if (!entityId) {
      throw new Error(`Entity must have an id field for indexing`);
    }

    try {
      // Generate content using the registered formatter
      const displayText = formatter.generateDisplayText(entity);
      const content = formatter.generateContent(entity);

      // Generate embedding for the content (using small model by default)
      const { embedding } = await this.embeddingService.generateEmbedding(content);

      // Upsert index entry with small embedding
      await this.repository.upsert({
        entityType,
        entityId,
        entitySlug: (entity.slug as string) || entityId, // Use slug if available, fallback to ID
        displayText,
        content,
        embeddingSmall: embedding,
        embeddingLarge: undefined, // Can be added later if needed
        modelUsed: "text-embedding-3-small",
      });

      this.logger.info(`Successfully indexed ${entityType} ${entityId}`);
    } catch (error) {
      this.logger.error(
        `Failed to index ${entityType} ${entityId}: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      throw error;
    }
  }

  /**
   * Index with a specific formatter (bypasses registration)
   */
  async indexWithFormatter(
    entity: Record<string, unknown>, 
    formatter: ContentFormatter,
    overrideEntityType?: string
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

      this.logger.info(`Successfully indexed ${entityType} ${entityId} using ${formatter.constructor.name}`);
    } catch (error) {
      this.logger.error(
        `Failed to index ${entityId}: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
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

  /**
   * Get a list of registered content formatters
   */
  getRegisteredEntityTypes(): string[] {
    return Array.from(this.contentFormatters.keys());
  }
}
