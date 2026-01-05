import type { CreateSearchHistory, SearchHistory, UpdateSearchHistory } from "@bip/domain";
import type { DbClient, DbSearchHistory } from "../_shared/database/models";

// Mapper function
function mapSearchHistoryToDomainEntity(dbSearchHistory: DbSearchHistory): SearchHistory {
  return {
    id: dbSearchHistory.id,
    searchQuery: dbSearchHistory.searchQuery,
    resultCount: dbSearchHistory.resultCount,
    searchType: dbSearchHistory.searchType as SearchHistory["searchType"],
    sentiment: dbSearchHistory.sentiment as SearchHistory["sentiment"],
    feedbackMessage: dbSearchHistory.feedbackMessage,
    createdAt: dbSearchHistory.createdAt,
    updatedAt: dbSearchHistory.updatedAt,
  };
}

export class SearchHistoryService {
  constructor(private readonly db: DbClient) {}

  async create(data: CreateSearchHistory): Promise<SearchHistory> {
    const result = await this.db.searchHistory.create({
      data: {
        searchQuery: data.searchQuery,
        resultCount: data.resultCount,
        searchType: data.searchType,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return mapSearchHistoryToDomainEntity(result);
  }

  async update(id: string, data: UpdateSearchHistory): Promise<SearchHistory> {
    const result = await this.db.searchHistory.update({
      where: { id },
      data: {
        sentiment: data.sentiment,
        feedbackMessage: data.feedbackMessage,
        updatedAt: new Date(),
      },
    });

    return mapSearchHistoryToDomainEntity(result);
  }
}
