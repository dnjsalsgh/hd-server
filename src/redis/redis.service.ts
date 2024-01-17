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

  /*
    count: 제거할 요소의 수입니다.
    count > 0: 리스트의 왼쪽부터 count 개수만큼의 value를 찾아 제거합니다.
    count < 0: 리스트의 오른쪽부터 count의 절대값 만큼의 value를 찾아 제거합니다.
    count = 0: 리스트에서 value와 일치하는 모든 요소를 제거합니다.
   */
  // 리스트에서 특정 값을 제거하는 메서드
  async removeElement(key: string, count: number, value: string) {
    return await this.redis.lRem(key, count, value);
  }
}
