import { Controller, Get, Post } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RedisContext,
} from '@nestjs/microservices';
import { RedisCacheService } from './redis.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('redis')
@Controller('/redis')
export class RedisController {
  constructor(private readonly cacheManager: RedisCacheService) {}

  @MessagePattern('notifications') //구독하는 주제1
  getNotifications(@Payload() data: number[], @Ctx() context: RedisContext) {
    console.log(`Channel: ${context.getChannel()}`);
  }

  @Post()
  async setRedis() {
    const setResult = await this.cacheManager.set('key', 'value');
    console.log(setResult);
  }

  @Get()
  async getRedis() {
    const value = await this.cacheManager.get('key');
    console.log(value);
  }
}
