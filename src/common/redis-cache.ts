import Redis from 'ioredis';

export class RedisCache {
  private client: Redis | null = null;
  private defaultTtlSec: number;

  constructor(redisUrl?: string | null, defaultTtlSec = 3600) {
    this.defaultTtlSec = defaultTtlSec;
    if (redisUrl) {
      this.client = new Redis(redisUrl);
    }
  }

  isAvailable() {
    return this.client !== null;
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.client) return null;
    const v = await this.client.get(key);
    if (!v) return null;
    try {
      return JSON.parse(v) as T;
    } catch {
      return null;
    }
  }

  async set(key: string, value: unknown, ttlSec?: number): Promise<void> {
    if (!this.client) return;
    const payload = JSON.stringify(value);
    const ttl = ttlSec ?? this.defaultTtlSec;
    await this.client.set(key, payload, 'EX', Math.max(1, Math.floor(ttl)));
  }

  async del(key: string): Promise<void> {
    if (!this.client) return;
    await this.client.del(key);
  }

  async quit(): Promise<void> {
    if (!this.client) return;
    await this.client.quit();
  }
}
