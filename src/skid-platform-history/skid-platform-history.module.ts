import { Module } from '@nestjs/common';
import { SkidPlatformHistoryService } from './skid-platform-history.service';
import { SkidPlatformHistoryController } from './skid-platform-history.controller';
import { SkidPlatformHistory } from './entities/skid-platform-history.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsrsOutOrder } from '../asrs-out-order/entities/asrs-out-order.entity';
import { MqttModule } from '../mqtt.module';
import { RedisService } from '../redis/redis.service';
import { redisProvider } from '../redis/redis.provider';
import { Awb } from '../awb/entities/awb.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SkidPlatformHistory, AsrsOutOrder, Awb]),
    MqttModule,
  ],
  controllers: [SkidPlatformHistoryController],
  providers: [SkidPlatformHistoryService, RedisService, ...redisProvider],
})
export class SkidPlatformHistoryModule {}
