import { createClient, type RedisClientType } from "redis";

export class RedisService {
  private client!: RedisClientType;
  private isConnected = false;

  constructor(private readonly url: string) {
    if (!url) {
      throw new Error("Redis URL is required");
    }
    this.client = createClient({ 
      url: this.url,
      // Add reconnection strategy to handle disconnections gracefully
      socket: {
        reconnectStrategy: (retries: number) => {
          if (retries > 10) {
            return new Error("Max reconnection attempts reached");
          }
          return Math.min(retries * 100, 3000);
        }
      }
    });
    
    // Handle connection errors to prevent unhandled rejections
    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });
  }

  async connect(): Promise<void> {
    if (!this.isConnected) {
      await this.client.connect();
      this.isConnected = true;
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.client.disconnect();
      this.isConnected = false;
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
    if (!this.isConnected) {
      throw new Error("Redis client not connected. Call connect() first");
    }
    return this.client;
  }
}
