import type { Logger } from "@bip/domain";
import OpenAI from "openai";

export interface EmbeddingResult {
  embedding: number[];
  tokens: number;
}

export class EmbeddingService {
  private openai: OpenAI;
  private readonly model = "text-embedding-3-small";
  private readonly dimensions = 1536;

  constructor(
    private readonly logger: Logger,
    apiKey?: string,
  ) {
    this.openai = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Generate embedding for a single text input
   */
  async generateEmbedding(text: string): Promise<EmbeddingResult> {
    try {
      const response = await this.openai.embeddings.create({
        model: this.model,
        input: text,
        dimensions: this.dimensions,
      });

      const embedding = response.data[0].embedding;
      const tokens = response.usage?.total_tokens || 0;

      return {
        embedding,
        tokens,
      };
    } catch (error) {
      this.logger.error(
        `Failed to generate embedding for text (${text.length} chars): ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      throw new Error(`Embedding generation failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Generate embeddings for multiple text inputs in a batch
   * Note: OpenAI API supports up to 2048 inputs per request
   */
  async generateEmbeddings(texts: string[]): Promise<EmbeddingResult[]> {
    if (texts.length === 0) {
      return [];
    }

    if (texts.length > 2048) {
      throw new Error("Too many texts for batch embedding (max 2048)");
    }

    try {
      this.logger.info(`Generating embeddings for ${texts.length} texts`);

      const response = await this.openai.embeddings.create({
        model: this.model,
        input: texts,
        dimensions: this.dimensions,
      });

      const totalTokens = response.usage?.total_tokens || 0;
      this.logger.info(`Generated ${texts.length} embeddings with ${totalTokens} total tokens`);

      return response.data.map((item) => ({
        embedding: item.embedding,
        tokens: totalTokens / texts.length, // Approximate tokens per embedding
      }));
    } catch (error) {
      this.logger.error(
        `Failed to generate batch embeddings for ${texts.length} texts: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      throw new Error(`Batch embedding generation failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Process large batches of texts by chunking them into smaller batches
   */
  async generateEmbeddingsInBatches(
    texts: string[],
    batchSize: number = 100,
    delayMs: number = 100,
  ): Promise<EmbeddingResult[]> {
    const results: EmbeddingResult[] = [];

    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);

      this.logger.info(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(texts.length / batchSize)}`);

      const batchResults = await this.generateEmbeddings(batch);
      results.push(...batchResults);

      // Add delay between batches to respect rate limits
      if (i + batchSize < texts.length && delayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    return results;
  }

  /**
   * Estimate the cost of embedding generation
   * text-embedding-3-small: $0.00002 per 1K tokens
   */
  estimateCost(texts: string[]): { estimatedTokens: number; estimatedCostUSD: number } {
    // Rough estimation: ~4 characters per token
    const estimatedTokens = texts.reduce((sum, text) => sum + Math.ceil(text.length / 4), 0);
    const estimatedCostUSD = (estimatedTokens / 1000) * 0.00002;

    return {
      estimatedTokens,
      estimatedCostUSD,
    };
  }
}
