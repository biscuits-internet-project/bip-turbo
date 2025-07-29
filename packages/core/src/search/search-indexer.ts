import type { Show, Song, Track, Venue } from "@bip/domain";
import type { SearchIndexService } from "./search-index-service";

export type IndexableEntity = Show | Song | Venue | Track;
export type EntityType = "show" | "song" | "venue" | "track";

export interface IndexUpdateEvent {
  type: "create" | "update" | "delete";
  entityType: EntityType;
  entityId: string;
  entity?: IndexableEntity;
}

export class SearchIndexer {
  public searchIndexService!: SearchIndexService;

  constructor(searchIndexService?: SearchIndexService) {
    if (searchIndexService) {
      this.searchIndexService = searchIndexService;
    }
  }

  /**
   * Handle a single entity update
   */
  async handleEntityUpdate(event: IndexUpdateEvent): Promise<void> {
    const { type, entityType, entityId, entity } = event;

    try {
      if (type === "delete") {
        await this.searchIndexService.removeEntity(entityType, entityId);
      } else if (type === "create" || type === "update") {
        if (!entity) {
          throw new Error(`Entity required for ${type} operation`);
        }
        await this.searchIndexService.indexEntity(entityType, entityId);
      }
    } catch (error) {
      // Log error but don't throw to avoid breaking the main operation
      console.error(`Failed to index ${entityType} ${entityId}:`, error);
    }
  }

  /**
   * Bulk update multiple entities at once
   */
  async handleBulkUpdate(events: IndexUpdateEvent[]): Promise<void> {
    const results = await Promise.allSettled(events.map((event) => this.handleEntityUpdate(event)));

    // Log any failures
    results.forEach((result, index) => {
      if (result.status === "rejected") {
        const event = events[index];
        console.error(`Bulk index update failed for ${event.entityType} ${event.entityId}:`, result.reason);
      }
    });
  }

  /**
   * Rebuild the entire search index for a specific entity type
   */
  async rebuildIndex(entityType: EntityType, entities: Array<{ id: string; data: IndexableEntity }>): Promise<void> {
    try {
      await this.searchIndexService.rebuildIndex(entityType, entities);
    } catch (error) {
      console.error(`Failed to rebuild search index for ${entityType}:`, error);
      throw error;
    }
  }

  /**
   * Get index health status
   */
  async getIndexHealth(): Promise<{
    isHealthy: boolean;
    totalItems: number;
    itemsByType: Record<string, number>;
    lastUpdateTime?: Date;
  }> {
    try {
      const stats = await this.searchIndexService.getStats();
      return {
        isHealthy: stats.isVectorExtensionAvailable,
        totalItems: stats.totalCount,
        itemsByType: stats.countsByType,
        lastUpdateTime: new Date(), // Could be enhanced to track actual last update time
      };
    } catch (error) {
      console.error("Failed to get index health:", error);
      return {
        isHealthy: false,
        totalItems: 0,
        itemsByType: {},
      };
    }
  }
}
