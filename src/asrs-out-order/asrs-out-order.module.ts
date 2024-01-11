import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsrsOutOrder } from './entities/asrs-out-order.entity';
import { AsrsOutOrderController } from './asrs-out-order.controller';
import { AsrsOutOrderService } from './asrs-out-order.service';
import { MqttModule } from '../mqtt.module';
import { AsrsHistoryService } from '../asrs-history/asrs-history.service';
import { SkidPlatformHistoryService } from '../skid-platform-history/skid-platform-history.service';
import { AsrsHistory } from '../asrs-history/entities/asrs-history.entity';
import { Asrs } from '../asrs/entities/asrs.entity';
import { Awb } from '../awb/entities/awb.entity';
import { SkidPlatformHistory } from '../skid-platform-history/entities/skid-platform-history.entity';
import { RedisService } from '../redis/redis.service';
import { redisCustomProvider } from '../redis/redisCustomProvider';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AsrsOutOrder,
      AsrsHistory,
      Asrs,
      Awb,
      SkidPlatformHistory,
      AsrsOutOrder,
    ]),
    // mqtt 모듈설정
    MqttModule,
  ],
  controllers: [AsrsOutOrderController],
  providers: [
    AsrsOutOrderService,
    AsrsHistoryService,
    SkidPlatformHistoryService,
    RedisService,
    ...redisCustomProvider,
  ],
})
export class AsrsOutOrderModule {}
