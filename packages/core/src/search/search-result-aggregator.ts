import type { SearchResult } from "./search-index-repository";

export interface SearchResultWithScore extends SearchResult {
  score: number; // Normalized score 0-100
}

export interface AggregatorWeights {
  [indexStrategy: string]: number;
}

export const DEFAULT_INDEX_STRATEGY_WEIGHTS: AggregatorWeights = {
  segue_sequence: 3.0, // Most specific - long chains are rare and meaningful  
  segue_pair: 2.0, // Specific transitions - hybrid scoring handles exact matches now
  song_individual: 1.0, // Baseline - individual song matches
  date_venue: 1.2, // Slight boost for date/venue matches
} as const;

export class SearchResultAggregator {
  private strategyWeights: AggregatorWeights;

  constructor(weights?: AggregatorWeights) {
    this.strategyWeights = weights ?? { ...DEFAULT_INDEX_STRATEGY_WEIGHTS };
  }

  /**
   * Aggregate search results by entityId to eliminate duplicates
   * Applies weighted scoring based on index strategy and sums scores per entity
   */
  aggregate(results: SearchResultWithScore[]): SearchResultWithScore[] {
    if (results.length === 0) return results;

    // Group results by entityId
    const groupedResults = new Map<string, SearchResultWithScore[]>();

    for (const result of results) {
      const entityId = result.entityId;
      if (!groupedResults.has(entityId)) {
        groupedResults.set(entityId, []);
      }
      const entityGroup = groupedResults.get(entityId);
      if (entityGroup) {
        entityGroup.push(result);
      }
    }

    // Aggregate each group with weighted scoring
    const aggregatedResults: SearchResultWithScore[] = [];

    for (const [_entityId, entityResults] of Array.from(groupedResults.entries())) {
      const aggregatedResult = this.aggregateEntityResults(entityResults);
      aggregatedResults.push(aggregatedResult);
    }

    // Sort by aggregated score (descending)
    return aggregatedResults.sort((a, b) => b.score - a.score);
  }

  /**
   * Update strategy weights for tuning search results
   */
  updateWeights(newWeights: Partial<AggregatorWeights>): void {
    this.strategyWeights = { ...this.strategyWeights, ...newWeights };
  }

  /**
   * Get current strategy weights
   */
  getWeights(): AggregatorWeights {
    return { ...this.strategyWeights };
  }

  /**
   * Aggregate results for a single entity (show)
   */
  private aggregateEntityResults(entityResults: SearchResultWithScore[]): SearchResultWithScore {
    // Use the result with the highest individual similarity as the base
    const bestResult = entityResults.reduce((best, current) => (current.similarity > best.similarity ? current : best));

    // Calculate weighted similarity sum
    let weightedSimilaritySum = 0;
    let weightedScoreSum = 0;
    let totalWeight = 0;

    for (const result of entityResults) {
      const weight = this.getStrategyWeight(result.indexStrategy);
      weightedSimilaritySum += result.similarity * weight;
      weightedScoreSum += result.score * weight;
      totalWeight += weight;
    }

    // Create aggregated result with honest scoring
    // Take the weighted average but add a small bonus for having multiple matches
    const baseScore = weightedScoreSum / totalWeight;
    const multiMatchBonus = Math.min((entityResults.length - 1) * 5, 15); // Small bonus for multiple matches
    const finalScore = Math.min(Math.round(baseScore + multiMatchBonus), 100);

    const aggregatedResult: SearchResultWithScore = {
      ...bestResult,
      similarity: Math.min(weightedSimilaritySum / totalWeight, 1.0), // Normalize and cap at 1.0
      score: finalScore,
    };

    return aggregatedResult;
  }

  /**
   * Get weight for a specific index strategy
   */
  private getStrategyWeight(indexStrategy?: string): number {
    if (!indexStrategy) return 1.0;
    return this.strategyWeights[indexStrategy] ?? 1.0;
  }
}
