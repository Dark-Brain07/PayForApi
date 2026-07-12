const DEFAULT_TTL_MS = 60000;

export class CacheManager {
  private static instance: CacheManager;
  private cache: Map<string, { value: unknown; expiry: number }>;
  private constructor() {
    this.cache = new Map();
  }
  public static getInstance(): CacheManager {
    if (!CacheManager.instance) CacheManager.instance = new CacheManager();
    return CacheManager.instance;
  }
  public set(key: string, value: unknown, ttlMs: number = DEFAULT_TTL_MS) {
    this.cache.set(key, { value, expiry: Date.now() + ttlMs });
  }
  public get(key: string): unknown {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }
}
export const cacheManagerInstance = CacheManager.getInstance();