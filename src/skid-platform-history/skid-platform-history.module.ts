import { Module } from '@nestjs/common';
import { SkidPlatformHistoryService } from './skid-platform-history.service';
import { SkidPlatformHistoryController } from './skid-platform-history.controller';
import { SkidPlatformHistory } from './entities/skid-platform-history.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsrsOutOrder } from '../asrs-out-order/entities/asrs-out-order.entity';
import { MqttModule } from '../mqtt.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SkidPlatformHistory, AsrsOutOrder]),
    MqttModule,
  ],
  controllers: [SkidPlatformHistoryController],
  providers: [SkidPlatformHistoryService],
})
export class SkidPlatformHistoryModule {}
