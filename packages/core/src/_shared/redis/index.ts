import { createClient, type RedisClientType } from "redis";

// Global singleton instance
let globalRedisClient: RedisClientType | null = null;
let globalIsConnected = false;

export class RedisService {
  private client: RedisClientType;

  constructor(private readonly url: string) {
    if (!url) {
      throw new Error("Redis URL is required");
    }

    // Use existing global client if available
    if (globalRedisClient) {
      this.client = globalRedisClient;
      return;
    }

    // Create new client and store globally
    this.client = createClient({
      url: this.url,
      // Add reconnection strategy to handle disconnections gracefully
      socket: {
        reconnectStrategy: (retries: number) => {
          if (retries > 10) {
            return new Error("Max reconnection attempts reached");
          }
          return Math.min(retries * 100, 3000);
        },
      },
    });

    // Handle connection errors to prevent unhandled rejections
    this.client.on("error", (err) => {
      console.error("Redis Client Error:", err);
      globalIsConnected = false;
    });

    // Store as global singleton
    globalRedisClient = this.client;
  }

  async connect(): Promise<void> {
    if (!globalIsConnected && !this.client.isOpen) {
      await this.client.connect();
      globalIsConnected = true;
    }
  }

  async disconnect(): Promise<void> {
    if (globalIsConnected && this.client.isOpen) {
      await this.client.disconnect();
      globalIsConnected = false;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    await this.connect();
    const value = await this.client.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set<T>(key: string, value: T, options?: { EX?: number }): Promise<void> {
    await this.connect();
    await this.client.set(key, JSON.stringify(value), options);
  }

  async del(key: string): Promise<void> {
    await this.connect();
    await this.client.del(key);
  }

  async delPattern(pattern: string): Promise<number> {
    await this.connect();
    const keys = await this.client.keys(pattern);
    if (keys.length === 0) return 0;
    return await this.client.del(keys);
  }

  async exists(key: string): Promise<boolean> {
    await this.connect();
    const result = await this.client.exists(key);
    return result === 1;
  }

  getClient(): RedisClientType {
    if (!globalIsConnected) {
      throw new Error("Redis client not connected. Call connect() first");
    }
    return this.client;
  }
}
