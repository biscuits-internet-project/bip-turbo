import { createClient, type RedisClientType } from "redis";

export class RedisService {
  private client!: RedisClientType;
  private isConnected = false;

  constructor(private readonly url: string) {
    if (!url) {
      throw new Error("Redis URL is required");
    }
    this.client = createClient({ url: this.url });
  }

  async connect(): Promise<void> {
    if (!this.isConnected) {
      await this.client.connect();
      this.isConnected = true;
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
