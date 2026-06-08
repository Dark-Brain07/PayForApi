export class CacheManager {
  private static instance: CacheManager;
  private cache: Map<string, { value: any; expiry: number }>;
  private constructor() {
    this.cache = new Map();
  }
  public static getInstance(): CacheManager {
    if (!CacheManager.instance) CacheManager.instance = new CacheManager();
    return CacheManager.instance;
  }
  public set(key: string, value: any, ttlMs: number = 60000) {
    this.cache.set(key, { value, expiry: Date.now() + ttlMs });
  }
  public get(key: string) {
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