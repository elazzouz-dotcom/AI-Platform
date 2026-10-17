/**
 * Caching System
 * In-memory cache with TTL support
 */

interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttl: number;
}

class Cache {
  private store = new Map<string, CacheEntry<any>>();
  private cleanupInterval = 60000; // 1 minute

  constructor() {
    this.startCleanup();
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.store.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl * 1000) {
      this.store.delete(key);
      return null;
    }

    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttl: number = 3600): Promise<void> {
    this.store.set(key, {
      value,
      timestamp: Date.now(),
      ttl
    });
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }

  async clear(): Promise<void> {
    this.store.clear();
  }

  private startCleanup(): void {
    setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.store.entries()) {
        if (now - entry.timestamp > entry.ttl * 1000) {
          this.store.delete(key);
        }
      }
    }, this.cleanupInterval);
  }
}

export const cache = new Cache();