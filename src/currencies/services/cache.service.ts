import { Injectable, Inject } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheService: Cache) {}

  async getOrSet<T>(key: string, ttl: number = 0, getData: () => Promise<T>) {
    const cachedData = await this.cacheService.get<T>(key);
    if (cachedData) {
      return cachedData;
    }

    const data = await getData();
    await this.cacheService.set(key, data, ttl * 1000);
    return data;
  }
}
