import type { DbClient } from "../_shared/database/models";

export interface SearchIndexData {
	id?: string;
	entityType: string;
	entityId: string;
	displayText: string;
	content: string;
	embeddingSmall: number[];
	embeddingLarge?: number[];
	modelUsed: string;
}

export interface SearchResult {
	id: string;
	entityType: string;
	entityId: string;
	displayText: string;
	content: string;
	similarity: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface SearchOptions {
	entityTypes?: string[];
	limit?: number;
	threshold?: number; // Minimum similarity score (0-1)
	useModel?: 'small' | 'large'; // Which embedding model to use for search
}

export class SearchIndexRepository {
	constructor(private readonly db: DbClient) {}

	/**
	 * Create a new search index entry using raw SQL
	 */
	async create(data: SearchIndexData): Promise<void> {
		await this.db.$executeRaw`
			INSERT INTO search_indexes (entity_type, entity_id, display_text, content, embedding_small, embedding_large, model_used)
			VALUES (
				${data.entityType}, 
				${data.entityId}::uuid, 
				${data.displayText}, 
				${data.content}, 
				${JSON.stringify(data.embeddingSmall)}::vector(1536),
				${data.embeddingLarge ? JSON.stringify(data.embeddingLarge) : null}::vector(3072),
				${data.modelUsed}
			)
		`;
	}

	/**
	 * Create multiple search index entries in a batch using raw SQL
	 */
	async createMany(dataArray: SearchIndexData[]): Promise<void> {
		if (dataArray.length === 0) return;

		// Build bulk insert SQL with VALUES clause
		const values = dataArray.map((data, index) => {
			const paramBase = index * 7; // 7 parameters per record
			return `(
				$${paramBase + 1}, 
				$${paramBase + 2}::uuid, 
				$${paramBase + 3}, 
				$${paramBase + 4}, 
				$${paramBase + 5}::vector(1536),
				$${paramBase + 6}::vector(3072),
				$${paramBase + 7}
			)`;
		}).join(', ');

		// Flatten all parameters
		const params = dataArray.flatMap(data => [
			data.entityType,
			data.entityId,
			data.displayText,
			data.content,
			JSON.stringify(data.embeddingSmall),
			data.embeddingLarge ? JSON.stringify(data.embeddingLarge) : null,
			data.modelUsed
		]);

		const query = `
			INSERT INTO search_indexes (entity_type, entity_id, display_text, content, embedding_small, embedding_large, model_used)
			VALUES ${values}
		`;

		await this.db.$executeRawUnsafe(query, ...params);
	}

	/**
	 * Update an existing search index entry
	 */
	async update(id: string, data: Partial<SearchIndexData>): Promise<void> {
		const updateData: any = {};

		if (data.displayText !== undefined)
			updateData.displayText = data.displayText;
		if (data.content !== undefined) updateData.content = data.content;
		if (data.embeddingSmall !== undefined) updateData.embeddingSmall = data.embeddingSmall;
		if (data.embeddingLarge !== undefined) updateData.embeddingLarge = data.embeddingLarge;
		if (data.modelUsed !== undefined) updateData.modelUsed = data.modelUsed;

		await this.db.searchIndex.update({
			where: { id },
			data: updateData,
		});
	}

	/**
	 * Delete search index entries by entity
	 */
	async deleteByEntity(entityType: string, entityId: string): Promise<void> {
		await this.db.searchIndex.deleteMany({
			where: {
				entityType,
				entityId,
			},
		});
	}

	/**
	 * Delete all search index entries for an entity type
	 */
	async deleteByEntityType(entityType: string): Promise<void> {
		await this.db.$executeRaw`
			DELETE FROM search_indexes WHERE entity_type = ${entityType}
		`;
	}

	/**
	 * Delete all search index entries
	 */
	async deleteAll(): Promise<void> {
		await this.db.$executeRaw`TRUNCATE TABLE search_indexes`;
	}

