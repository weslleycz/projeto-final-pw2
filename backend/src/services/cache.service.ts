import { Injectable } from '@nestjs/common';
import * as cacheManager from 'cache-manager';

@Injectable()
export class CacheService {
  private cache = cacheManager.caching('memory', {
    max: 100,
    ttl: 60 * 60 * 1000,
  });

  async get(key: string) {
    return (await this.cache).get(key);
  }

  async set(key: string, value: any) {
    return (await this.cache).set(key, value);
  }
}
