import { Module } from '@nestjs/common';
import { redisCustomProvider } from './redisCustomProvider';
import { RedisService } from './redis.service';

@Module({
  providers: [...redisCustomProvider, RedisService],
  exports: [...redisCustomProvider],
})
export class RedisModule {}
