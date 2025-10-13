interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class CacheService {
  private cache: Map<string, CacheEntry<any>>;
  private readonly defaultTTL: number;

  constructor(defaultTTLMinutes: number = 5) {
    this.cache = new Map();
    this.defaultTTL = defaultTTLMinutes * 60 * 1000;
  }

  set<T>(key: string, data: T, ttlMinutes?: number): void {
    const ttl = ttlMinutes ? ttlMinutes * 60 * 1000 : this.defaultTTL;
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now() + ttl
    };
    this.cache.set(key, entry);
    console.log(`[Cache] Dados armazenados: ${key} (expira em ${ttlMinutes || 5} minutos)`);
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      console.log(`[Cache] Miss: ${key}`);
      return null;
    }

    if (Date.now() > entry.timestamp) {
      console.log(`[Cache] Expirado: ${key}`);
      this.cache.delete(key);
      return null;
    }

    console.log(`[Cache] Hit: ${key}`);
    return entry.data as T;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    if (Date.now() > entry.timestamp) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  clear(): void {
    this.cache.clear();
    console.log('[Cache] Cache limpo completamente');
  }

  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      console.log(`[Cache] Removido: ${key}`);
    }
    return deleted;
  }

  getStats(): { size: number; keys: string[] } {
    const validKeys: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (Date.now() <= entry.timestamp) {
        validKeys.push(key);
      }
    }

    return {
      size: validKeys.length,
      keys: validKeys
    };
  }
}

export const cacheService = new CacheService(5);