	/**
	 * Perform vector similarity search
	 */
	async search(
		queryEmbedding: number[],
		options: SearchOptions = {},
	): Promise<SearchResult[]> {
		const { entityTypes, limit = 20, threshold = 0.0, useModel = 'small' } = options;

		// Choose embedding field based on model
		const embeddingField = useModel === 'large' ? 'embedding_large' : 'embedding_small';

		// Build the query dynamically based on filters
		const whereConditions = [];
		const queryParams: any[] = [queryEmbedding];
		let paramIndex = 1;

		if (entityTypes && entityTypes.length > 0) {
			whereConditions.push(`"entity_type" = ANY($${++paramIndex})`);
			queryParams.push(entityTypes);
		}

		if (threshold > 0) {
			whereConditions.push(
				`1 - (${embeddingField} <=> $1::vector) >= $${++paramIndex}`,
			);
			queryParams.push(threshold);
		}

		// Only search records that have the requested embedding type
		if (useModel === 'large') {
			whereConditions.push(`${embeddingField} IS NOT NULL`);
		}

		const whereClause =
			whereConditions.length > 0
				? `WHERE ${whereConditions.join(" AND ")}`
				: "";

		// Perform vector similarity search using cosine distance
		// Note: We use 1 - cosine_distance to get similarity (higher = more similar)
		const query = `
      SELECT 
        id,
        entity_type as "entityType",
        entity_id as "entityId", 
        display_text as "displayText",
        content,
        model_used as "modelUsed",
        created_at as "createdAt",
        updated_at as "updatedAt",
        1 - (${embeddingField} <=> $1::vector) as similarity
      FROM search_indexes
      ${whereClause}
      ORDER BY ${embeddingField} <=> $1::vector
      LIMIT $${++paramIndex}
    `;

		queryParams.push(limit);

		const results = await this.db.$queryRawUnsafe<SearchResult[]>(
			query,
			...queryParams,
		);

		return results.map((result) => ({
			...result,
			similarity: Number(result.similarity),
			createdAt: new Date(result.createdAt),
			updatedAt: new Date(result.updatedAt),
		}));
	}

	/**
	 * Find existing search index entry by entity
	 */
	async findByEntity(
		entityType: string,
		entityId: string,
	): Promise<SearchResult | null> {
		const result = await this.db.searchIndex.findFirst({
			where: {
				entityType,
				entityId,
			},
		});

		if (!result) return null;

		return {
			id: result.id,
			entityType: result.entityType,
			entityId: result.entityId,
			displayText: result.displayText,
			content: result.content,
			similarity: 1.0, // Not applicable for direct lookup
			createdAt: result.createdAt,
			updatedAt: result.updatedAt,
		};
	}

	/**
	 * Get count of indexed items by entity type
	 */
	async getCountByEntityType(): Promise<Record<string, number>> {
		const results = await this.db.searchIndex.groupBy({
			by: ["entityType"],
			_count: {
				id: true,
			},
		});

		return results.reduce(
			(acc, result) => {
				acc[result.entityType] = result._count.id;
				return acc;
			},
			{} as Record<string, number>,
		);
	}

	/**
	 * Get total count of all indexed items
	 */
	async getTotalCount(): Promise<number> {
		return await this.db.searchIndex.count();
	}

	/**
	 * Get indexing statistics by entity type
	 */
	async getStats(): Promise<Record<string, number>> {
		const results = await this.db.$queryRaw<Array<{entity_type: string, count: bigint}>>`
			SELECT entity_type, COUNT(*) as count 
			FROM search_indexes 
			GROUP BY entity_type
		`;
		
		return results.reduce((acc, row) => {
			acc[row.entity_type] = Number(row.count);
			return acc;
		}, {} as Record<string, number>);
	}

	/**
	 * Check if pgvector extension is available
	 */
	async checkVectorExtension(): Promise<boolean> {
		try {
			const result = await this.db.$queryRaw<{ exists: boolean }[]>`
        SELECT EXISTS(
          SELECT 1 FROM pg_extension WHERE extname = 'vector'
        ) as exists
      `;
			return result[0]?.exists || false;
		} catch (error) {
			return false;
		}
	}

	/**
	 * Create vector index if it doesn't exist
	 * Note: This should typically be done via migration, but included for completeness
	 */
	async createVectorIndex(): Promise<void> {
		try {
			await this.db.$executeRaw`
        CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_search_embedding 
        ON "search_indexes" USING ivfflat (embedding vector_cosine_ops)
        WITH (lists = 100)
      `;
		} catch (error) {
			// Index might already exist or we might not have permissions
			console.warn("Could not create vector index:", error);
		}
	}
}
