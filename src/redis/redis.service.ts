import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: RedisClientType,
  ) {}

  async set(key: string, value: string) {
    return await this.redis.set(key, value);
  }

  async get(key: string) {
    return await this.redis.get(key);
  }

  // Queue에 요소를 추가하는 메서드
  async push(key: string, value: string) {
    return await this.redis.rPush(key, value);
  }

  // Queue에서 요소를 제거하고 반환하는 메서드
  async pop(key: string) {
    return await this.redis.lPop(key);
  }

  // Queue의 크기를 확인하는 메서드
  async size(key: string) {
    return await this.redis.lLen(key);
  }
}
